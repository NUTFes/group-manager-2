// 団体申請(Group)の特性化テスト。
//
// Group は他の申請と違い、ページ全体の登録判定(check_all_registered.group)を
// 握るゲート役でもある。scenarioState() の既定では「登録済み」を返すようにしてあり
// (理由は scenarioState.ts の GroupRecord のコメントを参照)、未登録シナリオだけ
// state.group = null を明示的に上書きする。
//
// 現状の挙動をそのまま凍結することが目的なので、不具合と分かっている挙動も
// 「現状こうである」と記録する。該当箇所には BUG コメントを付ける。
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { mockHomePageApis } from '../support/mockServer';
import { mockGroupId, scenarioState } from '../support/scenarioState';
import {
  APPLICATION_TITLES,
  BUTTONS,
  selectRadio,
  submitButton,
} from '../support/selectors';

const FIELDS = {
  name: '団体名',
  projectName: '企画名',
  isInternational: '国際団体ですか？',
  isExternal: '学外団体ですか？',
  groupCategory: '参加形式',
  activity: '企画内容',
} as const;

const YES = 1;
const NO = 0;

const openGroup = (page: Page) =>
  page
    .getByRole('button', { name: new RegExp(APPLICATION_TITLES.group) })
    .click();

const fillGroupForm = async (
  page: Page,
  values: { name: string; projectName: string; activity: string }
) => {
  await page.getByLabel(FIELDS.name).fill(values.name);
  await page.getByLabel(FIELDS.projectName).fill(values.projectName);
  await page.getByLabel(FIELDS.activity).fill(values.activity);
};

test.describe('group application', () => {
  // 未登録なら、アコーディオンを開いた時点で入力フォームが表示される。
  test('shows the input form when nothing is registered yet', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.group = null;
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openGroup(page);

    for (const field of Object.values(FIELDS)) {
      await expect(page.getByLabel(field)).toBeVisible();
    }
    await expect(
      page.getByRole('button', { name: BUTTONS.register, exact: true })
    ).toBeVisible();
  });

  // 未登録時は validateEdit() が働かないため(groupsがundefinedのため常にfalse)、
  // 必須項目が空欄でも送信ボタンは活性のまま。バリデーションはzodのsubmit時検証のみ。
  test('keeps the submit button enabled even though required fields are still empty', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.group = null;
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openGroup(page);

    await expect(submitButton(page)).toBeEnabled();

    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('入力してください').first()).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 必須項目を入力して登録すると、POST /groups が snake_case のクエリで呼ばれる。
  // Group の3つのmutatorはprops由来の本物のmutateなので、送信後に
  // /groups/:id・/groups/user/:id・/check_all_registered/:id が実際に再取得される。
  test('creates a group with snake_case query parameters and revalidates all three sources', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.group = null;
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openGroup(page);

    await fillGroupForm(page, {
      name: 'E2E登録団体',
      projectName: 'E2E登録企画',
      activity: 'E2E登録企画内容',
    });
    await selectRadio(page, FIELDS.isInternational, YES);
    await selectRadio(page, FIELDS.isExternal, NO);
    await page.getByLabel(FIELDS.groupCategory).selectOption('3');
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('登録しました。')).toBeVisible();
    expect(state.requestedUrls).toContain('/groups');
    expect(state.group).toMatchObject({
      id: mockGroupId,
      name: 'E2E登録団体',
      project_name: 'E2E登録企画',
      activity: 'E2E登録企画内容',
      user_id: 1001,
      group_category_id: 3,
      fes_year_id: 1,
      is_international: true,
      is_external: false,
      committee: false,
    });

    // 3つのmutatorが実際に発火し、GETが再取得される(他の申請のno-opバグとは異なる)。
    expect(state.groupFetchCounts.groups).toBeGreaterThan(1);
    expect(state.groupFetchCounts.groupByUserId).toBeGreaterThan(1);
    expect(state.groupFetchCounts.checkAllRegistered).toBeGreaterThan(1);

    // 再取得が効くので、フォームは閉じて要約に入力値がそのまま反映される。
    await expect(page.getByLabel(FIELDS.name)).toHaveCount(0);
    await expect(page.getByText('E2E登録団体')).toBeVisible();
  });

  // BUG: Group/hooks.ts の isGroupResolved は useGetGroupByUserId の完了だけを見ており、
  // isRegistered の元になる check_all_registered の解決を待たない。
  // check_all_registered は groupId が判明してから初めて発火するため必ず1テンポ遅れ、
  // isEditing を決める一度きりの初期化effectは常に isRegistered=false(未解決)を掴む。
  // そのため「登録済み」でも、アコーディオンを開くと(FormListの要約ではなく)
  // 既存値が入った編集フォームがいきなり開く。
  test('opens directly into the edit form on first load even though the group is already registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openGroup(page);

    await expect(page.getByLabel(FIELDS.name)).toHaveValue(state.group!.name);
    // validateEdit(): まだ何も変えていないので送信ボタンは無効。
    await expect(submitButton(page)).toBeDisabled();

    // 「キャンセル」で isEditing をトグルすると、ようやく本来のFormList要約になる。
    await page
      .getByRole('button', { name: BUTTONS.cancel, exact: true })
      .click();
    await expect(page.getByText(state.group!.name)).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();

    // 修正ボタンで再びフォームへ戻れる。
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();
    await expect(page.getByLabel(FIELDS.name)).toHaveValue(state.group!.name);
  });

  // 前項のBUGにより初回表示から編集フォームが開くので、そのまま値を変更して送信できる。
  // PATCH /groups/:id が呼ばれ、update は mutateGroups() のみ呼ぶため
  // (create と違い mutateCheckAllRegisteredGroups / mutateGroupByUserId は呼ばれない)、
  // 自分の再取得だけが増える。
  test('updates an existing group via PATCH, revalidating only its own summary', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openGroup(page);
    await expect(page.getByLabel(FIELDS.name)).toHaveValue(state.group!.name);

    const groupsCountBefore = state.groupFetchCounts.groups;
    const groupByUserIdCountBefore = state.groupFetchCounts.groupByUserId;
    const checkAllRegisteredCountBefore =
      state.groupFetchCounts.checkAllRegistered;

    await page.getByLabel(FIELDS.name).fill('E2E更新団体');
    await submitButton(page).click();

    await expect(page.getByText('更新しました。')).toBeVisible();
    expect(state.requestedUrls).toContain(`/groups/${mockGroupId}`);
    expect(state.group).toMatchObject({ name: 'E2E更新団体' });

    expect(state.groupFetchCounts.groups).toBeGreaterThan(groupsCountBefore);
    expect(state.groupFetchCounts.groupByUserId).toBe(groupByUserIdCountBefore);
    expect(state.groupFetchCounts.checkAllRegistered).toBe(
      checkAllRegisteredCountBefore
    );

    // 実際に再取得されるので、要約にも新しい値が反映される。
    await expect(page.getByLabel(FIELDS.name)).toHaveCount(0);
    await expect(page.getByText('E2E更新団体')).toBeVisible();
  });

  // validateEdit(): 既存の団体があるときだけ働く手書き等価比較。
  // 一つも変えていない間は送信ボタンが無効。
  test('keeps the submit button disabled until a value actually changes', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openGroup(page);

    await expect(submitButton(page)).toBeDisabled();

    await page.getByLabel(FIELDS.name).fill('別の団体名');
    await expect(submitButton(page)).toBeEnabled();
  });

  // BUG(Phase 4-3): GroupForm/hooks.ts は catch 内の toast.error に加えて
  // useEffect(createError || updateError) でも toast.error(registerFailedMessage) を呼ぶ。
  // 新規登録が失敗すると、同じ文言の失敗トーストが2回表示される。
  test('shows the same failure toast twice when creation fails', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.group = null;
    state.forceGroupSubmitError = true;
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openGroup(page);
    await fillGroupForm(page, {
      name: 'E2E失敗団体',
      projectName: 'E2E失敗企画',
      activity: 'E2E失敗企画内容',
    });
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText('登録に失敗しました。')).toHaveCount(2);
  });

  // BUG(Phase 4-3): catch ブロックは更新用の updateFailed ("更新に失敗しました。") を
  // 出すが、useEffect は create/update を区別せず常に registerFailed
  // ("登録に失敗しました。") を出す。そのため更新失敗時は文言の異なる
  // 2つの失敗トーストが同時に表示される。
  test('shows two differently worded failure toasts when update fails', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.forceGroupSubmitError = true;
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openGroup(page);
    // BUGにより初回表示から既存値入りの編集フォームが開くので、そのまま変更して送信する。
    await page.getByLabel(FIELDS.name).fill('E2E更新失敗団体');
    await submitButton(page).click();

    await expect(page.getByText('更新に失敗しました。')).toBeVisible();
    await expect(page.getByText('登録に失敗しました。')).toBeVisible();
  });

  // BUG: home/index.tsx は Group の isDeadline に userPageSettings.isRegistGroup を
  // 渡しているが、これは pageMode に連動せず常に true を返す固定値(state駆動の
  // isEditGroup フィールドは定義されているだけで実際には未使用)。そのため他の申請と
  // 違い、pageMode: 'closed' でも Group は締切扱いにならず修正ボタンが出続け、
  // 編集も引き続き行える。
  test('stays editable past the deadline because isDeadline reads isRegistGroup (always true), not isEditGroup', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openGroup(page);

    // 登録済みでも初回はBUGにより編集フォームが開くので、一旦キャンセルして
    // 本来のFormList要約表示に切り替える。
    await page
      .getByRole('button', { name: BUTTONS.cancel, exact: true })
      .click();

    // 他の申請なら締切後は修正ボタンが消えるが、Group はそうならず出続ける。
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();

    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();
    await expect(page.getByLabel(FIELDS.name)).toBeVisible();
    // まだ値を変えていないので validateEdit() により送信ボタンは無効。
    await expect(submitButton(page)).toBeDisabled();
  });
});
