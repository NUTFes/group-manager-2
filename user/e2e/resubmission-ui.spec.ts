import { expect, test } from '@playwright/test';
import type { Page, Route } from '@playwright/test';

const mockUser = {
  id: 1001,
  name: 'e2e user',
  email: 'e2e-ui@example.com',
};
const mockGroupId = 2001;

test.describe('resubmission UI', () => {
  // APIレスポンスをモックし、締切後かつ再提出状態の画面だけを安定して検証する。
  test.beforeEach(async ({ page }) => {
    await mockHomePageApis(page);
  });

  // 電力申請が締切後でも再提出状態なら、画面操作で修正フォームを開けることを確認する。
  test('allows editing power order when it is waiting resubmission after deadline', async ({
    page,
  }) => {
    await page.goto('/home');

    await page.getByRole('button', { name: /電力申請/ }).click();
    await expect(page.getByText('E2E ホットプレート')).toBeVisible();

    await page.getByRole('button', { name: '修正' }).first().click();

    await expect(page.getByLabel('機器の名称')).toBeVisible();
    await expect(page.getByLabel('電力量 (W)')).toBeVisible();
  });

  // 火器申請が締切後でも再提出状態なら、画面操作で修正フォームを開けることを確認する。
  test('allows editing fire equipment order when it is waiting resubmission after deadline', async ({
    page,
  }) => {
    await page.goto('/home');

    await page.getByRole('button', { name: /火気使用申請/ }).click();
    await expect(page.getByText('E2E バーナー')).toBeVisible();

    await page.getByRole('button', { name: '修正' }).first().click();

    await expect(page.getByLabel('火気の名称')).toBeVisible();
    await expect(page.getByLabel('使用用途')).toBeVisible();
  });
});

const mockHomePageApis = async (page: Page) => {
  await page.route('**/*', async (route) => {
    const url = route.request().url();

    if (url.includes('/api/auth/session')) {
      return fulfillJson(route, {
        user: {
          name: mockUser.name,
          email: mockUser.email,
        },
        expires: '2099-01-01T00:00:00.000Z',
        accessToken: 'e2e-access-token',
        client: 'e2e-client',
        uid: mockUser.email,
      });
    }

    if (url.endsWith('/api/getUser')) {
      return fulfillJson(route, {
        id: String(mockUser.id),
        name: mockUser.name,
        email: mockUser.email,
      });
    }

    if (url.includes(`/groups/user/${mockUser.id}`)) {
      return fulfillJson(
        route,
        apiResponse({
          id: mockGroupId,
          user_id: mockUser.id,
          group_category_id: 1,
        })
      );
    }

    if (url.includes('/user_page_settings')) {
      return fulfillJson(route, apiResponse(userPageSettingsAfterDeadline()));
    }

    if (url.includes(`/check_all_registered/${mockGroupId}`)) {
      return fulfillJson(
        route,
        apiResponse({
          group: true,
          sub_rep: true,
          rental_item: true,
          place_order: true,
          stage_order: false,
          stage_option: false,
          power_order: true,
          employee: false,
          venue_map: false,
          food_product: false,
          purchase_list: false,
          cooking_process_order: false,
          fire_equipment_order: true,
          public_relation: false,
        })
      );
    }

    if (
      url.includes(
        `/api/v1/get_health_center_submission_status_for_user/${mockGroupId}`
      )
    ) {
      return fulfillJson(
        route,
        apiResponse({
          submissions: [
            submission('power_order', 3001, 'waiting_resubmission'),
            submission('fire_equipment_order', 3002, 'waiting_resubmission'),
          ],
        })
      );
    }

    if (url.includes(`/power_orders/group/${mockGroupId}`)) {
      return fulfillJson(
        route,
        apiResponse([
          {
            id: 4001,
            group_id: mockGroupId,
            item: 'E2E ホットプレート',
            power: 800,
            manufacturer: 'E2E Maker',
            model: 'E2E-800',
            item_url: 'https://example.com/power',
          },
        ])
      );
    }

    if (
      url.includes(
        `/un_registered_groups/group?group_id=${mockGroupId}&order_type=1`
      )
    ) {
      return fulfillJson(route, apiResponse([]));
    }

    if (url.includes(`/fire_equipment_orders/group/${mockGroupId}`)) {
      return fulfillJson(
        route,
        apiResponse({
          id: 5001,
          group_id: mockGroupId,
          name: 'E2E バーナー',
          quantity: 1,
          fuel: 'gas_bottle',
          usage: 'E2E 調理',
          is_takeaway: true,
          remark: 'E2E 備考',
        })
      );
    }

    if (url.includes('/news')) {
      return fulfillJson(route, []);
    }

    if (isApplicationApi(url)) {
      return fulfillJson(route, apiResponse([]));
    }

    return route.continue();
  });
};

const apiResponse = <T>(data: T) => ({
  status: { code: 200, message: 'Success' },
  data,
});

const submission = (
  applicationType: string,
  id: number,
  status: 'waiting_resubmission'
) => ({
  id,
  application_type: applicationType,
  status,
  comments: [],
  detail: null,
});

const userPageSettingsAfterDeadline = () => ({
  id: 1,
  is_regist_group: true,
  is_regist_food_product: false,
  is_edit_group: false,
  is_edit_sub_rep: false,
  is_edit_place: false,
  is_edit_power_order: false,
  is_edit_rental_order: false,
  is_edit_stage_order: false,
  is_edit_employee: false,
  is_edit_food_product: false,
  is_edit_purchase_list: false,
  add_power_order: false,
  add_rental_order: false,
  add_employee: false,
  add_food_product: false,
  add_purchase_list: false,
  fes_year_id: 1,
  is_edit_announcement: false,
  add_announcement: false,
  is_edit_user: false,
  is_edit_stage_common_option: false,
  is_edit_public_relation: false,
  is_edit_venue_map: false,
  is_edit_cooking_process: false,
  add_fire_equipment_order: false,
  is_edit_fire_equipment_order: false,
  add_stage_order: false,
});

const fulfillJson = (route: Route, body: unknown) =>
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });

const isApplicationApi = (url: string) =>
  [
    '/groups/',
    '/rental_orders/group/',
    '/place_orders/group/',
    '/public_relations/group/',
    '/venue_maps/group/',
    '/food_products/group/',
    '/purchase_lists/food_product',
    '/cooking_process_orders/group/',
    '/employees/group/',
  ].some((path) => url.includes(path));
