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

  // refine: 準備+本番+片付けの合計が120分を超えると totalTime エラーで送信不可になる。
  test('blocks submission when prep + perform + cleanup exceeds 120 minutes', async ({
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
      prepTime: '50',
      performTime: '50',
      cleanupTime: '30',
    });

    await expect(
      page.getByText('準備、本番、片付けの合計時間が120分を超えています')
    ).toBeVisible();
    await expect(submitButton(page)).toBeDisabled();
    expect(state.requestedUrls).toHaveLength(0);
  });

  // BUG(Phase 4-1相当、未修正): onSubmit成功時に
  // mutate(`check_all_registered/${currentGroupId}`) を呼んでいるが、
  // 先頭の '/' が無い文字列キーであり、SWRの実際のキーはタプル
  // [`/check_all_registered/${id}`, session] のため一致せず no-op になる。
  // そのため登録直後に check_all_registered が再取得されることはない
  // (アコーディオンの登録済みバッジは次回のページ遷移まで更新されない)。
  test('does not revalidate check_all_registered after a successful create (BUG: mutate key has no leading slash)', async ({
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

    const checkAllRegisteredBefore = state.groupFetchCounts.checkAllRegistered;
    await submitButton(page).click();

    await expect(page.getByText('ステージ希望を登録しました。')).toBeVisible();
    // 少し待っても増えないことを確認する(増えていれば直った証拠になる)。
    await page.waitForTimeout(300);
    expect(state.groupFetchCounts.checkAllRegistered).toBe(
      checkAllRegisteredBefore
    );
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

  // 既存値を変更して送信すると、晴天/雨天それぞれ PUT /stage_orders/:id が呼ばれる。
  test('updates existing sunny and rainy stage orders via PUT', async ({
    page,
  }) => {
    const state = stageScenario('registration');
    state.stageOrders = registeredStageOrders();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openStage(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await page.getByLabel(FIELDS.performTime).fill('30');
    await submitButton(page).click();

    await expect(page.getByText('ステージ希望を更新しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/stage_orders/13001');
    expect(state.requestedUrls).toContain('/stage_orders/13002');

    const sunny = state.stageOrders.find((order) => order.id === 13001);
    const rainy = state.stageOrders.find((order) => order.id === 13002);
    expect(sunny).toMatchObject({ use_time_interval: '30分' });
    expect(rainy).toMatchObject({ use_time_interval: '30分' });
  });

  // useStageForm の送信ボタンは isValid のみで活性判定しており、isDirty は見ていない。
  // そのため他群(stage-options等)と違い、既存の有効な値のまま修正モードに入った
  // 時点で、何も変更していなくても送信ボタンは活性のまま。
  test('enables the submit button on edit entry even before any change', async ({
    page,
  }) => {
    const state = stageScenario('registration');
    state.stageOrders = registeredStageOrders();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openStage(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await expect(page.getByLabel(FIELDS.sunnyFirst)).toBeVisible();
    await expect(submitButton(page)).toBeEnabled();
  });

  // 締切後は一覧のみで、修正ボタンを出さない。
  test('hides the edit button after the deadline', async ({ page }) => {
    const state = stageScenario('closed');
    state.stageOrders = registeredStageOrders();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openStage(page);

    await expect(page.getByText('1日目 (2026-09-19) 土')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });
});
