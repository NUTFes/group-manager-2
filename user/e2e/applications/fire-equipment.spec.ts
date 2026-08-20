// 火気使用申請の特性化テスト。
// 現状の挙動をそのまま凍結する。既知バグは BUG コメント付きで記録し、
// アプリ側は直さない。
//
// この群の特殊事情:
// - バリデーションが二重管理(zod superRefine とは別に手書きの isItemValid/isFormValid
//   が送信ボタンの活性を決める)。両者がずれる入力があり、下の BUG テストで固定する。
// - submitFireEquipmentOrders() は throw せず {success} を返す契約。
// - 表示モードの分岐(一覧/フォーム)は FireEquipment.tsx 側にもあり、
//   FireEquipmentForm 側にも isViewMode の早期 return がある(二重管理)。
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mockHomePageApis } from '../support/mockServer';
import {
  ORDER_TYPES,
  type ScenarioState,
  mockGroupId,
  scenarioState,
} from '../support/scenarioState';
import {
  APPLICATION_TITLES,
  BUTTONS,
  fillFireEquipmentForm,
  selectRadio,
  submitButton,
} from '../support/selectors';

const FIELDS = {
  question: '火気を使用しますか？',
  name: '火気の名称',
  quantity: '火気の台数',
  fuel: '燃料',
  usage: '使用用途',
  isTakeaway: '火気を毎日テントから持ち帰ることができますか？',
  remark: '備考',
} as const;

// 修正済み: 以前は applications.fireEquipment.buttons.noApplication
// ("火気を使用しない") が common.json に定義されているのに未使用で、
// negativeRegister の登録ボタンは通常の登録ボタンと同じ
// t('form.actions.register')="登録" を再利用していた(同一画面に「登録」が2つ
// 並ぶ)。定義済みのi18nキーを使うように修正した。

const registeredFireEquipmentOrder =
  (): ScenarioState['fireEquipmentOrders'][number] => ({
    id: 5001,
    group_id: mockGroupId,
    name: 'E2E バーナー',
    quantity: 1,
    fuel: 'gas_bottle',
    usage: 'E2E 調理',
    is_takeaway: true,
    remark: 'E2E 備考',
  });

const openFireEquipment = (page: Page) =>
  page
    .getByRole('button', { name: new RegExp(APPLICATION_TITLES.fireEquipment) })
    .click();

test.describe('fire equipment application', () => {
  // 未登録なら、まず「火気を使用しますか？」のラジオだけが出る。
  test('shows only the yes/no question before choosing', async ({ page }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);

    await expect(page.getByText(FIELDS.question)).toBeVisible();
    // 選択するまで入力欄もボタンも出さない。
    await expect(page.getByLabel(FIELDS.name)).toHaveCount(0);
    await expect(page.locator('form')).toHaveCount(0);
  });

  // 「はい」を選ぶと登録フォームが現れる。
  test('reveals the registration form when yes is chosen', async ({ page }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);
    await selectRadio(page, FIELDS.question, 1);

    for (const field of [
      FIELDS.name,
      FIELDS.quantity,
      FIELDS.fuel,
      FIELDS.usage,
      FIELDS.remark,
    ]) {
      await expect(page.getByLabel(field)).toBeVisible();
    }
    // フィールドが空のままなので送信ボタンは無効(ラベルが消えてスピナーになる)。
    // そのため役割名ではなく type=submit で引く。
    await expect(submitButton(page)).toBeVisible();
  });

  // isFormValid: 必須項目が全て埋まるまで送信ボタンは無効。
  test('keeps the submit button disabled until required fields are filled', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);
    await selectRadio(page, FIELDS.question, 1);

    await expect(submitButton(page)).toBeDisabled();

    await fillFireEquipmentForm(page, {
      name: 'E2E バーナー',
      quantity: '1',
      fuelLabel: 'カセットガス',
      usage: 'E2E 調理',
      remark: '',
    });

    await expect(submitButton(page)).toBeEnabled();
  });

  // 修正済み: 以前は isItemValid(手書き)が remarks を trim() して空判定するのに、
  // zod の superRefine は trim しなかったため、「いいえ」を選んで空白のみの
  // 備考を入れると送信ボタンは無効になるのにエラー文言が出ない行き止まりだった。
  // zod 側でも trim して判定するようにし、エラー文言が表示されるようにした。
  test('shows a validation error for whitespace-only remark while the submit button stays disabled', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);
    await selectRadio(page, FIELDS.question, 1);

    await fillFireEquipmentForm(page, {
      name: 'E2E バーナー',
      quantity: '1',
      fuelLabel: 'カセットガス',
      usage: 'E2E 調理',
      remark: '',
    });
    await expect(submitButton(page)).toBeEnabled();

    // 「いいえ」(持ち帰れない) を選ぶと備考が必須になる。
    await selectRadio(page, 'items.0.isTakeaway', 2);
    await expect(submitButton(page)).toBeDisabled();

    // 空白のみを入力: zod側もtrimして判定するため、非空値扱いにはならない。
    await page.getByLabel(FIELDS.remark).fill(' ');

    // 手書きの isItemValid は trim() するため無効のまま。
    await expect(submitButton(page)).toBeDisabled();
    // zod 側のエラー文言も表示されるようになった。
    await expect(
      page.getByText('持ち帰りが「いいえ」の場合、備考欄は必須です')
    ).toBeVisible();
  });

  // 入力して登録すると PUT /fire_equipment_orders/submit がJSONボディで呼ばれる。
  test('creates a fire equipment order via PUT /fire_equipment_orders/submit', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);
    await selectRadio(page, FIELDS.question, 1);

    await fillFireEquipmentForm(page, {
      name: 'E2E 登録バーナー',
      quantity: '2',
      fuelLabel: 'LPガス',
      usage: 'E2E 登録調理',
      remark: 'E2E 登録備考',
    });
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('火気申請が完了しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/fire_equipment_orders/submit');
    expect(state.fireEquipmentOrders).toHaveLength(1);
    expect(state.fireEquipmentOrders[0]).toMatchObject({
      group_id: mockGroupId,
      name: 'E2E 登録バーナー',
      quantity: 2,
      fuel: 'lp_gas',
      usage: 'E2E 登録調理',
      is_takeaway: true,
      remark: 'E2E 登録備考',
    });
  });

  // addItem/removeItem: 複数台まとめて申請できる。
  test('adds and removes items in the form', async ({ page }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);
    await selectRadio(page, FIELDS.question, 1);

    await expect(page.getByLabel(FIELDS.name)).toHaveCount(1);
    await page.getByRole('button', { name: '追加', exact: true }).click();
    await expect(page.getByLabel(FIELDS.name)).toHaveCount(2);

    await page
      .getByRole('button', { name: BUTTONS.delete, exact: true })
      .first()
      .click();
    await expect(page.getByLabel(FIELDS.name)).toHaveCount(1);
  });

  // 「いいえ」を選ぶと不使用登録ボタンが現れ、押すと未登録マーカーを登録する。
  test('registers the not-applying marker when no is chosen', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);
    await selectRadio(page, FIELDS.question, 2);

    // negativeRegister のボタンは定義済みのi18nキー(「火気を使用しない」)を使う。
    // 通常の登録ボタンと同じ「登録」文言を再利用していたバグは修正済み。
    await page
      .getByRole('button', { name: '火気を使用しない', exact: true })
      .click();

    await expect(
      page.getByText('火気申請を行わない登録が完了しました')
    ).toBeVisible();
    expect(state.requestedUrls).toContain('/fire_equipment_orders/submit');
    expect(state.requestedUrls).toContain('/un_registered_groups');
    expect(state.unregisteredOrderTypes).toContain(ORDER_TYPES.fireEquipment);

    // 登録後は一覧表示に切り替わり、専用の説明文が出る。
    await expect(page.getByText('火気申請は不要（登録済み）')).toBeVisible();
  });

  // 「不使用」が登録済みの場合、開いた時点で一覧表示になる。
  test('shows the not-applying notice when the marker already exists', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.unregisteredOrderTypes = [ORDER_TYPES.fireEquipment];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);

    await expect(page.getByText('火気申請は不要（登録済み）')).toBeVisible();
  });

  // 登録済みなら一覧表示になり、修正ボタンでフォームへ切り替わる。
  test('shows the summary with an edit button when already registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.fireEquipmentOrders = [registeredFireEquipmentOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);

    await expect(page.getByText('E2E バーナー')).toBeVisible();
    await expect(page.getByText('カセットガス')).toBeVisible();
    await expect(page.getByText('E2E 調理')).toBeVisible();
    await expect(page.getByText('E2E 備考')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();
  });

  // 既存値を変更して保存すると PUT /fire_equipment_orders/submit が id 付きで呼ばれる。
  test('updates an existing order via the edit form', async ({ page }) => {
    const state = scenarioState('registration');
    state.fireEquipmentOrders = [registeredFireEquipmentOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    // 既存値が初期表示される。
    await expect(page.getByLabel(FIELDS.name)).toHaveValue('E2E バーナー');

    await page.getByLabel(FIELDS.name).fill('E2E 更新バーナー');
    await page.getByRole('button', { name: BUTTONS.save, exact: true }).click();

    await expect(page.getByText('火気申請を更新しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/fire_equipment_orders/submit');
    expect(state.fireEquipmentOrders[0]).toMatchObject({
      id: 5001,
      name: 'E2E 更新バーナー',
    });
  });

  // FormList の削除ボタンから既存の申請を削除できる。
  test('deletes an existing order from the summary view', async ({ page }) => {
    const state = scenarioState('registration');
    state.fireEquipmentOrders = [registeredFireEquipmentOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);
    await page
      .getByRole('button', { name: BUTTONS.delete, exact: true })
      .first()
      .click();

    await expect(page.getByText('火気申請を削除しました')).toBeVisible();
    expect(state.requestedUrls).toContain('/fire_equipment_orders/submit');
    expect(state.fireEquipmentOrders).toHaveLength(0);
  });

  // API が {success:false} を返した場合、失敗トーストは1回だけ出る
  // (この群は throw せず結果オブジェクトを返す契約のため、catch には入らない)。
  test('shows a single failure toast when the submit API fails', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.forceFireEquipmentSubmitError = true;
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);
    await selectRadio(page, FIELDS.question, 1);

    await fillFireEquipmentForm(page, {
      name: 'E2E 失敗バーナー',
      quantity: '1',
      fuelLabel: 'カセットガス',
      usage: 'E2E 調理',
      remark: '',
    });
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(
      page.getByText('送信に失敗しました。もう一度お試しください。')
    ).toHaveCount(1);
    expect(state.fireEquipmentOrders).toHaveLength(0);
  });

  // 締切後、登録済みなら一覧のみで修正・削除ボタンを出さない。
  test('hides edit and delete controls after the deadline', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    state.fireEquipmentOrders = [registeredFireEquipmentOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);

    await expect(page.getByText('E2E バーナー')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: BUTTONS.delete, exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 締切後、未登録なら締切案内のみを表示する。
  test('shows the deadline notice when nothing is registered', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    state.fireEquipmentOrders = [];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openFireEquipment(page);

    await expect(page.getByText('申請期限が過ぎています')).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
  });
});
