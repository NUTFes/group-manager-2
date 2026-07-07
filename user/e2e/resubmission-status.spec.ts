import { expect, request, test } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

const API_BASE_URL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://api:3000';

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

type SubmissionStatus = {
  id: number | null;
  application_type: string;
  status: 'unapproved' | 'waiting_resubmission' | 'approved' | 'unsubmitted';
};

type Group = {
  id: number;
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

const existingResubmissionApplicationTypes = [
  'equipment',
  'employee',
  'food_product',
  'purchase_list',
  'venue_map',
  'cooking_process_order',
] as const;

test.describe('power and fire equipment resubmission status', () => {
  let api: APIRequestContext;
  let authContext: AuthContext;
  let groupId: number | undefined;
  let powerOrderId: number | undefined;
  let fireEquipmentOrderId: number | undefined;

  // E2E用ユーザーを作り、そのユーザーが所有する団体だけを操作対象にする。
  test.beforeEach(async () => {
    api = await request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
    authContext = await registerAndGetAuthContext(api);
    const group = await createGroup(api, authContext.userId);
    groupId = group.id;
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
      if (groupId !== undefined) {
        await api.delete(`/groups/${groupId}`, {
          headers: skipSlackNotificationHeader,
        });
        groupId = undefined;
      }
    } finally {
      await api.dispose();
    }
  });

  // 実APIを通して、管理者が再提出依頼したステータスをuser用APIで未承認へ戻せることを確認する。
  test('creates and updates power and fire equipment resubmission statuses through user APIs', async () => {
    expect(groupId).toBeDefined();

    const powerOrder = await createPowerOrder(api, groupId!);
    powerOrderId = powerOrder.id;

    const fireEquipmentOrder = await createFireEquipmentOrder(api, groupId!);
    fireEquipmentOrderId = fireEquipmentOrder.id;

    const initialStatuses = await getSubmissionStatuses(
      api,
      authContext.headers,
      groupId!
    );
    expect(findStatus(initialStatuses, 'power_order')?.status).toBe(
      'unsubmitted'
    );
    expect(findStatus(initialStatuses, 'fire_equipment_order')?.status).toBe(
      'unsubmitted'
    );

    const waitingPower = await submitSubmissionStatus(
      api,
      authContext.headers,
      groupId!,
      {
        application_type: 'power_order',
        status: 'waiting_resubmission',
      },
      { asAdmin: true }
    );
    expect(waitingPower.status).toBe('waiting_resubmission');

    const waitingFire = await submitSubmissionStatus(
      api,
      authContext.headers,
      groupId!,
      {
        application_type: 'fire_equipment_order',
        status: 'waiting_resubmission',
      },
      { asAdmin: true }
    );
    expect(waitingFire.status).toBe('waiting_resubmission');

    const updatedPower = await updateSubmissionStatus(
      api,
      authContext.headers,
      waitingPower.id,
      'unapproved'
    );
    expect(updatedPower.status).toBe('unapproved');

    const updatedFire = await updateSubmissionStatus(
      api,
      authContext.headers,
      waitingFire.id,
      'unapproved'
    );
    expect(updatedFire.status).toBe('unapproved');

    const finalStatuses = await getSubmissionStatuses(
      api,
      authContext.headers,
      groupId!
    );
    expect(findStatus(finalStatuses, 'power_order')?.status).toBe('unapproved');
    expect(findStatus(finalStatuses, 'fire_equipment_order')?.status).toBe(
      'unapproved'
    );
  });

  // 電力・火器以外の既存再提出申請も、新しいuser用APIで未承認へ戻せることを実APIで確認する。
  test('updates existing resubmission application statuses through user APIs', async () => {
    expect(groupId).toBeDefined();

    const waitingStatuses = await Promise.all(
      existingResubmissionApplicationTypes.map((applicationType) =>
        submitSubmissionStatus(
          api,
          authContext.headers,
          groupId!,
          {
            application_type: applicationType,
            status: 'waiting_resubmission',
          },
          { asAdmin: true }
        )
      )
    );

    waitingStatuses.forEach((submissionStatus, index) => {
      expect(submissionStatus.application_type).toBe(
        existingResubmissionApplicationTypes[index]
      );
      expect(submissionStatus.status).toBe('waiting_resubmission');
    });

    const updatedStatuses = await Promise.all(
      waitingStatuses.map((submissionStatus) =>
        updateSubmissionStatus(
          api,
          authContext.headers,
          submissionStatus.id,
          'unapproved'
        )
      )
    );

    updatedStatuses.forEach((submissionStatus, index) => {
      expect(submissionStatus.application_type).toBe(
        existingResubmissionApplicationTypes[index]
      );
      expect(submissionStatus.status).toBe('unapproved');
    });

    const finalStatuses = await getSubmissionStatuses(
      api,
      authContext.headers,
      groupId!
    );
    existingResubmissionApplicationTypes.forEach((applicationType) => {
      expect(findStatus(finalStatuses, applicationType)?.status).toBe(
        'unapproved'
      );
    });
  });
});

const registerAndGetAuthContext = async (
  api: APIRequestContext
): Promise<AuthContext> => {
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
  const body = (await response.json()) as { data: { id: number } };
  const headers = response.headers();

  expect(headers['access-token']).toBeTruthy();
  expect(headers.client).toBeTruthy();
  expect(headers.uid).toBe(email);

  expect(body.data.id).toBeGreaterThan(0);

  return {
    userId: body.data.id,
    headers: {
      'access-token': headers['access-token'],
      client: headers.client,
      uid: headers.uid,
    },
  };
};

const createGroup = async (
  api: APIRequestContext,
  userId: number
): Promise<Group> => {
  const response = await api.post('/groups', {
    headers: skipSlackNotificationHeader,
    data: {
      name: `e2e-resubmission-group-${Date.now()}`,
      project_name: 'e2e resubmission project',
      activity: 'e2e',
      user_id: userId,
      group_category_id: 1,
      fes_year_id: 1,
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<Group>;
  expect(body.status.code).toBe(201);
  expect(body.data.id).toBeGreaterThan(0);

  return body.data;
};

const createPowerOrder = async (
  api: APIRequestContext,
  groupId: number
): Promise<PowerOrder> => {
  const response = await api.post('/power_orders', {
    data: {
      group_id: groupId,
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
  api: APIRequestContext,
  groupId: number
): Promise<FireEquipmentOrder> => {
  const response = await api.post('/fire_equipment_orders', {
    data: {
      fire_equipment_order: {
        group_id: groupId,
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
  authHeaders: AuthHeaders,
  groupId: number
): Promise<SubmissionStatus[]> => {
  const response = await api.get(
    `/health_center_submission_statuses/user/${groupId}`,
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

const submitSubmissionStatus = async (
  api: APIRequestContext,
  authHeaders: AuthHeaders,
  groupId: number,
  params: Pick<SubmissionStatus, 'application_type' | 'status'>,
  options: { asAdmin?: boolean } = {}
): Promise<SubmissionStatus> => {
  const response = await api.post(
    options.asAdmin
      ? '/api/v1/health_center_submission_statuses'
      : '/health_center_submission_statuses/user',
    {
      headers: { ...authHeaders, ...skipSlackNotificationHeader },
      data: {
        group_id: groupId,
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
    `/health_center_submission_statuses/user/${statusId}`,
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
