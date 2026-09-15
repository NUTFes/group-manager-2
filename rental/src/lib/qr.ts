// QRコードのペイロードは参加団体の確定画面URL（設計書8章の決定事項）。
//   例: https://group-manager.nutfes.net/confirmed?group_id=12&secret=xxxx
// #2193 がサーバー側で生成し、#2202 が確定画面に表示する。

export type ScannedGroup = {
  groupId: string;
  secret: string;
};

/**
 * スキャンした文字列から group_id と secret を取り出す。
 * URL以外・パスが /confirmed でない・必要なクエリが無いものは受け付けない。
 */
export function parseGroupQr(raw: string): ScannedGroup | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  // 別サイトのQRを読んでもAPIへ問い合わせないよう、パスを確認する
  if (!url.pathname.endsWith("/confirmed")) return null;

  const groupId = url.searchParams.get("group_id");
  const secret = url.searchParams.get("secret");
  if (!groupId || !secret || !/^\d+$/.test(groupId)) return null;

  return { groupId, secret };
}
