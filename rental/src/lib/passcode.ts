// パスワードによる簡易的な入口の制限。
//
// Cloudflare Access の席数上限に達した場合など、Access を前段に置けないときに使う。
// 人の識別はしないので「誰が記録したか」は担当者名の自己申告になる（設計書6章）。
// URL を知っているだけの人やクローラからの書き込みを防ぐのが目的。
//
// 画面とドキュメントでは「パスワード」と呼ぶ。識別子（RENTAL_PASSCODE / passcode）は
// 英語のまま揃えている。
import { createHash, timingSafeEqual } from "node:crypto";
import { RENTAL_PASSCODE } from "./serverEnv";

export const PASSCODE_COOKIE = "rental-passcode";

/** パスワードが設定されていなければ、この仕組みは使わない（Access で守る構成） */
export const isPasscodeEnabled = () => RENTAL_PASSCODE !== "";

/**
 * Cookie に入れる値。パスワードそのものは置かず、そこから決まる固定の値にする。
 * 突き合わせに使う以上は事実上のトークンだが、パスワードの平文をブラウザに残さない。
 */
export function passcodeCookieValue(): string {
  return createHash("sha256").update(RENTAL_PASSCODE).digest("hex");
}

function equals(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  // timingSafeEqual は長さが違うと例外になるため、先に長さを見る
  return left.length === right.length && timingSafeEqual(left, right);
}

/** 入力されたパスワードが正しいか */
export function matchesPasscode(input: string): boolean {
  return isPasscodeEnabled() && equals(input, RENTAL_PASSCODE);
}

/** Cookie の値が正しいか */
export function matchesPasscodeCookie(value: string | undefined): boolean {
  return (
    isPasscodeEnabled() &&
    value !== undefined &&
    equals(value, passcodeCookieValue())
  );
}
