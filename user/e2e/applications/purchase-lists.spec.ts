// 購入品申請(PurchaseLists)の特性化テスト。
// 現状の挙動をそのまま凍結する。既知の癖は BUG/メモ コメント付きで記録し、
// アプリ側は直さない。
//
// 販売品(FoodProduct)にぶら下がる申請で、店舗(Shop)マスタにも依存する。
// フォームは完全な依存性注入型(hooks/schemaを持たず、control/fields/append/...を
// props で受け取るだけ)。件数で作成/更新APIが切り替わる点に注意
// (1件: POST /purchase_lists または PATCH /purchase_lists/:id、
//  2件以上: 常に POST /purchase_lists/upsert)。
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mockHomePageApis } from '../support/mockServer';
import {
  type FoodProductRecord,
  type PurchaseListRecord,
  SHOP_IDS,
  mockGroupId,
  scenarioState,
} from '../support/scenarioState';
import { BUTTONS, openApplication, submitButton } from '../support/selectors';

const FOOD_PRODUCT_ID = 22001;
const PURCHASE_LIST_ID = 23001;

const LABELS = {
  foodProduct: '販売品名',
  items: '選択した料理に使用した食材・使用する材料',
  shop: '購入場所',
  purchaseDate: '購入日',
  url: 'URL',
  remark: '備考',
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

const registeredPurchaseList = (
  overrides: Partial<PurchaseListRecord> = {}
): PurchaseListRecord => ({
  id: PURCHASE_LIST_ID,
  group_id: mockGroupId,
  food_product_id: FOOD_PRODUCT_ID,
  shop_id: SHOP_IDS.regular,
  fes_date_id: 1,
  items: 'たこ・キャベツ・小麦粉',
  is_fresh: true,
  purchase_date: '2026-09-01',
  url: null,
  remark: '既存の備考',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

/**
 * isFresh の Radio は input の name 属性が `isFresh-${index}` になる
 * (selectRadio が前提とするラベル文字列とは異なるため専用ヘルパーを使う)。
 */
const selectFreshRadio = (page: Page, index: number, value: 1 | 2) =>
  page
    .locator(`input[type="radio"][name="isFresh-${index}"][value="${value}"]`)
    .check();

/**
 * 購入場所(Selector)のnote文言に「URL入力が必要です」を含むため、
 * getByLabel('URL')は購入場所のselectにも部分一致してしまう。
 * URL欄(TextBox = role textbox)の有無はroleで絞って確認する
 * (購入場所はSelector = role combobox なので混ざらない)。
 */
const urlField = (page: Page) =>
  page.getByRole('textbox', { name: LABELS.url });

const fillPurchaseListRow = async (
  page: Page,
  index: number,
  values: {
    foodProductId: number;
    items: string;
    shopId: number;
    purchaseDate: string;
    freshValue?: 1 | 2;
  }
) => {
  await page
    .getByLabel(LABELS.foodProduct)
    .nth(index)
    .selectOption(String(values.foodProductId));
  await page.getByLabel(LABELS.items).nth(index).fill(values.items);
  if (values.freshValue) {
    await selectFreshRadio(page, index, values.freshValue);
  }
  await page
    .getByLabel(LABELS.shop)
    .nth(index)
    .selectOption(String(values.shopId));
  await page
    .getByLabel(LABELS.purchaseDate)
    .nth(index)
    .fill(values.purchaseDate);
};

test.describe('purchase lists application', () => {
  // 未登録なら、アコーディオンを開いた時点で入力フォームが直接出る。
  test('shows the input form when nothing is registered yet', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');

    await expect(page.getByLabel(LABELS.foodProduct)).toBeVisible();
    await expect(page.getByLabel(LABELS.items)).toBeVisible();
    await expect(page.getByLabel(LABELS.shop)).toBeVisible();
    await expect(page.getByLabel(LABELS.purchaseDate)).toBeVisible();
    // ネット注文(NET_ORDER_SHOP_ID)を選んでいない間はURL欄が出ない。
    await expect(urlField(page)).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: BUTTONS.register, exact: true })
    ).toBeVisible();
  });

  // このフォームはisValid/isMutatingのいずれも見ていないため、
  // 他群と違って送信ボタンが無効化されるロジック自体が存在しない。
  test('keeps the submit button enabled at all times (no disable logic exists)', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');

    // 何も入力していない状態でも活性。
    await expect(submitButton(page)).toBeEnabled();
  });

  // 何も入力せずに送信すると、zodのバリデーションエラーが表示されAPIは呼ばれない。
  test('shows a validation error and does not call the API when required fields are empty', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');

    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('販売品名を選択してください')).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
  });

  // ネット注文(NET_ORDER_SHOP_ID=998)を選んだ時だけURL欄が現れる(useWatch)。
  test('reveals the URL field only when the net-order shop is chosen', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');

    await expect(urlField(page)).toHaveCount(0);

    await page.getByLabel(LABELS.shop).selectOption(String(SHOP_IDS.netOrder));
    await expect(urlField(page)).toBeVisible();

    await page.getByLabel(LABELS.shop).selectOption(String(SHOP_IDS.regular));
    await expect(urlField(page)).toHaveCount(0);
  });

  // superRefine: ネット注文を選んだのにURLが空だと送信できない。
  test('requires a URL when the net-order shop is chosen', async ({ page }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');

    await fillPurchaseListRow(page, 0, {
      foodProductId: FOOD_PRODUCT_ID,
      items: 'E2E ネット注文品',
      shopId: SHOP_IDS.netOrder,
      purchaseDate: '2026-09-05',
    });
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(
      page.getByText('ネット注文の場合はURLを入力してください')
    ).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
  });

  // superRefine: 「その他」を選んだのに備考が空だと送信できない。
  test('requires a remark when the other shop is chosen', async ({ page }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');

    await fillPurchaseListRow(page, 0, {
      foodProductId: FOOD_PRODUCT_ID,
      items: 'E2E その他店舗品',
      shopId: SHOP_IDS.other,
      purchaseDate: '2026-09-05',
    });
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(
      page.getByText(
        '「その他」の場合は、店名・住所・電話番号・営業時間を記入してください'
      )
    ).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 1件だけ登録すると、POST /purchase_lists がJSONボディで呼ばれる
  // (2件以上のときのupsertとは別のエンドポイント)。
  test('creates a single purchase list via POST /purchase_lists', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');

    await fillPurchaseListRow(page, 0, {
      foodProductId: FOOD_PRODUCT_ID,
      items: 'E2E たこ・E2E キャベツ',
      shopId: SHOP_IDS.regular,
      purchaseDate: '2026-09-05',
    });

    const refetch = page.waitForRequest(
      (request) =>
        request.method() === 'GET' &&
        request.url().includes('/purchase_lists/food_product')
    );

    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('購入品申請が登録されました')).toBeVisible();
    expect(state.requestedUrls).toContain('/purchase_lists');
    expect(state.requestedUrls).not.toContain('/purchase_lists/upsert');
    expect(state.purchaseLists).toMatchObject([
      {
        group_id: mockGroupId,
        food_product_id: FOOD_PRODUCT_ID,
        shop_id: SHOP_IDS.regular,
        items: 'E2E たこ・E2E キャベツ',
        is_fresh: true,
        purchase_date: '2026-09-05',
      },
    ]);

    // useUpdateSubmissionStatusFor(groupId, 'purchase_list') の副作用で
    // 送信後にステータスがunapprovedへ戻る。
    expect(state.statuses.purchase_list).toBe('unapproved');
    expect(
      state.requestedUrls.some((url) =>
        url.startsWith('/health_center_submission_statuses/')
      )
    ).toBe(true);

    // mutatePurchaseLists() により一覧が再取得される(自分自身がbindしたSWRキーの
    // mutateなので、他群で見られる文字列キーno-opバグの影響を受けない)。
    await refetch;
  });

  // 2件以上ある状態で送信すると、常に POST /purchase_lists/upsert が
  // JSONボディ(purchase_lists配列)で呼ばれる。
  test('creates multiple purchase lists via the upsert endpoint when 2 or more rows exist', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');

    await fillPurchaseListRow(page, 0, {
      foodProductId: FOOD_PRODUCT_ID,
      items: 'E2E 1品目',
      shopId: SHOP_IDS.regular,
      purchaseDate: '2026-09-05',
    });

    await page
      .getByRole('button', { name: '購入品を追加', exact: true })
      .click();

    // 2行目は「加工品」を選び、is_freshがfalseで送られることも確認する。
    await fillPurchaseListRow(page, 1, {
      foodProductId: FOOD_PRODUCT_ID,
      items: 'E2E 2品目',
      shopId: SHOP_IDS.regular,
      purchaseDate: '2026-09-06',
      freshValue: 2,
    });

    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(
      page.getByText('複数の購入品申請が登録されました')
    ).toBeVisible();
    expect(state.requestedUrls).toContain('/purchase_lists/upsert');
    expect(state.requestedUrls).not.toContain('/purchase_lists');
    expect(state.purchaseLists).toMatchObject([
      { items: 'E2E 1品目', purchase_date: '2026-09-05', is_fresh: true },
      { items: 'E2E 2品目', purchase_date: '2026-09-06', is_fresh: false },
    ]);
  });

  // 登録済みなら一覧(カード)表示になり、修正ボタンでフォームへ切り替わる。
  test('shows the summary card with an edit button when already registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    state.purchaseLists = [registeredPurchaseList()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');

    await expect(page.getByText('E2E たこ焼き')).toBeVisible();
    await expect(page.getByText('たこ・キャベツ・小麦粉')).toBeVisible();
    await expect(page.getByText('E2E 商店')).toBeVisible();
    await expect(page.getByText('生鮮品')).toBeVisible();
    await expect(page.getByText('2026/9/1')).toBeVisible();
    await expect(page.getByText('既存の備考')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();
  });

  // 既存値を変更して送信すると PATCH /purchase_lists/:id が呼ばれる。
  // 送信ボタンの文言は新規/更新を問わず常に「登録」のまま(専用の「保存」表記はない)。
  test('updates an existing purchase list via PATCH /purchase_lists/:id', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    state.purchaseLists = [registeredPurchaseList()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');
    await page.getByRole('button', { name: BUTTONS.edit, exact: true }).click();

    await page.getByLabel(LABELS.items).fill('たこ・キャベツ・小麦粉(更新)');
    await page.getByRole('button', { name: BUTTONS.save, exact: true }).click();

    await expect(page.getByText('購入品申請が更新されました')).toBeVisible();
    expect(state.requestedUrls).toContain(
      `/purchase_lists/${PURCHASE_LIST_ID}`
    );
    expect(state.purchaseLists).toMatchObject([
      { id: PURCHASE_LIST_ID, items: 'たこ・キャベツ・小麦粉(更新)' },
    ]);
  });

  // B-2(送信ボタン無効化の統一): 制御が存在しなかった判定に
  // isSubmitting || validateEdit()(isUnchangedの配列版)を追加した。
  // 編集フォームを開いた直後(値が既存データと1つも変わっていない)は無効、
  // 1項目でも変更すれば有効になる。
  test('keeps the submit button disabled until a value actually changes when editing', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    state.purchaseLists = [registeredPurchaseList()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');
    await page.getByRole('button', { name: BUTTONS.edit, exact: true }).click();

    await expect(submitButton(page)).toBeDisabled();

    await page.getByLabel(LABELS.items).fill('たこ・キャベツ・小麦粉(更新)');
    await expect(submitButton(page)).toBeEnabled();
  });

  // 行を追加すると既存データと件数が一致しなくなるため送信可能になる
  // (未入力のまま送信すればzodのバリデーションで止まる)。
  test('keeps the submit button enabled after adding a new row while editing', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    state.purchaseLists = [registeredPurchaseList()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');
    await page.getByRole('button', { name: BUTTONS.edit, exact: true }).click();

    await expect(submitButton(page)).toBeDisabled();

    await page
      .getByRole('button', { name: '購入品を追加', exact: true })
      .click();
    await expect(submitButton(page)).toBeEnabled();
  });

  // 一覧カードの削除ボタンは DELETE /purchase_lists/:id を直接呼ぶ。
  // 最後の1件を消すと編集モード(新規登録フォーム)に戻る。
  test('deletes a purchase list from the summary card', async ({ page }) => {
    const state = scenarioState('registration');
    state.foodProducts = [registeredFoodProduct()];
    state.purchaseLists = [registeredPurchaseList()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');

    await page
      .getByRole('button', { name: BUTTONS.delete, exact: true })
      .click();

    await expect(page.getByText('購入品が削除されました')).toBeVisible();
    expect(state.requestedUrls).toContain(
      `/purchase_lists/${PURCHASE_LIST_ID}`
    );
    expect(state.purchaseLists).toHaveLength(0);
    // 0件になったのでフォームへ自動的に戻る。
    await expect(page.getByLabel(LABELS.foodProduct)).toBeVisible();
  });

  // 締め切り後で未登録の場合は、専用の案内文のみで入力欄を出さない。
  test('shows the deadline notice instead of a form when unregistered after the deadline', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    state.foodProducts = [registeredFoodProduct()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');

    await expect(page.getByText('申請期限が過ぎています')).toBeVisible();
    await expect(
      page.getByText(
        '購入品申請の締切期限が過ぎているため、新規申請はできません。'
      )
    ).toBeVisible();
    await expect(page.getByLabel(LABELS.foodProduct)).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 締め切り後で登録済み(再提出待ちでない)場合は、一覧のみで修正ボタンを出さない。
  test('hides the edit button and shows only the summary after the deadline', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    state.foodProducts = [registeredFoodProduct()];
    state.purchaseLists = [registeredPurchaseList()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');

    await expect(page.getByText('E2E たこ焼き')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 締め切り後でも、ステータスが再提出待ちの場合は編集フォームがそのまま出る。
  // B-2で送信ボタンにvalidateEdit()を追加したため、開いた直後(未変更)は
  // ボタンが無効化されラベルが消える(Buttonの仕様)。そのため
  // getByRole('button',{name})ではなくsubmitButton()で引く
  // (support/mockServer.tsのブリーフに記載の既知の落とし穴と同じ理由)。
  test('shows an editable form after the deadline when resubmission is requested', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    state.foodProducts = [registeredFoodProduct()];
    state.purchaseLists = [registeredPurchaseList()];
    state.statuses.purchase_list = 'waiting_resubmission';
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openApplication(page, 'purchaseLists');

    await expect(page.getByLabel(LABELS.foodProduct)).toBeVisible();
    await expect(submitButton(page)).toBeVisible();
    // 何も変更していないので無効(isUnchanged=true)。
    await expect(submitButton(page)).toBeDisabled();

    await page.getByLabel(LABELS.items).fill('たこ・キャベツ・小麦粉(再提出)');
    await expect(submitButton(page)).toBeEnabled();
  });
});
