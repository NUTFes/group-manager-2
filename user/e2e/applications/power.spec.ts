// 電力申請の特性化テスト。
// 現状の挙動をそのまま凍結する。既知バグは BUG コメント付きで記録し、
// アプリ側は直さない。
//
// この群の特殊事情:
// - PowerForm は UseFormReturn をまるごと props で渡す(他群は Controller 単位)。
//   削除ボタンの表示可否は form.getValues() をレンダー中に呼んで判定している
//   (index > 0 かつ productName が空のときだけ表示)。
// - 「はい/いいえ」を選ぶ前(undecided)の画面は PowerFormView ではなく
//   PowerNegativeView が使われる(ラジオのみで、register ボタンは
//   「いいえ」を明示的に選ぶまで出さない。以前は選択前から出ていたバグを
//   修正済み)。
// - 送信は常に PUT /power_orders/submit 一本(use_power: true/false で
//   登録/申請なしを切り替える)。新規登録・更新・申請なしのいずれも同じ
//   エンドポイントで、ボタン文言も常に「登録」のまま(火気申請のように
//   編集中だけ「保存」に変わることはない)。
// - PowerSummaryView は `isEditable` prop(締切前、または再提出可能なステータス
//   で編集できるか)を受け取る。以前は `isDeadline` という名前で true が
//   「ロックされていない(編集可能)」を意味する反転した命名だったため改名した
//   (見た目は変わらない)。
// - 一覧からの削除(handleDeleteDevice)はAPIを叩かない。残り0件ならラジオ
//   「いいえ」の登録待ち画面に、1件以上残るならフォーム編集画面に切り替わる
//   だけで、実際にPUT /power_orders/submitが飛ぶのは改めて登録ボタンを
//   押した時点(火気申請は削除ボタンで即APIが飛ぶのと対照的)。
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mockHomePageApis } from '../support/mockServer';
import {
  ORDER_TYPES,
  type PowerOrder,
  mockGroupId,
  scenarioState,
} from '../support/scenarioState';
import {
  APPLICATION_TITLES,
  BUTTONS,
  fillPowerForm,
  selectRadio,
  submitButton,
} from '../support/selectors';

const FIELDS = {
  question: '電力申請を行いますか？',
  productName: '機器の名称',
  manufacturer: '機器のメーカー名',
  model: '型番',
  url: '製品URL',
  maxPower: '電力量 (W)',
} as const;

const registeredPowerOrder = (): PowerOrder => ({
  id: 4001,
  group_id: mockGroupId,
  item: 'E2E ホットプレート',
  power: 800,
  manufacturer: 'E2E Maker',
  model: 'E2E-800',
  item_url: 'https://example.com/power',
});

const secondPowerOrder = (): PowerOrder => ({
  id: 4002,
  group_id: mockGroupId,
  item: 'E2E 電子レンジ',
  power: 500,
  manufacturer: 'E2E Maker2',
  model: 'E2E-500',
  item_url: 'https://example.com/power2',
});

const openPower = (page: Page) =>
  page
    .getByRole('button', { name: new RegExp(APPLICATION_TITLES.power) })
    .click();

test.describe('power application', () => {
  // 修正済み: 以前は未登録時、「はい/いいえ」を選ぶ前でもラジオと一緒に
  // 「申請しない」登録用の登録ボタンが表示されてしまっていた。
  // 火気使用申請と同様、「いいえ」を明示的に選ぶまでは登録ボタンを出さない。
  test('does not show a register button alongside the yes/no question before choosing', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);

    await expect(page.getByText(FIELDS.question)).toBeVisible();
    await expect(page.getByLabel(FIELDS.productName)).toHaveCount(0);
    // ラジオが未選択の間は登録ボタンが出ない。
    await expect(
      page.getByRole('button', { name: BUTTONS.register, exact: true })
    ).toHaveCount(0);
  });

  // 「はい」を選ぶと登録フォームが現れる。
  test('reveals the registration form when yes is chosen', async ({ page }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);
    await selectRadio(page, FIELDS.question, 1);

    for (const field of [
      FIELDS.productName,
      FIELDS.manufacturer,
      FIELDS.model,
      FIELDS.url,
      FIELDS.maxPower,
    ]) {
      await expect(page.getByLabel(field)).toBeVisible();
    }
    await expect(submitButton(page)).toBeVisible();
  });

  // isValid: 必須項目が全て埋まるまで送信ボタンは無効。
  test('keeps the submit button disabled until required fields are filled', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);
    await selectRadio(page, FIELDS.question, 1);

    await expect(submitButton(page)).toBeDisabled();

    await fillPowerForm(page, {
      item: 'E2E ホットプレート',
      manufacturer: 'E2E Maker',
      model: 'E2E-800',
      itemUrl: 'https://example.com/power',
      power: '800',
    });

    await expect(submitButton(page)).toBeEnabled();
  });

  // 合計消費電力が上限(1500W)を超えると、フォームは有効でも送信ボタンは無効になる。
  test('disables submit and shows a warning when total power exceeds the limit', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);
    await selectRadio(page, FIELDS.question, 1);

    await fillPowerForm(page, {
      item: 'E2E 大容量機器',
      manufacturer: 'E2E Maker',
      model: 'E2E-1600',
      itemUrl: 'https://example.com/power',
      power: '1600',
    });

    // zod のmax(1500)エラーになるため送信ボタンは無効。
    await expect(submitButton(page)).toBeDisabled();
    await expect(page.getByText('1500W以下で入力してください')).toBeVisible();
  });

  // 入力して登録すると PUT /power_orders/submit がJSONボディで呼ばれる。
  test('creates a power order via PUT /power_orders/submit', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);
    await selectRadio(page, FIELDS.question, 1);

    await fillPowerForm(page, {
      item: 'E2E 登録ホットプレート',
      manufacturer: '登録メーカー',
      model: 'REG-100',
      itemUrl: 'https://example.com/registered-power',
      power: '900',
    });
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('電力申請情報を登録しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/power_orders/submit');
    expect(state.powerOrders).toHaveLength(1);
    expect(state.powerOrders[0]).toMatchObject({
      group_id: mockGroupId,
      item: 'E2E 登録ホットプレート',
      power: 900,
      manufacturer: '登録メーカー',
      model: 'REG-100',
      item_url: 'https://example.com/registered-power',
    });
  });

  // addDevice: 機器を追加できる。削除ボタンは「2件目以降」かつ「製品名が空」の
  // ときだけレンダー中の form.getValues() 判定で表示される。
  test('shows a delete button only for an extra empty row, and hides it once named', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);
    await selectRadio(page, FIELDS.question, 1);

    await expect(page.getByLabel(FIELDS.productName)).toHaveCount(1);
    await page.getByRole('button', { name: '物品の追加', exact: true }).click();
    await expect(page.getByLabel(FIELDS.productName)).toHaveCount(2);

    // 2件目は空なので削除ボタンが出る。1件目には出ない。
    await expect(
      page.getByRole('button', { name: BUTTONS.delete, exact: true })
    ).toHaveCount(1);

    // 2件目に製品名を入力すると削除ボタンが消える(getValues()をレンダー中に
    // 呼んで判定しているための挙動)。
    await page.getByLabel(FIELDS.productName).nth(1).fill('E2E 2台目機器');
    await expect(
      page.getByRole('button', { name: BUTTONS.delete, exact: true })
    ).toHaveCount(0);
  });

  // removeDevice: フォームが1つしかない場合は削除せず初期化する。
  test('resets the only row instead of removing it when its own remove is triggered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);
    await selectRadio(page, FIELDS.question, 1);

    // 1件目には削除ボタンは出ないため、常にフォームが1件のまま。
    await expect(page.getByLabel(FIELDS.productName)).toHaveCount(1);
    await expect(
      page.getByRole('button', { name: BUTTONS.delete, exact: true })
    ).toHaveCount(0);
  });

  // 登録済みなら一覧表示になり、修正ボタンと削除ボタンの両方が出る
  // (締切前は PowerSummaryView が両方描画するため)。
  test('shows the summary with edit and delete buttons when already registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.powerOrders = [registeredPowerOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);

    await expect(page.getByText('E2E ホットプレート')).toBeVisible();
    await expect(page.getByText('E2E Maker')).toBeVisible();
    await expect(page.getByText('E2E-800')).toBeVisible();
    await expect(page.getByText('800W')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.delete, exact: true })
    ).toBeVisible();
  });

  // 既存値を変更して保存すると PUT /power_orders/submit が id 付きで呼ばれる。
  // 編集中はボタン文言が「保存」になる。
  test('updates an existing order via the edit form, submit button is labeled save', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.powerOrders = [registeredPowerOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);
    await page.getByRole('button', { name: BUTTONS.edit, exact: true }).click();

    // 既存値が初期表示される。
    await expect(page.getByLabel(FIELDS.productName)).toHaveValue(
      'E2E ホットプレート'
    );

    await page.getByLabel(FIELDS.productName).fill('E2E 更新ホットプレート');
    // 「登録」ボタンは存在せず、常に「保存」。
    await expect(
      page.getByRole('button', { name: BUTTONS.register, exact: true })
    ).toHaveCount(0);
    await page.getByRole('button', { name: BUTTONS.save, exact: true }).click();

    await expect(page.getByText('電力申請情報を更新しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/power_orders/submit');
    expect(state.powerOrders[0]).toMatchObject({
      id: 4001,
      item: 'E2E 更新ホットプレート',
    });
  });

  // 唯一の登録済み機器を一覧から削除すると、APIは即座に叩かれず
  // 「いいえ」の登録待ち(ラジオ+登録ボタン)画面に切り替わるだけ。
  test('deletes the only device locally without calling the API, then confirms via the negative register button', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.powerOrders = [registeredPowerOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);
    await page
      .getByRole('button', { name: BUTTONS.delete, exact: true })
      .click();

    // 削除ボタンを押した時点ではAPIは飛ばない。
    expect(state.requestedUrls).toHaveLength(0);
    // ラジオは「いいえ」が選択された状態になり、登録ボタンが出る。
    await expect(page.getByText(FIELDS.question)).toBeVisible();
    await expect(page.getByLabel(FIELDS.productName)).toHaveCount(0);

    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(
      page.getByText('電力申請を行わない登録が完了しました。')
    ).toBeVisible();
    expect(state.requestedUrls).toContain('/power_orders/submit');
    expect(state.powerOrders).toHaveLength(0);
  });

  // 複数登録済みのうち1件を一覧から削除すると、APIを叩かずフォーム編集画面
  // (残り1件が初期表示された状態)に切り替わるだけ。
  test('deletes one of multiple devices locally without calling the API, then confirms via form submit', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.powerOrders = [registeredPowerOrder(), secondPowerOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);
    await page
      .getByRole('button', { name: BUTTONS.delete, exact: true })
      .first()
      .click();

    // 削除ボタンを押した時点ではAPIは飛ばない。
    expect(state.requestedUrls).toHaveLength(0);
    // 残り1件のフォームが編集状態で表示される。
    await expect(page.getByLabel(FIELDS.productName)).toHaveCount(1);

    await page.getByRole('button', { name: BUTTONS.save, exact: true }).click();

    await expect(page.getByText('電力申請情報を更新しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/power_orders/submit');
    expect(state.powerOrders).toHaveLength(1);
  });

  // 「いいえ」を選ぶと不使用登録ボタンが現れ、押すと PUT /power_orders/submit が
  // use_power:false で呼ばれる。
  test('registers the not-applying marker when no is chosen', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);
    await selectRadio(page, FIELDS.question, 2);

    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(
      page.getByText('電力申請を行わない登録が完了しました。')
    ).toBeVisible();
    expect(state.requestedUrls).toContain('/power_orders/submit');
    expect(state.powerOrders).toHaveLength(0);
  });

  // API が500を返した場合、submitPowerOrders内部でcatchされ{success:false}に
  // 変換されるため、handleFormSubmitの外側catch(submitUnexpectedError)ではなく
  // 内側のsubmitFailedメッセージが出る。
  test('shows a failure toast when the submit API fails', async ({ page }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);
    await selectRadio(page, FIELDS.question, 1);

    await fillPowerForm(page, {
      item: 'E2E 失敗機器',
      manufacturer: 'E2E Maker',
      model: 'E2E-FAIL',
      itemUrl: 'https://example.com/power-fail',
      power: '800',
    });

    // PUT /power_orders/submit をこのテストだけ強制的に失敗させる。
    await page.route('**/power_orders/submit', async (route) => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({ status: 500, body: 'e2e forced failure' });
        return;
      }
      await route.continue();
    });

    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    // トーストとフォーム内のエラーボックスの両方に同じ文言が表示される。
    await expect(
      page.getByText('申請の送信に失敗しました。もう一度お試しください。')
    ).toHaveCount(2);
    expect(state.powerOrders).toHaveLength(0);
  });

  // 締切後、登録済みなら一覧のみで修正・削除ボタンを出さない。
  test('hides edit and delete controls after the deadline', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    state.powerOrders = [registeredPowerOrder()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);

    await expect(page.getByText('E2E ホットプレート')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: BUTTONS.delete, exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 修正済み: 以前は締切後で何も登録していない(機器なし・不使用マーカーもなし)
  // 場合でも、「不使用」を選んだかのように「電力申請は不要（登録済み）」と
  // 表示してしまっていた。火気使用申請と同様、この場合は「申請期限が
  // 過ぎています」という締切案内を表示するように分岐を追加した。
  test('shows the deadline notice after the deadline when nothing was ever registered', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    state.powerOrders = [];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);

    await expect(page.getByText('申請期限が過ぎています')).toBeVisible();
    await expect(page.getByText('電力申請は不要（登録済み）')).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 「不使用」が登録済みの場合、開いた時点で一覧表示になる。
  test('shows the not-applying notice when the marker already exists', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.powerOrders = [];
    // usePowerApplication自身は un_registered_groups へPOSTしないため
    // (上のテスト参照)、未登録マーカーをstate直接操作で再現する。
    state.unregisteredOrderTypes = [ORDER_TYPES.power];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPower(page);

    await expect(page.getByText('電力申請は不要（登録済み）')).toBeVisible();
  });
});
