import { expect, test } from '@playwright/test';
import { mockHomePageApis } from './support/mockServer';
import {
  ORDER_TYPES,
  scenarioState,
  submissionApplicationTypes,
} from './support/scenarioState';
import { fillFireEquipmentForm, fillPowerForm } from './support/selectors';

test.describe('resubmission UI', () => {
  // 保健所関連の全申請について、再提出ステータスと受付中表示がユーザー画面へ反映されることを確認する。
  test('shows resubmission status for all applications', async ({ page }) => {
    const state = scenarioState('closed');
    submissionApplicationTypes.forEach((applicationType) => {
      state.statuses[applicationType] = 'waiting_resubmission';
    });
    await mockHomePageApis(page, state);

    await page.goto('/home');

    for (const title of [
      '物品申請',
      '電力申請',
      '従業員申請',
      '模擬店平面図',
      '販売品申請',
      '購入品申請',
      '調理工程申請',
      '火気使用申請',
    ]) {
      const accordion = page.getByRole('button', {
        name: new RegExp(title),
      });
      await expect(
        accordion.getByText('再提出', { exact: true })
      ).toBeVisible();
      await expect(
        accordion.getByText('受付中', { exact: true })
      ).toBeVisible();
    }
  });

  for (const { categoryName, groupCategoryId, applications } of [
    {
      categoryName: 'goods sales',
      groupCategoryId: 2,
      applications: ['物品申請', '模擬店平面図', '販売品申請'],
    },
    {
      categoryName: 'stage',
      groupCategoryId: 3,
      applications: ['物品申請'],
    },
    {
      categoryName: 'exhibition',
      groupCategoryId: 4,
      applications: ['物品申請', '模擬店平面図'],
    },
    {
      categoryName: 'research lab',
      groupCategoryId: 5,
      applications: ['物品申請', '模擬店平面図'],
    },
    {
      categoryName: 'committee',
      groupCategoryId: 6,
      applications: ['物品申請', '模擬店平面図'],
    },
  ]) {
    test(`passes resubmission statuses to ${categoryName} applications`, async ({
      page,
    }) => {
      const state = scenarioState('closed');
      state.groupCategoryId = groupCategoryId;
      state.statuses.equipment = 'waiting_resubmission';
      state.statuses.venue_map = 'waiting_resubmission';
      state.statuses.food_product = 'waiting_resubmission';
      await mockHomePageApis(page, state);

      await page.goto('/home');

      for (const title of applications) {
        const accordion = page.getByRole('button', {
          name: new RegExp(title),
        });
        await expect(
          accordion.getByText('再提出', { exact: true })
        ).toBeVisible();
        await expect(
          accordion.getByText('受付中', { exact: true })
        ).toBeVisible();
      }
    });
  }

  // 締切前の未登録状態から、電力申請フォームを入力・送信し、登録後カードに入力値が表示されることを確認する。
  test('registers a power order and displays the submitted card values', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await page.getByRole('button', { name: /電力申請/ }).click();
    await page.getByRole('radio', { name: 'はい' }).check();

    await fillPowerForm(page, {
      item: 'E2E 登録ホットプレート',
      manufacturer: '登録メーカー',
      model: 'REG-100',
      itemUrl: 'https://example.com/registered-power',
      power: '900',
    });
    await page.getByRole('button', { name: '登録', exact: true }).click();

    await expect(page.getByText('E2E 登録ホットプレート')).toBeVisible();
    await expect(page.getByText('登録メーカー')).toBeVisible();
    await expect(page.getByText('REG-100')).toBeVisible();
    await expect(page.getByText('900W')).toBeVisible();
    expect(state.requestedUrls).toContain('/power_orders/submit');
  });

  // 締切前の未登録状態から、火器申請フォームを入力・送信し、登録後カードに入力値が表示されることを確認する。
  test('registers a fire equipment order and displays the submitted card values', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await page.getByRole('button', { name: /火気使用申請/ }).click();
    await page.getByRole('radio', { name: 'はい' }).check();

    await fillFireEquipmentForm(page, {
      name: 'E2E 登録バーナー',
      quantity: '2',
      fuelLabel: 'LPガス',
      usage: 'E2E 登録調理',
      remark: 'E2E 登録備考',
    });
    await page.getByRole('button', { name: '登録', exact: true }).click();

    await expect(page.getByText('E2E 登録バーナー')).toBeVisible();
    await expect(page.getByText('2', { exact: true })).toBeVisible();
    await expect(page.getByText('LPガス')).toBeVisible();
    await expect(page.getByText('E2E 登録調理')).toBeVisible();
    await expect(page.getByText('E2E 登録備考')).toBeVisible();
    expect(state.requestedUrls).toContain('/fire_equipment_orders/submit');
  });

  // 電力申請が締切後でも再提出状態なら既存カードから修正でき、送信後はunapprovedに戻って再編集できないことを確認する。
  test('updates a power order from the resubmission card and displays updated values', async ({
    page,
  }) => {
    const state = scenarioState('resubmission');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await page.getByRole('button', { name: /電力申請/ }).click();
    await expect(page.getByText('E2E ホットプレート')).toBeVisible();

    await page
      .getByRole('button', { name: '修正', exact: true })
      .first()
      .click();
    await fillPowerForm(page, {
      item: 'E2E 更新ホットプレート',
      manufacturer: '更新メーカー',
      model: 'UPD-900',
      itemUrl: 'https://example.com/updated-power',
      power: '950',
    });
    await page.getByRole('button', { name: '保存', exact: true }).click();

    await expect(page.getByText('E2E 更新ホットプレート')).toBeVisible();
    await expect(page.getByText('更新メーカー')).toBeVisible();
    await expect(page.getByText('UPD-900')).toBeVisible();
    await expect(page.getByText('950W')).toBeVisible();
    // 再提出後はステータスがunapprovedに変わるため、締切後の再編集ボタンが表示されないことを確認する。
    await expect(
      page.getByRole('button', { name: '修正', exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toContain('/power_orders/submit');
  });

  // 火器申請が締切後でも再提出状態なら既存カードから修正でき、送信後はunapprovedに戻って再編集できないことを確認する。
  test('updates a fire equipment order from the resubmission card and displays updated values', async ({
    page,
  }) => {
    const state = scenarioState('resubmission');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await page.getByRole('button', { name: /火気使用申請/ }).click();
    await expect(page.getByText('E2E バーナー')).toBeVisible();

    await page
      .getByRole('button', { name: '修正', exact: true })
      .first()
      .click();
    await fillFireEquipmentForm(page, {
      name: 'E2E 更新バーナー',
      quantity: '3',
      fuelLabel: '炭',
      usage: 'E2E 更新調理',
      remark: 'E2E 更新備考',
    });
    await page.getByRole('button', { name: '保存', exact: true }).click();

    await expect(page.getByText('E2E 更新バーナー')).toBeVisible();
    await expect(page.getByText('3', { exact: true })).toBeVisible();
    await expect(page.getByText('炭')).toBeVisible();
    await expect(page.getByText('E2E 更新調理')).toBeVisible();
    await expect(page.getByText('E2E 更新備考')).toBeVisible();
    // 再提出後はステータスがunapprovedに変わるため、締切後の再編集ボタンが表示されないことを確認する。
    await expect(
      page.getByRole('button', { name: '修正', exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toContain('/fire_equipment_orders/submit');
  });

  // 締切後かつステータスがunapprovedで再提出状態ではない場合、登録済みの電力・火器申請カードを修正できないことを確認する。
  test('does not allow editing existing power or fire equipment orders after deadline without resubmission status', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    await mockHomePageApis(page, state);

    await page.goto('/home');

    await page.getByRole('button', { name: /電力申請/ }).click();
    await expect(page.getByText('E2E ホットプレート')).toBeVisible();
    await expect(
      page.getByRole('button', { name: '修正', exact: true })
    ).toHaveCount(0);

    await page.getByRole('button', { name: /火気使用申請/ }).click();
    await expect(page.getByText('E2E バーナー')).toBeVisible();
    await expect(
      page.getByRole('button', { name: '修正', exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 火気申請の新規登録だけが受付中の場合でも、既存申請の編集・削除や「申請なし」の解除は許可しない。
  test('does not allow modifying existing fire equipment applications when only registration is open', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    state.fireEquipmentPermissions = { canAdd: true, canEdit: false };
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await page.getByRole('button', { name: /火気使用申請/ }).click();
    await expect(page.getByText('E2E バーナー')).toBeVisible();
    await expect(
      page.getByRole('button', { name: '修正', exact: true })
    ).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: '削除', exact: true })
    ).toHaveCount(0);

    state.fireEquipmentOrders = [];
    state.unregisteredOrderTypes = [ORDER_TYPES.fireEquipment];
    await page.reload();
    await page.getByRole('button', { name: /火気使用申請/ }).click();
    await expect(page.getByText('火気申請は不要（登録済み）')).toBeVisible();
    await expect(
      page.getByRole('button', { name: '修正', exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });
});
