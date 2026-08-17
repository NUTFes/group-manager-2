import { mutate } from 'swr';

/**
 * 取得系フックのキーで再検証する。
 *
 * `useAuthenticatedGet` の SWR キーは URL 文字列ではなく `[url, session]` の
 * タプルなので、`mutate('/foo/1')` のように文字列を渡しても一致せず何も起きない。
 * 必ずこのヘルパ(キー述語)を通すこと。
 *
 * 同じ書き方は `FoodProduct/hooks.ts` に既にある。
 */
export const revalidateByUrl = (url: string) =>
  mutate((key) => Array.isArray(key) && key[0] === url);

/** 申請の登録状況(アコーディオンの登録済みバッジ)を再検証する。 */
export const revalidateCheckAllRegistered = (groupId: number) =>
  revalidateByUrl(`/check_all_registered/${groupId}`);
