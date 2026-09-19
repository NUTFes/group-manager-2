// BFF とブラウザ、BFF と API のあいだで形を揃えるための定義。
//
// 同じヘッダー名やエラーの形を各所で書くと、片方だけ変えたときに気づけない
// （ヘッダー名は大文字小文字を無視して比較されるため型エラーにもならない）。

/** ブラウザ → BFF。記録者（局名_担当者名）。日本語を載せるためURLエンコードする */
export const STAFF_NAME_HEADER = "X-Rental-Staff-Name";

/** BFF → API。記録者。Cf-Access-* を使わない理由は docs/rental/design.md 6章 */
export const RECORDER_EMAIL_HEADER = "X-Rental-Recorder-Email";

/** BFF → API。呼び出し元がBFFであることを示すサービストークン */
export const API_TOKEN_HEADER = "X-Rental-Api-Token";

/** API の応答の封筒（ApplicationController#fmt と同じ形）。成功にもエラーにも使う */
export type ApiStatusBody = {
  status: { code: number; message: string };
};

/**
 * 応答の本体。Response と NextResponse のどちらで包むかは呼び出し側に任せる
 * （proxy は NextResponse、Route Handler は Response を使う）。
 */
export function apiStatusBody(code: number, message: string): ApiStatusBody {
  return { status: { code, message } };
}
