// 合言葉を設定している環境で、入口を守る（Next 16 では middleware ではなく proxy）。
//
// Cloudflare Access を前段に置ける構成では RENTAL_PASSCODE を設定せず、ここは素通しになる。
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PASSCODE_COOKIE,
  isPasscodeEnabled,
  matchesPasscodeCookie,
} from "@/lib/passcode";

const UNLOCK_PATH = "/unlock";
const UNLOCK_API_PATH = "/api/rental/unlock";

export function proxy(request: NextRequest) {
  if (!isPasscodeEnabled()) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === UNLOCK_PATH || pathname === UNLOCK_API_PATH) {
    return NextResponse.next();
  }
  if (matchesPasscodeCookie(request.cookies.get(PASSCODE_COOKIE)?.value)) {
    return NextResponse.next();
  }

  // BFF は JSON で返す。ここでHTMLに飛ばすと fetch がログイン画面を受け取ってしまう
  // TODO: この `{ status: { code, message } }` は bff.ts が export している
  // jsonError() と同じ形を手組みしている。route.ts の /api/rental/unlock も
  // 同様なので、共通ヘルパーとして揃えた方がよい。
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      {
        status: { code: 401, message: "合言葉が必要です (passcode_required)" },
      },
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
  // 静的アセットとPWAの資材は素通しにする（合言葉の画面自体が壊れるため）
  matcher: [
    "/((?!_next/static|_next/image|icons/|favicon.ico|manifest.webmanifest|sw.js|symbol-mark.svg|apple-icon.png).*)",
  ],
};
