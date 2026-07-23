const { expect, test } = require("@playwright/test");

const API_URL = process.env.PLAYWRIGHT_ADMIN_API_URL || "http://localhost:3000";
const PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD || "gidaifes";

const USERS = {
  manager:
    process.env.PLAYWRIGHT_ADMIN_MANAGER_EMAIL || "nutfes-taro@email.com",
  staff: process.env.PLAYWRIGHT_ADMIN_STAFF_EMAIL || "nutfes-jiro@email.com",
  participant:
    process.env.PLAYWRIGHT_ADMIN_PARTICIPANT_EMAIL || "nutfes-saburo@email.com",
};

const login = async (page, email) => {
  await page.goto("/");
  await page.locator('input[placeholder="email"]').fill(email);
  await page.locator('input[placeholder="password"]').fill(PASSWORD);
  await page.getByRole("button", { name: "login" }).click();
};

test.describe("admin real API access control", () => {
  test("ログイン画面では保護APIを呼ばない", async ({ page }) => {
    const businessResponses = [];
    const apiOrigin = new URL(API_URL).origin;

    page.on("response", (response) => {
      const url = new URL(response.url());
      if (url.origin === apiOrigin && !url.pathname.startsWith("/api/auth")) {
        businessResponses.push({
          path: url.pathname,
          status: response.status(),
        });
      }
    });

    await page.goto("/");
    await expect(page.locator(".login")).toBeVisible();
    await page.waitForTimeout(500);

    expect(businessResponses).toEqual([]);
  });

  for (const role of ["manager", "staff"]) {
    test(`${role}はログイン後にダッシュボードを開き、リロードできる`, async ({
      page,
    }) => {
      const dashboardResponse = page.waitForResponse(
        (response) =>
          response.url() === `${API_URL}/api/v1/dashboard` &&
          response.request().method() === "GET"
      );

      await login(page, USERS[role]);

      expect((await dashboardResponse).status()).toBe(200);
      await expect(page).toHaveURL(/\/dashboard$/);
      await expect(
        page.getByRole("heading", { name: "ダッシュボード" })
      ).toBeVisible();

      const reloadResponse = page.waitForResponse(
        (response) =>
          response.url() === `${API_URL}/api/v1/dashboard` &&
          response.request().method() === "GET"
      );
      await page.reload();

      expect((await reloadResponse).status()).toBe(200);
      await expect(
        page.getByRole("heading", { name: "ダッシュボード" })
      ).toBeVisible();
    });
  }

  test("participantはadminのダッシュボードAPIを利用できない", async ({
    page,
  }) => {
    const dashboardResponse = page.waitForResponse(
      (response) =>
        response.url() === `${API_URL}/api/v1/dashboard` &&
        response.request().method() === "GET"
    );

    await login(page, USERS.participant);

    expect((await dashboardResponse).status()).toBe(403);
    await expect(
      page.getByRole("heading", { name: "ダッシュボード" })
    ).toHaveCount(0);
  });
});
