const { expect, test } = require("@playwright/test");

const API_URL = process.env.PLAYWRIGHT_ADMIN_API_URL || "http://127.0.0.1:3201";

test.describe("物品割り当ての備考", () => {
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

  test("割り当てごとの備考を保存し、再読み込み後も表示できる", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() => window.$nuxt.$router.push("/assign_items"));

    await expect(
      page.getByRole("heading", { name: "物品割り当て" })
    ).toBeVisible();
    await expect(
      page.locator(".assignment-item").getByText("テント企画")
    ).toBeVisible();

    const remarkInput = page.getByLabel("机の備考");
    await expect(remarkInput).toBeEnabled();
    await expect(remarkInput).toHaveValue("");

    await remarkInput.fill("1、2、長岡高専A");
    await remarkInput.press("Tab");

    await expect
      .poll(() =>
        page.request
          .get(`${API_URL}/_e2e/requests`)
          .then((response) => response.json())
      )
      .toEqual([
        {
          method: "PUT",
          path: "/assign_rental_items/1",
          payload: { remark: "1、2、長岡高専A" },
        },
      ]);

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("机の備考")).toHaveValue("1、2、長岡高専A");
  });
});
