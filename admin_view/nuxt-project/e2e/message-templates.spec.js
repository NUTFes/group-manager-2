const { expect, test } = require("@playwright/test");

const API_URL = process.env.PLAYWRIGHT_ADMIN_API_URL || "http://127.0.0.1:3201";

test.describe("メールテンプレート管理画面", () => {
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

  // 正常系: テンプレート管理画面の主要導線。
  // 新規作成、編集、複製がそれぞれモーダル経由で実行され、期待するAPI payloadが送られることを検証する。
  test("テンプレートの作成・編集・複製初期値反映ができる", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() => window.$nuxt.$router.push("/message_templates"));

    await expect(page.getByText("メールテンプレート管理")).toBeVisible();
    await expect(page.getByText("GM再提出依頼")).toBeVisible();

    await expect(page.getByRole("button", { name: "編集" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "複製" })).toBeDisabled();

    await page.getByRole("button", { name: "新規作成" }).click();
    await expect(page.getByText("メールテンプレート作成")).toBeVisible();
    await page.getByPlaceholder("例: GM再提出依頼").fill("新規テンプレート");
    await page.getByPlaceholder("件名を入力してください").fill("新規件名");
    await page.getByPlaceholder("本文を入力してください").fill("本文");
    await page.getByRole("button", { name: "団体名" }).click();
    await page.getByRole("button", { name: "保存" }).click();
    await expect(page.getByText("テンプレートを作成しました")).toBeVisible();

    await page.getByText("GM再提出依頼").click();
    await page.getByRole("button", { name: "編集" }).click();
    await expect(page.getByText("メールテンプレート編集")).toBeVisible();
    await page.getByPlaceholder("件名を入力してください").fill("更新後件名");
    await page.getByRole("button", { name: "保存" }).click();
    await expect(page.getByText("テンプレートを更新しました")).toBeVisible();

    await page
      .getByRole("cell", { name: "GM Resubmission Request", exact: true })
      .click();
    await page.getByRole("button", { name: "複製" }).click();
    await expect(page.getByText("メールテンプレート複製")).toBeVisible();
    await expect(page.getByPlaceholder("例: GM再提出依頼")).toHaveValue(
      "GM Resubmission Request copy"
    );
    await page.getByRole("button", { name: "団体名" }).click();
    await expect(page.locator("textarea")).toHaveValue(
      "Dear {user_name},\n\n{resubmit_memo}{group_name}"
    );
    await page.getByRole("button", { name: "保存" }).click();
    await expect(page.getByText("テンプレートを作成しました")).toBeVisible();

    const requests = await page.request
      .get(`${API_URL}/_e2e/requests`)
      .then((response) => response.json());

    expect(requests).toEqual([
      {
        method: "POST",
        path: "/api/v1/message_templates",
        payload: {
          locale: "ja",
          name: "新規テンプレート",
          subject: "新規件名",
          body: "本文{group_name}",
        },
      },
      {
        method: "PATCH",
        path: "/api/v1/message_templates/1",
        payload: {
          locale: "ja",
          name: "GM再提出依頼",
          subject: "更新後件名",
          body: "{group_name} 代表 {user_name} 様\n\n{resubmit_memo}",
        },
      },
      {
        method: "POST",
        path: "/api/v1/message_templates",
        payload: {
          locale: "en",
          name: "GM Resubmission Request copy",
          subject: "GM resubmission request",
          body: "Dear {user_name},\n\n{resubmit_memo}{group_name}",
        },
      },
    ]);
  });

  // 異常系: 必須項目が不足している場合の保存抑止。
  // 新規作成モーダルで必須項目が空のまま保存した場合、バリデーションメッセージを表示しAPI送信しないことを検証する。
  test("必須項目が不足している場合はテンプレートを保存しない", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() => window.$nuxt.$router.push("/message_templates"));

    await expect(page.getByText("メールテンプレート管理")).toBeVisible();
    await page.getByRole("button", { name: "新規作成" }).click();
    await expect(page.getByText("メールテンプレート作成")).toBeVisible();

    await page.getByPlaceholder("例: GM再提出依頼").fill("入力不足テンプレート");
    await page.getByRole("button", { name: "保存" }).click();
    await expect(
      page.getByText("テンプレート名、言語、件名、本文を入力してください")
    ).toBeVisible();

    const requests = await page.request
      .get(`${API_URL}/_e2e/requests`)
      .then((response) => response.json());
    expect(requests).toEqual([]);
  });

  // 異常系: テンプレート保存APIが失敗した場合の表示。
  // APIがエラーを返した場合、失敗メッセージを表示し、送信したpayloadは保持したまま成功扱いにしないことを検証する。
  test("テンプレート保存APIが失敗した場合は失敗メッセージを表示する", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() => window.$nuxt.$router.push("/message_templates"));

    await expect(page.getByText("メールテンプレート管理")).toBeVisible();
    await page.getByRole("button", { name: "新規作成" }).click();
    await expect(page.getByText("メールテンプレート作成")).toBeVisible();
    await page.getByPlaceholder("例: GM再提出依頼").fill("保存失敗テンプレート");
    await page.getByPlaceholder("件名を入力してください").fill("保存失敗件名");
    await page.getByPlaceholder("本文を入力してください").fill("保存失敗本文");
    await page.getByRole("button", { name: "保存" }).click();
    await expect(page.getByText("テンプレートの保存に失敗しました")).toBeVisible();

    const requests = await page.request
      .get(`${API_URL}/_e2e/requests`)
      .then((response) => response.json());
    expect(requests).toEqual([
      {
        method: "POST",
        path: "/api/v1/message_templates",
        payload: {
          locale: "ja",
          name: "保存失敗テンプレート",
          subject: "保存失敗件名",
          body: "保存失敗本文",
        },
      },
    ]);
  });
});
