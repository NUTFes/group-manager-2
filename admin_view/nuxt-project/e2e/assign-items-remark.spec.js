const { expect, test } = require("@playwright/test");

const API_URL = process.env.PLAYWRIGHT_ADMIN_API_URL || "http://127.0.0.1:3201";

const openAssignItems = async (page) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(window.$nuxt));
  await page.evaluate(() => window.$nuxt.$router.push("/assign_items"));
  await expect(
    page.getByRole("heading", { name: "物品割り当て" })
  ).toBeVisible();
};

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
    await openAssignItems(page);
    const assignmentCard = page
      .locator(".assignment-item")
      .filter({ hasText: "テント企画" });
    await expect(assignmentCard.getByText("テント企画")).toBeVisible();
    await expect(
      assignmentCard
        .locator(".assignment-actions")
        .getByRole("button", { name: "テント企画の割り当てを削除" })
    ).toBeVisible();
    await expect(
      assignmentCard.getByRole("button", { name: /保存/ })
    ).toHaveCount(0);
    await expect(
      assignmentCard.locator(".assign-input-group").first()
    ).toContainText("机");

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
          payload: { num: 2, remark: "1、2、長岡高専A" },
        },
      ]);

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("机の備考")).toHaveValue("1、2、長岡高専A");
  });

  test("未割り当ての物品に備考だけを入力した場合は保存せず警告する", async ({
    page,
  }) => {
    await openAssignItems(page);

    await page.getByLabel("椅子の備考").fill("椅子A");
    let dialogMessage = "";
    page.once("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });
    await page.getByLabel("椅子の備考").press("Tab");
    expect(dialogMessage).toContain(
      "椅子の備考を保存するには、個数を1以上にしてください。"
    );

    expect(
      await page.request
        .get(`${API_URL}/_e2e/requests`)
        .then((response) => response.json())
    ).toEqual([]);
    await expect(page.getByLabel("椅子の備考")).toHaveValue("");
  });

  test("保存済みの値から変更がなければAPIを呼ばない", async ({ page }) => {
    await openAssignItems(page);

    await page.getByLabel("机の割り当て個数").focus();
    await page.getByLabel("机の割り当て個数").press("Tab");
    await page.getByLabel("机の備考").focus();
    await page.getByLabel("机の備考").press("Tab");

    expect(
      await page.request
        .get(`${API_URL}/_e2e/requests`)
        .then((response) => response.json())
    ).toEqual([]);
  });

  test("保存に失敗した場合はエラーを表示して保存済みの値へ戻す", async ({
    page,
  }) => {
    await openAssignItems(page);
    await page.request.post(`${API_URL}/_e2e/failure`, {
      data: { path: "/assign_rental_items/1" },
    });

    let dialogMessage = "";
    page.once("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });
    await page.getByLabel("机の備考").fill("保存できない備考");
    await page.getByLabel("机の備考").press("Tab");

    await expect
      .poll(() => dialogMessage)
      .toContain("割り当ての保存に失敗しました");
    await expect(page.getByLabel("机の備考")).toHaveValue("");
  });

  test("重複レコードでは表示した備考と同じ最小IDを更新する", async ({
    page,
  }) => {
    await page.request.put(`${API_URL}/_e2e/assign-rental-items`, {
      data: {
        items: [
          {
            id: 9,
            group_id: 1,
            rental_item_id: 1,
            stocker_place_id: 1,
            num: 3,
            remark: "後続レコード",
          },
          {
            id: 3,
            group_id: 1,
            rental_item_id: 1,
            stocker_place_id: 1,
            num: 2,
            remark: "表示対象レコード",
          },
        ],
      },
    });
    await openAssignItems(page);

    await expect(page.getByLabel("机の割り当て個数")).toHaveValue("5");
    await expect(page.getByLabel("机の備考")).toHaveValue("表示対象レコード");
    await page.getByLabel("机の備考").fill("更新後の備考");
    await page.getByLabel("机の備考").press("Enter");

    await expect
      .poll(() =>
        page.request
          .get(`${API_URL}/_e2e/requests`)
          .then((response) => response.json())
      )
      .toEqual([
        {
          method: "PUT",
          path: "/assign_rental_items/3",
          payload: { num: 2, remark: "更新後の備考" },
        },
      ]);
  });

  test("新規割り当てはドロップ時に登録し、その後の備考を入力終了時に保存する", async ({
    page,
  }) => {
    await page.request.delete(`${API_URL}/_e2e/assign-rental-items`);
    await openAssignItems(page);

    await page.locator(".group-card").dragTo(page.locator(".stock-card"));
    const remarkInput = page.getByLabel("机の備考");
    const assignmentActions = page
      .locator(".assignment-item")
      .filter({ hasText: "テント企画" })
      .locator(".assignment-actions");
    const deleteButton = assignmentActions.getByRole("button", {
      name: "テント企画の割り当てを削除",
    });
    await expect(
      assignmentActions.getByRole("button", { name: /保存/ })
    ).toHaveCount(0);
    await expect(deleteButton).toBeVisible();

    await expect
      .poll(() =>
        page.request
          .get(`${API_URL}/_e2e/requests`)
          .then((response) => response.json())
      )
      .toEqual([
        {
          method: "POST",
          path: "/assign_rental_items",
          payload: {
            items: [{ group_id: 1, num: 2, remark: null }],
            rentalItemId: 1,
            stockerPlaceId: 1,
          },
        },
      ]);

    await expect(remarkInput).toBeEnabled();
    await remarkInput.fill("長岡高専A");
    await remarkInput.press("Enter");

    await expect
      .poll(() =>
        page.request
          .get(`${API_URL}/_e2e/requests`)
          .then((response) => response.json())
      )
      .toEqual([
        {
          method: "POST",
          path: "/assign_rental_items",
          payload: {
            items: [{ group_id: 1, num: 2, remark: null }],
            rentalItemId: 1,
            stockerPlaceId: 1,
          },
        },
        {
          method: "PUT",
          path: "/assign_rental_items/1",
          payload: { num: 2, remark: "長岡高専A" },
        },
      ]);
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
