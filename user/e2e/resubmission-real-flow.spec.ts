import { expect, request, test } from '@playwright/test';
import type {
  APIRequestContext,
  Locator,
  Page,
  APIResponse as PlaywrightAPIResponse,
} from '@playwright/test';

const API_BASE_URL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://api:3000';
const LOGIN_EMAIL = process.env.PLAYWRIGHT_E2E_EMAIL ?? 'nutfes-taro@email.com';
const LOGIN_PASSWORD = process.env.PLAYWRIGHT_E2E_PASSWORD ?? 'gidaifes';
const FOOD_SALES_GROUP_CATEGORY_ID = 1;
const POWER_ORDER_TYPE = 1;
const FIRE_EQUIPMENT_ORDER_TYPE = 4;

type ApiResponse<T> = {
  status: {
    code: number;
    message: string;
  };
  data: T;
};

type AuthHeaders = {
  'access-token': string;
  client: string;
  uid: string;
};

type AuthContext = {
  userId: number;
  headers: AuthHeaders;
};

type GroupUserResponse = {
  id: number;
  group_category_id: number;
};

type Group = {
  id: number;
  name: string;
  project_name: string;
  activity: string;
  user_id: number;
  group_category_id: number;
  fes_year_id: number;
};

type PowerOrder = {
  id: number;
  group_id: number;
  item: string;
  power: number;
  manufacturer: string;
  model: string;
  item_url: string;
};

type PowerOrderPayload = Omit<PowerOrder, 'id'>;

type FireEquipmentOrder = {
  id: number;
  group_id: number;
  name: string;
  quantity: number;
  fuel: 'gas_bottle' | 'lp_gas' | 'charcoal';
  usage: string;
  is_takeaway: boolean;
  remark: string | null;
};

type FireEquipmentPayload = Omit<FireEquipmentOrder, 'id'>;

type SubmissionStatusValue =
  | 'unapproved'
  | 'waiting_resubmission'
  | 'approved'
  | 'unsubmitted';

type SubmissionStatus = {
  id: number | null;
  application_type: string;
  status: SubmissionStatusValue;
};

type UnRegisteredGroup = {
  id: number;
  group_id: number;
  order_type: string | number;
};

type RestoreState = {
  auth?: AuthContext;
  groupId?: number;
  createdGroupId?: number;
  originalGroupCategoryId?: number;
  originalPowerOrder?: PowerOrder;
  createdPowerOrderId?: number;
  originalFireEquipmentOrder?: FireEquipmentOrder;
  createdFireEquipmentOrderId?: number;
  originalPowerStatus?: SubmissionStatus;
  originalFireEquipmentStatus?: SubmissionStatus;
  originalUnregisteredRows?: UnRegisteredGroup[];
};

const skipSlackNotificationHeader = {
  'X-Skip-Slack-Notification': 'true',
};

test.describe('real API power and fire equipment resubmission flow', () => {
  test.setTimeout(120_000);

  // 指定ログインユーザーの団体を実DBで再提出状態にし、user画面から再提出完了まで確認する。
  test('resubmits power and fire equipment orders through login, real API, and real DB', async ({
    page,
  }) => {
    const api = await request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const restoreState: RestoreState = {};

    try {
      const authContext = await signInForApi(api);
      restoreState.auth = authContext;

      const prepared = await prepareResubmissionState(
        api,
        authContext,
        restoreState
      );

      await suppressSlackNotificationForBrowserApi(page);
      await loginThroughUi(page, authContext.userId);

      const powerSection = applicationSection(page, /電力申請/);
      await powerSection.getByRole('button', { name: /電力申請/ }).click();
      await expect(
        powerSection.getByText(prepared.initialPower.item)
      ).toBeVisible();

      await powerSection
        .getByRole('button', { name: '修正', exact: true })
        .first()
        .click();
      await fillPowerForm(powerSection, prepared.updatedPower);
      await powerSection
        .getByRole('button', { name: '登録', exact: true })
        .click();

      await expect(
        powerSection.getByText(prepared.updatedPower.item)
      ).toBeVisible();
      await expect(
        powerSection.getByText(`${prepared.updatedPower.power}W`)
      ).toBeVisible();
      await expect
        .poll(
          () =>
            getSubmissionStatus(
              api,
              authContext.headers,
              prepared.groupId,
              'power_order'
            ),
          { timeout: 10_000 }
        )
        .toBe('unapproved');

      const persistedPower = await getPowerOrderById(
        api,
        prepared.groupId,
        prepared.powerOrderId
      );
      expect(persistedPower).toMatchObject(prepared.updatedPower);

      const fireEquipmentSection = applicationSection(page, /火[器気]使用申請/);
      await fireEquipmentSection
        .getByRole('button', { name: /火[器気]使用申請/ })
        .click();
      await expect(
        fireEquipmentSection.getByText(prepared.initialFireEquipment.name)
      ).toBeVisible();

      await fireEquipmentSection
        .getByRole('button', { name: '修正', exact: true })
        .first()
        .click();
      await fillFireEquipmentForm(fireEquipmentSection, {
        name: prepared.updatedFireEquipment.name,
        quantity: String(prepared.updatedFireEquipment.quantity),
        fuelLabel: '炭',
        usage: prepared.updatedFireEquipment.usage,
        remark: prepared.updatedFireEquipment.remark ?? '',
      });
      await fireEquipmentSection
        .getByRole('button', { name: '修正', exact: true })
        .last()
        .click();

      await expect(
        fireEquipmentSection.getByText(prepared.updatedFireEquipment.name)
      ).toBeVisible();
      await expect(
        fireEquipmentSection.getByText(prepared.updatedFireEquipment.usage)
      ).toBeVisible();
      await expect
        .poll(
          () =>
            getSubmissionStatus(
              api,
              authContext.headers,
              prepared.groupId,
              'fire_equipment_order'
            ),
          { timeout: 10_000 }
        )
        .toBe('unapproved');

      const persistedFireEquipment = await getFireEquipmentOrderByGroup(
        api,
        prepared.groupId
      );
      expect(persistedFireEquipment).toMatchObject(
        prepared.updatedFireEquipment
      );
    } finally {
      await restorePreparedState(api, restoreState);
      await api.dispose();
    }
  });
});

const loginThroughUi = async (page: Page, expectedUserId: number) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'ログイン' }).click();
  await page.getByLabel('メールアドレス').fill(LOGIN_EMAIL);
  await page.getByLabel('パスワード').fill(LOGIN_PASSWORD);

  const loginForm = page.locator('form').filter({
    has: page.getByLabel('メールアドレス'),
  });
  await loginForm.getByRole('button', { name: 'ログイン' }).click();

  await expect(page).toHaveURL(/\/home/, { timeout: 15_000 });
  await expect
    .poll(
      async () => {
        const response = await page.request.get('/api/getUser');
        const body = (await response.json()) as { id: string | null };
        return body.id;
      },
      { timeout: 10_000 }
    )
    .toBe(String(expectedUserId));
};

const suppressSlackNotificationForBrowserApi = async (page: Page) => {
  const apiOrigin = new URL(API_BASE_URL).origin;
  const mutatingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

  await page.route(`${apiOrigin}/**`, async (route) => {
    const request = route.request();
    if (!mutatingMethods.has(request.method())) {
      await route.continue();
      return;
    }

    await route.continue({
      headers: {
        ...request.headers(),
        ...skipSlackNotificationHeader,
      },
    });
  });
};

const applicationSection = (page: Page, title: RegExp): Locator =>
  page.getByRole('button', { name: title }).locator('xpath=..');

const fillPowerForm = async (section: Locator, values: PowerOrderPayload) => {
  await section.getByLabel('機器の名称').first().fill(values.item);
  await section
    .getByLabel('機器のメーカー名')
    .first()
    .fill(values.manufacturer);
  await section.getByLabel('型番').first().fill(values.model);
  await section.getByLabel('製品URL').first().fill(values.item_url);
  await section.getByLabel('電力量 (W)').first().fill(String(values.power));
};

const fillFireEquipmentForm = async (
  section: Locator,
  values: {
    name: string;
    quantity: string;
    fuelLabel: string;
    usage: string;
    remark: string;
  }
) => {
  await section.getByLabel('火気の名称').fill(values.name);
  await section.getByLabel('火気の台数').fill(values.quantity);
  await section.getByLabel('燃料').selectOption({ label: values.fuelLabel });
  await section.getByLabel('使用用途').fill(values.usage);
  await section.getByLabel('備考').fill(values.remark);
};

const prepareResubmissionState = async (
  api: APIRequestContext,
  authContext: AuthContext,
  restoreState: RestoreState
) => {
  const stamp = Date.now();
  const group = await ensureUserGroup(api, authContext.userId, restoreState);
  restoreState.groupId = group.id;
  restoreState.originalGroupCategoryId = group.group_category_id;

  if (group.group_category_id !== FOOD_SALES_GROUP_CATEGORY_ID) {
    await updateGroupCategory(api, group.id, FOOD_SALES_GROUP_CATEGORY_ID);
  }

  restoreState.originalUnregisteredRows = [
    ...(await getUnregisteredRows(api, group.id, POWER_ORDER_TYPE)),
    ...(await getUnregisteredRows(api, group.id, FIRE_EQUIPMENT_ORDER_TYPE)),
  ];
  await clearUnregisteredRows(api, group.id, POWER_ORDER_TYPE);
  await clearUnregisteredRows(api, group.id, FIRE_EQUIPMENT_ORDER_TYPE);

  const initialPower = powerPayload(group.id, `初期-${stamp}`, 820);
  const updatedPower = powerPayload(group.id, `更新-${stamp}`, 930);
  const powerOrders = await getPowerOrders(api, group.id);
  const powerOrder =
    powerOrders[0] ?? (await createPowerOrder(api, initialPower));
  if (powerOrders[0]) {
    restoreState.originalPowerOrder = powerOrders[0];
    await updatePowerOrder(api, powerOrder.id, initialPower);
  } else {
    restoreState.createdPowerOrderId = powerOrder.id;
  }

  const initialFireEquipment = fireEquipmentPayload(
    group.id,
    `初期-${stamp}`,
    'lp_gas'
  );
  const updatedFireEquipment = fireEquipmentPayload(
    group.id,
    `更新-${stamp}`,
    'charcoal'
  );
  const fireEquipmentOrder = await getFireEquipmentOrderByGroup(api, group.id);
  const preparedFireEquipment =
    fireEquipmentOrder ??
    (await createFireEquipmentOrder(api, initialFireEquipment));
  if (fireEquipmentOrder) {
    restoreState.originalFireEquipmentOrder = fireEquipmentOrder;
    await updateFireEquipmentOrder(
      api,
      preparedFireEquipment.id,
      initialFireEquipment
    );
  } else {
    restoreState.createdFireEquipmentOrderId = preparedFireEquipment.id;
  }

  const currentStatuses = await getSubmissionStatuses(
    api,
    authContext.headers,
    group.id
  );
  restoreState.originalPowerStatus = currentStatuses.find(
    (status) => status.application_type === 'power_order'
  );
  restoreState.originalFireEquipmentStatus = currentStatuses.find(
    (status) => status.application_type === 'fire_equipment_order'
  );

  await upsertSubmissionStatus(api, authContext.headers, group.id, {
    application_type: 'power_order',
    status: 'waiting_resubmission',
  });
  await upsertSubmissionStatus(api, authContext.headers, group.id, {
    application_type: 'fire_equipment_order',
    status: 'waiting_resubmission',
  });

  return {
    groupId: group.id,
    powerOrderId: powerOrder.id,
    fireEquipmentOrderId: preparedFireEquipment.id,
    initialPower,
    updatedPower,
    initialFireEquipment,
    updatedFireEquipment,
  };
};

const restorePreparedState = async (
  api: APIRequestContext,
  state: RestoreState
) => {
  if (!state.groupId) return;

  if (state.createdGroupId) {
    await api.delete(`/groups/${state.createdGroupId}`, {
      headers: skipSlackNotificationHeader,
    });
    return;
  }

  if (state.auth) {
    await restoreSubmissionStatus(
      api,
      state.auth.headers,
      state.groupId,
      'power_order',
      state.originalPowerStatus
    );
    await restoreSubmissionStatus(
      api,
      state.auth.headers,
      state.groupId,
      'fire_equipment_order',
      state.originalFireEquipmentStatus
    );
  }

  if (state.originalPowerOrder) {
    await updatePowerOrder(api, state.originalPowerOrder.id, {
      group_id: state.originalPowerOrder.group_id,
      item: state.originalPowerOrder.item,
      power: state.originalPowerOrder.power,
      manufacturer: state.originalPowerOrder.manufacturer,
      model: state.originalPowerOrder.model,
      item_url: state.originalPowerOrder.item_url,
    });
  } else if (state.createdPowerOrderId) {
    await api.delete(`/power_orders/user/${state.createdPowerOrderId}`, {
      headers: state.auth?.headers,
    });
  }

  if (state.originalFireEquipmentOrder) {
    await updateFireEquipmentOrder(api, state.originalFireEquipmentOrder.id, {
      group_id: state.originalFireEquipmentOrder.group_id,
      name: state.originalFireEquipmentOrder.name,
      quantity: state.originalFireEquipmentOrder.quantity,
      fuel: state.originalFireEquipmentOrder.fuel,
      usage: state.originalFireEquipmentOrder.usage,
      is_takeaway: state.originalFireEquipmentOrder.is_takeaway,
      remark: state.originalFireEquipmentOrder.remark,
    });
  } else if (state.createdFireEquipmentOrderId) {
    await api.delete(
      `/fire_equipment_orders/user/${state.createdFireEquipmentOrderId}`,
      {
        headers: state.auth?.headers,
      }
    );
  }

  await clearUnregisteredRows(api, state.groupId, POWER_ORDER_TYPE);
  await clearUnregisteredRows(api, state.groupId, FIRE_EQUIPMENT_ORDER_TYPE);
  for (const row of state.originalUnregisteredRows ?? []) {
    await createUnregisteredRow(api, state.groupId, row.order_type);
  }

  if (
    state.originalGroupCategoryId !== undefined &&
    state.originalGroupCategoryId !== FOOD_SALES_GROUP_CATEGORY_ID
  ) {
    await updateGroupCategory(
      api,
      state.groupId,
      state.originalGroupCategoryId
    );
  }
};

const signInForApi = async (api: APIRequestContext): Promise<AuthContext> => {
  const response = await api.post('/api/auth/sign_in', {
    data: {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD,
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as { data: { id: number } };
  const headers = response.headers();

  expect(headers['access-token']).toBeTruthy();
  expect(headers.client).toBeTruthy();
  expect(headers.uid).toBe(LOGIN_EMAIL);

  return {
    userId: Number(body.data.id),
    headers: {
      'access-token': headers['access-token'],
      client: headers.client,
      uid: headers.uid,
    },
  };
};

const ensureUserGroup = async (
  api: APIRequestContext,
  userId: number,
  restoreState: RestoreState
): Promise<GroupUserResponse> => {
  const existingGroup = await getGroupByUser(api, userId);
  if (existingGroup) return existingGroup;

  const createdGroup = await createGroup(api, userId);
  restoreState.createdGroupId = createdGroup.id;
  return {
    id: createdGroup.id,
    group_category_id: createdGroup.group_category_id,
  };
};

const getGroupByUser = async (
  api: APIRequestContext,
  userId: number
): Promise<GroupUserResponse | undefined> => {
  const response = await api.get(`/groups/user/${userId}`);
  const body = (await response.json()) as ApiResponse<GroupUserResponse | []>;
  if (body.status.code === 404) return undefined;
  expect(body.status.code).toBe(200);
  return body.data as GroupUserResponse;
};

const createGroup = async (
  api: APIRequestContext,
  userId: number
): Promise<Group> => {
  const response = await api.post('/groups', {
    headers: skipSlackNotificationHeader,
    data: {
      name: `e2e-real-resubmission-${Date.now()}`,
      project_name: 'e2e real resubmission',
      activity: 'e2e',
      user_id: userId,
      group_category_id: FOOD_SALES_GROUP_CATEGORY_ID,
      fes_year_id: 1,
    },
  });
  return readApiResponse<Group>(response, 201);
};

const updateGroupCategory = async (
  api: APIRequestContext,
  groupId: number,
  groupCategoryId: number
) => {
  const response = await api.patch(`/groups/${groupId}`, {
    headers: skipSlackNotificationHeader,
    data: {
      group_category_id: groupCategoryId,
    },
  });
  await readApiResponse<Group>(response, 201);
};

const getPowerOrders = async (
  api: APIRequestContext,
  groupId: number
): Promise<PowerOrder[]> => {
  const response = await api.get(`/power_orders/group/${groupId}`);
  const body = (await response.json()) as ApiResponse<PowerOrder[]>;
  if (body.status.code === 404) return [];
  expect(body.status.code).toBe(200);
  return body.data;
};

const getPowerOrderById = async (
  api: APIRequestContext,
  groupId: number,
  powerOrderId: number
): Promise<PowerOrder> => {
  const powerOrders = await getPowerOrders(api, groupId);
  const powerOrder = powerOrders.find((order) => order.id === powerOrderId);
  expect(powerOrder).toBeDefined();
  return powerOrder as PowerOrder;
};

const createPowerOrder = async (
  api: APIRequestContext,
  payload: PowerOrderPayload
): Promise<PowerOrder> => {
  const response = await api.post('/power_orders', {
    data: payload,
  });
  return readApiResponse<PowerOrder>(response, 201);
};

const updatePowerOrder = async (
  api: APIRequestContext,
  powerOrderId: number,
  payload: PowerOrderPayload
): Promise<PowerOrder> => {
  const response = await api.put(`/power_orders/${powerOrderId}`, {
    data: payload,
  });
  return readApiResponse<PowerOrder>(response, 201);
};

const getFireEquipmentOrderByGroup = async (
  api: APIRequestContext,
  groupId: number
): Promise<FireEquipmentOrder | undefined> => {
  const response = await api.get(`/fire_equipment_orders/group/${groupId}`);
  const body = (await response.json()) as ApiResponse<FireEquipmentOrder | []>;
  if (body.status.code === 404 || Array.isArray(body.data)) return undefined;
  expect(body.status.code).toBe(200);
  return body.data;
};

const createFireEquipmentOrder = async (
  api: APIRequestContext,
  payload: FireEquipmentPayload
): Promise<FireEquipmentOrder> => {
  const response = await api.post('/fire_equipment_orders', {
    data: {
      fire_equipment_order: payload,
    },
  });
  return readApiResponse<FireEquipmentOrder>(response, 201);
};

const updateFireEquipmentOrder = async (
  api: APIRequestContext,
  fireEquipmentOrderId: number,
  payload: FireEquipmentPayload
): Promise<FireEquipmentOrder> => {
  const response = await api.patch(
    `/fire_equipment_orders/${fireEquipmentOrderId}`,
    {
      data: {
        fire_equipment_order: payload,
      },
    }
  );
  return readApiResponse<FireEquipmentOrder>(response, 201);
};

const getSubmissionStatuses = async (
  api: APIRequestContext,
  authHeaders: AuthHeaders,
  groupId: number
): Promise<SubmissionStatus[]> => {
  const response = await api.get(
    `/health_center_submission_statuses/user/${groupId}`,
    {
      headers: authHeaders,
    }
  );
  const body = await readApiResponse<{ submissions: SubmissionStatus[] }>(
    response,
    200
  );
  return body.submissions;
};

const getSubmissionStatus = async (
  api: APIRequestContext,
  authHeaders: AuthHeaders,
  groupId: number,
  applicationType: string
): Promise<SubmissionStatusValue | undefined> => {
  const statuses = await getSubmissionStatuses(api, authHeaders, groupId);
  return statuses.find((status) => status.application_type === applicationType)
    ?.status;
};

const upsertSubmissionStatus = async (
  api: APIRequestContext,
  authHeaders: AuthHeaders,
  groupId: number,
  params: Pick<SubmissionStatus, 'application_type' | 'status'>
): Promise<SubmissionStatus> => {
  const response = await api.post('/api/v1/health_center_submission_statuses', {
    headers: { ...authHeaders, ...skipSlackNotificationHeader },
    data: {
      group_id: groupId,
      application_type: params.application_type,
      status: params.status,
    },
  });
  return readApiResponse<SubmissionStatus>(response, 200);
};

const restoreSubmissionStatus = async (
  api: APIRequestContext,
  authHeaders: AuthHeaders,
  groupId: number,
  applicationType: 'power_order' | 'fire_equipment_order',
  originalStatus: SubmissionStatus | undefined
) => {
  await upsertSubmissionStatus(api, authHeaders, groupId, {
    application_type: applicationType,
    status: originalStatus?.status ?? 'unsubmitted',
  });
};

const getUnregisteredRows = async (
  api: APIRequestContext,
  groupId: number,
  orderType: number
): Promise<UnRegisteredGroup[]> => {
  const response = await api.get(
    `/un_registered_groups/group?group_id=${groupId}&order_type=${orderType}`
  );
  const body = (await response.json()) as ApiResponse<UnRegisteredGroup[]>;
  if (body.status.code === 404) return [];
  expect(body.status.code).toBe(200);
  return body.data;
};

const clearUnregisteredRows = async (
  api: APIRequestContext,
  groupId: number,
  orderType: number
) => {
  const rows = await getUnregisteredRows(api, groupId, orderType);
  await Promise.all(
    rows.map((row) => api.delete(`/un_registered_groups/${row.id}`))
  );
};

const createUnregisteredRow = async (
  api: APIRequestContext,
  groupId: number,
  orderType: string | number
) => {
  const response = await api.post('/un_registered_groups', {
    data: {
      un_registered_group: {
        group_id: groupId,
        order_type: orderType,
      },
    },
  });
  await readApiResponse<UnRegisteredGroup>(response, 200);
};

const powerPayload = (
  groupId: number,
  label: string,
  power: number
): PowerOrderPayload => ({
  group_id: groupId,
  item: `E2E 実API 電力 ${label}`,
  power,
  manufacturer: `E2E メーカー ${label}`,
  model: `E2E-${power}`,
  item_url: `https://example.com/e2e-real-power-${power}`,
});

const fireEquipmentPayload = (
  groupId: number,
  label: string,
  fuel: FireEquipmentPayload['fuel']
): FireEquipmentPayload => ({
  group_id: groupId,
  name: `E2E 実API 火器 ${label}`,
  quantity: fuel === 'charcoal' ? 3 : 2,
  fuel,
  usage: `E2E 実API 調理 ${label}`,
  is_takeaway: true,
  remark: `E2E 実API 備考 ${label}`,
});

const readApiResponse = async <T>(
  response: PlaywrightAPIResponse,
  expectedStatusCode: number
): Promise<T> => {
  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<T>;
  expect(body.status.code).toBe(expectedStatusCode);
  return body.data;
};
