/**
 * 既存レコードとフォームの現在値を、指定したキーだけで比較する。
 *
 * 各群が `validateEdit()` という名前で
 * 「既存値と1つも違わなければ送信ボタンを無効にする」判定を
 * フィールドごとの手書き等価比較でコピーしていたものを一本化したもの。
 *
 * original が undefined（＝新規登録）のときは false を返す。
 * 新規は「未変更だから押せない」ではなく、常に送信できるべきだからである。
 *
 * keys は両方の型に存在するキーしか受け付けないため、綴り間違いは型で弾ける。
 * 値の比較自体は、レスポンス型とフォーム型で表現が異なる場合があるので
 * unknown 経由の同一性比較に留める。
 */
export const isUnchanged = <T extends object, V extends object>(
  original: T | undefined,
  values: V | undefined,
  keys: readonly (keyof T & keyof V)[]
): boolean => {
  if (!original || !values) return false;

  return keys.every(
    (key) => (original[key] as unknown) === (values[key] as unknown)
  );
};
