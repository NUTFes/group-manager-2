// QRコードのペイロードは参加団体の確定画面URL（設計書8章の決定事項）。
//   例: https://group-manager.nutfes.net/confirmed?group_id=12&secret=xxxx
// #2193 がサーバー側で生成し、#2202 が確定画面に表示する。

export type ScannedGroup = {
  groupId: string;
  secret: string;
};

const CONFIRMED_PATH = "/confirmed";

/**
 * 団体QRが指してよいオリジン。next.config.ts が APP_ENV ごとの user アプリの
 * URL を埋め込む（カンマ区切りで複数指定できる）。
 * 未設定なら候補なし = すべて拒否する（設定漏れを黙って通さない）。
 */
const ALLOWED_ORIGINS: string[] = (process.env.NEXT_PUBLIC_USER_FRONT_URL ?? "")
  .split(",")
  .map((value) => {
    try {
      return new URL(value.trim()).origin;
    } catch {
      return null;
    }
  })
  .filter((origin): origin is string => origin !== null);

/**
 * スキャンした文字列から group_id と secret を取り出す。
 * URL以外・user アプリ以外のオリジン・パスが /confirmed でない・必要なクエリが
 * 無いものは受け付けない。
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

  // 別サイトのQRを読んでもAPIへ問い合わせないよう、オリジンとパスの両方を確認する。
  // パスだけでは https://example.com/confirmed のような別ドメインのQRを通してしまう
  if (!ALLOWED_ORIGINS.includes(url.origin)) return null;
  if (url.pathname.replace(/\/$/, "") !== CONFIRMED_PATH) return null;

  const groupId = url.searchParams.get("group_id");
  const secret = url.searchParams.get("secret");
  if (!groupId || !secret || !/^\d+$/.test(groupId)) return null;

  return { groupId, secret };
}
