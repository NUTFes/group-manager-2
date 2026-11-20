// パスワードを設定している環境で、入口を守る（Next 16 では middleware ではなく proxy）。
//
// Cloudflare Access を前段に置ける構成では RENTAL_PASSCODE を設定せず、ここは素通しになる。
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiStatusBody } from "@/lib/apiContract";
import {
  PASSCODE_COOKIE,
  isPasscodeEnabled,
  matchesPasscodeCookie,
} from "@/lib/passcode";
import { CF_ACCESS_AUD, CF_ACCESS_TEAM_DOMAIN } from "@/lib/serverEnv";

const UNLOCK_PATH = "/unlock";
const UNLOCK_API_PATH = "/api/rental/unlock";
const ACCESS_JWT_HEADER = "cf-access-jwt-assertion";

// Access が設定されていてトークンも来ているなら、そちらを優先して通す。
// こうしないと、Access とパスワードの両方を設定した移行期間に、Access で
// 認証済みの人までパスワードを求められてしまう。
//
// ここでは**ヘッダーがあるかどうかしか見ない**。値の検証は後段の BFF
// （lib/access.ts）が JWKS で行う。そのため次の前提が要る。
//
//   /api/rental/* の Route Handler は、必ず forwardToApi を通すこと。
//
// 通さないものを足すと、偽のヘッダーを付けるだけでパスワード無しに到達できて
// しまう。認証を持たない /api/rental/unlock だけが例外で、これは下で先に
// 素通しさせている（パスワードの照合そのものを行う入口のため）。
function hasAccessToken(request: NextRequest): boolean {
  const isAccessConfigured =
    CF_ACCESS_TEAM_DOMAIN !== "" && CF_ACCESS_AUD !== "";

  return isAccessConfigured && request.headers.get(ACCESS_JWT_HEADER) !== null;
}

export function proxy(request: NextRequest) {
  if (!isPasscodeEnabled()) return NextResponse.next();

  if (hasAccessToken(request)) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === UNLOCK_PATH || pathname === UNLOCK_API_PATH) {
    return NextResponse.next();
  }
  if (matchesPasscodeCookie(request.cookies.get(PASSCODE_COOKIE)?.value)) {
    return NextResponse.next();
  }

  // BFF は JSON で返す。ここでHTMLに飛ばすと fetch がログイン画面を受け取ってしまう
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      apiStatusBody(401, "パスワードが必要です (passcode_required)"),
      { status: 401 }
    );
  }

  // 戻り先はクエリで持ち回さない。外部URLへ飛ばされる余地を作らないため、
  // 解錠後は必ず最初の画面へ送る
  const url = request.nextUrl.clone();
  url.pathname = UNLOCK_PATH;
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // 静的アセットとPWAの資材は素通しにする（パスワードの画面自体が壊れるため）
  matcher: [
    "/((?!_next/static|_next/image|icons/|favicon.ico|manifest.webmanifest|sw.js|symbol-mark.svg|apple-icon.png).*)",
  ],
};
