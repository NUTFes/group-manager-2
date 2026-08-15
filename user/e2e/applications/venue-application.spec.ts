// 会場申請の特性化テスト。
// 現状の挙動をそのまま凍結する。既知バグは BUG コメント付きで記録し、
// Phase 4 の修正コミットで assert を反転させる。
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mockHomePageApis } from '../support/mockServer';
import {
  PLACE_IDS,
  type ScenarioState,
  mockGroupId,
  scenarioState,
} from '../support/scenarioState';
import {
  APPLICATION_TITLES,
  BUTTONS,
  submitButton,
} from '../support/selectors';

const FIELDS = {
  first: '第一希望',
  second: '第二希望',
  third: '第三希望',
  remark: '備考',
} as const;

const registeredPlaceOrder = (): ScenarioState['placeOrder'] => ({
  id: 8001,
  group_id: mockGroupId,
  first: PLACE_IDS.gym1,
  second: PLACE_IDS.gym2,
  third: PLACE_IDS.courtyard,
  remark: '既存の備考',
});

const openVenue = (page: Page) =>
  page
    .getByRole('button', {
      name: new RegExp(APPLICATION_TITLES.venueApplication),
    })
    .click();

const choose = (page: Page, field: string, placeId: number) =>
  page.getByLabel(field).selectOption(String(placeId));

test.describe('venue application', () => {
  // 未登録なら、アコーディオンを開いた時点で入力フォームが表示される。
  test('shows the input form when nothing is registered yet', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenue(page);

    for (const field of Object.values(FIELDS)) {
      await expect(page.getByLabel(field)).toBeVisible();
    }
    await expect(
      page.getByRole('button', { name: BUTTONS.register, exact: true })
    ).toBeVisible();
  });

  // 希望を3つ選んで登録すると、POST /place_orders が snake_case のクエリで呼ばれる。
  test('creates a place order with snake_case query parameters', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenue(page);

    await choose(page, FIELDS.first, PLACE_IDS.gym1);
    await choose(page, FIELDS.second, PLACE_IDS.gym2);
    await choose(page, FIELDS.third, PLACE_IDS.courtyard);
    await page.getByLabel(FIELDS.remark).fill('E2E 登録備考');
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('登録しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/place_orders');
    expect(state.placeOrder).toMatchObject({
      group_id: mockGroupId,
      first: PLACE_IDS.gym1,
      second: PLACE_IDS.gym2,
      third: PLACE_IDS.courtyard,
      remark: 'E2E 登録備考',
    });
  });

  // superRefine: 同じ会場を重複して選ぶと送信されない。
  test('blocks submission when the same place is chosen twice', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenue(page);

    await choose(page, FIELDS.first, PLACE_IDS.gym1);
    await choose(page, FIELDS.second, PLACE_IDS.gym1);
    await choose(page, FIELDS.third, PLACE_IDS.courtyard);
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('希望が重複しています').first()).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
  });

  // superRefine: 「その他」を選んだ場合は備考が必須。
  test('requires a remark when the other option is chosen', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenue(page);

    await choose(page, FIELDS.first, PLACE_IDS.other);
    await choose(page, FIELDS.second, PLACE_IDS.gym2);
    await choose(page, FIELDS.third, PLACE_IDS.courtyard);
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('備考に場所を入力してください')).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 登録済みなら一覧表示になり、会場名が解決されて出る。
  test('shows the resolved place names when already registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.placeOrder = registeredPlaceOrder();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenue(page);

    await expect(page.getByText('第1体育館')).toBeVisible();
    await expect(page.getByText('第2体育館')).toBeVisible();
    await expect(page.getByText('中庭')).toBeVisible();
    await expect(page.getByText('既存の備考')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();
  });

  // 既存値を変更して送信すると PATCH /place_orders/:id が呼ばれる。
  test('updates an existing place order via PATCH', async ({ page }) => {
    const state = scenarioState('registration');
    state.placeOrder = registeredPlaceOrder();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenue(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await choose(page, FIELDS.third, PLACE_IDS.other);
    await page.getByLabel(FIELDS.remark).fill('E2E 更新備考');
    await submitButton(page).click();

    await expect(page.getByText('登録しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/place_orders/8001');
    expect(state.placeOrder).toMatchObject({
      first: PLACE_IDS.gym1,
      second: PLACE_IDS.gym2,
      third: PLACE_IDS.other,
      remark: 'E2E 更新備考',
    });
  });

  // validateEdit(): 既存値から変えていない間は送信ボタンが無効。
  test('keeps the submit button disabled until a value actually changes', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.placeOrder = registeredPlaceOrder();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenue(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await expect(submitButton(page)).toBeDisabled();

    await choose(page, FIELDS.third, PLACE_IDS.other);
    await expect(submitButton(page)).toBeEnabled();
  });

  // BUG(Phase 4-1): 送信後に呼ばれる mutate('/check_all_registered/:id') は
  // 文字列キーのため SWR のタプルキーと一致せず no-op。
  // 一方 placeOrderMutate() はフック由来のため機能し、一覧自体は更新される。
  test('refreshes its own summary but never revalidates check_all_registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenue(page);

    await choose(page, FIELDS.first, PLACE_IDS.gym1);
    await choose(page, FIELDS.second, PLACE_IDS.gym2);
    await choose(page, FIELDS.third, PLACE_IDS.courtyard);
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    // placeOrderMutate() は機能するので、フォームから一覧表示へ切り替わり登録内容が反映される。
    // (先に select が消えるのを待たないと、同名の <option> と多重一致する)
    await expect(page.getByLabel(FIELDS.first)).toHaveCount(0);
    await expect(page.getByText('第1体育館')).toBeVisible();

    // 一方 check_all_registered は再取得されない。
    expect(
      state.requestedUrls.filter((url) => url.includes('/check_all_registered'))
    ).toHaveLength(0);
  });

  // 締切後は一覧のみで、修正ボタンを出さない。
  test('hides the edit button after the deadline', async ({ page }) => {
    const state = scenarioState('closed');
    state.placeOrder = registeredPlaceOrder();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenue(page);

    await expect(page.getByText('第1体育館')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });
});
