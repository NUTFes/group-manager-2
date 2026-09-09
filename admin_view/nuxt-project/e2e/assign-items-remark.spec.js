const { expect, test } = require("@playwright/test");

const API_URL = process.env.PLAYWRIGHT_ADMIN_API_URL || "http://127.0.0.1:3201";

// 物品割り当て画面の備考欄。入力終了時(blur / Enter)に個数と同じ経路で保存されることを固定する。
const authenticate = async (page) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("auth.strategy", "local");
    window.localStorage.setItem("auth._token.local", "Bearer e2e-token");
    window.localStorage.setItem("access-token", "e2e-token");
    window.localStorage.setItem("client", "e2e-client");
    window.localStorage.setItem("uid", "admin@example.com");
    window.localStorage.setItem("token-type", "Bearer");
  });
};

const jsonBody = (data) =>
  JSON.stringify({ status: { code: 200, message: "Success" }, data });

// 画面が必要とするマスターデータを stub する。assign_rental_items だけは
// PUT で書き換わった値を後続の GET へ反映できるよう、状態を閉じ込める。
// opts.delayFirstPutMs: 1本目の PUT 応答だけ遅らせ、逆順到着を誘発する。
const setupAssignItems = async (page, opts = {}) => {
  const state = {
    assigns: [
      {
        id: 1,
        group_id: 1,
        stocker_place_id: 1,
        rental_item_id: 1,
        num: 2,
        remark: "",
      },
    ],
  };
  const putPayloads = [];
  const putOrder = []; // 受信順（"num" / "remark"）
  let putCount = 0;

  const routes = {
    "**/fes_years": jsonBody([{ id: 1, year_num: 2026 }]),
    "**/group_categories": jsonBody([{ id: 1, name: "一般企画" }]),
    "**/rental_items": jsonBody([
      { id: 1, name: "机" },
      { id: 2, name: "椅子" },
    ]),
    "**/groups": jsonBody([
      { id: 1, name: "テント企画", group_category_id: 1, fes_year_id: 1 },
    ]),
    "**/rental_orders": jsonBody([
      { id: 1, group_id: 1, rental_item_id: 1, num: 5 },
    ]),
    "**/stocker_items": jsonBody([
      { stocker_place_id: 1, rental_item_id: 1, num: 10 },
    ]),
    "**/stocker_places": jsonBody([{ id: 1, name: "物品倉庫" }]),
    "**/rentable_items": jsonBody([]),
  };

  for (const [pattern, body] of Object.entries(routes)) {
    await page.route(pattern, (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body })
    );
  }

  let nextId = 100;
  await page.route("**/assign_rental_items", async (route) => {
    if (route.request().method() === "POST") {
      const payload = route.request().postDataJSON();
      const created = (payload.items || []).map((it) => ({
        id: nextId++,
        group_id: it.group_id,
        stocker_place_id: Number(payload.stockerPlaceId),
        rental_item_id: Number(payload.rentalItemId),
        num: it.num,
        remark: it.remark || "",
      }));
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: jsonBody(created),
      });
      return;
    }
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: jsonBody(state.assigns),
    });
  });

  await page.route("**/assign_rental_items/1", async (route) => {
    const payload = route.request().postDataJSON();
    putPayloads.push(payload);
    putOrder.push("num" in payload ? "num" : "remark");
    putCount += 1;

    if (opts.delayFirstPutMs && putCount === 1) {
      await new Promise((r) => setTimeout(r, opts.delayFirstPutMs));
    }

    // 部分更新: 送られてきた項目だけ反映する
    if ("num" in payload) state.assigns[0].num = payload.num;
    if ("remark" in payload) state.assigns[0].remark = payload.remark || "";

    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: jsonBody(state.assigns[0]),
    });
  });

  return { putPayloads, putOrder, state };
};

const expectAssignItemsVisible = (page) =>
  expect(page.getByRole("heading", { name: "物品割り当て" })).toBeVisible();

const openAssignItems = async (page) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(window.$nuxt));
  await page.evaluate(() => window.$nuxt.$router.push("/assign_items"));
  await expectAssignItemsVisible(page);
};

test.describe("物品割り当ての備考", () => {
  test.describe.configure({ timeout: 60_000 });

  test.beforeEach(async ({ page }) => {
    await authenticate(page);
    await page.request.delete(`${API_URL}/_e2e/requests`);
  });

  test("備考を入力終了時に保存し、リロード後も表示できる", async ({ page }) => {
    const { putPayloads } = await setupAssignItems(page);
    await openAssignItems(page);

    const remarkInput = page.getByLabel("机の備考");
    await expect(remarkInput).toBeEnabled();
    await expect(remarkInput).toHaveValue("");

    await remarkInput.fill("テント1・2（正面入口側）");
    await remarkInput.press("Tab");

    await expect
      .poll(() => putPayloads)
      .toEqual([{ remark: "テント1・2（正面入口側）" }]);

    // リロードして再取得しても保存済みの備考が表示されること
    await page.reload({ waitUntil: "domcontentloaded" });
    await expectAssignItemsVisible(page);
    await expect(page.getByLabel("机の備考")).toHaveValue(
      "テント1・2（正面入口側）"
    );
  });

  test("個数変更は個数のみ・備考変更は備考のみを部分更新で送る", async ({
    page,
  }) => {
    const { putPayloads, state } = await setupAssignItems(page);
    await openAssignItems(page);

    await page.getByLabel("机の備考").fill("入口1番");
    await page.getByLabel("机の備考").press("Tab");
    await expect.poll(() => putPayloads.length).toBe(1);

    const numInput = page.getByLabel("机の割り当て個数");
    await numInput.fill("4");
    await numInput.press("Enter");
    await expect.poll(() => putPayloads.length).toBe(2);

    // 各保存は変更した項目だけを送る（相手の古い値を相乗りさせない）
    expect(putPayloads).toEqual([{ remark: "入口1番" }, { num: 4 }]);
    // どちらの保存も相手の項目を巻き戻していない
    expect(state.assigns[0]).toMatchObject({ num: 4, remark: "入口1番" });
  });

  test("応答が逆順で到着しても他方の値を巻き戻さない（部分更新＋直列化）", async ({
    page,
  }) => {
    const { putPayloads, putOrder, state } = await setupAssignItems(page, {
      delayFirstPutMs: 800,
    });
    await openAssignItems(page);

    const numInput = page.getByLabel("机の割り当て個数");
    const remarkInput = page.getByLabel("机の備考");

    await numInput.fill("4");
    await numInput.press("Tab"); // PUT#1 { num: 4 }（応答を遅延）
    await remarkInput.fill("入口1番");
    await remarkInput.press("Tab"); // PUT#2 { remark: "入口1番" }

    await expect.poll(() => putPayloads.length).toBe(2);
    // 直列化により、遅延しても受信順は必ず num -> remark
    expect(putOrder).toEqual(["num", "remark"]);
    expect(putPayloads).toEqual([{ num: 4 }, { remark: "入口1番" }]);
    expect(state.assigns[0]).toMatchObject({ num: 4, remark: "入口1番" });
  });

  test("同じ項目を連続編集しても最後の値が残る（直列化）", async ({ page }) => {
    const { putPayloads, state } = await setupAssignItems(page, {
      delayFirstPutMs: 800,
    });
    await openAssignItems(page);

    const numInput = page.getByLabel("机の割り当て個数");
    await numInput.fill("4");
    await numInput.press("Tab"); // PUT#1 { num: 4 }（応答を遅延）
    await numInput.fill("5");
    await numInput.press("Tab"); // PUT#2 { num: 5 }

    await expect.poll(() => putPayloads).toEqual([{ num: 4 }, { num: 5 }]);
    expect(state.assigns[0].num).toBe(5);
  });

  test("保存済みの値から変更がなければ保存しない", async ({ page }) => {
    const { putPayloads } = await setupAssignItems(page);
    await openAssignItems(page);

    await page.getByLabel("机の備考").focus();
    await page.getByLabel("机の備考").press("Tab");
    await page.getByLabel("机の割り当て個数").focus();
    await page.getByLabel("机の割り当て個数").press("Tab");

    await page.waitForTimeout(300);
    expect(putPayloads).toEqual([]);
  });

  test("新規ドロップ・個数0の物品に備考だけ入れると警告し、クラッシュしない", async ({
    page,
  }) => {
    await setupAssignItems(page);
    // 既存の割り当ては無い状態にする
    await page.route("**/assign_rental_items", (route) => {
      if (route.request().method() === "GET") {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: jsonBody([]),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: jsonBody([{ id: 200, num: 5 }]),
        });
      }
    });
    await openAssignItems(page);
    await page
      .locator(".group-card")
      .first()
      .dragTo(page.locator(".stock-card").first());

    // 椅子は申請が無いため個数0で割り当てられる
    const chairRemark = page.getByLabel("椅子の備考");
    await expect(chairRemark).toBeEnabled();

    // ここから先の操作中に assign.dbIds が undefined のまま参照される
    // （初期化漏れ）とここで例外が飛ぶ。無関係な既知の404等は無視する。
    const pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(String(e)));

    let dialogMessage = "";
    page.once("dialog", async (d) => {
      dialogMessage = d.message();
      await d.dismiss();
    });
    await chairRemark.fill("予備");
    await chairRemark.press("Tab");

    await expect
      .poll(() => dialogMessage)
      .toContain("個数を1以上にしてください");
    expect(pageErrors, `pageerror: ${pageErrors.join(" | ")}`).toEqual([]);
    await expect(chairRemark).toHaveValue("");
  });
});
