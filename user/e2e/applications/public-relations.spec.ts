// PR文申請(PublicRelations)の特性化テスト。
//
// この群は Imgur への直接アップロード・手書きの resolver ラップ・正方形チェックなど
// 他の群にはない難所を持つ。現状の挙動をそのまま凍結することが目的なので、
// 不具合と分かっている挙動も「現状こうである」と記録する。該当箇所には BUG コメントを付ける。
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import path from 'node:path';
import { mockHomePageApis } from '../support/mockServer';
import {
  type ScenarioState,
  mockGroupId,
  scenarioState,
} from '../support/scenarioState';
import {
  APPLICATION_TITLES,
  BUTTONS,
  selectRadio,
  submitButton,
} from '../support/selectors';

const FIELDS = {
  text: 'PR文(HP,パンフレット,アナウンスに使用)',
  announce: 'アナウンスを行いますか？',
  image: 'PR画像',
} as const;

const YES = 1;

const MESSAGES = {
  submitSuccess: '送信しました',
  submitFailed: '送信に失敗しました。時間を置いて再度お試しください',
  imageRequired: '画像をアップロードしてください',
  imageSquare: '画像は正方形にしてください',
} as const;

const SQUARE_IMAGE = path.join(__dirname, '../support/fixtures/square.png');
const NON_SQUARE_IMAGE = path.join(
  __dirname,
  '../support/fixtures/non-square.png'
);

const registeredPublicRelationId = 11001;

const registeredPublicRelation = (): ScenarioState['publicRelation'] => ({
  id: registeredPublicRelationId,
  group_id: mockGroupId,
  blurb: '既存のPR文です',
  picture_name: 'existing.png',
  picture_path: 'https://i.imgur.com/existing.png',
  is_announcement_requested: true,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
});

const openPublicRelations = (page: Page) =>
  page
    .getByRole('button', {
      name: new RegExp(APPLICATION_TITLES.publicRelations),
    })
    .click();

/** アップロードボタン。Upload はネイティブの<button>で、implicitなlabel関連付けが無い。 */
const uploadButton = (page: Page) =>
  page.locator('button', { hasText: FIELDS.image });

/**
 * handleImageUpload() は document.createElement('input') で未接続のinputを動的生成し
 * input.click() を呼ぶ実装。DOM未接続でも同一の同期呼び出し内であればブラウザのネイティブ
 * ファイル選択ダイアログは発火し、Playwrightの filechooser イベントで捕まえられる。
 */
const chooseImage = async (page: Page, filePath: string) => {
  const fileChooserPromise = page.waitForEvent('filechooser');
  await uploadButton(page).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(filePath);
};

/** FormList の1項目(label div + content div)をラベルから丸ごと絞り込む。 */
const summaryRow = (page: Page, label: string) =>
  page.getByText(label, { exact: true }).locator('xpath=../..');

test.describe('public relations application', () => {
  // 未登録なら、アコーディオンを開いた時点で入力フォームが表示される。
  test('shows the input form when nothing is registered yet', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPublicRelations(page);

    await expect(page.getByLabel(FIELDS.text)).toBeVisible();
    await expect(page.getByText(FIELDS.announce)).toBeVisible();
    await expect(uploadButton(page)).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.register, exact: true })
    ).toBeVisible();
  });

  // resolverを手書きでラップしており、新規作成時のみ画像が必須になる。
  test('requires an image when creating a new public relation', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPublicRelations(page);

    await page.getByLabel(FIELDS.text).fill('E2E登録PR文');
    await selectRadio(page, FIELDS.announce, YES);
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText(MESSAGES.imageRequired)).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
    expect(state.imgurUploadCount).toBe(0);
  });

  // 画像を選んで登録すると、まずImgurにアップロードしてから
  // POST /public_relations が snake_case のクエリで呼ばれる。
  test('creates a public relation, uploading the image to Imgur first', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPublicRelations(page);

    await page.getByLabel(FIELDS.text).fill('E2E登録PR文');
    await selectRadio(page, FIELDS.announce, YES);
    await chooseImage(page, SQUARE_IMAGE);
    await expect(page.getByText('アップロード済み: square.png')).toBeVisible();

    const checkAllRegisteredBefore = state.groupFetchCounts.checkAllRegistered;
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText(MESSAGES.submitSuccess)).toBeVisible();
    expect(state.imgurUploadCount).toBe(1);
    expect(state.requestedUrls).toContain('/public_relations');
    expect(state.publicRelation).toMatchObject({
      group_id: mockGroupId,
      blurb: 'E2E登録PR文',
      is_announcement_requested: true,
      picture_name: 'square.png',
      picture_path: 'https://i.imgur.com/e2e-mock.png',
    });

    // prMutate()はこのhookが持つ本物のSWR mutate(タプルキー)なので、
    // 自分の一覧は正しく再取得され、フォームは閉じて要約表示に切り替わる。
    await expect(page.getByLabel(FIELDS.text)).toHaveCount(0);
    await expect(page.getByText('E2E登録PR文')).toBeVisible();

    // 修正済み(旧 Phase 4-1): 以前は mutate(`check_all_registered/${groupId}`) を
    // 先頭スラッシュの無い文字列キーで呼んでおり、useAuthenticatedGet が使う
    // 実際のタプルキー [url, session] と一致せず check_all_registered は
    // 再検証されなかった。revalidateCheckAllRegistered() に置き換えたことで、
    // 登録済みバッジのもとになる check_all_registered も再取得される。
    await expect
      .poll(() => state.groupFetchCounts.checkAllRegistered)
      .toBeGreaterThan(checkAllRegisteredBefore);
  });

  // 正方形チェックは new Image() の読み込み後に同期的にsetErrorで反映される。
  test('rejects a non-square image before submission', async ({ page }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPublicRelations(page);

    await chooseImage(page, NON_SQUARE_IMAGE);

    await expect(page.getByText(MESSAGES.imageSquare)).toBeVisible();
    // 検証に失敗した画像はsetValueされないため、Imgurへは送信されない。
    expect(state.imgurUploadCount).toBe(0);
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 登録済みなら一覧表示になり、PR文・アナウンス状態・画像プレビューが出る。
  test('shows the summary with the resolved fields when already registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.publicRelation = registeredPublicRelation();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPublicRelations(page);

    await expect(page.getByText('既存のPR文です')).toBeVisible();
    await expect(
      summaryRow(page, FIELDS.announce).getByText('はい', { exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /のプレビューを開く/ })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();
  });

  // 既存データを編集する場合は、resolverが画像必須チェックを外すため
  // 新しい画像を選ばなくても送信でき、既存の画像情報がそのまま維持される。
  test('does not require a new image when updating an existing public relation', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.publicRelation = registeredPublicRelation();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPublicRelations(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await expect(page.getByLabel(FIELDS.text)).toHaveValue('既存のPR文です');

    await page.getByLabel(FIELDS.text).fill('E2E更新PR文');
    await submitButton(page).click();

    await expect(page.getByText(MESSAGES.submitSuccess)).toBeVisible();
    expect(state.requestedUrls).toContain(
      `/public_relations/${registeredPublicRelationId}`
    );
    expect(state.imgurUploadCount).toBe(0);
    expect(state.publicRelation).toMatchObject({
      blurb: 'E2E更新PR文',
      picture_name: 'existing.png',
      picture_path: 'https://i.imgur.com/existing.png',
    });
  });

  // validateEdit(): 既存値から一つも変えていない間は送信ボタンが無効。
  test('keeps the submit button disabled until a value actually changes', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.publicRelation = registeredPublicRelation();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPublicRelations(page);
    await page
      .getByRole('button', { name: BUTTONS.edit, exact: true })
      .first()
      .click();

    await expect(submitButton(page)).toBeDisabled();

    await page.getByLabel(FIELDS.text).fill('別のPR文');
    await expect(submitButton(page)).toBeEnabled();
  });

  // 締切後は一覧のみで、修正ボタンを出さない。
  test('hides the edit button after the deadline', async ({ page }) => {
    const state = scenarioState('closed');
    state.publicRelation = registeredPublicRelation();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPublicRelations(page);

    await expect(page.getByText('既存のPR文です')).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 修正済み(旧 Phase 4-2): 以前は PublicRelationsForm/hooks.ts が
  // catch内のtoast.errorに加えて
  // useEffect(() => { if (createError || updateError) toast.error(...) }) も
  // 持っていたため、送信自体(POST/PATCH /public_relations)が失敗すると
  // 同じ文言のトーストが2回出ていた。useEffect側を削除し、catch側の
  // toast.errorのみが呼ばれるようにした。
  test('shows the failure toast once when the submission itself fails', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.forcePublicRelationSubmitError = true;
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPublicRelations(page);
    await page.getByLabel(FIELDS.text).fill('E2E失敗PR文');
    await selectRadio(page, FIELDS.announce, YES);
    await chooseImage(page, SQUARE_IMAGE);
    await expect(page.getByText('アップロード済み: square.png')).toBeVisible();
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText(MESSAGES.submitFailed)).toHaveCount(1);
    expect(state.publicRelation).toBeNull();
  });

  // Imgurアップロード自体が失敗した場合も、createPr呼び出し前にthrowされた
  // 例外がonSubmitのcatchで捕まりtoast.errorが1回呼ばれるだけ
  // (上のテストと同じくcatch側のみが通知元になる)。
  test('shows the failure toast once when only the Imgur upload fails', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.forceImgurUploadError = true;
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openPublicRelations(page);
    await page.getByLabel(FIELDS.text).fill('E2E失敗PR文');
    await selectRadio(page, FIELDS.announce, YES);
    await chooseImage(page, SQUARE_IMAGE);
    await expect(page.getByText('アップロード済み: square.png')).toBeVisible();
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText(MESSAGES.submitFailed)).toHaveCount(1);
    expect(state.requestedUrls).not.toContain('/public_relations');
  });
});
