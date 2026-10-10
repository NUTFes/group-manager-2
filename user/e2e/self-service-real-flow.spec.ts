import { expect, request, test } from '@playwright/test';
import type {
  APIRequestContext,
  Locator,
  Page,
  Response,
} from '@playwright/test';

// 参加団体(userロール)が自団体の申請を実際の画面から保存し、
// 認証ヘッダー付きのリクエストが実APIで2xxになることを検証する。
// 準備・後片付けはAPIで行い、画面の保存処理そのものには手を加えない。

const API_BASE_URL = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://api:3000';
const PASSWORD = process.env.PLAYWRIGHT_E2E_PASSWORD ?? 'gidaifes';
const USER_EMAIL =
  process.env.PLAYWRIGHT_E2E_USER_EMAIL ?? 'nutfes-saburo@email.com';
const MANAGER_EMAIL =
  process.env.PLAYWRIGHT_E2E_EMAIL ?? 'nutfes-taro@email.com';
const STAGE_GROUP_CATEGORY_ID = 3;
const RENTAL_ITEM_ORDER_TYPE = 0;
const SKIP_SLACK_HEADER = { 'X-Skip-Slack-Notification': 'true' };
// 1x1の正方形PNG（PR画像の正方形チェックを通すため）
const SQUARE_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

type AuthContext = {
  userId: number;
  headers: Record<string, string>;
};

type Group = {
  id: number;
  name: string;
  project_name: string;
  activity: string;
  group_category_id: number;
  fes_year_id: number;
  committee: boolean | null;
  is_international: boolean | null;
  is_external: boolean | null;
};

test.describe.configure({ mode: 'serial' });

test.describe('real API: participant saves own applications from the UI', () => {
  test.setTimeout(120_000);

  let api: APIRequestContext;
  let user: AuthContext;
  let groupId: number;

  test.beforeEach(async () => {
    api = await request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: { Accept: 'application/json' },
    });
    user = await signIn(api, USER_EMAIL);
    const group = await getData<{ id: number }>(
      await api.get(`/groups/user/${user.userId}`, { headers: user.headers })
    );
    groupId = group.id;
  });

  test.afterEach(async () => {
    await api.dispose();
  });

  test('団体申請の修正を保存できる', async ({ page }) => {
    const original = await getGroup(api, user, groupId);

    try {
      await suppressSlackNotification(page);
      await loginThroughUi(page, user.userId);

      const section = await openSection(page, /団体申請/);
      const nameInput = section.getByLabel('団体名');
      const editButton = section.getByRole('button', {
        name: '修正',
        exact: true,
      });
      await expect(nameInput.or(editButton).first()).toBeVisible();
      if (!(await nameInput.isVisible())) await editButton.click();

      // 団体申請の編集フォームは保存値を読み込まずに開くことがある(既存の不具合)ため、
      // 全項目を元の値で明示的に入力してから企画名だけを変える
      await nameInput.fill(original.name);
      await section
        .getByLabel('企画名')
        .fill(`${original.project_name}-e2e-${Date.now()}`);
      await section
        .getByLabel('参加形式')
        .selectOption(String(original.group_category_id));
      await section.getByLabel('企画内容').fill(original.activity);

      const saved = waitForApi(page, 'PATCH', `/groups/${groupId}`);
      await section.getByRole('button', { name: '修正', exact: true }).click();
      await expectAuthenticatedSuccess(await saved);

      const persisted = await getGroup(api, user, groupId);
      expect(persisted.project_name).not.toBe(original.project_name);
      expect(persisted.group_category_id).toBe(original.group_category_id);
    } finally {
      await restoreGroup(api, user, original);
    }
  });

  test('副代表申請の修正を保存できる', async ({ page }) => {
    const original = await getData<Record<string, unknown>>(
      await api.get(`/sub_reps/group/${groupId}`, { headers: user.headers })
    );
    const updatedName = `副代表E2E${Date.now() % 100000}`;

    try {
      await loginThroughUi(page, user.userId);

      const section = await openSection(page, /副代表申請/);
      await section.getByRole('button', { name: '修正', exact: true }).click();
      await section.getByLabel('名前').fill(updatedName);
      await section.getByLabel('電話番号').fill('09012345678');

      const saved = waitForApi(page, 'PATCH', `/sub_reps/${original.id}`);
      await section.getByRole('button', { name: '登録', exact: true }).click();
      await expectAuthenticatedSuccess(await saved);

      const persisted = await getData<{ name: string }>(
        await api.get(`/sub_reps/group/${groupId}`, { headers: user.headers })
      );
      expect(persisted.name).toBe(updatedName);
    } finally {
      await api.patch(`/sub_reps/${original.id}`, {
        headers: user.headers,
        data: {
          group_id: original.group_id,
          name: original.name,
          student_id: original.student_id,
          grade_id: original.grade_id,
          department_id: original.department_id,
          email: original.email,
          tel: original.tel,
        },
      });
    }
  });

  test('会場申請を新規登録できる', async ({ page }) => {
    await expectNoRecord(api, user, `/place_orders/group/${groupId}`);
    const remark = `E2E 会場申請 ${Date.now()}`;

    try {
      await loginThroughUi(page, user.userId);

      const section = await openSection(page, /会場申請/);
      await section.getByLabel('備考').fill(remark);

      const saved = waitForApi(page, 'POST', '/place_orders');
      await section.getByRole('button', { name: '登録', exact: true }).click();
      await expectAuthenticatedSuccess(await saved);

      const persisted = await getData<{ remark: string }>(
        await api.get(`/place_orders/group/${groupId}`, {
          headers: user.headers,
        })
      );
      expect(persisted.remark).toBe(remark);
    } finally {
      await deleteIfExists(api, user, `/place_orders/group/${groupId}`, (id) =>
        api.delete(`/place_orders/${id}`, { headers: user.headers })
      );
    }
  });

  test('物品申請で「申請しない」を登録できる', async ({ page }) => {
    expect(await getUnregisteredRows(api, user, groupId)).toEqual([]);

    try {
      await loginThroughUi(page, user.userId);

      const section = await openSection(page, /物品申請/);
      await expect(
        section.locator(
          'input[type="radio"][name="物品申請を行いますか？"][value="0"]'
        )
      ).toBeChecked();

      const saved = waitForApi(page, 'POST', '/un_registered_groups');
      await section.getByRole('button', { name: '登録', exact: true }).click();
      await expectAuthenticatedSuccess(await saved);

      expect(await getUnregisteredRows(api, user, groupId)).toHaveLength(1);
    } finally {
      for (const row of await getUnregisteredRows(api, user, groupId)) {
        await api.delete(`/un_registered_groups/${row.id}`, {
          headers: user.headers,
        });
      }
      await resetEquipmentStatus(api, groupId);
    }
  });

  test('物品申請で物品を新規登録できる', async ({ page }) => {
    expect(await getRentalOrders(api, user, groupId)).toEqual([]);

    try {
      await loginThroughUi(page, user.userId);

      const section = await openSection(page, /物品申請/);
      await section
        .locator(
          'input[type="radio"][name="物品申請を行いますか？"][value="1"]'
        )
        .check({ force: true });
      await section.getByLabel('物品名').first().selectOption({ label: '机' });

      const saved = waitForApi(page, 'POST', '/rental_orders');
      await section.getByRole('button', { name: '登録', exact: true }).click();
      await expectAuthenticatedSuccess(await saved);

      await expect
        .poll(async () => (await getRentalOrders(api, user, groupId)).length)
        .toBe(1);
    } finally {
      for (const order of await getRentalOrders(api, user, groupId)) {
        await api.delete(`/rental_orders/${order.id}`, {
          headers: user.headers,
        });
      }
      await resetEquipmentStatus(api, groupId);
    }
  });

  test('PR文申請を画像付きで新規登録できる', async ({ page }) => {
    await expectNoRecord(api, user, `/public_relations/group/${groupId}`);
    const blurb = `E2E PR文 ${Date.now() % 100000}`;

    try {
      await mockImgurUpload(page, 'https://i.imgur.com/e2e-user.png');
      await loginThroughUi(page, user.userId);

      const section = await openSection(page, /PR文申請/);
      await section.getByLabel(/PR文/).fill(blurb);

      const fileChooser = page.waitForEvent('filechooser');
      await section.getByRole('button', { name: /PR画像/ }).click();
      await (
        await fileChooser
      ).setFiles({
        name: 'e2e_pr.png',
        mimeType: 'image/png',
        buffer: SQUARE_PNG,
      });
      await expect(section.getByText(/アップロード済み/)).toBeVisible();

      const saved = waitForApi(page, 'POST', '/public_relations');
      await section.getByRole('button', { name: '登録', exact: true }).click();
      await expectAuthenticatedSuccess(await saved);

      const persisted = await getData<{ blurb: string; picture_path: string }>(
        await api.get(`/public_relations/group/${groupId}`, {
          headers: user.headers,
        })
      );
      expect(persisted.blurb).toBe(blurb);
      expect(persisted.picture_path).toBe('https://i.imgur.com/e2e-user.png');
    } finally {
      await deleteIfExists(
        api,
        user,
        `/public_relations/group/${groupId}`,
        (id) => api.delete(`/public_relations/${id}`, { headers: user.headers })
      );
    }
  });

  test('ステージオプション申請を新規登録できる', async ({ page }) => {
    const original = await getGroup(api, user, groupId);
    await expectNoRecord(api, user, `/stage_common_options/group/${groupId}`);

    try {
      // ステージオプション申請はステージ団体にだけ表示されるため、一時的に参加形式を切り替える
      await patchGroup(api, user, groupId, {
        group_category_id: STAGE_GROUP_CATEGORY_ID,
      });
      await loginThroughUi(page, user.userId);

      const section = await openSection(page, /ステージオプション申請/);
      for (const question of [
        '電力を使用する機器を持ち込みますか',
        'スピーカーに繋ぐ機器を持ち込みますか',
        '実行委員が撮影することを許可しますか',
        '大きい音を出しますか',
      ]) {
        await section
          .locator(`input[type="radio"][name="${question}"][value="1"]`)
          .check({ force: true });
      }

      const saved = waitForApi(page, 'POST', '/stage_common_options');
      await section.getByRole('button', { name: '登録', exact: true }).click();
      await expectAuthenticatedSuccess(await saved);

      const persisted = await getData<{ bgm: boolean; loud_sound: boolean }>(
        await api.get(`/stage_common_options/group/${groupId}`, {
          headers: user.headers,
        })
      );
      expect(persisted).toMatchObject({ bgm: true, loud_sound: true });
    } finally {
      await deleteIfExists(
        api,
        user,
        `/stage_common_options/group/${groupId}`,
        (id) =>
          api.delete(`/stage_common_options/${id}`, { headers: user.headers })
      );
      await restoreGroup(api, user, original);
    }
  });
});

const signIn = async (
  api: APIRequestContext,
  email: string
): Promise<AuthContext> => {
  const response = await api.post('/api/auth/sign_in', {
    data: { email, password: PASSWORD },
  });
  expect(response.ok()).toBe(true);
  const headers = response.headers();
  const body = (await response.json()) as { data: { id: number } };
  return {
    userId: Number(body.data.id),
    headers: {
      'access-token': headers['access-token'],
      client: headers.client,
      uid: headers.uid,
    },
  };
};

const getData = async <T>(
  response: Awaited<ReturnType<APIRequestContext['get']>>
) => {
  expect(response.ok()).toBe(true);
  return ((await response.json()) as { data: T }).data;
};

const getGroup = (api: APIRequestContext, user: AuthContext, groupId: number) =>
  api
    .get(`/groups/${groupId}`, { headers: user.headers })
    .then((response) => getData<Group>(response));

const patchGroup = async (
  api: APIRequestContext,
  user: AuthContext,
  groupId: number,
  data: Partial<Group>
) => {
  const response = await api.patch(`/groups/${groupId}`, {
    headers: { ...user.headers, ...SKIP_SLACK_HEADER },
    data,
  });
  expect(response.ok()).toBe(true);
};

const restoreGroup = (
  api: APIRequestContext,
  user: AuthContext,
  group: Group
) =>
  patchGroup(api, user, group.id, {
    name: group.name,
    project_name: group.project_name,
    activity: group.activity,
    group_category_id: group.group_category_id,
    fes_year_id: group.fes_year_id,
    committee: group.committee,
    is_international: group.is_international,
    is_external: group.is_external,
  });

type LookupBody = { status: { code: number }; data: { id: number } };

// 自団体の未登録はHTTP 200 + 本文のcode 404で返る(gm3/developと同じ仕様)
const expectNoRecord = async (
  api: APIRequestContext,
  user: AuthContext,
  path: string
) => {
  const response = await api.get(path, { headers: user.headers });
  expect(response.ok()).toBe(true);
  const body = (await response.json()) as LookupBody;
  expect(body.status.code, `${path} は未登録であること`).toBe(404);
};

const deleteIfExists = async (
  api: APIRequestContext,
  user: AuthContext,
  path: string,
  destroy: (id: number) => Promise<unknown>
) => {
  const response = await api.get(path, { headers: user.headers });
  if (!response.ok()) return;
  const body = (await response.json()) as LookupBody;
  if (body.status.code === 200) await destroy(body.data.id);
};

const getUnregisteredRows = async (
  api: APIRequestContext,
  user: AuthContext,
  groupId: number
): Promise<{ id: number }[]> => {
  const response = await api.get(
    `/un_registered_groups/group?group_id=${groupId}&order_type=${RENTAL_ITEM_ORDER_TYPE}`,
    { headers: user.headers }
  );
  if (response.status() === 404) return [];
  expect(response.ok()).toBe(true);
  return ((await response.json()) as { data: { id: number }[] }).data;
};

const getRentalOrders = async (
  api: APIRequestContext,
  user: AuthContext,
  groupId: number
): Promise<{ id: number }[]> => {
  const response = await api.get(`/rental_orders/group/${groupId}`, {
    headers: user.headers,
  });
  expect(response.ok()).toBe(true);
  return ((await response.json()) as { data: { id: number }[] }).data ?? [];
};

// 物品申請の保存で提出ステータスが作られるため、未提出に戻す
const resetEquipmentStatus = async (
  api: APIRequestContext,
  groupId: number
) => {
  const manager = await signIn(api, MANAGER_EMAIL);
  await api.post('/api/v1/health_center_submission_statuses', {
    headers: { ...manager.headers, ...SKIP_SLACK_HEADER },
    data: {
      group_id: groupId,
      application_type: 'equipment',
      status: 'unsubmitted',
    },
  });
};

const loginThroughUi = async (page: Page, expectedUserId: number) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'ログイン' }).click();
  await page.getByLabel('メールアドレス').fill(USER_EMAIL);
  await page.getByLabel('パスワード').fill(PASSWORD);

  const loginForm = page.locator('form').filter({
    has: page.getByLabel('メールアドレス'),
  });
  await loginForm.getByRole('button', { name: 'ログイン' }).click();

  await expect(page).toHaveURL(/\/home/, { timeout: 15_000 });
  await expect
    .poll(
      async () => {
        const response = await page.request.get('/api/getUser');
        return ((await response.json()) as { id: string | null }).id;
      },
      { timeout: 10_000 }
    )
    .toBe(String(expectedUserId));
};

const openSection = async (page: Page, title: RegExp): Promise<Locator> => {
  const toggle = page.getByRole('button', { name: title });
  await toggle.click();
  return toggle.locator('xpath=..');
};

const waitForApi = (page: Page, method: string, pathname: string) => {
  const apiOrigin = new URL(API_BASE_URL).origin;
  return page.waitForResponse(
    (response) =>
      response.request().method() === method &&
      new URL(response.url()).origin === apiOrigin &&
      new URL(response.url()).pathname === pathname
  );
};

const expectAuthenticatedSuccess = async (response: Response) => {
  const requestHeaders = await response.request().allHeaders();
  const label = `${response.request().method()} ${new URL(response.url()).pathname}`;

  expect(
    requestHeaders['access-token'],
    `${label} に認証ヘッダーが付くこと`
  ).toBeTruthy();
  expect(
    requestHeaders.client,
    `${label} に認証ヘッダーが付くこと`
  ).toBeTruthy();
  expect(requestHeaders.uid).toBe(USER_EMAIL);
  expect(response.status(), `${label} が2xxになること`).toBeGreaterThanOrEqual(
    200
  );
  expect(response.status(), `${label} が2xxになること`).toBeLessThan(300);
};

// 団体申請の更新はSlack通知を送るため、ブラウザからの更新系リクエストに抑止ヘッダーを付ける
const suppressSlackNotification = async (page: Page) => {
  const apiOrigin = new URL(API_BASE_URL).origin;
  await page.route(`${apiOrigin}/**`, async (route) => {
    const req = route.request();
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method())) {
      await route.continue();
      return;
    }
    await route.continue({
      headers: { ...req.headers(), ...SKIP_SLACK_HEADER },
    });
  });
};

const mockImgurUpload = async (page: Page, link: string) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  await page.route('https://api.imgur.com/**', async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: corsHeaders,
      body: JSON.stringify({ success: true, status: 200, data: { link } }),
    });
  });
};
