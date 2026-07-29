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

const fulfillData = (route, data, extra = {}) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      status: { code: 200, message: "Success" },
      data,
      ...extra,
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
    await expect(cells.nth(1)).toHaveText("ー");
    await expect(cells.nth(3)).toHaveText("ー");
    await expect(cells.nth(4)).toHaveText("ー");
    await expect(cells.nth(7)).toHaveText("ー");
    await expect(cells.nth(13)).toHaveText("ー");
  });

  test("分類別表示と全体の団体名順を切り替えられる", async ({ page }) => {
    const groups = [
      {
        group: {
          id: 1,
          name: "D-実行委員",
          group_category_id: 6,
          committee: true,
          is_international: false,
        },
        group_category: 6,
      },
      {
        group: {
          id: 2,
          name: "A-国際",
          group_category_id: 4,
          committee: false,
          is_international: true,
        },
        group_category: 4,
      },
      {
        group: {
          id: 3,
          name: "B-食品",
          group_category_id: 1,
          committee: false,
          is_international: false,
        },
        group_category: 1,
      },
      {
        group: {
          id: 4,
          name: "C-ステージ",
          group_category_id: 3,
          committee: false,
          is_international: false,
        },
        group_category: 3,
      },
    ];

    await page.route(`${API_URL}/group_categories`, (route) =>
      fulfillData(route, [
        { id: 1, name: "食品販売" },
        { id: 3, name: "ステージ" },
        { id: 4, name: "展示・体験" },
        { id: 6, name: "実行委員" },
      ])
    );
    await page.route(`${API_URL}/fes_years`, (route) =>
      fulfillData(route, [{ id: 1, year_num: 2026 }])
    );
    let refinementRequestCount = 0;
    await page.route(
      `${API_URL}/api/v1/get_refinement_order_status_check*`,
      (route) => {
        refinementRequestCount += 1;
        const committee = new URL(route.request().url()).searchParams.get(
          "committee"
        );
        const filteredGroups = committee === "1" ? [groups[0]] : groups;
        fulfillData(route, filteredGroups, {
          sort_orders:
            committee === "1"
              ? { section: [1], name: [1] }
              : {
                  section: [1, 2, 3, 4],
                  name: [2, 3, 4, 1],
                },
        });
      }
    );
    await page.route(`${API_URL}/un_registered_groups*`, (route) =>
      fulfillData(route, [])
    );

    await openNuxtRoute(page, "/order_status_check");

    await expect(page.locator(".group-section-row")).toHaveText([
      "実行委員会（1団体）",
      "国際（1団体）",
      "食品販売（1団体）",
      "ステージ（1団体）",
    ]);
    const requestCountBeforeSort = refinementRequestCount;
    const nameSortButton = page.getByRole("button", { name: /団体名順/ });
    await nameSortButton.click();
    await expect(page.locator(".group-section-row")).toHaveCount(0);
    await expect(
      page.locator("tbody tr.clickable-row td:nth-child(1)")
    ).toHaveText(["A-国際", "B-食品", "C-ステージ", "D-実行委員"]);
    await nameSortButton.click();
    await expect(
      page.locator("tbody tr.clickable-row td:nth-child(1)")
    ).toHaveText(["D-実行委員", "C-ステージ", "B-食品", "A-国際"]);
    expect(refinementRequestCount).toBe(requestCountBeforeSort);

    const committeeFilter = page
      .locator(".drop-down-content")
      .filter({ hasText: "団体種別: ALL" });
    await committeeFilter.getByRole("button").first().click();
    await committeeFilter
      .getByRole("button", { name: "実行委員会", exact: true })
      .click();
    await expect(
      page.locator("tbody tr.clickable-row td:nth-child(1)")
    ).toHaveText(["D-実行委員"]);
  });

  test("詳細画面に申請内容と合計電力を表示する", async ({ page }) => {
    const group = {
      group: {
        id: 1,
        name: "申請内容優先団体",
        project_name: "食品販売",
        activity: "飲食物の販売",
        group_category_id: 1,
        committee: false,
        is_international: false,
        is_external: false,
        fes_year_id: 1,
      },
      user: { name: "代表者", email: "representative@example.com" },
      group_category: "食品販売",
      power_orders: [
        {
          power_order: {
            id: 1,
            item: "ホットプレート",
            power: 1200,
          },
        },
        {
          power_order: {
            id: 2,
            item: "電気ケトル",
            power: 300,
          },
        },
      ],
      rental_orders: [
        {
          rental_item: {
            rental_item: { id: 1, group_id: 1, rental_item_id: 1, num: 2 },
            name: "長机",
            num: 2,
          },
        },
      ],
      fire_equipment_orders: [
        {
          fire_equipment_order: {
            id: 1,
            name: "カセットコンロ",
            quantity: 1,
            fuel_japanese: "ガスボンベ",
          },
        },
      ],
      total_power: 1500,
    };
    await page.route(
      `${API_URL}/api/v1/get_order_info_for_admin_view/1`,
      (route) => fulfillData(route, group)
    );
    await page.route(
      `${API_URL}/api/v1/get_health_center_submission_status_show_for_admin_view/1`,
      (route) => fulfillData(route, { submissions: [] })
    );
    await page.route(`${API_URL}/un_registered_groups?group_id=1`, (route) =>
      fulfillData(route, [])
    );
    await page.route(
      `${API_URL}/api/v1/get_refinement_order_status_check*`,
      (route) =>
        fulfillData(route, [
          {
            group: group.group,
            group_category: 1,
          },
        ])
    );

    await openNuxtRoute(page, "/order_status_check/1");

    await expect(page.getByText("ホットプレート")).toBeVisible();
    await expect(page.getByText("長机", { exact: true })).toBeVisible();
    await expect(page.getByText("カセットコンロ")).toBeVisible();
    await expect(page.locator(".power-total-row")).toContainText("1500 W");
  });
});
