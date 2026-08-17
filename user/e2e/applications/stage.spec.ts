// ステージ申請の特性化テスト。
//
// リファクタ前の挙動をそのまま凍結することが目的なので、
// 現時点で不具合と分かっている挙動も「現状こうである」と記録する。
// 該当箇所には BUG コメントを付ける。
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mockHomePageApis } from '../support/mockServer';
import {
  type ScenarioState,
  mockGroupId,
  scenarioState,
} from '../support/scenarioState';
import {
  APPLICATION_TITLES,
  BUTTONS,
  selectRadio,
  submitButton,
} from '../support/selectors';

const FIELDS = {
  date: '開催日',
  sunnyFirst: '晴れの場合：第1希望',
  sunnySecond: '晴れの場合：第2希望',
  rainyFirst: '雨の場合：第1希望',
  rainySecond: '雨の場合：第2希望',
  prepTime: '準備時間(単位：min)',
  performTime: '本番時間(単位：min)',
  cleanupTime: '片付け時間(単位：min)',
} as const;

/** ステージ申請は「ステージ」区分(GROUP_CATEGORY.STAGE = 3)でのみ表示される。 */
const stageScenario = (pageMode: Parameters<typeof scenarioState>[0]) => {
  const state = scenarioState(pageMode);
  state.groupCategoryId = 3;
  return state;
};

const registeredStageOrders = (): ScenarioState['stageOrders'] => [
  {
    id: 13001,
    group_id: mockGroupId,
    fes_date_id: 1,
    is_sunny: true,
    stage_first: 101,
    stage_second: 102,
    use_time_interval: '60分',
    prepare_time_interval: '20分',
    cleanup_time_interval: '20分',
  },
  {
    id: 13002,
    group_id: mockGroupId,
    fes_date_id: 1,
    is_sunny: false,
    stage_first: 201,
    stage_second: 202,
    use_time_interval: '60分',
    prepare_time_interval: '20分',
    cleanup_time_interval: '20分',
  },
];

const openStage = (page: Page) =>
  page
    .getByRole('button', { name: new RegExp(APPLICATION_TITLES.stage) })
    .click();

const fillStageForm = async (
  page: Page,
  values: {
    date: number;
    sunnyFirst: number;
    sunnySecond: number;
    rainyFirst: number;
    rainySecond: number;
    prepTime: string;
    performTime: string;
    cleanupTime: string;
  }
) => {
  await selectRadio(page, FIELDS.date, values.date);
  await page
    .getByLabel(FIELDS.sunnyFirst)
    .selectOption(String(values.sunnyFirst));
  await page
    .getByLabel(FIELDS.sunnySecond)
    .selectOption(String(values.sunnySecond));
  await page
    .getByLabel(FIELDS.rainyFirst)
    .selectOption(String(values.rainyFirst));
  await page
    .getByLabel(FIELDS.rainySecond)
    .selectOption(String(values.rainySecond));
  await page.getByLabel(FIELDS.prepTime).fill(values.prepTime);
  await page.getByLabel(FIELDS.performTime).fill(values.performTime);
  await page.getByLabel(FIELDS.cleanupTime).fill(values.cleanupTime);
};

test.describe('stage application', () => {
  // 未登録なら、アコーディオンを開いた時点で入力フォームが表示される。
  test('shows the input form when nothing is registered yet', async ({
    page,
  }) => {
    const state = stageScenario('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openStage(page);

    for (const field of Object.values(FIELDS)) {
      await expect(page.getByLabel(field)).toBeVisible();
    }
    // 未入力のうちは isValid=false で isDisable になり、Button はラベルを消して
    // スピナーだけ描画するため、getByRole名ではなく submitButton() で見る。
    await expect(submitButton(page)).toBeVisible();
    await expect(submitButton(page)).toBeDisabled();
  });

  // 全項目を入力して登録すると、晴天/雨天それぞれ POST /stage_orders が
  // JSONボディ(snake_case、時間は「分」付き)で呼ばれる。
  test('creates sunny and rainy stage orders with a JSON body', async ({
    page,
  }) => {
    const state = stageScenario('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openStage(page);

    await fillStageForm(page, {
      date: 1,
      sunnyFirst: 101,
      sunnySecond: 102,
      rainyFirst: 201,
      rainySecond: 202,
      prepTime: '20',
      performTime: '60',
      cleanupTime: '20',
    });
    await submitButton(page).click();

    await expect(page.getByText('ステージ希望を登録しました。')).toBeVisible();
    expect(
      state.requestedUrls.filter((url) => url === '/stage_orders')
    ).toHaveLength(2);

    const sunny = state.stageOrders.find((order) => order.is_sunny);
    const rainy = state.stageOrders.find((order) => !order.is_sunny);
    expect(sunny).toMatchObject({
      group_id: mockGroupId,
      fes_date_id: 1,
      stage_first: 101,
      stage_second: 102,
      use_time_interval: '60分',
      prepare_time_interval: '20分',
      cleanup_time_interval: '20分',
    });
    expect(rainy).toMatchObject({
      group_id: mockGroupId,
      fes_date_id: 1,
      stage_first: 201,
      stage_second: 202,
      use_time_interval: '60分',
      prepare_time_interval: '20分',
      cleanup_time_interval: '20分',
    });
  });

  // 登録済みなら一覧表示になり、修正ボタンでフォームへ切り替わる。
  test('shows the summary with an edit button when already registered', async ({
    page,
  }) => {
    const state = stageScenario('registration');
    state.stageOrders = registeredStageOrders();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openStage(page);

    await expect(page.getByText('1日目 (2026-09-19) 土')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();

    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();
    await expect(page.getByLabel(FIELDS.sunnyFirst)).toBeVisible();
  });
});
