// 模擬店平面図申請(VenueMap)の特性化テスト。
//
// VenueMapはPublicRelationsのほぼクローンだが、静かに挙動がずれている:
//   1. 手書きresolverラップが、編集時に画像エラーを種類を問わず全て消す
//      (PublicRelationsはメッセージ文字列を照合し、required エラーだけを消す)。
//   2. setValue('image', ..., { shouldDirty: true }) を使い、送信ボタンの
//      無効化もPublicRelationsのvalidateEdit()ではなくRHFのisDirtyで判定する。
//   3. Imgur失敗時の内部エラーが日本語ハードコード(`エラー: ${status}`)。
//      PublicRelationsは英語(`Error: ${status}`)。
//   4. 画像エラーのキーがtextsオブジェクトではなく生のリテラル文字列
//      (ただしUpload側のtranslateErrorがt(key, {defaultValue:key})を
//      呼ぶため、翻訳キーとして解決できれば表示自体は正しい日本語になる)。
//   5. 送信完了の通知が onSubmitted?.() コールバック(PublicRelationsは
//      フォーム側で toEdit() を直接呼ぶ)。
// 挙動を「直す」ことはせず、現状をそのまま記録する。
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
  submitButton,
} from '../support/selectors';

const FIELDS = {
  picture: '模擬店平面図画像',
  checklist: '平面図確認事項',
} as const;

const CHECKLIST_OPTIONS = [
  'ゴミ箱の設置位置を記載しました。',
  '食材の保存場所を記載しました。',
  '申請した物品をすべて平面図に記載しました。',
  '火気・電化製品の使用場所を明記しました。',
  'パーテーション/掲示板が調理場内に入っておらず、テントの側面に設置してあることを確認しました。',
] as const;

const MESSAGES = {
  submitSuccess: '送信しました。',
  submitFailed: '送信に失敗しました。時間を置いて再度お試しください。',
  imageRequired: '模擬店平面図画像をアップロードしてください。',
  checklistRequired: 'すべての項目を確認してください。',
  imgurUploadFailed: '画像のアップロードに失敗しました。',
} as const;

const SQUARE_IMAGE = path.join(__dirname, '../support/fixtures/square.png');

const registeredVenueMapId = 12001;

const registeredVenueMap = (): ScenarioState['venueMap'] => ({
  id: registeredVenueMapId,
  group_id: mockGroupId,
  picture_name: 'existing.png',
  picture_path: 'https://i.imgur.com/existing.png',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
});

const openVenueMap = (page: Page) =>
  page
    .getByRole('button', { name: new RegExp(APPLICATION_TITLES.venueMap) })
    .click();

/** アップロードボタン。Upload はネイティブの<button>でtitleが空文字のため、固定文言"アップロード"で拾う。 */
const uploadButton = (page: Page) =>
  page.locator('button', { hasText: 'アップロード' });

/**
 * handleImageUpload() は document.createElement('input') で未接続のinputを動的生成し
 * input.click() を呼ぶ実装。DOM未接続でも同一の同期呼び出し内であればブラウザのネイティブ
 * ファイル選択ダイアログは発火し、Playwrightの filechooser イベントで捕まえられる。
 */
const chooseImage = async (
  page: Page,
  file: string | { name: string; mimeType: string; buffer: Buffer }
) => {
  const fileChooserPromise = page.waitForEvent('filechooser');
  await uploadButton(page).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(file);
};

const checkAllChecklistItems = async (page: Page) => {
  for (const label of CHECKLIST_OPTIONS) {
    await page.getByLabel(label, { exact: true }).check();
  }
};

test.describe('venue map application', () => {
  // 未登録なら、アコーディオンを開いた時点で入力フォームが表示される。
  test('shows the input form when nothing is registered yet', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenueMap(page);

    await expect(page.getByText(FIELDS.picture)).toBeVisible();
    await expect(uploadButton(page)).toBeVisible();
    await expect(page.getByText(FIELDS.checklist)).toBeVisible();
    for (const label of CHECKLIST_OPTIONS) {
      await expect(page.getByLabel(label, { exact: true })).toBeVisible();
    }
    await expect(
      page.getByRole('button', { name: BUTTONS.register, exact: true })
    ).toBeVisible();
  });

  // 手書きresolverラップにより、新規作成時のみ画像が必須になる。
  // エラーメッセージは生のi18nキーリテラルだが、Upload側のtranslateErrorが
  // t(key, { defaultValue: key }) するため表示自体は翻訳済みの日本語になる。
  test('requires an image when creating a new venue map', async ({ page }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenueMap(page);
    await checkAllChecklistItems(page);
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText(MESSAGES.imageRequired)).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
    expect(state.imgurUploadCount).toBe(0);
  });

  // チェックリストは常に5項目全てが必須(schema.tsのlength(5))。
  test('requires all checklist items when creating a new venue map', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenueMap(page);
    await chooseImage(page, SQUARE_IMAGE);
    await expect(page.getByText('アップロード済み: square.png')).toBeVisible();
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText(MESSAGES.checklistRequired)).toBeVisible();
    expect(state.requestedUrls).toHaveLength(0);
  });

  // 画像を選んで登録すると、まずImgurにアップロードしてから
  // POST /venue_maps が snake_case のクエリで呼ばれる。
  test('creates a venue map, uploading the image to Imgur first', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenueMap(page);
    await chooseImage(page, SQUARE_IMAGE);
    await expect(page.getByText('アップロード済み: square.png')).toBeVisible();
    await checkAllChecklistItems(page);

    const checkAllRegisteredBefore = state.groupFetchCounts.checkAllRegistered;
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText(MESSAGES.submitSuccess)).toBeVisible();
    expect(state.imgurUploadCount).toBe(1);
    expect(state.requestedUrls).toContain('/venue_maps');
    expect(state.venueMap).toMatchObject({
      group_id: mockGroupId,
      picture_name: 'square.png',
      picture_path: 'https://i.imgur.com/e2e-mock.png',
    });

    // onSubmitted?.() コールバック経由でフォームが閉じ、要約表示に切り替わる
    // (PublicRelationsはフォーム側からtoEdit()を直接呼ぶが、こちらは
    // VenueMap側のhandleFormSubmittedをonSubmittedとして渡す構造)。
    await expect(page.getByText(FIELDS.checklist)).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: /のプレビューを開く/ })
    ).toBeVisible();

    // BUG: mutate(`check_all_registered/${groupId}`) は先頭スラッシュの無い
    // 文字列キーで呼ばれており、useAuthenticatedGet が使う実際のタプルキー
    // [url, session] とは一致しない。そのため登録済みバッジのもとになる
    // check_all_registered は再検証されず、カウントは変化しない。
    expect(state.groupFetchCounts.checkAllRegistered).toBe(
      checkAllRegisteredBefore
    );
  });

  // 登録済みなら一覧表示になり、画像プレビューと修正ボタンが出る。
  test('shows the summary with the picture preview when already registered', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.venueMap = registeredVenueMap();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenueMap(page);

    await expect(
      page.getByRole('button', { name: /のプレビューを開く/ })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toBeVisible();
  });

  // VenueMapだけ setValue('image', ..., { shouldDirty: true }) を使い、
  // 送信ボタンの無効化もRHFのisDirtyで判定する
  // (PublicRelationsのvalidateEdit()とは別ロジック)。
  // チェックリストのdefaultValuesは常に[]なので、1項目チェックしただけでも
  // isDirtyはtrueになり送信ボタンが有効化される。
  test('keeps the submit button disabled until isDirty flips via any change', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.venueMap = registeredVenueMap();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenueMap(page);
    await page.getByRole('button', { name: BUTTONS.edit, exact: true }).click();

    await expect(submitButton(page)).toBeDisabled();

    // チェックリストを1項目だけチェックする(5項目揃っていなくてもisDirtyはtrueになる)
    await page.getByLabel(CHECKLIST_OPTIONS[0], { exact: true }).check();

    await expect(submitButton(page)).toBeEnabled();
  });

  // 既存データを編集する場合は、resolverが画像必須チェックを外すため
  // 新しい画像を選ばなくても送信できる。ただしchecklistはAPIに保存されない
  // フィールドのため、defaultValuesは編集時も常に[]から始まり、
  // 5項目を毎回チェックし直さないと送信できない。
  test('does not require a new image when updating, but still requires re-checking the checklist', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.venueMap = registeredVenueMap();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenueMap(page);
    await page.getByRole('button', { name: BUTTONS.edit, exact: true }).click();
    await checkAllChecklistItems(page);
    await submitButton(page).click();

    await expect(page.getByText(MESSAGES.submitSuccess)).toBeVisible();
    expect(state.requestedUrls).toContain(
      `/venue_maps/${registeredVenueMapId}`
    );
    expect(state.imgurUploadCount).toBe(0);
    expect(state.venueMap).toMatchObject({
      picture_name: 'existing.png',
      picture_path: 'https://i.imgur.com/existing.png',
    });
  });

  // BUG: PublicRelationsの手書きresolverはエラーメッセージ文字列を照合して
  // 「必須」エラーだけを消すが、VenueMapは `if (errors.image) delete errors.image`
  // で編集時の画像エラーを種類を問わず全て消す。
  //
  // ただしzodResolverは検証失敗時、result.values を空オブジェクトで返す
  // (エラーが1つでもあればフォーム全体のparseが失敗する)ため、resolverラップが
  // errors.image を後から消してもresult.valuesはすでに空のまま。
  // その結果: 許可されていない形式のファイルを選んでもエラー表示は一切出ず、
  // ファイル名・プレビューはUI上「アップロード済み」に見えるが、実際に送信される
  // formData.image は undefined になり、送信は「画像を変更しなかった」ものとして
  // 既存の画像のまま静かに成功してしまう(ユーザーは新しい画像に差し替わったと
  // 誤認するが、実際には差し替わっていない)。
  test('silently drops an invalid image type when editing an existing venue map', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.venueMap = registeredVenueMap();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenueMap(page);
    await page.getByRole('button', { name: BUTTONS.edit, exact: true }).click();

    await chooseImage(page, {
      name: 'wrong-type.gif',
      mimeType: 'image/gif',
      buffer: Buffer.from('e2e-not-a-real-image'),
    });
    // クライアント側の見た目上は選択が反映される(検証はしていないため)。
    await expect(
      page.getByText('アップロード済み: wrong-type.gif')
    ).toBeVisible();

    // 本来 schema.ts の fileType refine に引っかかるはずだが、編集時は
    // resolverラップが errors.image を無条件で消すためエラー表示が出ない。
    await expect(
      page.getByText('ファイル形式はpngまたはjpegにしてください')
    ).toHaveCount(0);

    await checkAllChecklistItems(page);
    await submitButton(page).click();

    await expect(page.getByText(MESSAGES.submitSuccess)).toBeVisible();
    // Imgurへは一切アップロードされない(formData.imageが空になっているため)。
    expect(state.imgurUploadCount).toBe(0);
    // 送信結果は既存の画像のまま(見た目は差し替えたはずなのに実データは不変)。
    expect(state.venueMap).toMatchObject({
      picture_name: 'existing.png',
      picture_path: 'https://i.imgur.com/existing.png',
    });
  });

  // 締切後は一覧のみで、修正ボタンを出さない。
  test('hides the edit button after the deadline', async ({ page }) => {
    const state = scenarioState('closed');
    state.venueMap = registeredVenueMap();
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenueMap(page);

    await expect(
      page.getByRole('button', { name: /のプレビューを開く/ })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: BUTTONS.edit, exact: true })
    ).toHaveCount(0);
    expect(state.requestedUrls).toHaveLength(0);
  });

  // BUG(二重toast): VenueMapForm/hooks.ts は catch内のtoast.errorに加えて
  // useEffect(() => { if (createError || updateError) toast.error(...) }) を持つため、
  // 送信自体(POST/PATCH /venue_maps)が失敗すると同じ文言のトーストが2回出る。
  // Group/GroupForm/hooks.ts では既に同種のuseEffectを削除済みだが、
  // VenueMapはまだ未修正のため、ここでは現状(2回出る)をそのまま記録する。
  test('shows the failure toast twice when the submission itself fails', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.forceVenueMapSubmitError = true;
    await mockHomePageApis(page, state);

    await page.goto('/home');
    await openVenueMap(page);
    await chooseImage(page, SQUARE_IMAGE);
    await expect(page.getByText('アップロード済み: square.png')).toBeVisible();
    await checkAllChecklistItems(page);
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText(MESSAGES.submitFailed)).toHaveCount(2);
    expect(state.venueMap).toBeNull();
  });

  // Imgurアップロード自体が失敗した場合は例外がcreateVenueMap呼び出し前に
  // throwされるため createError/updateError は発生せず、useEffect側は発火しない
  // (上のテストとの対比: 失敗の原因によってトーストが1回のときと2回のときがある)。
  // uploadImageToImgur内部で imgurUploadFailedメッセージへ詰め替えられた例外は
  // onSubmitの外側catchでさらに揉み消され、結局 submitFailed の文言で
  // トーストされる(PublicRelationsと同じ構造)。
  // また、VenueMapは内部エラーを `エラー: ${status}` と日本語ハードコードしており
  // (PublicRelationsは `Error: ${status}` と英語)、これはコンソールログにのみ残る。
  test('shows the failure toast once when only the Imgur upload fails', async ({
    page,
  }) => {
    const state = scenarioState('registration');
    state.forceImgurUploadError = true;
    await mockHomePageApis(page, state);

    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/home');
    await openVenueMap(page);
    await chooseImage(page, SQUARE_IMAGE);
    await expect(page.getByText('アップロード済み: square.png')).toBeVisible();
    await checkAllChecklistItems(page);
    await page
      .getByRole('button', { name: BUTTONS.register, exact: true })
      .click();

    await expect(page.getByText(MESSAGES.submitFailed)).toHaveCount(1);
    expect(state.requestedUrls).not.toContain('/venue_maps');

    // BUG: uploadImageToImgur内部の生エラーが日本語ハードコード('エラー: 500')。
    // ユーザーには翻訳済みメッセージが出るが、コンソールにはこの生文字列が残る。
    expect(consoleErrors.some((text) => text.includes('エラー: 500'))).toBe(
      true
    );
  });
});
