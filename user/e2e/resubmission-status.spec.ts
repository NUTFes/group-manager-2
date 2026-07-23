import { expect, request, test } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

const API_BASE_URL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://api:3000';
const MANAGER_EMAIL =
  process.env.PLAYWRIGHT_STATUS_MANAGER_EMAIL ?? 'nutfes-heinai-g@email.com';
const MANAGER_PASSWORD =
  process.env.PLAYWRIGHT_STATUS_MANAGER_PASSWORD ?? 'gidaifes';

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
  test.describe.configure({ mode: 'serial' });

  let api: APIRequestContext;
  let authContext: AuthContext;
  let managerAuthContext: AuthContext;
  let groupId: number | undefined;

  // E2E用ユーザーを作り、そのユーザーが所有する団体だけを操作対象にする。
  test.beforeEach(async () => {
    api = await request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
    managerAuthContext = await signInAsManager(api);
    authContext = await registerAndGetAuthContext(api);
    const group = await createGroup(
      api,
      authContext.headers,
      authContext.userId
    );
    groupId = group.id;
  });

  test.afterEach(async () => {
    try {
      if (groupId !== undefined) {
        await api.delete(`/groups/${groupId}`, {
          headers: {
            ...managerAuthContext.headers,
            ...skipSlackNotificationHeader,
          },
        });
        groupId = undefined;
      }
      await api.delete(`/users/${authContext.userId}`, {
        headers: managerAuthContext.headers,
      });
    } finally {
      await api.dispose();
    }
  });

  // 実APIを通して、管理者が再提出依頼したステータスをuser用APIで未承認へ戻せることを確認する。
  test('creates and updates power and fire equipment resubmission statuses through user APIs', async () => {
    expect(groupId).toBeDefined();

    await createPowerOrder(api, authContext.headers, groupId!);

    await createFireEquipmentOrder(api, authContext.headers, groupId!);

    const initialStatuses = await getSubmissionStatuses(
      api,
      authContext.headers,
      groupId!
    );
    expect(findStatus(initialStatuses, 'power_order')?.status).toBe(
      'unapproved'
    );
    expect(findStatus(initialStatuses, 'fire_equipment_order')?.status).toBe(
      'unapproved'
    );

    const waitingPower = await submitSubmissionStatus(
      api,
      managerAuthContext.headers,
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
      managerAuthContext.headers,
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
          managerAuthContext.headers,
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

  test('rejects unauthenticated group creation', async () => {
    const response = await api.post('/groups', {
      headers: skipSlackNotificationHeader,
      data: {
        name: `e2e-unauthenticated-group-${Date.now()}`,
        project_name: 'must not be created',
        activity: 'e2e',
        user_id: authContext.userId,
        group_category_id: 1,
        fes_year_id: 1,
      },
    });

    expect(response.status()).toBe(401);
  });

  test('rejects role 3 access to a staff API', async () => {
    const response = await api.get('/api/v1/fire_equipment_orders', {
      headers: authContext.headers,
    });

    expect(response.status()).toBe(403);
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
  const body = (await response.json()) as {
    data: { id: number; role_id: number };
  };
  const headers = response.headers();

  expect(headers['access-token']).toBeTruthy();
  expect(headers.client).toBeTruthy();
  expect(headers.uid).toBe(email);

  expect(body.data.id).toBeGreaterThan(0);
  expect(body.data.role_id).toBe(3);

  return {
    userId: body.data.id,
    headers: {
      'access-token': headers['access-token'],
      client: headers.client,
      uid: headers.uid,
    },
  };
};

const signInAsManager = async (
  api: APIRequestContext
): Promise<AuthContext> => {
  const response = await api.post('/api/auth/sign_in', {
    data: {
      email: MANAGER_EMAIL,
      password: MANAGER_PASSWORD,
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as { data: { id: number } };
  const headers = response.headers();

  expect(headers['access-token']).toBeTruthy();
  expect(headers.client).toBeTruthy();
  expect(headers.uid).toBe(MANAGER_EMAIL);

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
  authHeaders: AuthHeaders,
  userId: number
): Promise<Group> => {
  const response = await api.post('/groups', {
    headers: { ...authHeaders, ...skipSlackNotificationHeader },
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
  authHeaders: AuthHeaders,
  groupId: number
): Promise<PowerOrder> => {
  const response = await api.put('/power_orders/submit', {
    headers: authHeaders,
    data: {
      group_id: groupId,
      use_power: true,
      power_orders: [
        {
          item: `e2e-hot-plate-${Date.now()}`,
          power: 1200,
          manufacturer: 'e2e maker',
          model: 'E2E-POWER',
          item_url: 'https://example.com/e2e-power',
        },
      ],
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<PowerOrder[]>;
  expect(body.status.code).toBe(200);
  expect(body.data).toHaveLength(1);
  expect(body.data[0].id).toBeGreaterThan(0);

  return body.data[0];
};

const createFireEquipmentOrder = async (
  api: APIRequestContext,
  authHeaders: AuthHeaders,
  groupId: number
): Promise<FireEquipmentOrder> => {
  const response = await api.put('/fire_equipment_orders/submit', {
    headers: authHeaders,
    data: {
      group_id: groupId,
      fire_equipment_orders: [
        {
          name: `e2e-burner-${Date.now()}`,
          quantity: 1,
          fuel: 'gas_bottle',
          usage: 'e2e cooking',
          is_takeaway: false,
          remark: 'e2e',
        },
      ],
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<FireEquipmentOrder[]>;
  expect(body.status.code).toBe(200);
  expect(body.data).toHaveLength(1);
  expect(body.data[0].id).toBeGreaterThan(0);

  return body.data[0];
};

const getSubmissionStatuses = async (
  api: APIRequestContext,
  authHeaders: AuthHeaders,
  groupId: number
): Promise<SubmissionStatus[]> => {
  const response = await api.get(
    `/health_center_submission_statuses?group_id=${groupId}`,
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
      : '/health_center_submission_statuses',
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
    `/health_center_submission_statuses/${statusId}`,
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
