// utils/auth-token-cookie.js
// devise_token_auth のトークンを Cookie にも保存し、SSR（asyncData など）のリクエストにも
// 認証ヘッダーを付けられるようにする。
// localStorage への保存をやめるまでの暫定対応（#2253 で方針を決めて置き換える）。

export const AUTH_TOKEN_KEYS = ["access-token", "client", "uid", "token-type"];

const COOKIE_PREFIX = "gm_auth_";
// devise_token_auth の token_lifespan（2週間）に合わせる
const MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

function writeCookie(key, value, maxAge) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${COOKIE_PREFIX}${key}=${encodeURIComponent(value)}` +
    `; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function setAuthTokenCookie(key, value) {
  if (!value) return;
  writeCookie(key, value, MAX_AGE_SECONDS);
}

// レスポンスヘッダー（または localStorage の値）からまとめて保存する
export function saveAuthTokenCookies(tokens) {
  AUTH_TOKEN_KEYS.forEach((key) => setAuthTokenCookie(key, tokens[key]));
}

export function clearAuthTokenCookies() {
  AUTH_TOKEN_KEYS.forEach((key) => writeCookie(key, "", 0));
}

// SSR 時に、リクエストの Cookie ヘッダーからトークンを取り出す
export function readAuthTokenCookies(cookieHeader) {
  const tokens = {};
  (cookieHeader || "").split(";").forEach((pair) => {
    const [rawName, ...rawValue] = pair.trim().split("=");
    if (!rawName.startsWith(COOKIE_PREFIX)) return;

    const key = rawName.slice(COOKIE_PREFIX.length);
    if (!AUTH_TOKEN_KEYS.includes(key)) return;

    try {
      tokens[key] = decodeURIComponent(rawValue.join("="));
    } catch (e) {
      // 壊れた値は無視する（認証ヘッダーが付かず 401 になる）
    }
  });
  return tokens;
}
