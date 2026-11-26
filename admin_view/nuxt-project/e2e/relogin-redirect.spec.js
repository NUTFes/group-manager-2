const { expect, test } = require("@playwright/test");

const API_URL = process.env.PLAYWRIGHT_ADMIN_API_URL || "http://127.0.0.1:3201";

const login = async (page) => {
  await page.locator(".login input[type='text']").fill("e2e@example.com");
  await page.locator(".login input[type='password']").fill("password");
  await page.getByRole("button", { name: "login" }).click();
};

const setLoggedInStorage = (page) =>
  page.evaluate(() => {
    window.localStorage.setItem("auth.strategy", "local");
    window.localStorage.setItem("auth._token.local", "Bearer e2e-token");
    window.localStorage.setItem("access-token", "e2e-token");
    window.localStorage.setItem("client", "e2e-client");
    window.localStorage.setItem("uid", "e2e@example.com");
    window.localStorage.setItem("token-type", "Bearer");
  });

// ログイン済みの状態で対象ページへクライアント遷移し、APIの401で再ログイン案内ページへ送られるまで進める。
const expireSessionOn = async (page, fullPath, apiPath) => {
  await page.request.post(`${API_URL}/_e2e/unauthorized`, {
    data: { path: apiPath },
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await setLoggedInStorage(page);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(window.$nuxt));
  await page.evaluate((path) => window.$nuxt.$router.push(path), fullPath);

  await expect(
    page.getByRole("heading", { name: "再度ログインしてください" })
  ).toBeVisible();
  await page.getByRole("button", { name: "ログイン画面に戻る" }).click();
  await expect(page.locator(".login")).toBeVisible();

  // 再ログイン後は同じAPIが成功する状態に戻す。
  await page.request.delete(`${API_URL}/_e2e/requests`);
};

test.describe("再ログイン後の遷移先", () => {
  test.beforeEach(async ({ page }) => {
    await page.request.delete(`${API_URL}/_e2e/requests`);
  });

  // 正常系: ログイン切れで再ログインした場合、クエリを含む直前のページへ戻ることを検証する。
  test("401で再ログインすると直前に見ていたページへ戻る", async ({ page }) => {
    await expireSessionOn(
      page,
      "/message_templates?tab=en",
      "/api/v1/message_templates"
    );

    await login(page);

    await expect(page).toHaveURL(/\/message_templates\?tab=en$/);
    await expect(page.getByText("メールテンプレート管理")).toBeVisible();
  });

  // 正常系: ログイン切れを経由しない通常ログインでは、従来どおりダッシュボードへ遷移することを検証する。
  test("通常のログインではダッシュボードへ遷移する", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));

    await login(page);

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  // 状態遷移: 復帰先は一度使うと消え、次のログインでは前回の復帰先へ飛ばされないことを検証する。
  test("復帰した後の次のログインではダッシュボードへ遷移する", async ({
    page,
  }) => {
    await expireSessionOn(
      page,
      "/message_templates",
      "/api/v1/message_templates"
    );
    await login(page);
    await expect(page).toHaveURL(/\/message_templates$/);

    // 再認証ページの導線でトークンだけを消し、ストレージの他の値は残したままログイン画面へ戻る。
    await page.evaluate(() =>
      window.$nuxt.$router.push("/reauthentication_required")
    );
    await page.getByRole("button", { name: "ログイン画面に戻る" }).click();
    await expect(page.locator(".login")).toBeVisible();

    await login(page);

    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
