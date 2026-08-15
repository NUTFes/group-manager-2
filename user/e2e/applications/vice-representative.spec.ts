// 副代表申請の特性化テスト。
// 「一人での参加」を選ぶと副代表を登録せず未登録マーカーを立てる分岐があり、
// その際は resolver ごと差し替えて検証を無効化している(既知の設計上の穴)。
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mockHomePageApis } from '../support/mockServer';
import {
  ORDER_TYPES,
  type ScenarioState,
  mockGroupId,
  scenarioState,
} from '../support/scenarioState';
import { APPLICATION_TITLES, BUTTONS, selectRadio } from '../support/selectors';

const FIELDS = {
  isIndividual: '一人での参加ですか？',
  name: '名前',
  studentId: '学籍番号',
  gradeId: '課程・学年',
  departmentId: '学科・専攻',
  email: 'メールアドレス',
  tel: '電話番号',
} as const;

const INDIVIDUAL = 1;
const GROUP = 0;

const registeredViceRepresentative =
  (): ScenarioState['viceRepresentative'] => ({
    id: 9001,
    group_id: mockGroupId,
    name: '長岡 花子',
    student_id: 87654321,
    grade_id: 2,
    department_id: 1,
    email: '876543@stn.nagaokaut.ac.jp',
    tel: '09087654321',
  });

const openViceRepresentative = (page: Page) =>
  page
    .getByRole('button', {
      name: new RegExp(APPLICATION_TITLES.viceRepresentative),
    })
    .click();

const fillViceRepresentative = async (
  page: Page,
  values: {
    name: string;
    studentId: string;
    gradeId: number;
    departmentId: number;
    email: string;
    tel: string;
  }
) => {
  await page.getByLabel(FIELDS.name).fill(values.name);
  await page.getByLabel(FIELDS.studentId).fill(values.studentId);
  await page.getByLabel(FIELDS.gradeId).selectOption(String(values.gradeId));
  await page
    .getByLabel(FIELDS.departmentId)
    .selectOption(String(values.departmentId));
  await page.getByLabel(FIELDS.email).fill(values.email);
  await page.getByLabel(FIELDS.tel).fill(values.tel);
};

test.describe('vice representative application', () => {
  // 未登録なら、まず「一人での参加ですか？」のラジオだけが出る。
  test('shows only the individual/group question before choosing', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openViceRepresentative(page);

    await expect(page.getByText(FIELDS.isIndividual)).toBeVisible();
    // 選択するまで氏名などの入力欄は出さない。
    await expect(page.getByLabel(FIELDS.name)).toHaveCount(0);
  });

  // 「いいえ（グループで参加）」を選ぶと副代表の入力欄が現れる。
  test('reveals the detail fields when joining as a group', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openViceRepresentative(page);
    await selectRadio(page, FIELDS.isIndividual, GROUP);

    for (const field of [
      FIELDS.name,
      FIELDS.studentId,
      FIELDS.gradeId,
      FIELDS.departmentId,
      FIELDS.email,
      FIELDS.tel,
    ]) {
      await expect(page.getByLabel(field)).toBeVisible();
    }
  });

  // 入力して登録すると POST /sub_reps が snake_case のクエリで呼ばれる。
  test('creates a vice representative with snake_case query parameters', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openViceRepresentative(page);
    await selectRadio(page, FIELDS.isIndividual, GROUP);

    await fillViceRepresentative(page, {
      name: '長岡 太郎',
      studentId: '12345678',
      gradeId: 2,
      departmentId: 1,
      email: '123456@stn.nagaokaut.ac.jp',
      tel: '09012345678',
    });
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('送信しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/sub_reps');
    expect(state.viceRepresentative).toMatchObject({
      group_id: mockGroupId,
      name: '長岡 太郎',
      student_id: 12345678,
      grade_id: 2,
      department_id: 1,
      email: '123456@stn.nagaokaut.ac.jp',
      tel: '09012345678',
    });
  });

  // zod: 学籍番号は8桁、電話番号は0始まりの10〜11桁。
  test('rejects an invalid student id and phone number', async ({ page }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openViceRepresentative(page);
    await selectRadio(page, FIELDS.isIndividual, GROUP);

    await fillViceRepresentative(page, {
      name: '長岡 太郎',
      studentId: '123',
      gradeId: 2,
      departmentId: 1,
      email: '123456@stn.nagaokaut.ac.jp',
      tel: '12345',
    });
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(
      page.getByText('学籍番号は8桁で入力してください')
    ).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 「はい（個人で参加）」を選ぶと、検証を通さずに未登録マーカーを登録する。
  test('registers the not-applying marker when joining as an individual', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openViceRepresentative(page);
    await selectRadio(page, FIELDS.isIndividual, INDIVIDUAL);
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('送信しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/un_registered_groups');
    expect(state.unregisteredOrderTypes).toContain(ORDER_TYPES.subRep);
    // 未入力のまま送信できてしまう(resolver を素通しに差し替えているため)。
    expect(state.viceRepresentative).toBeNull();
  });

  // 「個人で参加」で登録済みなら、一覧に専用の説明文が出る。
  test('shows the individual notice when the not-applying marker exists', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.unregisteredOrderTypes = [ORDER_TYPES.subRep];
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openViceRepresentative(page);

    await expect(page.getByText('あなたは1人での参加です')).toBeVisible();
  });

  // 登録済みなら一覧表示になり、修正ボタンでフォームへ切り替わる。
  test('shows the summary with an edit button when already registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.viceRepresentative = registeredViceRepresentative();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openViceRepresentative(page);

    await expect(page.getByText('長岡 花子')).toBeVisible();
    // 電話番号(09087654321)にも部分一致するため exact で引く。
    await expect(page.getByText('87654321', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();
  });

  // 既存値を変更して送信すると PATCH /sub_reps/:id が呼ばれる。
  test('updates an existing vice representative via PATCH', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.viceRepresentative = registeredViceRepresentative();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openViceRepresentative(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await page.getByLabel(FIELDS.name).fill('長岡 次郎');
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('送信しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/sub_reps/9001');
    expect(state.viceRepresentative).toMatchObject({ name: '長岡 次郎' });
  });

  // 締切後は一覧のみで、修正ボタンを出さない。
  test('hides the edit button after the deadline', async ({ page }) => {
    const state = scenarioState('closed');
    state.viceRepresentative = registeredViceRepresentative();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openViceRepresentative(page);

    await expect(page.getByText('長岡 花子')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });
});
