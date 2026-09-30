const { expect, request, test } = require("@playwright/test");

const API_URL = process.env.PLAYWRIGHT_ADMIN_API_URL || "http://localhost:3000";
const PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD || "gidaifes";

const USERS = {
  manager:
    process.env.PLAYWRIGHT_ADMIN_MANAGER_EMAIL || "nutfes-taro@email.com",
  staff: process.env.PLAYWRIGHT_ADMIN_STAFF_EMAIL || "nutfes-jiro@email.com",
  user: process.env.PLAYWRIGHT_ADMIN_USER_EMAIL || "nutfes-saburo@email.com",
};

const login = async (page, email) => {
  await page.goto("/");
  await page.locator('input[placeholder="email"]').fill(email);
  await page.locator('input[placeholder="password"]').fill(PASSWORD);
  await page.getByRole("button", { name: "login" }).click();
};

test.describe("admin real API access control", () => {
  test("ログイン画面では保護APIを呼ばない", async ({ page }) => {
    const businessResponses = [];
    const apiOrigin = new URL(API_URL).origin;

    page.on("response", (response) => {
      const url = new URL(response.url());
      if (url.origin === apiOrigin && !url.pathname.startsWith("/api/auth")) {
        businessResponses.push({
          path: url.pathname,
          status: response.status(),
        });
      }
    });

    await page.goto("/");
    await expect(page.locator(".login")).toBeVisible();
    await page.waitForTimeout(500);

    expect(businessResponses).toEqual([]);
  });

  for (const role of ["manager", "staff"]) {
    test(`${role}はログイン後にダッシュボードを開き、リロードできる`, async ({
      page,
    }) => {
      const dashboardResponse = page.waitForResponse(
        (response) =>
          response.url() === `${API_URL}/api/v1/dashboard` &&
          response.request().method() === "GET"
      );

      await login(page, USERS[role]);

      expect((await dashboardResponse).status()).toBe(200);
      await expect(page).toHaveURL(/\/dashboard$/);
      await expect(
        page.getByRole("heading", { name: "ダッシュボード" })
      ).toBeVisible();

      const reloadResponse = page.waitForResponse(
        (response) =>
          response.url() === `${API_URL}/api/v1/dashboard` &&
          response.request().method() === "GET"
      );
      await page.reload();

      expect((await reloadResponse).status()).toBe(200);
      await expect(
        page.getByRole("heading", { name: "ダッシュボード" })
      ).toBeVisible();
    });
  }

  test("userはadminのダッシュボードAPIを利用できない", async ({ page }) => {
    const dashboardResponse = page.waitForResponse(
      (response) =>
        response.url() === `${API_URL}/api/v1/dashboard` &&
        response.request().method() === "GET"
    );

    await login(page, USERS.user);

    expect((await dashboardResponse).status()).toBe(403);
    await expect(
      page.getByRole("heading", { name: "ダッシュボード" })
    ).toHaveCount(0);
  });
});

const SKIP_SLACK_HEADER = { "X-Skip-Slack-Notification": "true" };
const MANAGER_OWNED_GROUP_ID = 1;

const newApiContext = () =>
  request.newContext({
    baseURL: API_URL,
    extraHTTPHeaders: { Accept: "application/json" },
  });

const signIn = async (api, email) => {
  const response = await api.post("/api/auth/sign_in", {
    data: { email, password: PASSWORD },
  });
  expect(response.ok()).toBe(true);
  const headers = response.headers();
  const body = await response.json();
  return {
    userId: body.data.id,
    headers: {
      "access-token": headers["access-token"],
      client: headers.client,
      uid: headers.uid,
    },
  };
};

const readData = async (response) => {
  expect(response.ok()).toBe(true);
  return (await response.json()).data;
};

const apiPath = (response) => new URL(response.url()).pathname;

const waitForApi = (page, method, pathname) =>
  page.waitForResponse(
    (response) =>
      response.request().method() === method &&
      new URL(response.url()).origin === new URL(API_URL).origin &&
      apiPath(response) === pathname
  );

// 団体編集はSlack通知を送るため、ブラウザからの更新系リクエストに抑止ヘッダーを付ける
const suppressSlackNotification = async (page) => {
  const apiOrigin = new URL(API_URL).origin;
  await page.route(`${apiOrigin}/**`, async (route) => {
    const req = route.request();
    if (["GET", "HEAD", "OPTIONS"].includes(req.method())) {
      await route.continue();
      return;
    }
    await route.continue({
      headers: { ...req.headers(), ...SKIP_SLACK_HEADER },
    });
  });
};

const mockImgurUpload = async (page, uploaded) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  await page.route("https://api.imgur.com/**", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: corsHeaders,
      body: JSON.stringify({ success: true, status: 200, data: uploaded }),
    });
  });
};

const inputUnderHeading = (page, heading, tag = "input") =>
  page.locator(
    `xpath=//h3[normalize-space()="${heading}"]/following-sibling::${tag}[1]`
  );

test.describe("admin real API: staff manages another group's records", () => {
  test("staffは他団体の団体詳細を開き、編集を保存できる", async ({ page }) => {
    const api = await newApiContext();
    const staff = await signIn(api, USERS.staff);
    const original = (
      await readData(
        await api.get(
          `/api/v1/get_group_show_for_admin_view/${MANAGER_OWNED_GROUP_ID}`,
          { headers: staff.headers }
        )
      )
    ).group;
    expect(original.user_id).not.toBe(staff.userId);
    const updatedName = `${original.name}-e2e-${Date.now()}`;

    try {
      await suppressSlackNotification(page);
      await login(page, USERS.staff);
      await expect(page).toHaveURL(/\/dashboard$/);

      const detailResponse = waitForApi(
        page,
        "GET",
        `/api/v1/get_group_show_for_admin_view/${MANAGER_OWNED_GROUP_ID}`
      );
      await page.goto(`/groups/${MANAGER_OWNED_GROUP_ID}`);
      expect((await detailResponse).status()).toBe(200);

      await page.getByRole("button", { name: /編集/ }).first().click();
      await inputUnderHeading(page, "団体名").fill(updatedName);

      const updateResponse = waitForApi(
        page,
        "PATCH",
        `/api/v1/update_group_for_admin_view/${MANAGER_OWNED_GROUP_ID}`
      );
      await page.getByRole("button", { name: /登録/ }).click();
      expect((await updateResponse).status()).toBe(200);

      const persisted = await readData(
        await api.get(
          `/api/v1/get_group_show_for_admin_view/${MANAGER_OWNED_GROUP_ID}`,
          { headers: staff.headers }
        )
      );
      expect(persisted.group.name).toBe(updatedName);
    } finally {
      await api.patch(
        `/api/v1/update_group_for_admin_view/${MANAGER_OWNED_GROUP_ID}`,
        {
          headers: { ...staff.headers, ...SKIP_SLACK_HEADER },
          data: {
            name: original.name,
            project_name: original.project_name,
            activity: original.activity,
            group_category_id: original.group_category_id,
            fes_year_id: original.fes_year_id,
            committee: original.committee,
            is_international: original.is_international,
            is_external: original.is_external,
          },
        }
      );
      await api.dispose();
    }
  });

  test("staffは他団体の従業員詳細を開き、編集を保存できる", async ({ page }) => {
    const api = await newApiContext();
    const staff = await signIn(api, USERS.staff);
    const employees = await readData(
      await api.get("/api/v1/get_employee_index_for_admin_view", {
        headers: staff.headers,
      })
    );
    const target = employees.find(
      (row) => row.group && row.group.user_id !== staff.userId
    );
    expect(target, "他団体の従業員がSeedに存在すること").toBeTruthy();
    const original = target.employee;
    const updatedName = `e2e-${Date.now()}`;

    try {
      await login(page, USERS.staff);
      await expect(page).toHaveURL(/\/dashboard$/);

      const detailResponse = waitForApi(
        page,
        "GET",
        `/api/v1/get_employee_show_for_admin_view/${original.id}`
      );
      await page.goto(`/employees/${original.id}`);
      expect((await detailResponse).status()).toBe(200);

      await page.getByRole("button", { name: /編集/ }).first().click();
      await inputUnderHeading(page, "氏名").fill(updatedName);

      const updateResponse = waitForApi(
        page,
        "PATCH",
        `/api/v1/update_employee_for_admin_view/${original.id}`
      );
      await page.getByRole("button", { name: /登録/ }).click();
      expect((await updateResponse).status()).toBe(200);

      const persisted = await readData(
        await api.get(`/api/v1/get_employee_show_for_admin_view/${original.id}`, {
          headers: staff.headers,
        })
      );
      expect(persisted.employee.name).toBe(updatedName);
    } finally {
      await api.patch(`/api/v1/update_employee_for_admin_view/${original.id}`, {
        headers: staff.headers,
        data: {
          group_id: original.group_id,
          name: original.name,
          student_id: original.student_id,
          stool_test_id: original.stool_test_id,
        },
      });
      await api.dispose();
    }
  });

  test("staffは他団体のPR申請を画面から登録できる", async ({ page }) => {
    const api = await newApiContext();
    const staff = await signIn(api, USERS.staff);
    // 既存のPRを差し替えると本物のimgur画像の削除が走り得るため、PR未登録の団体だけを使う
    const groupsWithoutPr = await readData(
      await api.get("/api/v1/get_groups_have_no_public_relation", {
        headers: staff.headers,
      })
    );
    const targetGroup = groupsWithoutPr.find(
      (group) => group.user_id !== staff.userId
    );
    expect(targetGroup, "PR未登録の他団体がSeedに存在すること").toBeTruthy();
    const blurb = `E2E staff PR ${Date.now()}`;
    let createdPublicRelationId;

    try {
      await mockImgurUpload(page, {
        link: "https://i.imgur.com/e2e-admin.png",
        deletehash: "e2e-admin-deletehash",
      });
      await login(page, USERS.staff);
      await expect(page).toHaveURL(/\/dashboard$/);

      const detailResponse = waitForApi(
        page,
        "GET",
        `/api/v1/get_public_relation_for_admin_view/${targetGroup.id}`
      );
      await page.goto(`/public_relations/${targetGroup.id}`);
      expect((await detailResponse).status()).toBe(200);

      await page.getByRole("button", { name: /編集/ }).first().click();
      await page.locator('input[type="file"]').setInputFiles({
        name: "物品販売_e2e.png",
        mimeType: "image/png",
        buffer: Buffer.from("e2e-image"),
      });
      await inputUnderHeading(page, "文章", "textarea").fill(blurb);

      const createResponse = waitForApi(
        page,
        "POST",
        "/api/v1/create_public_relation_for_admin_view"
      );
      await page.getByRole("button", { name: /登録/ }).click();
      const created = await createResponse;
      expect(created.status()).toBe(200);
      createdPublicRelationId = (await created.json()).data.id;

      const persisted = await readData(
        await api.get(
          `/api/v1/get_public_relation_for_admin_view/${targetGroup.id}`,
          { headers: staff.headers }
        )
      );
      expect(persisted[0].public_relation_id).toBe(createdPublicRelationId);
      expect(persisted[0].blurb).toBe(blurb);
      expect(persisted[0].picture_path).toBe(
        "https://i.imgur.com/e2e-admin.png"
      );
    } finally {
      if (createdPublicRelationId) {
        await api.delete(
          `/api/v1/delete_public_relation_for_admin_view/${createdPublicRelationId}`,
          { headers: staff.headers }
        );
      }
      await api.dispose();
    }
  });

  test("userはadmin用APIで他団体を取得・更新できない", async () => {
    const api = await newApiContext();
    const user = await signIn(api, USERS.user);

    try {
      const read = await api.get(
        `/api/v1/get_group_show_for_admin_view/${MANAGER_OWNED_GROUP_ID}`,
        { headers: user.headers }
      );
      expect(read.status()).toBe(403);

      const update = await api.patch(
        `/api/v1/update_group_for_admin_view/${MANAGER_OWNED_GROUP_ID}`,
        {
          headers: { ...user.headers, ...SKIP_SLACK_HEADER },
          data: { name: "user-cannot-edit" },
        }
      );
      expect(update.status()).toBe(403);

      const create = await api.post(
        "/api/v1/create_employee_for_admin_view",
        {
          headers: user.headers,
          data: { group_id: MANAGER_OWNED_GROUP_ID, name: "user-cannot-create" },
        }
      );
      expect(create.status()).toBe(403);
    } finally {
      await api.dispose();
    }
  });
});
