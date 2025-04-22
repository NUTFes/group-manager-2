import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// 認証が不要なパスのリスト
const publicPaths = ['/', '/register', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証が不要なパスの場合はスキップ
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // ローカルストレージから認証情報を取得
  const authStorage = request.cookies.get('auth-storage');
  if (!authStorage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const authData = JSON.parse(authStorage.value);
    const state = authData.state;

    // 認証情報が存在しない、または期限切れの場合はログインページにリダイレクト
    if (!state.accessToken || !state.client || !state.uid) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // JSONのパースに失敗した場合もログインページにリダイレクト
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
