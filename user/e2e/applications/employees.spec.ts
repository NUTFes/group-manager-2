// 従業員申請の特性化テスト。
// 現状の挙動をそのまま凍結する。既知の癖は BUG コメント付きで記録し、
// アプリ側は直さない。
//
// この群の特徴:
// - ロジックが useEmployeesForm/useEmployeesFormState/useEmployeesFormHandlers の
//   3フックに分割された唯一の群で、<Controller> を使う数少ないフォームでもある。
// - 従業員が1人なら POST /employees(新規)/PATCH /employees/:id(更新)、
//   2人以上なら常に POST /employees/upsert が使われる(hooks.ts の分岐)。
// - 「申請しない」(代表・副代表のみで活動)は ORDER_TYPES.employee(=3) の
//   未登録マーカーで表現される。
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mockHomePageApis } from '../support/mockServer';
import {
  type EmployeeRecord,
  ORDER_TYPES,
  mockGroupId,
  scenarioState,
} from '../support/scenarioState';
import {
  APPLICATION_TITLES,
  BUTTONS,
  selectRadio,
  submitButton,
} from '../support/selectors';

const LABELS = {
  radio: '「代表」と「副代表」以外の従業員申請を行いますか？',
  name: '従業員名',
  studentId: '学籍番号',
  addEmployee: '従業員の追加',
} as const;

const RADIO_YES = 1; // 「はい」= 従業員申請する
const RADIO_NO = 2; // 「いいえ」= 代表・副代表のみで活動する

const registeredEmployee = (
  overrides: Partial<EmployeeRecord> = {}
): EmployeeRecord => ({
  id: 15001,
  group_id: mockGroupId,
  name: 'E2E 太郎',
  student_id: 12345678,
  stool_test_id: 1,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const openEmployees = (page: Page) =>
  page
    .getByRole('button', { name: new RegExp(APPLICATION_TITLES.employees) })
    .click();

const fillEmployee = async (
  page: Page,
  index: number,
  values: { name: string; studentId: string }
) => {
  await page.getByLabel(LABELS.name).nth(index).fill(values.name);
  await page.getByLabel(LABELS.studentId).nth(index).fill(values.studentId);
};

test.describe('employees application', () => {
  // 未登録なら、アコーディオンを開いた時点でラジオだけの入力フォームが出る。
  test('shows only the radio question when nothing is registered yet', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openEmployees(page);

    await expect(page.getByText(LABELS.radio)).toBeVisible();
    await expect(page.getByLabel(LABELS.name)).toHaveCount(0);
    // 未選択の間は isSubmitDisabled=true でボタンが無効化され、
    // ラベルも消えてスピナーだけになる(Button の仕様)ため type で引く。
    await expect(submitButton(page)).toBeVisible();
    await expect(submitButton(page)).toBeDisabled();
  });

  // 「はい」を選ぶと、空の従業員入力欄が1件自動で追加される。
  test('reveals an empty employee field after selecting yes', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openEmployees(page);
    await selectRadio(page, LABELS.radio, RADIO_YES);

    await expect(page.getByLabel(LABELS.name)).toHaveCount(1);
    await expect(page.getByLabel(LABELS.studentId)).toHaveCount(1);
    await expect(
      page.getByRole('button', { name: LABELS.addEmployee, exact: true })
    ).toBeVisible();
    // 名前・学籍番号とも未入力のため送信不可。
    await expect(submitButton(page)).toBeDisabled();
  });

  // 学籍番号は8桁の zod regex を満たすまで送信不可。
  test('keeps the submit button disabled until the student id is valid', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openEmployees(page);
    await selectRadio(page, LABELS.radio, RADIO_YES);

    await fillEmployee(page, 0, { name: 'E2E 花子', studentId: '123' });
    await expect(submitButton(page)).toBeDisabled();

    await page.getByLabel(LABELS.studentId).nth(0).fill('12345678');
    await expect(submitButton(page)).toBeEnabled();
  });

  // 従業員が1人なら POST /employees が JSONボディで呼ばれる。
  test('creates a single employee via POST /employees', async ({ page }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openEmployees(page);
    await selectRadio(page, LABELS.radio, RADIO_YES);
    await fillEmployee(page, 0, { name: 'E2E 花子', studentId: '12345678' });
    await submitButton(page).click();

    await expect(page.getByText('従業員申請が完了しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/employees');
    expect(state.requestedUrls).not.toContain('/employees/upsert');
    expect(state.employees).toMatchObject([
      {
        group_id: mockGroupId,
        name: 'E2E 花子',
        student_id: 12345678,
      },
    ]);
  });

  // 従業員を2人以上まとめて送ると、常に POST /employees/upsert が使われる。
  test('creates multiple employees via POST /employees/upsert', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openEmployees(page);
    await selectRadio(page, LABELS.radio, RADIO_YES);
    await fillEmployee(page, 0, { name: 'E2E 一郎', studentId: '11111111' });
    await page
      .getByRole('button', { name: LABELS.addEmployee, exact: true })
      .click();
    await fillEmployee(page, 1, { name: 'E2E 二郎', studentId: '22222222' });
    await submitButton(page).click();

    await expect(page.getByText('従業員申請が完了しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/employees/upsert');
    expect(state.requestedUrls).not.toContain('/employees');
    expect(state.employees).toMatchObject([
      { group_id: mockGroupId, name: 'E2E 一郎', student_id: 11111111 },
      { group_id: mockGroupId, name: 'E2E 二郎', student_id: 22222222 },
    ]);
  });

  // 登録済みなら FormList(テーブル表示)になり、修正ボタンでフォームへ切り替わる。
  test('shows the summary table with an edit button when already registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.employees = [registeredEmployee()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openEmployees(page);

    await expect(page.getByText('従業員名', { exact: true })).toBeVisible();
    await expect(page.getByText('学籍番号', { exact: true })).toBeVisible();
    await expect(page.getByText('E2E 太郎')).toBeVisible();
    await expect(page.getByText('12345678')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();
  });

  // 既存値を変更して送信すると PATCH /employees/:id が呼ばれる(1人の場合)。
  test('updates an existing employee via PATCH /employees/:id', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.employees = [registeredEmployee()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openEmployees(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    // 編集開始時、既存値(学籍番号は文字列化されて)がフォームへ復元される。
    await expect(page.getByLabel(LABELS.name)).toHaveValue('E2E 太郎');
    await expect(page.getByLabel(LABELS.studentId)).toHaveValue('12345678');

    await page.getByLabel(LABELS.name).fill('E2E 太郎(改)');
    await submitButton(page).click();

    await expect(page.getByText('従業員申請が完了しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/employees/15001');
    expect(state.employees).toMatchObject([
      { id: 15001, name: 'E2E 太郎(改)', student_id: 12345678 },
    ]);
  });

  // フォーム内の削除ボタンは即APIを呼ばない。フィールドを外すだけで、
  // DB上の削除は保存を押した時点の差分削除でまとめて確定する。
  test('removes the field locally and only deletes on submit', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.employees = [registeredEmployee()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openEmployees(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();
    await expect(page.getByLabel(LABELS.name)).toHaveCount(1);

    await page
      .getByRole('button', { name: BUTTONS.delete, exact: true })
      .click();

    // まだ何もAPIを呼んでいない。サーバ上のデータは残ったまま。
    expect(state.requestedUrls).not.toContain('/employees/15001');
    expect(state.employees).toHaveLength(1);

    // フォーム上の行は0件、保存はdisabled、「追加」への導線メッセージが出る。
    await expect(page.getByLabel(LABELS.name)).toHaveCount(0);
    await expect(submitButton(page)).toBeDisabled();
    await expect(
      page.getByText('すべての従業員を削除したため', { exact: false })
    ).toBeVisible();

    // 保存して初めて削除が確定する(差分削除 + 新規作成)。
    await page
      .getByRole('button', { name: LABELS.addEmployee, exact: true })
      .click();
    await fillEmployee(page, 0, { name: '差し替え後', studentId: '87654321' });
    await submitButton(page).click();

    await expect(page.getByText('従業員申請が完了しました。')).toBeVisible();
    // 差分削除で元の従業員(id=15001)を消してから、新規作成で1件登録する。
    // モックのPOST /employeesは常にid=15001を割り当てる(登録時のidは
    // 別テストとも共通の固定値)ため、DELETEが実際に飛んだことは
    // リクエストURLの記録で確認する。
    expect(state.requestedUrls).toContain('/employees/15001');
    expect(state.requestedUrls).toContain('/employees');
    expect(state.employees).toHaveLength(1);
    expect(state.employees[0]).toMatchObject({ name: '差し替え後' });
  });

  // 未登録の状態で「いいえ」を選ぶと、代表・副代表のみで活動する扱いになり
  // 未登録マーカー(order_type=3)が登録される。既存の従業員データは無いので削除は起きない。
  test('registers the not-applying marker when selecting no with nothing to delete', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openEmployees(page);
    await selectRadio(page, LABELS.radio, RADIO_NO);
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(
      page.getByText('従業員申請を行わない登録が完了しました。')
    ).toBeVisible();
    expect(state.requestedUrls).toContain('/un_registered_groups');
    expect(state.unregisteredOrderTypes).toContain(ORDER_TYPES.employee);
    expect(
      state.requestedUrls.some((url) => url.startsWith('/employees/'))
    ).toBe(false);
  });

  // 「申請しない」登録済みなら専用の一覧文言になり、修正ボタンでマーカーを削除してフォームに戻る。
  test('shows the not-applying summary and clears the marker when editing', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.unregisteredOrderTypes = [ORDER_TYPES.employee];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openEmployees(page);

    await expect(page.getByText('従業員申請は不要（登録済み）')).toBeVisible();
    await expect(
      page.getByText('代表と副代表だけで活動します。')
    ).toBeVisible();

    await page.getByRole('button', { name: BUTTONS.edit, exact: true }).click();

    // マーカーが削除され、ラジオ未選択の入力フォームへ戻る。
    expect(state.requestedUrls).toContain('/un_registered_groups/6003');
    await expect(page.getByText(LABELS.radio)).toBeVisible();
    await expect(submitButton(page)).toBeDisabled();
  });

  // 締切後は一覧のみで、修正ボタンを出さない。
  test('hides the edit button after the deadline', async ({ page }) => {
    const state = scenarioState('closed');
    state.employees = [registeredEmployee()];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openEmployees(page);

    await expect(page.getByText('E2E 太郎')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 締切後かつ未登録(従業員データも未登録マーカーも無い)なら、専用の締切メッセージになる。
  test('shows the deadline message when closed and nothing is registered', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openEmployees(page);

    await expect(page.getByText('申請期限が過ぎています')).toBeVisible();
    await expect(page.getByText(LABELS.radio)).toHaveCount(0);
  });

  // 送信に失敗すると失敗トーストが出る。
  test('shows a failure toast when the create request fails', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.forceEmployeeSubmitError = true;
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openEmployees(page);
    await selectRadio(page, LABELS.radio, RADIO_YES);
    await fillEmployee(page, 0, { name: 'E2E 花子', studentId: '12345678' });
    await submitButton(page).click();

    await expect(
      page.getByText('従業員申請の登録に失敗しました。')
    ).toBeVisible();
    expect(state.requestedUrls).toContain('/employees');
    expect(state.employees).toHaveLength(0);
  });
});
