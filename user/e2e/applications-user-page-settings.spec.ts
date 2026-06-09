import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import {
  type UserPageSettings,
  baseSettings,
  registeredStatus,
  setupHomeApiMocks,
  unregisteredStatus,
} from './support/homeMocks';

const applicationRows = [
  {
    title: '物品申請',
    registrationFlag: 'addRentalOrder',
    editFlag: 'isEditRentalOrder',
  },
  {
    title: '電力申請',
    registrationFlag: 'addPowerOrder',
    editFlag: 'isEditPowerOrder',
  },
  {
    title: '従業員申請',
    registrationFlag: 'addEmployee',
    editFlag: 'isEditEmployee',
  },
  {
    title: '販売品申請',
    registrationFlag: 'addFoodProduct',
    editFlag: 'isEditFoodProduct',
  },
  {
    title: '購入品申請',
    registrationFlag: 'addPurchaseList',
    editFlag: 'isEditPurchaseList',
  },
  {
    title: '火気使用申請',
    registrationFlag: 'addFireEquipmentOrder',
    editFlag: 'isEditFireEquipmentOrder',
  },
] as const;

const settingWithOnly = (enabledFlag: string): UserPageSettings => ({
  ...baseSettings,
  isRegistGroup: false,
  isEditGroup: false,
  addRentalOrder: false,
  isEditRentalOrder: false,
  addPowerOrder: false,
  isEditPowerOrder: false,
  addEmployee: false,
  isEditEmployee: false,
  addFoodProduct: false,
  isEditFoodProduct: false,
  addPurchaseList: false,
  isEditPurchaseList: false,
  addFireEquipmentOrder: false,
  isEditFireEquipmentOrder: false,
  [enabledFlag]: true,
});

const applicationButton = (page: Page, title: string) =>
  page.getByRole('button').filter({ hasText: title });

test.describe('home applications user page setting behavior', () => {
  test('treats the registration toggle as correct for applications that are not registered yet', async ({
    page,
  }) => {
    for (const row of applicationRows) {
      await setupHomeApiMocks({
        page,
        userPageSettings: settingWithOnly(row.registrationFlag),
        registrationStatus: unregisteredStatus,
      });
      await page.goto('/home');

      await expect(applicationButton(page, row.title)).toContainText('受付中');
    }
  });

  test('does not use edit toggles to open applications that are not registered yet', async ({
    page,
  }) => {
    for (const row of applicationRows) {
      await setupHomeApiMocks({
        page,
        userPageSettings: settingWithOnly(row.editFlag),
        registrationStatus: unregisteredStatus,
      });
      await page.goto('/home');

      await expect(applicationButton(page, row.title)).toContainText(
        '受付終了'
      );
    }
  });

  test('treats the edit toggle as correct for applications that are already registered', async ({
    page,
  }) => {
    for (const row of applicationRows) {
      await setupHomeApiMocks({
        page,
        userPageSettings: settingWithOnly(row.editFlag),
        registrationStatus: registeredStatus,
      });
      await page.goto('/home');

      await expect(applicationButton(page, row.title)).toContainText('受付中');
    }
  });

  test('does not use registration toggles to reopen applications that are already registered', async ({
    page,
  }) => {
    for (const row of applicationRows) {
      await setupHomeApiMocks({
        page,
        userPageSettings: settingWithOnly(row.registrationFlag),
        registrationStatus: registeredStatus,
      });
      await page.goto('/home');

      await expect(applicationButton(page, row.title)).toContainText(
        '受付終了'
      );
    }
  });

  test('uses the group registration toggle before group registration and the group edit toggle after group registration', async ({
    page,
  }) => {
    await setupHomeApiMocks({
      page,
      userPageSettings: settingWithOnly('isRegistGroup'),
      registrationStatus: { ...unregisteredStatus, group: false },
    });
    await page.goto('/home');
    await expect(applicationButton(page, '団体申請')).toContainText('受付中');

    await setupHomeApiMocks({
      page,
      userPageSettings: settingWithOnly('isEditGroup'),
      registrationStatus: { ...registeredStatus, group: true },
    });
    await page.goto('/home');
    await expect(applicationButton(page, '団体申請')).toContainText('受付中');
  });
});
