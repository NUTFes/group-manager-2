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

  // テストケース: 再提出画面の送信ボタンからメッセージを送信する導線。
  // コメント登録後に、画面上の団体名・代表者名・コメント本文をtemplate_valuesとして送信APIへ渡すことを確認する。
  test("再提出メッセージ送信時にメールも送信できる", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() =>
      window.$nuxt.$router.push("/health_center_document_review/1")
    );

    await expect(page.getByText("メッセージ")).toBeVisible();
    await expect(page.getByText("技大祭企画")).toBeVisible();
    await expect(page.getByText("代表者: 山田太郎")).toBeVisible();

    const commentTextarea = page.locator(".comment-textarea");
    await commentTextarea.scrollIntoViewIfNeeded();
    await commentTextarea.fill("食品名を修正してください。", { force: true });

    const sendButton = page.getByRole("button", { name: "送信" });
    await sendButton.scrollIntoViewIfNeeded();
    await sendButton.click();
    await expect(page.getByText("メッセージを送信しました")).toBeVisible();

    const requests = await page.request
      .get(`${API_URL}/_e2e/requests`)
      .then((response) => response.json());
    expect(requests).toContainEqual({
      method: "POST",
      path: "/api/v1/create_health_center_submission_status_comment",
      payload: {
        group_id: 1,
        application_type: "food_product",
        body: "食品名を修正してください。",
      },
    });

    expect(requests).toContainEqual(
      expect.objectContaining({
        method: "POST",
        path: "/api/v1/mail_deliveries",
      })
    );

    const mailRequest = requests.find(
      (request) => request.path === "/api/v1/mail_deliveries"
    );
    expect(mailRequest).toEqual({
      method: "POST",
      path: "/api/v1/mail_deliveries",
      payload: {
        to: "representative@example.com",
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
