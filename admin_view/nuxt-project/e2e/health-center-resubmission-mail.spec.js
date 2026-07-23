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
  // テンプレート選択で本文欄に展開済み本文が入り、送信前プレビューを確認してから送信付きコメント登録APIへ渡すことを検証する。
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

    const sendButton = page.getByRole("button", { name: "送信" });
    await expect(sendButton).toBeDisabled();
    const commentTextarea = page.locator(".comment-textarea");
    await expect(commentTextarea).toBeDisabled();
    await page.locator("#message-template-select").selectOption("1");
    await expect(commentTextarea).toBeEnabled();
    await expect(commentTextarea).toHaveValue(
      "技大祭企画 代表 山田太郎 様\n\n食品名を修正してください。"
    );
    await expect(sendButton).toBeEnabled();
    await sendButton.scrollIntoViewIfNeeded();
    await sendButton.click();
    const previewModal = page.locator(".edit-modal");
    await expect(previewModal.getByText("送信内容の確認")).toBeVisible();
    await expect(
      previewModal.getByText("representative@example.com")
    ).toBeVisible();
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
    await expect(page.getByText("送信しました", { exact: true })).toBeVisible();

    const requests = await page.request
      .get(`${API_URL}/_e2e/requests`)
      .then((response) => response.json());
    expect(requests).toEqual([
      {
        method: "POST",
        path: "/api/v1/create_health_center_submission_status_comment_mail",
        payload: {
          group_id: 1,
          application_type: "food_product",
          message_template_id: 1,
          body: "技大祭企画 代表 山田太郎 様\n\n食品名を修正してください。",
        },
      },
    ]);
  });

  // 異常系: テンプレート未選択または本文未入力では送信できない。
  // 必須入力が欠けている間は送信ボタンが無効で、プレビュー表示やAPI送信が発生しないことを検証する。
  test("テンプレート未選択またはコメント未入力では送信できない", async ({
    page,
  }) => {
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
    await expect(commentTextarea).toBeDisabled();

    await page.locator("#message-template-select").selectOption("1");
    await expect(commentTextarea).toBeEnabled();
    await expect(sendButton).toBeEnabled();
    await commentTextarea.fill("", { force: true });
    await expect(sendButton).toBeDisabled();
    await page.locator("#message-template-select").selectOption("");
    await expect(commentTextarea).toBeDisabled();
    await expect(commentTextarea).toHaveValue("");
    await expect(page.locator(".edit-modal")).toHaveCount(0);

    const requests = await page.request
      .get(`${API_URL}/_e2e/requests`)
      .then((response) => response.json());
    expect(requests).toEqual([]);
  });

  // 異常系: メール送信が失敗した場合の表示。
  // APIがfailedコメントを残してエラーを返した場合、履歴から再送信できることを検証する。
  test("メール送信が失敗した場合は履歴から再送信できる", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() =>
      window.$nuxt.$router.push("/health_center_document_review/1")
    );

    await expect(page.getByText("メッセージ")).toBeVisible();
    await page.locator("#message-template-select").selectOption("1");
    await page
      .locator(".comment-textarea")
      .fill("送信失敗テスト", { force: true });
    await page.getByRole("button", { name: "送信" }).click();
    await expect(
      page.locator(".edit-modal").getByText("送信内容の確認")
    ).toBeVisible();

    await page.getByRole("button", { name: "送信する" }).click();
    await expect(
      page.getByText("送信に失敗しました", { exact: true })
    ).toBeVisible();
    await expect(page.getByText("エラー", { exact: true })).toBeVisible();
    await page.getByText("2026/06/21").click();
    await page.getByRole("button", { name: "再送信" }).click();
    await expect(
      page.getByText("再送信しました", { exact: true })
    ).toBeVisible();

    const requests = await page.request
      .get(`${API_URL}/_e2e/requests`)
      .then((response) => response.json());
    expect(requests).toEqual([
      {
        method: "POST",
        path: "/api/v1/create_health_center_submission_status_comment_mail",
        payload: {
          group_id: 1,
          application_type: "food_product",
          message_template_id: 1,
          body: "送信失敗テスト",
        },
      },
      {
        method: "POST",
        path: "/api/v1/resend_health_center_submission_status_comment_mail/1",
        payload: {},
      },
    ]);
  });

  // 異常系: 認証切れなどで401が返った場合の再ログイン導線。
  // 401時に通常のエラー画面ではなく再ログイン案内ページへ遷移し、ログイン画面へ戻れることを検証する。
  test("401が返った場合は再ログイン案内ページへ遷移する", async ({ page }) => {
    await page.route(
      `${API_URL}/api/v1/get_group_show_for_admin_view/1`,
      (route) =>
        route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ error: "Unauthorized" }),
        })
    );

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() =>
      window.$nuxt.$router.push("/health_center_document_review/1")
    );

    await expect(
      page.getByRole("heading", { name: "再度ログインしてください" })
    ).toBeVisible();
    await page.getByRole("button", { name: "ログイン画面に戻る" }).click();
    await expect(page.locator(".login")).toBeVisible();
  });
});
