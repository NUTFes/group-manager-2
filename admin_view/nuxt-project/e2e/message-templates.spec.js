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

  // テストケース: テンプレート管理画面の主要導線。
  // 新規作成、編集、複製がそれぞれモーダル経由で実行され、期待するAPI payloadが送られることを確認する。
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
});
