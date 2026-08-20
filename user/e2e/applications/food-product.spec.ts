// 販売品申請(FoodProduct)の特性化テスト。
// 現状の挙動をそのまま凍結する。既知の癖は BUG/メモ コメント付きで記録し、
// アプリ側は直さない。
//
// このフォームのフックはAPIを一切持たず、addFoodProducts/setFoodProductsData を
// 親(FoodProduct/hooks.ts)からpropsで受け取って呼ぶだけの点が他群と異なる。
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mockHomePageApis } from '../support/mockServer';
import {
  type FoodProductRecord,
  mockGroupId,
  scenarioState,
} from '../support/scenarioState';
import { BUTTONS, openApplication, submitButton } from '../support/selectors';

const FOOD_PRODUCT_ID = 22001;

const LABELS = {
  name: '販売品名',
  day1: '1日目販売予定数',
  day2: '2日目販売予定数',
} as const;

const registeredFoodProduct = (
  overrides: Partial<FoodProductRecord> = {}
): FoodProductRecord => ({
  id: FOOD_PRODUCT_ID,
  group_id: mockGroupId,
  name: 'E2E たこ焼き',
  is_cooking: true,
  first_day_num: 30,
  second_day_num: 40,
  is_alcohol: false,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

/**
 * alcohol/cooking の Radio は name 属性に `alcohol_${index}` / `license_${index}` が入る
 * (selectRadio が前提とするラベル文字列とは異なるため、専用ヘルパーを使う)。
 */
const selectFoodProductRadio = (
  page: Page,
  index: number,
  field: 'alcohol' | 'license',
  value: 0 | 1
) =>
  page
    .locator(`input[type="radio"][name="${field}_${index}"][value="${value}"]`)
    .check();

const fillFoodProductForm = async (
  page: Page,
  values: { name: string; day1: string; day2: string }
) => {
  await page.getByLabel(LABELS.name).fill(values.name);
  await page.getByLabel(LABELS.day1).fill(values.day1);
  await page.getByLabel(LABELS.day2).fill(values.day2);
};

test.describe('food product application', () => {
  // 未登録なら、アコーディオンを開いた時点で入力フォームが直接出る。
  test('shows the input form when nothing is registered yet', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'foodProduct');

    await expect(page.getByLabel(LABELS.name)).toBeVisible();
    await expect(page.getByLabel(LABELS.day1)).toBeVisible();
    await expect(page.getByLabel(LABELS.day2)).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.register, exact: true })
    ).toBeVisible();
  });

  // 新規登録時はvalidateEdit()の比較対象(original)が無いため常にfalseになり、
  // isSubmitting中以外は無効化されない。未入力のままでも押せてしまい、
  // 送信してから初めてzodのエラーが表示される。
  test('keeps the submit button enabled even before required fields are filled', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'foodProduct');

    // 販売品名は空のまま(day1/day2はデフォルト値'1'が入っている)。
    await expect(submitButton(page)).toBeEnabled();
  });

  // 販売品名が空のまま送信すると、zodのバリデーションエラーが表示されAPIは呼ばれない。
  test('shows a validation error and does not call the API when name is empty', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'foodProduct');

    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('販売品名を入力してください')).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 酒類=はいのまま調理の有無=無しで送信すると、superRefineが調理の有無フィールドへ
  // エラーを出す(酒類はいを選ぶとhandleAlcoholChangeが自動でisCooking=trueにするため、
  // このエラーを再現するにはコード変更後に調理を「無し」へ戻す必要がある)。
  test('shows a cross-field validation error when alcohol is yes but cooking is no', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'foodProduct');

    await fillFoodProductForm(page, {
      name: 'E2E かき氷',
      day1: '10',
      day2: '10',
    });
    await selectFoodProductRadio(page, 0, 'alcohol', 1);
    // 酒類=はいで自動的に調理=有りになるため、明示的に「無し」へ戻す。
    await selectFoodProductRadio(page, 0, 'license', 0);

    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(
      page.getByText('酒類を販売する場合は調理の有無を「有り」にしてください')
    ).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 全項目を入力して登録すると、POST /food_products/upsert が
  // snake_case のJSONボディで呼ばれ、保健所ステータスもunapprovedへ戻す。
  test('creates a food product via the upsert endpoint', async ({ page }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'foodProduct');

    await fillFoodProductForm(page, {
      name: 'E2E 焼きそば',
      day1: '50',
      day2: '60',
    });
    await selectFoodProductRadio(page, 0, 'alcohol', 0);
    await selectFoodProductRadio(page, 0, 'license', 1);

    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('販売品申請を送信しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/food_products/upsert');
    expect(state.foodProducts).toMatchObject([
      {
        group_id: mockGroupId,
        name: 'E2E 焼きそば',
        is_cooking: true,
        is_alcohol: false,
        first_day_num: 50,
        second_day_num: 60,
      },
    ]);

    // useUpdateSubmissionStatusFor(groupId, 'food_product') の副作用で
    // 送信後にステータスがunapprovedへ戻る(再提出でなくても毎回起きる)。
    expect(state.statuses.food_product).toBe('unapproved');
    expect(
      state.requestedUrls.some((url) =>
        url.startsWith('/health_center_submission_statuses/')
      )
    ).toBe(true);
  });

  // B-2(送信ボタン無効化の統一): isMutating(実体はisSubmitting)のみだった判定に
  // isUnchanged()を足した。編集フォームを開いた直後(値が既存データと1つも
  // 変わっていない)は無効、1項目でも変更すれば有効になる。
  test('keeps the submit button disabled until a value actually changes when editing', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'foodProduct');
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await expect(submitButton(page)).toBeDisabled();

    await page.getByLabel(LABELS.name).fill('E2E たこ焼き(更新)');
    await expect(submitButton(page)).toBeEnabled();
  });

  // 商品を追加すると、既存データと件数が一致しなくなるため送信可能になる
  // (未入力のまま送信すればzodのバリデーションで止まる)。
  test('keeps the submit button enabled after adding a new row while editing', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'foodProduct');
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await expect(submitButton(page)).toBeDisabled();

    await page
      .getByRole('button', { name: '販売品の追加', exact: true })
      .click();
    await expect(submitButton(page)).toBeEnabled();
  });

  // 登録済みなら一覧(カード)表示になり、修正ボタンでフォームへ切り替わる。
  test('shows the summary card with an edit button when already registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'foodProduct');

    await expect(page.getByText('E2E たこ焼き')).toBeVisible();
    await expect(page.getByText('30', { exact: true })).toBeVisible();
    await expect(page.getByText('40', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();
  });

  // 既存値を変更して送信すると、常に同じ upsert エンドポイントへ id 付きで送られ、
  // 調理工程申請のキャッシュもタプルキー述語で正しく再検証される。
  test('updates an existing food product via the upsert endpoint and revalidates cooking process orders', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    // 調理工程申請を先に開いておき、SWRキャッシュにキーを登録させる
    // (mutate(タプルキー述語) はキャッシュに存在するキーしか再検証しない)。
    await openApplication(page, 'cookingProcessOrder');
    await openApplication(page, 'foodProduct');

    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await page.getByLabel(LABELS.name).fill('E2E たこ焼き(更新)');

    const cookingProcessOrderRefetch = page.waitForRequest(
      (request) =>
        request.method() === 'GET' &&
        request.url().includes(`/cooking_process_orders/group/${mockGroupId}`)
    );

    // 調理工程申請の方の送信ボタンも同じ page.locator('form button[type="submit"]')
    // に引っかかってしまう(2つの申請フォームが同時に開いているため)ので、
    // 販売品側の「保存」ラベルで一意に絞り込む。
    await page.getByRole('button', { name: BUTTONS.save, exact: true }).click();

    await expect(page.getByText('販売品を更新しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/food_products/upsert');
    expect(state.foodProducts).toMatchObject([
      {
        id: FOOD_PRODUCT_ID,
        name: 'E2E たこ焼き(更新)',
      },
    ]);

    // FoodProduct/hooks.ts の mutateCookingProcessOrders() は
    // mutate((key) => Array.isArray(key) && key[0] === '/cooking_process_orders/group/:id')
    // という正しいタプルキー述語のため、実際に再検証(GET再発火)される。
    await cookingProcessOrderRefetch;
  });

  // 一覧カードの削除ボタンは setFoodProductsData の差分処理を経由せず、
  // removeFoodProduct から直接 DELETE /food_products/:id を呼ぶ。
  test('deletes a food product from the summary card', async ({ page }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'foodProduct');

    await page
      .getByRole('button', { name: BUTTONS.delete, exact: true })
      .click();

    await expect(
      page.getByText('「E2E たこ焼き」を削除しました。')
    ).toBeVisible();
    expect(state.requestedUrls).toContain(`/food_products/${FOOD_PRODUCT_ID}`);
    expect(state.foodProducts).toHaveLength(0);
  });

  // 締切後は登録件数のサマリー1行のみで、修正ボタンを出さない
  // (未登録時と違い、個別カードではなく formItem の集計表示になる)。
  test('hides the edit button and shows only a count summary after the deadline', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'foodProduct');

    await expect(page.getByText('1品目登録済み')).toBeVisible();
    await expect(page.getByText('E2E たこ焼き')).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });
});
