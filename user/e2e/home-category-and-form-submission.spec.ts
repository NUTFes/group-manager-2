import { expect, test } from '@playwright/test';
import type { Page, Request, Route } from '@playwright/test';
import {
  GROUP_CATEGORY,
  apiResponse,
  baseSettings,
  fulfillJson,
  normalizeApiPath,
  registeredStatus,
  setupHomeApiMocks,
  unregisteredStatus,
} from './support/homeMocks';

const allApplicationTitles = [
  '団体申請',
  '副代表申請',
  '会場申請',
  '物品申請',
  '電力申請',
  'PR文申請',
  '従業員申請',
  '模擬店平面図',
  '販売品申請',
  '購入品申請',
  '調理工程申請',
  '火気使用申請',
  'ステージ申請',
  'ステージオプション申請',
] as const;

const categoryCases = [
  {
    name: '食品販売',
    groupCategoryId: GROUP_CATEGORY.FOOD_SALES,
    visible: [
      '団体申請',
      '副代表申請',
      '会場申請',
      '物品申請',
      '電力申請',
      'PR文申請',
      '従業員申請',
      '模擬店平面図',
      '販売品申請',
      '購入品申請',
      '調理工程申請',
      '火気使用申請',
    ],
  },
  {
    name: '物品販売',
    groupCategoryId: GROUP_CATEGORY.GOODS_SALES,
    visible: [
      '団体申請',
      '副代表申請',
      '会場申請',
      '物品申請',
      '電力申請',
      'PR文申請',
      '模擬店平面図',
      '販売品申請',
      '火気使用申請',
    ],
  },
  {
    name: 'ステージ',
    groupCategoryId: GROUP_CATEGORY.STAGE,
    visible: [
      '団体申請',
      '副代表申請',
      '物品申請',
      'ステージ申請',
      'ステージオプション申請',
      '電力申請',
      'PR文申請',
    ],
  },
  {
    name: '展示・体験',
    groupCategoryId: GROUP_CATEGORY.EXHIBITION,
    visible: [
      '団体申請',
      '副代表申請',
      '会場申請',
      '物品申請',
      '電力申請',
      'PR文申請',
      '模擬店平面図',
      '火気使用申請',
    ],
  },
  {
    name: '研究室公開',
    groupCategoryId: GROUP_CATEGORY.RESEARCH_LAB,
    visible: [
      '団体申請',
      '副代表申請',
      '会場申請',
      '物品申請',
      '電力申請',
      'PR文申請',
      '模擬店平面図',
      '火気使用申請',
    ],
  },
  {
    name: '実行委員会',
    groupCategoryId: GROUP_CATEGORY.COMMITTEE,
    visible: [
      '団体申請',
      '副代表申請',
      '会場申請',
      '物品申請',
      '電力申請',
      'PR文申請',
      '模擬店平面図',
    ],
  },
] as const;

const applicationButton = (page: Page, title: string) =>
  page.getByRole('button').filter({ hasText: title });

test.describe('home application category behavior', () => {
  for (const categoryCase of categoryCases) {
    test(`shows current application set for ${categoryCase.name}`, async ({
      page,
    }) => {
      await setupHomeApiMocks({
        page,
        groupCategoryId: categoryCase.groupCategoryId,
        registrationStatus: registeredStatus,
      });

      await page.goto('/home');

      for (const title of categoryCase.visible) {
        await expect(applicationButton(page, title)).toBeVisible();
      }

      const hiddenTitles = allApplicationTitles.filter(
        (title) => !(categoryCase.visible as readonly string[]).includes(title)
      );
      for (const title of hiddenTitles) {
        await expect(applicationButton(page, title)).toHaveCount(0);
      }
    });
  }
});

test.describe('home application form submissions', () => {
  test('submits a new group application from the UI', async ({ page }) => {
    let submittedUrl: URL | undefined;

    await setupHomeApiMocks({
      page,
      groupRegistered: false,
      registrationStatus: { ...unregisteredStatus, group: false },
    });
    await routeMutation(page, 'POST', '/groups', async (route, request) => {
      submittedUrl = new URL(request.url());
      await fulfillJson(
        route,
        apiResponse({
          id: 1,
          name: submittedUrl.searchParams.get('name'),
          project_name: submittedUrl.searchParams.get('project_name'),
        })
      );
    });

    await page.goto('/home');
    await applicationButton(page, '団体申請').click();
    await page.getByLabel('団体名').fill('E2E 団体');
    await page.getByLabel('企画名').fill('E2E 企画');
    await page
      .getByRole('radio', {
        name: 'いいえ、国際団体（留学生団体）ではありません。',
      })
      .check();
    await page.getByRole('radio', { name: 'いいえ、学内の団体です。' }).check();
    await page.getByLabel('参加形式').selectOption('4');
    await page.getByLabel('企画内容').fill('E2E の企画内容です。');
    await page.getByRole('button', { name: '登録', exact: true }).click();

    await expect
      .poll(() => submittedUrl?.searchParams.get('name'))
      .toBe('E2E 団体');
    expect(submittedUrl?.searchParams.get('project_name')).toBe('E2E 企画');
    expect(submittedUrl?.searchParams.get('group_category_id')).toBe('4');
    expect(submittedUrl?.searchParams.get('activity')).toBe(
      'E2E の企画内容です。'
    );
  });

  test('submits a venue application from the UI', async ({ page }) => {
    let submittedUrl: URL | undefined;

    await setupHomeApiMocks({
      page,
      groupCategoryId: GROUP_CATEGORY.EXHIBITION,
      registrationStatus: { ...registeredStatus, placeOrder: false },
    });
    await routeMutation(
      page,
      'POST',
      '/place_orders',
      async (route, request) => {
        submittedUrl = new URL(request.url());
        await fulfillJson(route, apiResponse({ id: 10 }));
      }
    );

    await page.goto('/home');
    await applicationButton(page, '会場申請').click();
    await page.getByLabel('第一希望').selectOption('1');
    await page.getByLabel('第二希望').selectOption('2');
    await page.getByLabel('第三希望').selectOption('3');
    await page.getByLabel('備考').fill('会場申請 E2E 備考');
    await page.getByRole('button', { name: '登録', exact: true }).click();

    await expect
      .poll(() => submittedUrl?.searchParams.get('group_id'))
      .toBe('1');
    expect(submittedUrl?.searchParams.get('first')).toBe('1');
    expect(submittedUrl?.searchParams.get('second')).toBe('2');
    expect(submittedUrl?.searchParams.get('third')).toBe('3');
    expect(submittedUrl?.searchParams.get('remark')).toBe('会場申請 E2E 備考');
  });

  test('submits a negative power application from the UI', async ({ page }) => {
    let submittedBody: unknown;

    await setupHomeApiMocks({
      page,
      registrationStatus: { ...registeredStatus, powerOrder: false },
    });
    await routeMutation(
      page,
      'POST',
      '/un_registered_groups',
      async (route, request) => {
        submittedBody = request.postDataJSON();
        await fulfillJson(route, { data: { id: 20 } });
      }
    );

    await page.goto('/home');
    await applicationButton(page, '電力申請').click();
    await page.getByRole('radio', { name: 'いいえ', exact: true }).check();
    await page.getByRole('button', { name: '登録', exact: true }).click();

    await expect
      .poll(() => submittedBody)
      .toEqual({
        group_id: 1,
        order_type: 1,
      });
  });

  test('submits a fire equipment application from the UI', async ({ page }) => {
    let submittedBody: Record<string, unknown> | undefined;

    await setupHomeApiMocks({
      page,
      registrationStatus: { ...registeredStatus, fireEquipmentOrder: false },
    });
    await routeMutation(
      page,
      'POST',
      '/fire_equipment_orders',
      async (route, request) => {
        submittedBody = request.postDataJSON();
        await fulfillJson(route, {
          success: true,
          data: { id: 30 },
        });
      }
    );

    await page.goto('/home');
    await applicationButton(page, '火気使用申請').click();
    await page.locator('input[name="火気を使用しますか？"][value="1"]').check();
    await page.getByLabel('火気の名称').fill('E2E コンロ');
    await page.getByLabel('火気の台数').fill('2');
    await page.getByLabel('燃料').selectOption('1');
    await page.getByLabel('使用用途').fill('湯煎に使用します。');
    await page
      .locator(
        'input[name="火気を毎日テントから持ち帰ることができますか？"][value="1"]'
      )
      .check();
    await page.getByLabel('備考').fill('毎日持ち帰ります。');
    await page.getByRole('button', { name: '登録', exact: true }).click();

    await expect.poll(() => submittedBody?.name).toBe('E2E コンロ');
    expect(submittedBody?.group_id).toBe(1);
    expect(submittedBody?.quantity).toBe(2);
    expect(submittedBody?.fuel).toBe(1);
    expect(submittedBody?.usage).toBe('湯煎に使用します。');
    expect(submittedBody?.is_takeaway).toBe(true);
    expect(submittedBody?.remark).toBe('毎日持ち帰ります。');
  });
});

test.describe('home application action availability', () => {
  test('does not show the group registration form when group registration is closed', async ({
    page,
  }) => {
    await setupHomeApiMocks({
      page,
      groupRegistered: false,
      registrationStatus: { ...unregisteredStatus, group: false },
      userPageSettings: { ...baseSettings, isRegistGroup: false },
    });

    await page.goto('/home');
    await applicationButton(page, '団体申請').click();

    await expect(page.getByLabel('団体名')).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: '登録', exact: true })
    ).toHaveCount(0);
  });

  test('shows the group edit form and submits PATCH when group editing is open', async ({
    page,
  }) => {
    let submittedUrl: URL | undefined;

    await setupHomeApiMocks({
      page,
      registrationStatus: registeredStatus,
      userPageSettings: { ...baseSettings, isEditGroup: true },
    });
    await routeMutation(page, 'PATCH', '/groups/1', async (route, request) => {
      submittedUrl = new URL(request.url());
      await fulfillJson(route, apiResponse({ id: 1 }));
    });

    await page.goto('/home');
    await applicationButton(page, '団体申請').click();
    await page.getByLabel('団体名').fill('E2E edited group');
    await page.getByRole('button', { name: '修正', exact: true }).click();

    await expect
      .poll(() => submittedUrl?.searchParams.get('name'))
      .toBe('E2E edited group');
  });

  test('does not show the group edit button when group editing is closed', async ({
    page,
  }) => {
    await setupHomeApiMocks({
      page,
      registrationStatus: registeredStatus,
      userPageSettings: { ...baseSettings, isEditGroup: false },
    });

    await page.goto('/home');
    await applicationButton(page, '団体申請').click();

    await expect(
      page.getByRole('button', { name: '修正', exact: true })
    ).toHaveCount(0);
  });

  test('does not show fire equipment registration controls when registration is closed', async ({
    page,
  }) => {
    await setupHomeApiMocks({
      page,
      registrationStatus: { ...registeredStatus, fireEquipmentOrder: false },
      userPageSettings: {
        ...baseSettings,
        addFireEquipmentOrder: false,
        isEditFireEquipmentOrder: true,
      },
    });

    await page.goto('/home');
    await applicationButton(page, '火気使用申請').click();

    await expect(page.getByText('火気を使用しますか？')).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: '登録', exact: true })
    ).toHaveCount(0);
  });

  test('shows the fire equipment edit form and submits PATCH when editing is open', async ({
    page,
  }) => {
    let submittedBody: Record<string, unknown> | undefined;

    await setupHomeApiMocks({
      page,
      registrationStatus: { ...registeredStatus, fireEquipmentOrder: true },
      userPageSettings: {
        ...baseSettings,
        addFireEquipmentOrder: false,
        isEditFireEquipmentOrder: true,
      },
    });
    await routeMutation(
      page,
      'PATCH',
      '/fire_equipment_orders/1',
      async (route, request) => {
        submittedBody = request.postDataJSON();
        await fulfillJson(route, { success: true, data: { id: 1 } });
      }
    );

    await page.goto('/home');
    await applicationButton(page, '火気使用申請').click();
    await page.getByRole('button', { name: '修正', exact: true }).click();
    await page.getByLabel('火気の名称').fill('E2E edited burner');
    await page.getByRole('button', { name: '修正', exact: true }).click();

    await expect.poll(() => submittedBody?.name).toBe('E2E edited burner');
    expect(submittedBody?.group_id).toBe(1);
  });

  test('does not show the fire equipment edit button when editing is closed', async ({
    page,
  }) => {
    await setupHomeApiMocks({
      page,
      registrationStatus: { ...registeredStatus, fireEquipmentOrder: true },
      userPageSettings: {
        ...baseSettings,
        addFireEquipmentOrder: true,
        isEditFireEquipmentOrder: false,
      },
    });

    await page.goto('/home');
    await applicationButton(page, '火気使用申請').click();

    await expect(
      page.getByRole('button', { name: '修正', exact: true })
    ).toHaveCount(0);
  });
});

const routeMutation = async (
  page: Page,
  method: string,
  expectedPath: string,
  handler: (route: Route, request: Request) => Promise<void>
) => {
  await page.route('**/*', async (route) => {
    const request = route.request();
    const path = normalizeApiPath(new URL(request.url()).pathname);

    if (request.method() === method && path === expectedPath) {
      await handler(route, request);
      return;
    }

    await route.fallback();
  });
};
