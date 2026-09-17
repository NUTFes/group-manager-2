const { expect, test } = require("@playwright/test");

const API_URL = process.env.PLAYWRIGHT_ADMIN_API_URL || "http://127.0.0.1:3201";

test.describe("ユーザー画面制御の楽観的保存", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("auth.strategy", "local");
      window.localStorage.setItem("auth._token.local", "Bearer e2e-token");
      window.localStorage.setItem("access-token", "e2e-token");
      window.localStorage.setItem("client", "e2e-client");
      window.localStorage.setItem("uid", "e2e@example.com");
      window.localStorage.setItem("token-type", "Bearer");
    });
    await page.request.delete(`${API_URL}/_e2e/requests`);
  });

  const openSettings = async (page) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() => window.$nuxt.$router.push("/user_page_setting"));
    await expect(
      page.getByRole("heading", { name: "ユーザー画面制御" })
    ).toBeVisible();
    await expect(page.locator(".switch-button")).toHaveCount(24);
  };

  test("トグルは一項目だけ即時送信し、保存中の再操作を防ぐ", async ({
    page,
  }) => {
    await page.route("**/user_page_settings/1", async (route) => {
      if (route.request().method() === "PATCH") {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      await route.continue();
    });
    await openSettings(page);

    const row = page.locator("tr").filter({ hasText: "代表者" });
    const toggle = row.locator(".switch-button");
    await expect(row.getByText("募集締め切り")).toBeVisible();
    const saveResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith("/user_page_settings/1") &&
        response.request().method() === "PATCH"
    );
    await toggle.click();
    await expect(row.getByText("募集中")).toBeVisible();
    await expect(toggle).toBeDisabled();
    await saveResponse;
    await expect(toggle).toBeEnabled();
    await expect(page.getByRole("button", { name: "保存" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "キャンセル" })).toHaveCount(
      0
    );

    const requests = await page.request
      .get(`${API_URL}/_e2e/requests`)
      .then((response) => response.json());
    expect(requests).toEqual([
      {
        method: "PATCH",
        path: "/user_page_settings/1",
        payload: { is_edit_user: true },
      },
    ]);
  });

  test("保存失敗時はトグルを元に戻して通知する", async ({ page }) => {
    await openSettings(page);
    await page.request.post(`${API_URL}/_e2e/next-setting-update-status`, {
      data: { status: 422 },
    });

    const row = page.locator("tr").filter({ hasText: "代表者" });
    await row.locator(".switch-button").click();

    await expect(row.getByText("募集締め切り")).toBeVisible();
    await expect(
      page.getByText(
        "変更を保存できませんでした。時間をおいて再度お試しください。"
      )
    ).toBeVisible();
    await expect(row.locator(".switch-button")).toBeEnabled();
  });

  test("開催年は選択直後に保存し、失敗時には選択を戻す", async ({ page }) => {
    await openSettings(page);
    const yearSelect = page.locator("select");
    await expect(yearSelect).toHaveValue("1");

    await yearSelect.selectOption("2");
    await expect(yearSelect).toHaveValue("2");
    await expect
      .poll(async () =>
        page.request
          .get(`${API_URL}/_e2e/requests`)
          .then((response) => response.json())
      )
      .toEqual([
        {
          method: "PATCH",
          path: "/user_page_settings/1",
          payload: { fes_year_id: 2 },
        },
      ]);

    await page.request.post(`${API_URL}/_e2e/next-setting-update-status`, {
      data: { status: 422 },
    });
    await yearSelect.selectOption("1");
    await expect(yearSelect).toHaveValue("2");
    await expect(
      page.getByText(
        "変更を保存できませんでした。時間をおいて再度お試しください。"
      )
    ).toBeVisible();
  });

  test("初期取得に失敗した場合はトグルを表示しない", async ({ page }) => {
    await page.route("**/user_page_settings", (route) => route.abort());
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() => window.$nuxt.$router.push("/user_page_setting"));

    await expect(
      page
        .getByText(
          "設定を読み込めませんでした。ページを再読み込みしてください。"
        )
        .first()
    ).toBeVisible();
    await expect(page.locator(".switch-button")).toHaveCount(0);
  });
});
