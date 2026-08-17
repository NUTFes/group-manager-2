// 調理工程申請の特性化テスト。
// 現状の挙動をそのまま凍結する。既知の癖は BUG/メモ コメント付きで記録し、
// アプリ側は直さない。
//
// 注意: `user/e2e/cooking-process-order.spec.ts`(実APIを叩く別テスト)とは別物。
// ここでは `user/e2e/support/mockServer.ts` によるモックバックエンドを使う。
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mockHomePageApis } from '../support/mockServer';
import {
  type CookingProcessOrderRecord,
  type FoodProductRecord,
  mockGroupId,
  scenarioState,
} from '../support/scenarioState';
import {
  APPLICATION_TITLES,
  BUTTONS,
  submitButton,
} from '../support/selectors';

const FOOD_PRODUCT_ID = 21001;

const LABELS = {
  foodProduct: '販売品名',
  kitchenUsage: '調理場の使用有無',
  preOpen: '(営業前)',
  duringOpen: '(営業中)',
  tent: '調理内容',
  confirm: '調理工程確認事項',
} as const;

const CONFIRM_OPTIONS = [
  '衛生管理の工程をできるだけ詳しく記載しました。',
  '最終的に加熱して提供するか確認しました。',
  'お酒の調理工程も提出しました。',
] as const;

const cookingTargetFoodProduct = (
  overrides: Partial<FoodProductRecord> = {}
): FoodProductRecord => ({
  id: FOOD_PRODUCT_ID,
  group_id: mockGroupId,
  name: 'E2E コーヒー',
  is_cooking: true,
  first_day_num: 1,
  second_day_num: 1,
  is_alcohol: false,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const registeredCookingProcessOrder = (
  overrides: Partial<CookingProcessOrderRecord> = {}
): CookingProcessOrderRecord => ({
  id: 14001,
  group_id: mockGroupId,
  food_product_id: FOOD_PRODUCT_ID,
  pre_open_kitchen: true,
  during_open_kitchen: false,
  tent: '既存の調理工程',
  tent_ja: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const openCookingProcessOrder = (page: Page) =>
  page
    .getByRole('button', {
      name: new RegExp(APPLICATION_TITLES.cookingProcessOrder),
    })
    .click();

/** preOpenKitchen/duringOpenKitchen の Radio は name 属性に RHF のパス文字列が入る。 */
const selectKitchenUsage = (
  page: Page,
  index: number,
  field: 'preOpenKitchen' | 'duringOpenKitchen',
  use: boolean
) =>
  page
    .locator(
      `input[type="radio"][name="cookingProcessOrders.${index}.${field}"][value="${use ? 1 : 0}"]`
    )
    .check();

/** confirmCookingProcess の3つのチェックボックスを全てチェックする(zodが3件必須)。 */
const checkAllConfirmations = async (page: Page) => {
  for (const value of ['1', '2', '3']) {
    await page
      .locator(
        `input[type="checkbox"][name="${LABELS.confirm}"][value="${value}"]`
      )
      .check();
  }
};

test.describe('cooking process order application', () => {
  // 対象の販売品(isCooking=true)が1件もなければ、フォームの代わりに警告文が出る。
  test('shows a warning instead of a form when there is no cooking target food product', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openCookingProcessOrder(page);

    await expect(
      page.getByText('販売品申請を先に申請してください。')
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.register, exact: true })
    ).toHaveCount(0);
  });

  // 対象の販売品はあるが調理工程が未登録なら、アコーディオンを開いた時点で入力フォームが出る。
  test('shows the input form when nothing is registered yet', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [cookingTargetFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openCookingProcessOrder(page);

    await expect(page.getByText('E2E コーヒー')).toBeVisible();
    await expect(page.getByText(LABELS.kitchenUsage)).toBeVisible();
    await expect(page.getByText(LABELS.preOpen)).toBeVisible();
    await expect(page.getByText(LABELS.duringOpen)).toBeVisible();
    await expect(page.getByLabel(LABELS.tent)).toBeVisible();
    for (const option of CONFIRM_OPTIONS) {
      await expect(page.getByText(option)).toBeVisible();
    }
    // 未入力の間は isValid=false でボタンが無効化され、ラベルも消えてスピナーだけになる
    // (Button の仕様。isDisable時はラベルを描画しない)ため、type で引く。
    await expect(submitButton(page)).toBeVisible();
    await expect(submitButton(page)).toBeDisabled();
  });

  // 全項目を入力して登録すると、POST /cooking_process_orders/upsert が
  // snake_case のJSONボディで呼ばれ、保健所ステータスもunapprovedへ戻す。
  test('creates a cooking process order via the upsert endpoint', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [cookingTargetFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openCookingProcessOrder(page);

    await selectKitchenUsage(page, 0, 'preOpenKitchen', true);
    await selectKitchenUsage(page, 0, 'duringOpenKitchen', false);
    await page.getByLabel(LABELS.tent).fill('E2E 登録調理工程');
    await checkAllConfirmations(page);

    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('調理工程を更新しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/cooking_process_orders/upsert');
    expect(state.cookingProcessOrders).toMatchObject([
      {
        group_id: mockGroupId,
        food_product_id: FOOD_PRODUCT_ID,
        pre_open_kitchen: true,
        during_open_kitchen: false,
        tent: 'E2E 登録調理工程',
      },
    ]);

    // useUpdateSubmissionStatusFor(groupId, 'cooking_process_order') の副作用で
    // 送信後にステータスがunapprovedへ戻る(再提出でなくても毎回起きる)。
    expect(state.statuses.cooking_process_order).toBe('unapproved');
    expect(
      state.requestedUrls.some((url) =>
        url.startsWith('/health_center_submission_statuses/')
      )
    ).toBe(true);
  });

  // 送信ボタンはconfirmCookingProcessが3件揃うまで(zodのrefine)無効。
  test('keeps the submit button disabled until all confirmations are checked', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [cookingTargetFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openCookingProcessOrder(page);

    await selectKitchenUsage(page, 0, 'preOpenKitchen', true);
    await selectKitchenUsage(page, 0, 'duringOpenKitchen', false);
    await page.getByLabel(LABELS.tent).fill('E2E 調理工程');
    await page
      .locator(`input[type="checkbox"][name="${LABELS.confirm}"][value="1"]`)
      .check();
    await page
      .locator(`input[type="checkbox"][name="${LABELS.confirm}"][value="2"]`)
      .check();

    await expect(submitButton(page)).toBeDisabled();

    await page
      .locator(`input[type="checkbox"][name="${LABELS.confirm}"][value="3"]`)
      .check();

    await expect(submitButton(page)).toBeEnabled();
  });

  // 登録済みなら一覧表示になり、修正ボタンでフォームへ切り替わる。
  test('shows the summary with an edit button when already registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [cookingTargetFoodProduct()];
    state.cookingProcessOrders = [registeredCookingProcessOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openCookingProcessOrder(page);

    await expect(page.getByText('E2E コーヒー')).toBeVisible();
    await expect(page.getByText('使用する', { exact: true })).toBeVisible();
    await expect(page.getByText('使用しない', { exact: true })).toBeVisible();
    await expect(page.getByText('既存の調理工程')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();
  });

  // 既存値を変更して送信すると、常に同じ upsert エンドポイントへ id 付きで送られる。
  // confirmCookingProcess はAPIに保存されないため、修正のたびにチェックし直しが必要になる。
  test('updates an existing cooking process order via the upsert endpoint', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [cookingTargetFoodProduct()];
    state.cookingProcessOrders = [registeredCookingProcessOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openCookingProcessOrder(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await page.getByLabel(LABELS.tent).fill('E2E 更新調理工程');
    await checkAllConfirmations(page);
    await submitButton(page).click();

    await expect(page.getByText('調理工程を更新しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/cooking_process_orders/upsert');
    expect(state.cookingProcessOrders).toMatchObject([
      {
        id: 14001,
        food_product_id: FOOD_PRODUCT_ID,
        pre_open_kitchen: true,
        during_open_kitchen: false,
        tent: 'E2E 更新調理工程',
      },
    ]);

    // mutateCookingProcessOrders() は bound mutate(タプルキー)なので正しく再検証され、
    // 一覧表示に更新後の値が反映される。
    await expect(page.getByText('E2E 更新調理工程')).toBeVisible();
  });

  // 締切後は一覧のみで、修正ボタンを出さない。
  test('hides the edit button after the deadline', async ({ page }) => {
    const state = scenarioState('closed');
    state.foodProducts = [cookingTargetFoodProduct()];
    state.cookingProcessOrders = [registeredCookingProcessOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openCookingProcessOrder(page);

    await expect(page.getByText('既存の調理工程')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });
});
