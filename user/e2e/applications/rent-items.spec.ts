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
  test('reveals the registration form when yes is chosen', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openRentItems(page);
    await selectRadio(page, FIELDS.question, 1);

    await expect(page.getByLabel(FIELDS.item)).toBeVisible();
    await expect(page.getByLabel(FIELDS.count)).toBeVisible();
    await expect(submitButton(page)).toBeVisible();
  });
});
