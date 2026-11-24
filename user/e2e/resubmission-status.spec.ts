import { expect, request, test } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

const API_BASE_URL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://api:3000';
// 新規登録ではロールを指定できないため、既存のmanagerでログインしてmanagerを作成する
const MANAGER_EMAIL =
  process.env.PLAYWRIGHT_E2E_EMAIL ?? 'nutfes-taro@email.com';
const MANAGER_PASSWORD = process.env.PLAYWRIGHT_E2E_PASSWORD ?? 'gidaifes';

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
  let userAuthContext: AuthContext;
  let managerAuthContext: AuthContext;
  let groupId: number | undefined;

  // 公開登録したuserが所有する団体を操作対象にし、管理操作だけmanagerで行う。
  test.beforeEach(async () => {
    api = await request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
    userAuthContext = await createUserAndGetAuthContext(api);
    managerAuthContext = await createManagerAndGetAuthContext(api);
    const group = await createGroup(api, userAuthContext);
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
    } finally {
      await api.dispose();
    }
  });

  // userが申請・取得・更新を行い、managerの再提出依頼後にuser用APIで未承認へ戻せることを確認する。
  test('creates and updates power and fire equipment resubmission statuses through user APIs', async () => {
    expect(groupId).toBeDefined();

    await createPowerOrder(api, userAuthContext.headers, groupId!);

    await createFireEquipmentOrder(api, userAuthContext.headers, groupId!);

    const initialStatuses = await getSubmissionStatuses(
      api,
      userAuthContext.headers,
      groupId!
    );
    expect(findStatus(initialStatuses, 'power_order')?.status).toBe(
      'unapproved'
    );
    expect(findStatus(initialStatuses, 'fire_equipment_order')?.status).toBe(
      'unapproved'
    );

    const waitingPower = await setWaitingSubmissionStatus(
      api,
      managerAuthContext.headers,
      groupId!,
      {
        application_type: 'power_order',
        status: 'waiting_resubmission',
      }
    );
    expect(waitingPower.status).toBe('waiting_resubmission');

    const waitingFire = await setWaitingSubmissionStatus(
      api,
      managerAuthContext.headers,
      groupId!,
      {
        application_type: 'fire_equipment_order',
        status: 'waiting_resubmission',
      }
    );
    expect(waitingFire.status).toBe('waiting_resubmission');

    const updatedPower = await updateSubmissionStatus(
      api,
      userAuthContext.headers,
      waitingPower.id,
      'unapproved'
    );
    expect(updatedPower.status).toBe('unapproved');

    const updatedFire = await updateSubmissionStatus(
      api,
      userAuthContext.headers,
      waitingFire.id,
      'unapproved'
    );
    expect(updatedFire.status).toBe('unapproved');

    const finalStatuses = await getSubmissionStatuses(
      api,
      userAuthContext.headers,
      groupId!
    );
    expect(findStatus(finalStatuses, 'power_order')?.status).toBe('unapproved');
    expect(findStatus(finalStatuses, 'fire_equipment_order')?.status).toBe(
      'unapproved'
    );
  });

  // 電力・火器以外の既存再提出申請も、user用APIで未承認へ戻せることを実APIで確認する。
  test('updates existing resubmission application statuses through user APIs', async () => {
    expect(groupId).toBeDefined();

    const waitingStatuses = await Promise.all(
      existingResubmissionApplicationTypes.map((applicationType) =>
        setWaitingSubmissionStatus(api, managerAuthContext.headers, groupId!, {
          application_type: applicationType,
          status: 'waiting_resubmission',
        })
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
          userAuthContext.headers,
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
      userAuthContext.headers,
      groupId!
    );
    existingResubmissionApplicationTypes.forEach((applicationType) => {
      expect(findStatus(finalStatuses, applicationType)?.status).toBe(
        'unapproved'
      );
    });
  });

  // ステータスがまだ無い場合に、userがuser用APIで未承認ステータスを作成できることを確認する。
  test('creates a missing submission status through user API', async () => {
    expect(groupId).toBeDefined();

    const createdStatus = await createSubmissionStatus(
      api,
      userAuthContext.headers,
      groupId!,
      {
        application_type: 'equipment',
        status: 'unapproved',
      }
    );

    expect(createdStatus.application_type).toBe('equipment');
    expect(createdStatus.status).toBe('unapproved');
  });
});

const signIn = async (
  api: APIRequestContext,
  email: string,
  password: string
): Promise<AuthContext> => {
  const response = await api.post('/api/auth/sign_in', {
    data: { email, password },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as { data: { id: number } };
  const headers = response.headers();

  expect(headers['access-token']).toBeTruthy();
  expect(headers.client).toBeTruthy();
  expect(headers.uid).toBe(email);

  return {
    userId: Number(body.data.id),
    headers: {
      'access-token': headers['access-token'],
      client: headers.client,
      uid: headers.uid,
    },
  };
};

const createManagerAndGetAuthContext = async (
  api: APIRequestContext
): Promise<AuthContext> => {
  const email = `e2e-resubmission-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}@example.com`;
  const manager = await signIn(api, MANAGER_EMAIL, MANAGER_PASSWORD);

  const response = await api.post('/users/simply_user_create', {
    headers: manager.headers,
    data: {
      name: 'e2e resubmission user',
      email,
      password: 'password',
      password_confirmation: 'password',
      role_id: 1,
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<{ id: number }>;
  expect(body.status.code).toBe(201);
  expect(body.data.id).toBeGreaterThan(0);

  return signIn(api, email, 'password');
};

const createUserAndGetAuthContext = async (
  api: APIRequestContext
): Promise<AuthContext> => {
  const email = `e2e-resubmission-user-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}@example.com`;
  const password = 'password';
  const response = await api.post('/api/auth', {
    data: {
      registration: {
        name: 'e2e resubmission user',
        email,
        password,
        password_confirmation: password,
      },
    },
  });

  expect(response.ok()).toBe(true);

  return signIn(api, email, password);
};

const createGroup = async (
  api: APIRequestContext,
  authContext: AuthContext
): Promise<Group> => {
  const response = await api.post('/groups', {
    headers: { ...authContext.headers, ...skipSlackNotificationHeader },
    data: {
      name: `e2e-resubmission-group-${Date.now()}`,
      project_name: 'e2e resubmission project',
      activity: 'e2e',
      user_id: authContext.userId,
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
          fuel: 1,
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

const setWaitingSubmissionStatus = async (
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

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as ApiResponse<SubmissionStatus>;
  expect(body.status.code).toBe(200);

  return body.data;
};

const createSubmissionStatus = async (
  api: APIRequestContext,
  authHeaders: AuthHeaders,
  groupId: number,
  params: Pick<SubmissionStatus, 'application_type' | 'status'>
): Promise<SubmissionStatus> => {
  const response = await api.post('/health_center_submission_statuses', {
    headers: { ...authHeaders, ...skipSlackNotificationHeader },
    data: {
      group_id: groupId,
      application_type: params.application_type,
      status: params.status,
    },
  });

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
