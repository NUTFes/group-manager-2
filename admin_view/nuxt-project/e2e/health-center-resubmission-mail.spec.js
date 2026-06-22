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

  // 正常系: 再提出画面の送信前プレビューを経由したメッセージ送信導線。
  // テンプレート選択とコメント入力後、送信前プレビューを確認してからコメント登録APIとメール送信APIへ渡すことを検証する。
  test("再提出メッセージ送信時にメールも送信できる", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() =>
      window.$nuxt.$router.push("/health_center_document_review/1")
    );

    await expect(page.getByText("メッセージ")).toBeVisible();
    await expect(page.getByText("技大祭企画")).toBeVisible();
    await expect(page.getByText("代表者: 山田太郎")).toBeVisible();
    await expect(page.locator("#message-template-select")).toHaveValue("");

    const commentTextarea = page.locator(".comment-textarea");
    await commentTextarea.scrollIntoViewIfNeeded();
    await commentTextarea.fill("食品名を修正してください。", { force: true });

    const sendButton = page.getByRole("button", { name: "送信" });
    await expect(sendButton).toBeDisabled();
    await page.locator("#message-template-select").selectOption("1");
    await expect(sendButton).toBeEnabled();
    await sendButton.scrollIntoViewIfNeeded();
    await sendButton.click();
    const previewModal = page.locator(".edit-modal");
    await expect(previewModal.getByText("送信内容の確認")).toBeVisible();
    await expect(previewModal.getByText("representative@example.com")).toBeVisible();
    await expect(
      previewModal.getByText("【GM再提出】修正をお願いします")
    ).toBeVisible();
    await expect(
      previewModal.getByText("技大祭企画 代表 山田太郎 様")
    ).toBeVisible();
    await expect(
      previewModal.getByText("食品名を修正してください。")
    ).toBeVisible();

    const requestsBeforeConfirm = await page.request
      .get(`${API_URL}/_e2e/requests`)
      .then((response) => response.json());
    expect(requestsBeforeConfirm).toEqual([]);

    await page.getByRole("button", { name: "送信する" }).click();
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

  // 異常系: テンプレート未選択またはコメント未入力では送信できない。
  // 必須入力が欠けている間は送信ボタンが無効で、プレビュー表示やAPI送信が発生しないことを検証する。
  test("テンプレート未選択またはコメント未入力では送信できない", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() =>
      window.$nuxt.$router.push("/health_center_document_review/1")
    );

    await expect(page.getByText("メッセージ")).toBeVisible();
    const sendButton = page.getByRole("button", { name: "送信" });
    const commentTextarea = page.locator(".comment-textarea");

    await expect(page.locator("#message-template-select")).toHaveValue("");
    await expect(sendButton).toBeDisabled();

    await page.locator("#message-template-select").selectOption("1");
    await expect(sendButton).toBeDisabled();

    await page.locator("#message-template-select").selectOption("");
    await commentTextarea.fill("食品名を修正してください。", { force: true });
    await expect(sendButton).toBeDisabled();
    await expect(page.locator(".edit-modal")).toHaveCount(0);

    const requests = await page.request
      .get(`${API_URL}/_e2e/requests`)
      .then((response) => response.json());
    expect(requests).toEqual([]);
  });

  // 異常系: メール送信APIが失敗した場合の表示。
  // プレビュー確定後にメール送信APIがエラーを返した場合、失敗メッセージを表示して成功扱いにしないことを検証する。
  test("メール送信APIが失敗した場合は失敗メッセージを表示する", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() =>
      window.$nuxt.$router.push("/health_center_document_review/1")
    );

    await expect(page.getByText("メッセージ")).toBeVisible();
    await page.locator("#message-template-select").selectOption("1");
    await page.locator(".comment-textarea").fill("送信失敗テスト", { force: true });
    await page.getByRole("button", { name: "送信" }).click();
    await expect(page.locator(".edit-modal").getByText("送信内容の確認")).toBeVisible();

    await page.getByRole("button", { name: "送信する" }).click();
    await expect(page.getByText("メッセージの送信に失敗しました")).toBeVisible();

    const requests = await page.request
      .get(`${API_URL}/_e2e/requests`)
      .then((response) => response.json());
    expect(requests).toContainEqual(
      expect.objectContaining({
        method: "POST",
        path: "/api/v1/mail_deliveries",
        payload: expect.objectContaining({
          template_values: expect.objectContaining({
            resubmit_memo: "送信失敗テスト",
          }),
        }),
      })
    );
  });
});
