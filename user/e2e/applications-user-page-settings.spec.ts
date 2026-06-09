import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import {
  type UserPageSettings,
  baseSettings,
  registeredStatus,
  setupHomeApiMocks,
  unregisteredStatus,
} from './support/homeMocks';

const applicationsUsingRegistrationAndEditSettings = [
  {
    title: '物品申請',
    registrationStatusKey: 'rentalItem',
    registrationSettingKey: 'addRentalOrder',
    editSettingKey: 'isEditRentalOrder',
  },
  {
    title: '電力申請',
    registrationStatusKey: 'powerOrder',
    registrationSettingKey: 'addPowerOrder',
    editSettingKey: 'isEditPowerOrder',
  },
  {
    title: '従業員申請',
    registrationStatusKey: 'employee',
    registrationSettingKey: 'addEmployee',
    editSettingKey: 'isEditEmployee',
  },
  {
    title: '販売品申請',
    registrationStatusKey: 'foodProduct',
    registrationSettingKey: 'addFoodProduct',
    editSettingKey: 'isEditFoodProduct',
  },
  {
    title: '購入品申請',
    registrationStatusKey: 'purchaseList',
    registrationSettingKey: 'addPurchaseList',
    editSettingKey: 'isEditPurchaseList',
  },
  {
    title: '火気使用申請',
    registrationStatusKey: 'fireEquipmentOrder',
    registrationSettingKey: 'addFireEquipmentOrder',
    editSettingKey: 'isEditFireEquipmentOrder',
  },
] as const;

const userPageSettingKeysUnderTest =
  applicationsUsingRegistrationAndEditSettings.flatMap((row) => [
    row.registrationSettingKey,
    row.editSettingKey,
  ]);

const settingWithOnly = (enabledFlag: string): UserPageSettings => ({
  ...baseSettings,
  isRegistGroup: false,
  isEditGroup: false,
  ...Object.fromEntries(
    userPageSettingKeysUnderTest.map((key) => [key, false])
  ),
  [enabledFlag]: true,
});

const applicationButton = (page: Page, title: string) =>
  page.getByRole('button').filter({ hasText: title });

test.describe('home applications user page setting behavior', () => {
  test('treats the registration toggle as correct for applications that are not registered yet', async ({
    page,
  }) => {
    for (const row of applicationsUsingRegistrationAndEditSettings) {
      await setupHomeApiMocks({
        page,
        userPageSettings: settingWithOnly(row.registrationSettingKey),
        registrationStatus: {
          ...registeredStatus,
          [row.registrationStatusKey]: false,
        },
      });
      await page.goto('/home');

      await expect(applicationButton(page, row.title)).toContainText('受付中');
    }
  });

  test('does not use edit toggles to open applications that are not registered yet', async ({
    page,
  }) => {
    for (const row of applicationsUsingRegistrationAndEditSettings) {
      await setupHomeApiMocks({
        page,
        userPageSettings: settingWithOnly(row.editSettingKey),
        registrationStatus: {
          ...registeredStatus,
          [row.registrationStatusKey]: false,
        },
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
    for (const row of applicationsUsingRegistrationAndEditSettings) {
      await setupHomeApiMocks({
        page,
        userPageSettings: settingWithOnly(row.editSettingKey),
        registrationStatus: {
          ...unregisteredStatus,
          [row.registrationStatusKey]: true,
        },
      });
      await page.goto('/home');

      await expect(applicationButton(page, row.title)).toContainText('受付中');
    }
  });

  test('does not use registration toggles to reopen applications that are already registered', async ({
    page,
  }) => {
    for (const row of applicationsUsingRegistrationAndEditSettings) {
      await setupHomeApiMocks({
        page,
        userPageSettings: settingWithOnly(row.registrationSettingKey),
        registrationStatus: {
          ...unregisteredStatus,
          [row.registrationStatusKey]: true,
        },
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
      groupRegistered: false,
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
