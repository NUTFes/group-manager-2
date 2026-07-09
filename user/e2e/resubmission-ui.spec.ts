import { expect, test } from '@playwright/test';
import type { Page, Route } from '@playwright/test';

const mockUser = {
  id: 1001,
  name: 'e2e user',
  email: 'e2e-ui@example.com',
};
const mockGroupId = 2001;

type SubmissionStatusValue =
  | 'unapproved'
  | 'waiting_resubmission'
  | 'approved'
  | 'unsubmitted';

type PowerOrder = {
  id: number;
  group_id: number;
  item: string;
  power: number;
  manufacturer: string;
  model: string;
  item_url: string;
};

type FireEquipmentOrder = {
  id: number;
  group_id: number;
  name: string;
  quantity: number;
  fuel: 'gas_bottle' | 'lp_gas' | 'charcoal';
  usage: string;
  is_takeaway: boolean;
  remark: string;
};

type ScenarioState = {
  pageMode: 'registration' | 'resubmission' | 'closed';
  statuses: Record<
    'power_order' | 'fire_equipment_order',
    SubmissionStatusValue
  >;
  powerOrders: PowerOrder[];
  fireEquipmentOrder: FireEquipmentOrder | null;
  requestedUrls: string[];
};

test.describe('resubmission UI', () => {
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
    await page.getByRole('button', { name: '登録', exact: true }).click();

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
    await page.getByRole('button', { name: '修正', exact: true }).click();

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
});

const scenarioState = (pageMode: ScenarioState['pageMode']): ScenarioState => ({
  pageMode,
  statuses: {
    power_order:
      pageMode === 'resubmission'
        ? 'waiting_resubmission'
        : pageMode === 'closed'
          ? 'unapproved'
          : 'unsubmitted',
    fire_equipment_order:
      pageMode === 'resubmission'
        ? 'waiting_resubmission'
        : pageMode === 'closed'
          ? 'unapproved'
          : 'unsubmitted',
  },
  powerOrders:
    pageMode !== 'registration'
      ? [
          {
            id: 4001,
            group_id: mockGroupId,
            item: 'E2E ホットプレート',
            power: 800,
            manufacturer: 'E2E Maker',
            model: 'E2E-800',
            item_url: 'https://example.com/power',
          },
        ]
      : [],
  fireEquipmentOrder:
    pageMode !== 'registration'
      ? {
          id: 5001,
          group_id: mockGroupId,
          name: 'E2E バーナー',
          quantity: 1,
          fuel: 'gas_bottle',
          usage: 'E2E 調理',
          is_takeaway: true,
          remark: 'E2E 備考',
        }
      : null,
  requestedUrls: [],
});

const fillPowerForm = async (
  page: Page,
  values: {
    item: string;
    manufacturer: string;
    model: string;
    itemUrl: string;
    power: string;
  }
) => {
  await page.getByLabel('機器の名称').fill(values.item);
  await page.getByLabel('機器のメーカー名').fill(values.manufacturer);
  await page.getByLabel('型番').fill(values.model);
  await page.getByLabel('製品URL').fill(values.itemUrl);
  await page.getByLabel('電力量 (W)').fill(values.power);
};

const fillFireEquipmentForm = async (
  page: Page,
  values: {
    name: string;
    quantity: string;
    fuelLabel: string;
    usage: string;
    remark: string;
  }
) => {
  await page.getByLabel('火気の名称').fill(values.name);
  await page.getByLabel('火気の台数').fill(values.quantity);
  await page.getByLabel('燃料').selectOption({ label: values.fuelLabel });
  await page.getByLabel('使用用途').fill(values.usage);
  await page.getByLabel('備考').fill(values.remark);
};

const mockHomePageApis = async (page: Page, state: ScenarioState) => {
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    const requestUrl = new URL(url);
    const path = `${requestUrl.pathname}${requestUrl.search}`;
    const method = route.request().method();

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

    if (path === `/groups/user/${mockUser.id}`) {
      return fulfillJson(
        route,
        apiResponse({
          id: mockGroupId,
          user_id: mockUser.id,
          group_category_id: 1,
        })
      );
    }

    if (path === '/user_page_settings') {
      return fulfillJson(route, apiResponse(userPageSettings(state.pageMode)));
    }

    if (path === `/check_all_registered/${mockGroupId}`) {
      return fulfillJson(route, apiResponse(checkAllRegistered(state)));
    }

    if (path === `/health_center_submission_statuses?group_id=${mockGroupId}`) {
      return fulfillJson(
        route,
        apiResponse({
          submissions: [
            submission('power_order', 3001, state.statuses.power_order),
            submission(
              'fire_equipment_order',
              3002,
              state.statuses.fire_equipment_order
            ),
          ],
        })
      );
    }

    if (method === 'GET' && path === `/power_orders/group/${mockGroupId}`) {
      return fulfillJson(route, apiResponse(state.powerOrders));
    }

    if (method === 'POST' && path === '/power_orders') {
      state.requestedUrls.push(path);
      const body = (await route
        .request()
        .postDataJSON()) as Partial<PowerOrder>;
      const powerOrder = powerOrderFromBody(body, 4101);
      state.powerOrders = [powerOrder];
      return fulfillJson(route, apiResponse(powerOrder));
    }

    if (method === 'PUT' && /^\/power_orders\/\d+$/.test(path)) {
      state.requestedUrls.push(path);
      const body = (await route
        .request()
        .postDataJSON()) as Partial<PowerOrder>;
      const id = Number(path.split('/').at(-1));
      const powerOrder = powerOrderFromBody(body, id);
      state.powerOrders = [powerOrder];
      return fulfillJson(route, apiResponse(powerOrder));
    }

    if (method === 'PUT' && path === '/power_orders/submit') {
      state.requestedUrls.push(path);
      const body = (await route.request().postDataJSON()) as {
        use_power: boolean;
        power_orders: Partial<PowerOrder>[];
      };
      if (body.use_power) {
        state.powerOrders = body.power_orders.map((powerOrder, index) => ({
          id: powerOrder.id ?? 4101 + index,
          group_id: powerOrder.group_id ?? mockGroupId,
          item: powerOrder.item ?? '',
          power: powerOrder.power ?? 0,
          manufacturer: powerOrder.manufacturer ?? '',
          model: powerOrder.model ?? '',
          item_url: powerOrder.item_url ?? '',
        }));
      } else {
        state.powerOrders = [];
      }
      state.statuses.power_order = 'unapproved';
      return fulfillJson(route, apiResponse(state.powerOrders[0]));
    }

    if (method === 'DELETE' && /^\/power_orders\/\d+$/.test(path)) {
      state.requestedUrls.push(path);
      state.powerOrders = state.powerOrders.filter(
        (powerOrder) => powerOrder.id !== Number(path.split('/').at(-1))
      );
      return fulfillJson(route, apiResponse([]));
    }

    if (
      method === 'GET' &&
      path ===
        `/un_registered_groups/group?group_id=${mockGroupId}&order_type=1`
    ) {
      return fulfillJson(route, apiResponse([]));
    }

    if (
      (method === 'DELETE' || method === 'POST') &&
      path === '/un_registered_groups'
    ) {
      state.requestedUrls.push(path);
      return fulfillJson(route, apiResponse([]));
    }

    if (method === 'POST' && path === '/health_center_submission_statuses') {
      state.requestedUrls.push(path);
      const body = (await route.request().postDataJSON()) as {
        application_type: 'power_order' | 'fire_equipment_order';
        status: SubmissionStatusValue;
      };
      state.statuses[body.application_type] = body.status;
      return fulfillJson(
        route,
        apiResponse(submission(body.application_type, 3001, body.status))
      );
    }

    if (
      method === 'PATCH' &&
      /^\/health_center_submission_statuses\/\d+$/.test(path)
    ) {
      state.requestedUrls.push(path);
      const id = Number(path.split('/').at(-1));
      const body = (await route.request().postDataJSON()) as {
        status: SubmissionStatusValue;
      };
      const applicationType =
        id === 3002 ? 'fire_equipment_order' : 'power_order';
      state.statuses[applicationType] = body.status;
      return fulfillJson(
        route,
        apiResponse(submission(applicationType, id, body.status))
      );
    }

    if (
      method === 'GET' &&
      path === `/fire_equipment_orders/group/${mockGroupId}`
    ) {
      return fulfillJson(route, apiResponse(state.fireEquipmentOrder));
    }

    if (method === 'POST' && path === '/fire_equipment_orders') {
      state.requestedUrls.push(path);
      const body = (await route.request().postDataJSON()) as FireEquipmentBody;
      state.fireEquipmentOrder = fireEquipmentFromBody(body, 5101);
      return fulfillJson(route, apiResponse(state.fireEquipmentOrder));
    }

    if (method === 'PATCH' && /^\/fire_equipment_orders\/\d+$/.test(path)) {
      state.requestedUrls.push(path);
      const body = (await route.request().postDataJSON()) as FireEquipmentBody;
      const id = Number(path.split('/').at(-1));
      state.fireEquipmentOrder = fireEquipmentFromBody(body, id);
      return fulfillJson(route, apiResponse(state.fireEquipmentOrder));
    }

    if (method === 'PATCH' && path === '/fire_equipment_orders/submit') {
      state.requestedUrls.push(path);
      const body = (await route.request().postDataJSON()) as {
        id?: number;
        use_fire_equipment: boolean;
        fire_equipment_order?: FireEquipmentBody;
      };
      state.fireEquipmentOrder = body.use_fire_equipment
        ? fireEquipmentFromBody(
            body.fire_equipment_order ?? {},
            body.id ?? 5101
          )
        : fireEquipmentFromBody(
            {
              group_id: mockGroupId,
              name: '',
              quantity: 0,
              fuel: 'gas_bottle',
              usage: '',
              is_takeaway: true,
              remark: '',
            },
            body.id ?? 5101
          );
      state.statuses.fire_equipment_order = 'unapproved';
      return fulfillJson(route, apiResponse(state.fireEquipmentOrder));
    }

    if (method === 'DELETE' && /^\/fire_equipment_orders\/\d+$/.test(path)) {
      state.requestedUrls.push(path);
      state.fireEquipmentOrder = null;
      return fulfillJson(route, apiResponse([]));
    }

    if (url.includes('/news')) {
      return fulfillJson(route, []);
    }

    if (isApplicationApi(path)) {
      return fulfillJson(route, apiResponse([]));
    }

    return route.continue();
  });
};

type FireEquipmentBody = {
  group_id?: number;
  name?: string;
  quantity?: number;
  fuel?: number | FireEquipmentOrder['fuel'];
  usage?: string;
  is_takeaway?: boolean;
  remark?: string;
};

const powerOrderFromBody = (
  body: Partial<PowerOrder>,
  id: number
): PowerOrder => ({
  id,
  group_id: body.group_id ?? mockGroupId,
  item: body.item ?? '',
  power: body.power ?? 0,
  manufacturer: body.manufacturer ?? '',
  model: body.model ?? '',
  item_url: body.item_url ?? '',
});

const fireEquipmentFromBody = (
  body: FireEquipmentBody,
  id: number
): FireEquipmentOrder => ({
  id,
  group_id: body.group_id ?? mockGroupId,
  name: body.name ?? '',
  quantity: body.quantity ?? 0,
  fuel: fuelToApiValue(body.fuel ?? 'gas_bottle'),
  usage: body.usage ?? '',
  is_takeaway: body.is_takeaway ?? true,
  remark: body.remark ?? '',
});

const fuelToApiValue = (
  fuel: number | FireEquipmentOrder['fuel']
): FireEquipmentOrder['fuel'] => {
  if (typeof fuel === 'string') return fuel;
  if (fuel === 2) return 'lp_gas';
  if (fuel === 3) return 'charcoal';
  return 'gas_bottle';
};

const checkAllRegistered = (state: ScenarioState) => ({
  group: true,
  sub_rep: true,
  rental_item: true,
  place_order: true,
  stage_order: false,
  stage_option: false,
  power_order: state.powerOrders.length > 0,
  employee: false,
  venue_map: false,
  food_product: false,
  purchase_list: false,
  cooking_process_order: false,
  fire_equipment_order: state.fireEquipmentOrder !== null,
  public_relation: false,
});

const apiResponse = <T>(data: T) => ({
  status: { code: 200, message: 'Success' },
  data,
});

const submission = (
  applicationType: 'power_order' | 'fire_equipment_order',
  id: number,
  status: SubmissionStatusValue
) => ({
  id,
  application_type: applicationType,
  status,
  comments: [],
  detail: null,
});

const userPageSettings = (pageMode: ScenarioState['pageMode']) => {
  const canEdit = pageMode === 'registration';

  return {
    id: 1,
    is_regist_group: true,
    is_regist_food_product: false,
    is_edit_group: canEdit,
    is_edit_sub_rep: canEdit,
    is_edit_place: canEdit,
    is_edit_power_order: canEdit,
    is_edit_rental_order: canEdit,
    is_edit_stage_order: canEdit,
    is_edit_employee: canEdit,
    is_edit_food_product: canEdit,
    is_edit_purchase_list: canEdit,
    add_power_order: canEdit,
    add_rental_order: canEdit,
    add_employee: canEdit,
    add_food_product: canEdit,
    add_purchase_list: canEdit,
    fes_year_id: 1,
    is_edit_announcement: false,
    add_announcement: false,
    is_edit_user: false,
    is_edit_stage_common_option: canEdit,
    is_edit_public_relation: canEdit,
    is_edit_venue_map: canEdit,
    is_edit_cooking_process: canEdit,
    add_fire_equipment_order: canEdit,
    is_edit_fire_equipment_order: canEdit,
    add_stage_order: canEdit,
  };
};

const fulfillJson = (route: Route, body: unknown) =>
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });

const isApplicationApi = (path: string) =>
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
  ].some((apiPath) => path.includes(apiPath));
