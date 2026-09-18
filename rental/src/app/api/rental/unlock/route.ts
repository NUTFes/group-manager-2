import { NextResponse } from "next/server";
import {
  PASSCODE_COOKIE,
  isPasscodeEnabled,
  matchesPasscode,
  passcodeCookieValue,
} from "@/lib/passcode";
import { isProduction } from "@/lib/serverEnv";

// 合言葉が正しければ Cookie を発行する。当日は一度入れたら使い続けられるよう長めに保つ
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

// POST /api/rental/unlock … 合言葉の照合
export async function POST(request: Request) {
  if (!isPasscodeEnabled()) {
    return NextResponse.json(
      { status: { code: 404, message: "合言葉は使いません" } },
      { status: 404 }
    );
  }

  let passcode = "";
  try {
    const body = (await request.json()) as { passcode?: string };
    passcode = body.passcode ?? "";
  } catch {
    // 空のまま照合して失敗させる
  }

  if (!matchesPasscode(passcode)) {
    return NextResponse.json(
      { status: { code: 401, message: "合言葉が違います" } },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ status: { code: 200, message: "OK" } });
  response.cookies.set({
    name: PASSCODE_COOKIE,
    value: passcodeCookieValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  return response;
}
