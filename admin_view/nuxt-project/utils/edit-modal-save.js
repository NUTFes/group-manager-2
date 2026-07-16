// utils/edit-modal-save.js
// 編集モーダル(create/update)共通の保存・エラーハンドリング処理。
// バックエンドの fmt() は 422 のバリデーションエラー詳細を
// response.data.status.option に格納するため、そこを優先して読み取る。
export async function saveEditModal({ emit, request, label }) {
  try {
    const response = await request();
    const savedId = response?.data?.id;

    if (typeof savedId === 'undefined') {
      console.error(`${label}の保存レスポンスに id がありませんでした`, response);
      emit('error', '保存に失敗しました');
      return;
    }

    emit('saved', savedId);
    emit('close');
  } catch (error) {
    console.error(`${label}の編集に失敗しました`, error);
    emit(
      'error',
      error?.response?.data?.status?.option ||
        error?.response?.data?.status?.message ||
        error?.message ||
        '保存に失敗しました'
    );
  }
}
