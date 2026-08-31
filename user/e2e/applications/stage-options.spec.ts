// ステージオプション申請の特性化テスト。
//
// リファクタ前の挙動をそのまま凍結することが目的なので、
// 現時点で不具合と分かっている挙動も「現状こうである」と記録する。
// 該当箇所には BUG コメントを付け、Phase 4 の修正コミットで assert を反転させる。
import { expect, test } from '@playwright/test';
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

const LABELS = {
  ownEquipment: '電力を使用する機器を持ち込みますか',
  bgm: 'スピーカーに繋ぐ機器を持ち込みますか',
  cameraPermission: '実行委員が撮影することを許可しますか',
  loudSound: '大きい音を出しますか',
} as const;

const YES = 1;
const NO = 0;

/** ステージオプション申請は「ステージ」区分(GROUP_CATEGORY.STAGE = 3)でのみ表示される。 */
const stageScenario = (pageMode: Parameters<typeof scenarioState>[0]) => {
  const state = scenarioState(pageMode);
  state.groupCategoryId = 3;
  return state;
};

const registeredStageOption = (): ScenarioState['stageOption'] => ({
  id: 7001,
  group_id: mockGroupId,
  own_equipment: true,
  bgm: false,
  camera_permission: true,
  loud_sound: false,
});

const openStageOptions = (page: import('@playwright/test').Page) =>
  page
    .getByRole('button', { name: new RegExp(APPLICATION_TITLES.stageOptions) })
    .click();

test.describe('stage options application', () => {
  // 未登録なら、アコーディオンを開いた時点で入力フォームが表示される。
  test('shows the input form when nothing is registered yet', async ({
    page,
  }) => {
    const state = stageScenario('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openStageOptions(page);

    for (const label of Object.values(LABELS)) {
      await expect(page.getByText(label)).toBeVisible();
    }
    await expect(
      page.getByRole('button', { name: BUTTONS.register, exact: true })
    ).toBeVisible();
  });

  // 4項目を選んで登録すると、POST /stage_common_options が snake_case のクエリで呼ばれる。
  test('creates a stage option with snake_case query parameters', async ({
    page,
  }) => {
    const state = stageScenario('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openStageOptions(page);

    await selectRadio(page, LABELS.ownEquipment, YES);
    await selectRadio(page, LABELS.bgm, NO);
    await selectRadio(page, LABELS.cameraPermission, YES);
    await selectRadio(page, LABELS.loudSound, NO);
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('送信しました')).toBeVisible();
    expect(state.requestedUrls).toContain('/stage_common_options');
    // legacyPostFetcher は本文ではなくクエリに値を載せる。
    expect(state.stageOption).toMatchObject({
      group_id: mockGroupId,
      own_equipment: true,
      bgm: false,
      camera_permission: true,
      loud_sound: false,
    });
  });

  // 修正済み(旧 Phase 4-1): 以前は mutate() に文字列キーを渡しており
  // SWR のタプルキー [url, session] と一致せず no-op だったため、
  // 登録直後の一覧が未登録時の既定値（全て「いいえ」）のままだった。
  // revalidateByUrl / revalidateCheckAllRegistered で再検証するようにした。
  test('revalidates after create, so the summary shows the submitted values', async ({
    page,
  }) => {
    const state = stageScenario('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openStageOptions(page);

    await selectRadio(page, LABELS.ownEquipment, YES);
    await selectRadio(page, LABELS.bgm, YES);
    await selectRadio(page, LABELS.cameraPermission, YES);
    await selectRadio(page, LABELS.loudSound, YES);
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('送信しました')).toBeVisible();

    // 全て「はい」で登録したので、一覧にも「はい」が反映される。
    // FormList は 1項目を <div><div>label</div></div><div>content</div> で描画するため、
    // ラベルから2つ上をたどって同じ項目の値を見る。
    const summary = page
      .getByText(LABELS.ownEquipment, { exact: true })
      .locator('xpath=../..');
    await expect(summary.getByText('はい', { exact: true })).toBeVisible();
  });

  // 登録済みなら一覧表示になり、修正ボタンでフォームへ切り替わる。
  test('shows the summary with an edit button when already registered', async ({
    page,
  }) => {
    const state = stageScenario('registration');
    state.stageOption = registeredStageOption();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openStageOptions(page);

    await expect(page.getByText(LABELS.ownEquipment)).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();

    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();
    await expect(
      page.locator(`input[type="radio"][name="${LABELS.ownEquipment}"]`).first()
    ).toBeVisible();
  });

  // 既存値を変更して送信すると PATCH /stage_common_options/:id が呼ばれる。
  test('updates an existing stage option via PATCH', async ({ page }) => {
    const state = stageScenario('registration');
    state.stageOption = registeredStageOption();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openStageOptions(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await selectRadio(page, LABELS.bgm, YES);
    await selectRadio(page, LABELS.loudSound, YES);
    await submitButton(page).click();

    await expect(page.getByText('送信しました')).toBeVisible();
    expect(state.requestedUrls).toContain('/stage_common_options/7001');
    expect(state.stageOption).toMatchObject({
      own_equipment: true,
      bgm: true,
      camera_permission: true,
      loud_sound: true,
    });
  });

  // validateEdit(): 既存値から一つも変えていない間は送信ボタンが無効。
  test('keeps the submit button disabled until a value actually changes', async ({
    page,
  }) => {
    const state = stageScenario('registration');
    state.stageOption = registeredStageOption();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openStageOptions(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await expect(submitButton(page)).toBeDisabled();

    await selectRadio(page, LABELS.bgm, YES);
    await expect(submitButton(page)).toBeEnabled();
  });

  // 締切後は一覧のみで、修正ボタンを出さない。
  test('hides the edit button after the deadline', async ({ page }) => {
    const state = stageScenario('closed');
    state.stageOption = registeredStageOption();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openStageOptions(page);

    await expect(page.getByText(LABELS.ownEquipment)).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });
});
