// 物品申請の特性化テスト。
// 現状の挙動をそのまま凍結する。既知バグは BUG コメント付きで記録し、
// アプリ側は直さない。
//
// この群の特殊事情:
// - scenarioState() の既定団体区分(groupCategoryId=1=食品販売)は
//   isFoodSellingGroup=true になり、会場タイプは屋外に固定され
//   (locationType選択UI自体が非表示: hideLocationTypeSelect)、
//   会場タイプに応じた物品一覧は屋外用エンドポイントを叩く。
// - hasItems の defaultValues は false。Radio は tri-state(未選択)を
//   表現できないbooleanのため、初期表示から「いいえ」が選択された状態になり、
//   「はい/いいえ」を選ぶ前から「申請しない」登録ボタンが出てしまう
//   (Power申請と同種のBUG)。
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mockHomePageApis } from '../support/mockServer';
import {
  ORDER_TYPES,
  RENTABLE_ITEM_IDS,
  type RentalOrderRecord,
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
  question: '物品申請を行いますか？',
  locationQuestion: '会場申請の第一希望はどちらですか？',
  item: '物品名',
  count: '個数',
} as const;

const registeredRentalOrder = (): RentalOrderRecord => ({
  id: 20101,
  group_id: mockGroupId,
  rental_item_id: RENTABLE_ITEM_IDS.table,
  num: 2,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
});

const openRentItems = (page: Page) =>
  page
    .getByRole('button', { name: new RegExp(APPLICATION_TITLES.rentItems) })
    .click();

test.describe('rent items application', () => {
  // BUG: hasItemsのdefaultValuesがfalseのため、「はい/いいえ」を選ぶ前から
  // 「いいえ」が選択された状態になり、「申請しない」登録ボタンが表示されてしまう。
  test('BUG: shows the not-applying register button before choosing yes or no', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openRentItems(page);

    await expect(page.getByText(FIELDS.question)).toBeVisible();
    await expect(page.getByLabel(FIELDS.item)).toHaveCount(0);
    // 食品販売団体なので会場タイプの選択UI自体が出ない。
    await expect(page.getByText(FIELDS.locationQuestion)).toHaveCount(0);
    // 食品販売団体向けの注記は常に表示される。
    await expect(
      page.getByText('※食品販売団体は屋外での出店のみとなります')
    ).toBeVisible();
    // 未選択のはずが「いいえ」の登録ボタンが見えてしまう(BUG)。
    await expect(
      page.getByRole('button', { name: BUTTONS.register, exact: true })
    ).toBeVisible();
  });

  // 「はい」を選ぶと登録フォームが現れる。
  test('reveals the registration form when yes is chosen', async ({ page }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openRentItems(page);
    await selectRadio(page, FIELDS.question, 1);

    await expect(page.getByLabel(FIELDS.item)).toBeVisible();
    await expect(page.getByLabel(FIELDS.count)).toBeVisible();
    await expect(submitButton(page)).toBeVisible();
  });

  // isValid: 物品が未選択のままだと送信ボタンは無効。
  test('keeps the submit button disabled until an item is selected', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openRentItems(page);
    await selectRadio(page, FIELDS.question, 1);

    await expect(submitButton(page)).toBeDisabled();

    await page.getByLabel(FIELDS.item).selectOption({ label: 'E2E テーブル' });

    await expect(submitButton(page)).toBeEnabled();
  });

  // 入力して登録すると POST /rental_orders がJSONボディで呼ばれる。
  test('creates a rental order via POST /rental_orders', async ({ page }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openRentItems(page);
    await selectRadio(page, FIELDS.question, 1);
    await page.getByLabel(FIELDS.item).selectOption({ label: 'E2E テーブル' });
    await page.getByLabel(FIELDS.count).selectOption('3');
    await submitButton(page).click();

    await expect(page.getByText('物品申請を登録しました')).toBeVisible();
    expect(state.requestedUrls).toContain('/rental_orders');
    expect(state.rentalOrders).toHaveLength(1);
    expect(state.rentalOrders[0]).toMatchObject({
      group_id: mockGroupId,
      rental_item_id: RENTABLE_ITEM_IDS.table,
      num: 3,
    });
  });

  // API が500を返した場合、トーストとフォーム内バナーで別々のi18nキー(異なる文言)が
  // 表示される(Power/FireEquipmentは同一文言を使い回すが、この群は独立している)。
  test('shows different toast and banner text when the submit API fails', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openRentItems(page);
    await selectRadio(page, FIELDS.question, 1);
    await page.getByLabel(FIELDS.item).selectOption({ label: 'E2E テーブル' });

    await page.route('**/rental_orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 500, body: 'e2e forced failure' });
        return;
      }
      await route.continue();
    });

    await submitButton(page).click();

    await expect(page.getByText('物品申請の送信に失敗しました')).toBeVisible();
    await expect(
      page.getByText('送信中にエラーが発生しました。もう一度お試しください。')
    ).toBeVisible();
    expect(state.rentalOrders).toHaveLength(0);
  });

  // addItem/remove: 物品を追加・削除できる。
  test('adds and removes item rows in the form', async ({ page }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openRentItems(page);
    await selectRadio(page, FIELDS.question, 1);

    await expect(page.getByLabel(FIELDS.item)).toHaveCount(1);
    // ボタンの内容は「+ 物品の追加」(+アイコンと連結される)ため完全一致では引けない。
    await page.getByRole('button', { name: /物品の追加/ }).click();
    await expect(page.getByLabel(FIELDS.item)).toHaveCount(2);

    await page
      .getByRole('button', { name: BUTTONS.delete, exact: true })
      .first()
      .click();
    await expect(page.getByLabel(FIELDS.item)).toHaveCount(1);
  });

  // 登録済みなら一覧表示になり、修正ボタンでフォームへ切り替わる。
  test('shows the summary with an edit button when already registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.rentalOrders = [registeredRentalOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openRentItems(page);

    await expect(page.getByText('E2E テーブル')).toBeVisible();
    await expect(page.getByText('2 個')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();
  });

  // 既存値を変更して保存すると PATCH /rental_orders/:id が呼ばれる。
  // 送信ボタンの文言は「登録」ではなく hasExisting=true のため「修正」のまま。
  test('updates an existing order via the edit form, submit button is labeled edit', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.rentalOrders = [registeredRentalOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openRentItems(page);
    await page.getByRole('button', { name: BUTTONS.edit, exact: true }).click();

    // 既存値が初期表示される。
    await expect(page.getByLabel(FIELDS.item)).toHaveValue(
      String(RENTABLE_ITEM_IDS.table)
    );
    await expect(page.getByLabel(FIELDS.count)).toHaveValue('2');

    await page.getByLabel(FIELDS.count).selectOption('5');
    // 送信ボタンのラベルは常に「修正」(hasExisting=trueのため)。
    await expect(
      page.getByRole('button', { name: BUTTONS.register, exact: true })
    ).toHaveCount(0);
    await submitButton(page).click();

    await expect(page.getByText('物品申請を更新しました')).toBeVisible();
    expect(state.requestedUrls).toContain('/rental_orders/20101');
    expect(state.rentalOrders[0]).toMatchObject({
      id: 20101,
      num: 5,
    });
  });

  // 「いいえ」を選ぶと申請しない登録が行われ、POST /un_registered_groups が
  // ネストしたボディ({un_registered_group:{group_id,order_type}})で呼ばれる。
  test('registers the not-applying marker when no is chosen', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openRentItems(page);
    // hasItemsのdefaultはfalseなので、既に「いいえ」が選択された状態。
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(
      page.getByText('物品申請を行わない設定を登録しました')
    ).toBeVisible();
    expect(state.requestedUrls).toContain('/un_registered_groups');
    expect(state.unregisteredOrderTypes).toContain(ORDER_TYPES.rentalItem);

    // 登録後は一覧表示に切り替わり、専用の説明文が出る。
    await expect(page.getByText('物品申請は不要（登録済み）')).toBeVisible();
  });

  // 「不使用」が登録済みの場合、開いた時点で一覧表示になる。
  test('shows the not-applying notice when the marker already exists', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.unregisteredOrderTypes = [ORDER_TYPES.rentalItem];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openRentItems(page);

    await expect(page.getByText('物品申請は不要（登録済み）')).toBeVisible();
  });

  // 締切後、登録済みなら一覧のみで修正ボタンを出さない。
  test('hides the edit control after the deadline', async ({ page }) => {
    const state = scenarioState('closed');
    state.rentalOrders = [registeredRentalOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openRentItems(page);

    await expect(page.getByText('E2E テーブル')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 締切後、未登録かつ「申請しない」記録もない場合は締切案内のみを表示する。
  test('shows the deadline notice when nothing is registered', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openRentItems(page);

    await expect(page.getByText('申請期限が過ぎています')).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
  });
});
