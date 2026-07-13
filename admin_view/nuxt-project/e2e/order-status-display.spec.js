const { expect, test } = require("@playwright/test");

const API_URL = process.env.PLAYWRIGHT_ADMIN_API_URL || "http://127.0.0.1:3201";

const authenticate = async (page) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("auth.strategy", "local");
    window.localStorage.setItem("auth._token.local", "Bearer e2e-token");
    window.localStorage.setItem("access-token", "e2e-token");
    window.localStorage.setItem("client", "e2e-client");
    window.localStorage.setItem("uid", "admin@example.com");
    window.localStorage.setItem("token-type", "Bearer");
  });
};

const fulfillData = (route, data) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      status: { code: 200, message: "Success" },
      data,
    }),
  });

const openNuxtRoute = async (page, path) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(window.$nuxt));
  await page.evaluate(
    (routePath) => window.$nuxt.$router.push(routePath),
    path
  );
};

test.describe("申請状況の表示", () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
    await page.request.delete(`${API_URL}/_e2e/requests`);
  });

  test("申請あり・ステータスレコードなしは詳細でも未確認になる", async ({
    page,
  }) => {
    await page.route(`${API_URL}/food_products/group/1`, (route) =>
      fulfillData(route, [
        { id: 1, name: "焼きそば", first_day_num: 10, second_day_num: 10 },
      ])
    );
    await page.route(
      `${API_URL}/api/v1/get_health_center_submission_status_show_for_admin_view/1`,
      (route) =>
        fulfillData(route, {
          submissions: [
            {
              id: null,
              application_type: "food_product",
              status: "unsubmitted",
              comments: [],
            },
          ],
        })
    );

    await openNuxtRoute(page, "/health_center_document_review/1");

    await expect(page.getByLabel("販売品申請のステータス")).toHaveValue(
      "unapproved"
    );
  });

  test("永続化済みの未提出ステータスは詳細でも未提出になる", async ({
    page,
  }) => {
    await page.route(`${API_URL}/food_products/group/1`, (route) =>
      fulfillData(route, [
        { id: 1, name: "焼きそば", first_day_num: 10, second_day_num: 10 },
      ])
    );
    await page.route(
      `${API_URL}/api/v1/get_health_center_submission_status_show_for_admin_view/1`,
      (route) =>
        fulfillData(route, {
          submissions: [
            {
              id: 10,
              application_type: "food_product",
              status: "unsubmitted",
              comments: [],
            },
          ],
        })
    );

    await openNuxtRoute(page, "/health_center_document_review/1");

    await expect(page.getByLabel("販売品申請のステータス")).toHaveValue(
      "unsubmitted"
    );
  });

  test("申請状況詳細でも申請あり・ステータスレコードなしは未確認になる", async ({
    page,
  }) => {
    await page.route(
      `${API_URL}/api/v1/get_order_info_for_admin_view/1`,
      (route) =>
        fulfillData(route, {
          group: {
            id: 1,
            name: "技大祭企画",
            project_name: "食品販売",
            activity: "飲食物の販売",
            group_category_id: 1,
            committee: false,
            is_international: false,
            is_external: false,
          },
          user: {
            name: "山田太郎",
            email: "representative@example.com",
          },
          group_category: "食品販売",
          food_products: [
            {
              food_product: {
                id: 1,
                name: "焼きそば",
                first_day_num: 10,
                second_day_num: 10,
              },
              purchase_lists: [],
              cooking_process_order: null,
            },
          ],
        })
    );
    await page.route(
      `${API_URL}/api/v1/get_health_center_submission_status_show_for_admin_view/1`,
      (route) =>
        fulfillData(route, {
          submissions: [
            {
              id: null,
              application_type: "food_product",
              status: "unsubmitted",
              comments: [],
            },
          ],
        })
    );

    await openNuxtRoute(page, "/order_status_check/1");

    const foodProductStatus = page
      .locator(".section-header-with-button", { hasText: "販売品申請" })
      .locator("select.status-select");
    await expect(foodProductStatus).toHaveValue("unapproved");
  });

  test("申請しない回答は一覧で対象外として表示される", async ({ page }) => {
    const group = {
      group: {
        id: 1,
        name: "申請しない表示確認",
        is_international: false,
      },
      group_category: 1,
      power_orders: null,
      rental_orders: null,
      employees: null,
      fire_equipment_order: null,
      health_center_submission_statuses: {},
    };
    const unregisteredGroups = [
      "sub_rep",
      "power_order",
      "rental_item_order",
      "employee",
      "fire_equipment_order",
    ].map((orderType) => ({ group_id: 1, order_type: orderType }));

    await page.route(`${API_URL}/group_categories`, (route) =>
      fulfillData(route, [{ id: 1, name: "食品販売" }])
    );
    await page.route(`${API_URL}/fes_years`, (route) =>
      fulfillData(route, [{ id: 1, year_num: 2026 }])
    );
    await page.route(
      `${API_URL}/api/v1/get_refinement_order_status_check*`,
      (route) => fulfillData(route, [group])
    );
    await page.route(`${API_URL}/un_registered_groups*`, (route) =>
      fulfillData(route, unregisteredGroups)
    );

    await openNuxtRoute(page, "/order_status_check");

    const row = page.locator("tbody tr", {
      hasText: "申請しない表示確認",
    });
    await expect(row).toBeVisible();
    const cells = row.locator("td");
    await expect(cells.nth(2)).toHaveText("ー");
    await expect(cells.nth(4)).toHaveText("ー");
    await expect(cells.nth(5)).toHaveText("ー");
    await expect(cells.nth(8)).toHaveText("ー");
    await expect(cells.nth(14)).toHaveText("ー");
  });
});
