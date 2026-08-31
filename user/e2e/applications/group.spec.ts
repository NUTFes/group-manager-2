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

  // 修正済み: 以前は home/index.tsx の isGroupResolved が useGetGroupByUserId の
  // 完了だけを見ており、isRegistered の元になる check_all_registered の解決を
  // 待たなかった。check_all_registered は groupId が判明してから発火するぶん必ず
  // 遅れるうえ、Group の isRegistered は未解決の undefined を false に潰すため、
  // isEditing を決める一度きりの初期化effectが常に「未登録」を掴んでいた。
  // その結果、登録済みでもアコーディオンを開くと編集フォームが直接開いていた。
  test('shows the summary with an edit button when already registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openGroup(page);

    // 登録済みなので、まず FormList の要約が出る。
    await expect(page.getByText(state.group!.name)).toBeVisible();
    await expect(page.getByLabel(FIELDS.name)).toHaveCount(0);

    // 修正ボタンで編集フォームへ切り替わり、既存値が入っている。
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();
    await expect(page.getByLabel(FIELDS.name)).toHaveValue(state.group!.name);
    // validateEdit(): まだ何も変えていないので送信ボタンは無効。
    await expect(submitButton(page)).toBeDisabled();
  });

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
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();
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
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await expect(page.getByLabel(FIELDS.name)).toHaveValue('E2Eテスト団体');
    await expect(submitButton(page)).toBeDisabled();

    await page.getByLabel(FIELDS.name).fill('別の団体名');
    await expect(submitButton(page)).toBeEnabled();
  });

  // 修正済み: Group/hooks.ts の hasLoadedOnce は最初のロードで latch するため、
  // groupId 確定後に /groups/:id を取り直している間もローディング表示に戻らず、
  // GroupForm が団体データ未到着のままマウントされることがある。
  // useForm の defaultValues は mount 時に一度しか評価されないので、以前は
  // データが後から届いてもフォームが空欄のままだった。
  // GroupForm/hooks.ts に到着時の reset() を足して流し込み直すようにした。
  test('fills the edit form once the group data arrives late', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    // 到着を遅らせて、フォームが団体データより先にマウントされる経路を確定させる。
    state.groupFetchDelayMs = 500;
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openGroup(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    // 遅れて届いた団体データがフォームへ流し込まれ、未変更なので送信は無効。
    await expect(page.getByLabel(FIELDS.name)).toHaveValue('E2Eテスト団体');
    await expect(submitButton(page)).toBeDisabled();
  });

  // 修正済み(旧 Phase 4-3): 以前は catch 内の toast.error に加えて
  // useEffect(createError || updateError) でも toast.error を呼んでいたため、
  // 登録失敗時に同じ文言のトーストが2回出ていた。useEffect 側を削除した。
  test('shows the failure toast once when creation fails', async ({ page }) => {
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

    await expect(page.getByText('登録に失敗しました。')).toHaveCount(1);
  });

  // 修正済み(旧 Phase 4-3): catch は更新用の "更新に失敗しました。" を出す一方、
  // useEffect は create/update を区別せず常に "登録に失敗しました。" を出していたため、
  // 更新失敗時は文言の異なる2つのトーストが同時に出ていた。
  // 今は更新用の文言だけが1回出る。
  test('shows only the update failure toast when update fails', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.forceGroupSubmitError = true;
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openGroup(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();
    await page.getByLabel(FIELDS.name).fill('E2E更新失敗団体');
    await submitButton(page).click();

    await expect(page.getByText('更新に失敗しました。')).toBeVisible();
    await expect(page.getByText('登録に失敗しました。')).toHaveCount(0);
  });

  // Group の isDeadline は他の申請と違い userPageSettings.isRegistGroup を読む。
  // 団体申請にとっては登録受付期間そのものが締切なので、これは妥当な参照。
  // モックの is_regist_group は pageMode に連動しない固定値 true なので、
  // pageMode: 'closed' でも Group だけは編集可能なまま残る。
  // (pageMode に連動する is_edit_group は型に定義されているが未使用。)
  test('stays editable while group registration is still open', async ({
    page,
  }) => {
    const state = scenarioState('closed');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openGroup(page);

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
