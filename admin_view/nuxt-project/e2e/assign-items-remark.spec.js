const { expect, test } = require("@playwright/test");

const API_URL = process.env.PLAYWRIGHT_ADMIN_API_URL || "http://127.0.0.1:3201";

test.describe("物品割り当ての備考", () => {
  test.describe.configure({ timeout: 60_000 });

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
    const assignmentCard = page
      .locator(".assignment-item")
      .filter({ hasText: "テント企画" });
    await expect(assignmentCard.getByText("テント企画")).toBeVisible();
    await expect(
      assignmentCard
        .locator(".assignment-actions")
        .getByRole("button", { name: "テント企画の割り当てを削除" })
    ).toBeVisible();
    await expect(assignmentCard.locator(".assign-input-group")).toContainText(
      "机"
    );

    const remarkInput = page.getByLabel("机の備考");
    const numInput = page.getByLabel("机の割り当て個数");
    await expect(remarkInput).toBeEnabled();
    await expect(remarkInput).toHaveValue("");

    const numBox = await numInput.boundingBox();
    const remarkBox = await remarkInput.boundingBox();
    expect(numBox).not.toBeNull();
    expect(remarkBox).not.toBeNull();
    expect(remarkBox.y).toBeGreaterThan(numBox.y);

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

  test("新規割り当てで数量と備考を一緒に登録できる", async ({ page }) => {
    await page.request.delete(`${API_URL}/_e2e/assign-rental-items`);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() => window.$nuxt.$router.push("/assign_items"));

    await page.locator(".group-card").dragTo(page.locator(".stock-card"));
    const remarkInput = page.getByLabel("机の備考");
    const assignmentActions = page
      .locator(".assignment-item")
      .filter({ hasText: "テント企画" })
      .locator(".assignment-actions");
    const saveButton = assignmentActions.getByRole("button", {
      name: "テント企画の割り当てを保存",
    });
    const deleteButton = assignmentActions.getByRole("button", {
      name: "テント企画の割り当てを削除",
    });
    await expect(saveButton).toBeVisible();
    await expect(deleteButton).toBeVisible();

    const saveBox = await saveButton.boundingBox();
    const deleteBox = await deleteButton.boundingBox();
    expect(saveBox).not.toBeNull();
    expect(deleteBox).not.toBeNull();
    expect(Math.abs(saveBox.y - deleteBox.y)).toBeLessThan(8);

    await remarkInput.fill("長岡高専A");
    await saveButton.click();

    await expect
      .poll(() =>
        page.request
          .get(`${API_URL}/_e2e/requests`)
          .then((response) => response.json())
      )
      .toContainEqual({
        method: "POST",
        path: "/assign_rental_items",
        payload: {
          items: [{ group_id: 1, num: 2, remark: "長岡高専A" }],
          rentalItemId: 1,
          stockerPlaceId: 1,
        },
      });

    await expect(
      page.getByRole("button", { name: "テント企画の割り当てを保存" })
    ).toHaveCount(0);
  });

  test("在庫登録画面で数量と備考を一緒に登録できる", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() => window.$nuxt.$router.push("/stock_items/1"));

    await page.locator(".assign-add-button").click();
    await page
      .locator(".assign-item-name-select")
      .selectOption({ label: "机" });
    await page
      .locator(".assign-item-list-group-select")
      .selectOption({ label: "テント企画" });
    const groupSelect = page.locator(".assign-item-list-group-select");
    const numInput = page.locator(".assign-item-list-num-input");
    const remarkInput = page.getByLabel("割当1の備考");
    const assignRow = page.locator(".assign-item-list");
    const modalActions = page.locator(".assign-item-add-modal__actions");
    await expect(assignRow.locator(".assign-item-list-header")).toContainText(
      "1件目"
    );
    await expect(
      assignRow.getByRole("button", { name: "割当1を削除" })
    ).toBeVisible();
    await expect(
      modalActions.getByRole("button", { name: "団体を追加" })
    ).toBeVisible();
    await expect(
      modalActions.getByRole("button", { name: "キャンセル" })
    ).toBeVisible();
    await expect(
      modalActions.getByRole("button", { name: "登録" })
    ).toBeVisible();
    await numInput.fill("4");
    await remarkInput.fill("長岡高専A");

    const groupBox = await groupSelect.boundingBox();
    const numBox = await numInput.boundingBox();
    const remarkBox = await remarkInput.boundingBox();
    expect(groupBox).not.toBeNull();
    expect(numBox).not.toBeNull();
    expect(remarkBox).not.toBeNull();
    expect(numBox.x).toBeGreaterThan(groupBox.x);
    expect(remarkBox.x).toBeGreaterThan(numBox.x);
    expect(remarkBox.width).toBeGreaterThan(numBox.width);

    const addButtonBox = await modalActions
      .getByRole("button", { name: "団体を追加" })
      .boundingBox();
    const submitButtonBox = await modalActions
      .getByRole("button", { name: "登録" })
      .boundingBox();
    expect(addButtonBox).not.toBeNull();
    expect(submitButtonBox).not.toBeNull();
    expect(Math.abs(addButtonBox.y - submitButtonBox.y)).toBeLessThan(8);

    await page.getByRole("button", { name: "登録" }).click();

    await expect
      .poll(() =>
        page.request
          .get(`${API_URL}/_e2e/requests`)
          .then((response) => response.json())
      )
      .toContainEqual({
        method: "POST",
        path: "/assign_rental_items",
        payload: {
          items: [{ group_id: 1, num: 4, remark: "長岡高専A" }],
          rentalItemId: 1,
          stockerPlaceId: "1",
        },
      });
  });

  test("在庫登録画面で数量と備考を一緒に更新できる", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.$nuxt));
    await page.evaluate(() => window.$nuxt.$router.push("/stock_items/1"));

    await page
      .getByRole("row")
      .filter({ hasText: "テント企画" })
      .locator("btn", { hasText: "編集" })
      .click();
    await page.getByRole("spinbutton").last().fill("3");
    await page.getByLabel("割当の備考").fill("入口1番");
    await page.getByRole("button", { name: "編集" }).last().click();

    await expect
      .poll(() =>
        page.request
          .get(`${API_URL}/_e2e/requests`)
          .then((response) => response.json())
      )
      .toContainEqual({
        method: "PUT",
        path: "/assign_rental_items/1",
        payload: { num: 3, remark: "入口1番" },
      });
  });
});
