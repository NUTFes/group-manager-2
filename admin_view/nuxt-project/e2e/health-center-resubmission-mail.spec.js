const { expect, test } = require("@playwright/test");

const API_URL = process.env.PLAYWRIGHT_ADMIN_API_URL || "http://127.0.0.1:3201";

test.describe("保健所提出書類確認画面の再提出メール", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("auth.strategy", "local");
      window.localStorage.setItem("auth._token.local", "Bearer e2e-token");
      window.localStorage.setItem("access-token", "e2e-token");
      window.localStorage.setItem("client", "e2e-client");
      window.localStorage.setItem("uid", "admin@example.com");
      window.localStorage.setItem("token-type", "Bearer");
    });

    await page.request.delete(`${API_URL}/_e2e/requests`);
  });

  // 再提出画面のテスト送信導線。
  // 画面上の団体名・代表者名・コメント本文をtemplate_valuesとして送信APIへ渡すことを確認する。
  test("再提出メールをテスト送信できる", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() =>
      window.$nuxt.$router.push("/health_center_document_review/1")
    );

    await expect(page.getByText("メッセージ")).toBeVisible();
    await expect(page.getByText("技大祭企画")).toBeVisible();
    await expect(page.getByText("代表者: 山田太郎")).toBeVisible();

    await page.getByLabel("テスト送信先").fill("reviewer@example.com");
    await page
      .getByPlaceholder("メールで送信するコメント")
      .fill("食品名を修正してください。");
    await page.getByRole("button", { name: "テスト送信" }).click();
    await expect(page.getByText("テストメールを送信しました")).toBeVisible();

    const requests = await page.request
      .get(`${API_URL}/_e2e/requests`)
      .then((response) => response.json());
    const mailRequest = requests.find(
      (request) => request.path === "/api/v1/mail_deliveries"
    );

    expect(mailRequest).toEqual({
      method: "POST",
      path: "/api/v1/mail_deliveries",
      payload: {
        to: "reviewer@example.com",
        subject: "【GM再提出】修正をお願いします",
        body: "{group_name} 代表 {user_name} 様\n\n{resubmit_memo}",
        template_values: {
          group_name: "技大祭企画",
          user_name: "山田太郎",
          resubmit_memo: "食品名を修正してください。",
        },
      },
    });
  });
});
