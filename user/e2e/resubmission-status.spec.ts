import { expect, request, test } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

const API_BASE_URL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://api:3000';
const TEST_GROUP_ID = Number(process.env.PLAYWRIGHT_E2E_GROUP_ID ?? 1);

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

type SubmissionStatus = {
  id: number | null;
  application_type: string;
  status: 'unapproved' | 'waiting_resubmission' | 'approved' | 'unsubmitted';
};

type PowerOrder = {
  id: number;
};

type FireEquipmentOrder = {
  id: number;
};

const skipSlackNotificationHeader = {
  'X-Skip-Slack-Notification': 'true',
};

test.describe('power and fire equipment resubmission status', () => {
  let api: APIRequestContext;
  let authHeaders: AuthHeaders;
  let powerOrderId: number | undefined;
  let fireEquipmentOrderId: number | undefined;

  test.beforeEach(async () => {
    api = await request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
    authHeaders = await registerAndGetAuthHeaders(api);
  });

  test.afterEach(async () => {
    try {
      if (powerOrderId !== undefined) {
        await api.delete(`/power_orders/${powerOrderId}`);
        powerOrderId = undefined;
      }
      if (fireEquipmentOrderId !== undefined) {
        await api.delete(`/fire_equipment_orders/${fireEquipmentOrderId}`);
        fireEquipmentOrderId = undefined;
      }
      await upsertSubmissionStatus(api, authHeaders, {
        application_type: 'power_order',
        status: 'unsubmitted',
      });
      await upsertSubmissionStatus(api, authHeaders, {
        application_type: 'fire_equipment_order',
        status: 'unsubmitted',
      });
    } finally {
      await api.dispose();
    }
  });

  test('creates and updates power and fire equipment resubmission statuses through user APIs', async () => {
    const powerOrder = await createPowerOrder(api);
    powerOrderId = powerOrder.id;

    const fireEquipmentOrder = await createFireEquipmentOrder(api);
    fireEquipmentOrderId = fireEquipmentOrder.id;

    const initialStatuses = await getSubmissionStatuses(api, authHeaders);
    expect(findStatus(initialStatuses, 'power_order')?.status).toBe(
      'unsubmitted'
    );
    expect(findStatus(initialStatuses, 'fire_equipment_order')?.status).toBe(
      'unsubmitted'
    );

    const waitingPower = await upsertSubmissionStatus(api, authHeaders, {
      application_type: 'power_order',
      status: 'waiting_resubmission',
    });
    expect(waitingPower.status).toBe('waiting_resubmission');

    const waitingFire = await upsertSubmissionStatus(api, authHeaders, {
      application_type: 'fire_equipment_order',
      status: 'waiting_resubmission',
    });
    expect(waitingFire.status).toBe('waiting_resubmission');

    const updatedPower = await updateSubmissionStatus(
      api,
      authHeaders,
      waitingPower.id,
      'unapproved'
    );
    expect(updatedPower.status).toBe('unapproved');

    const updatedFire = await updateSubmissionStatus(
      api,
      authHeaders,
      waitingFire.id,
      'unapproved'
    );
    expect(updatedFire.status).toBe('unapproved');

    const finalStatuses = await getSubmissionStatuses(api, authHeaders);
    expect(findStatus(finalStatuses, 'power_order')?.status).toBe('unapproved');
    expect(findStatus(finalStatuses, 'fire_equipment_order')?.status).toBe(
      'unapproved'
    );
  });
});

const registerAndGetAuthHeaders = async (
  api: APIRequestContext
): Promise<AuthHeaders> => {
  const email = `e2e-resubmission-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}@example.com`;

  const response = await api.post('/api/auth', {
    data: {
      registration: {
        name: 'e2e resubmission user',
        email,
        password: 'password',
        password_confirmation: 'password',
        role_id: 1,
      },
    },
  });

  expect(response.ok()).toBe(true);
  const headers = response.headers();

  expect(headers['access-token']).toBeTruthy();
  expect(headers.client).toBeTruthy();
  expect(headers.uid).toBe(email);

  return {
    'access-token': headers['access-token'],
    client: headers.client,
    uid: headers.uid,
  };
};

const createPowerOrder = async (
  api: APIRequestContext
): Promise<PowerOrder> => {
  const response = await api.post('/power_orders', {
    data: {
      group_id: TEST_GROUP_ID,
      item: `e2e-hot-plate-${Date.now()}`,
      power: 1200,
      manufacturer: 'e2e maker',
      model: 'E2E-POWER',
      item_url: 'https://example.com/e2e-power',
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<PowerOrder>;
  expect(body.status.code).toBe(201);
  expect(body.data.id).toBeGreaterThan(0);

  return body.data;
};

const createFireEquipmentOrder = async (
  api: APIRequestContext
): Promise<FireEquipmentOrder> => {
  const response = await api.post('/fire_equipment_orders', {
    data: {
      fire_equipment_order: {
        group_id: TEST_GROUP_ID,
        name: `e2e-burner-${Date.now()}`,
        quantity: 1,
        fuel: 'gas_bottle',
        usage: 'e2e cooking',
        is_takeaway: false,
        remark: 'e2e',
      },
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<FireEquipmentOrder>;
  expect(body.status.code).toBe(201);
  expect(body.data.id).toBeGreaterThan(0);

  return body.data;
};

const getSubmissionStatuses = async (
  api: APIRequestContext,
  authHeaders: AuthHeaders
): Promise<SubmissionStatus[]> => {
  const response = await api.get(
    `/api/v1/get_health_center_submission_status_for_user/${TEST_GROUP_ID}`,
    {
      headers: authHeaders,
    }
  );

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<{
    submissions: SubmissionStatus[];
  }>;
  expect(body.status.code).toBe(200);

  return body.data.submissions;
};

const upsertSubmissionStatus = async (
  api: APIRequestContext,
  authHeaders: AuthHeaders,
  params: Pick<SubmissionStatus, 'application_type' | 'status'>
): Promise<SubmissionStatus> => {
  const response = await api.post(
    '/api/v1/upsert_health_center_submission_status_for_user',
    {
      headers: { ...authHeaders, ...skipSlackNotificationHeader },
      data: {
        group_id: TEST_GROUP_ID,
        application_type: params.application_type,
        status: params.status,
      },
    }
  );

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<SubmissionStatus>;
  expect(body.status.code).toBe(200);

  return body.data;
};

const updateSubmissionStatus = async (
  api: APIRequestContext,
  authHeaders: AuthHeaders,
  statusId: number | null,
  status: SubmissionStatus['status']
): Promise<SubmissionStatus> => {
  expect(statusId).not.toBeNull();

  const response = await api.patch(
    `/api/v1/update_health_center_submission_status_for_user/${statusId}`,
    {
      headers: { ...authHeaders, ...skipSlackNotificationHeader },
      data: { status },
    }
  );

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<SubmissionStatus>;
  expect(body.status.code).toBe(200);

  return body.data;
};

const findStatus = (
  statuses: SubmissionStatus[],
  applicationType: string
): SubmissionStatus | undefined =>
  statuses.find((status) => status.application_type === applicationType);
