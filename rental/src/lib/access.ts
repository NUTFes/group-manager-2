// Cloudflare Access（Zero Trust）が付与する情報の検証。
//
// cloudflared は Access を通ったリクエストに次のヘッダーを付ける。
//   Cf-Access-Jwt-Assertion            … 署名付きのアクセストークン
//   Cf-Access-Authenticated-User-Email … 認証されたユーザーのメール
//
// メールヘッダーだけを信用すると、Access を迂回して直接BFFに到達できた場合に
// 記録者を偽装できてしまう。そのためJWTをCloudflareのJWKSで検証し、
// 検証済みのクレームからメールを取り出す。
import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  CF_ACCESS_AUD,
  CF_ACCESS_TEAM_DOMAIN,
  DEV_RECORDER_EMAIL,
  isDevelopment,
} from "./serverEnv";

const ACCESS_JWT_HEADER = "cf-access-jwt-assertion";
const ACCESS_EMAIL_HEADER = "cf-access-authenticated-user-email";

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!CF_ACCESS_TEAM_DOMAIN) return null;
  jwks ||= createRemoteJWKSet(
    new URL(`https://${CF_ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`)
  );
  return jwks;
}

export type AccessResult =
  | { ok: true; email: string }
  // code は画面に出してよい短い識別子。detail は内部の設定名を含むためログ専用。
  | { ok: false; code: string; detail: string };

export async function resolveRecorderEmail(
  request: Request
): Promise<AccessResult> {
  const token = request.headers.get(ACCESS_JWT_HEADER);
  const keySet = getJwks();

  // Access の設定が無い環境では検証できない。ローカル開発だけ固定のメールで動かし、
  // それ以外（staging / production）は設定を要求して閉じる。
  // 設定漏れのまま検証なしでヘッダーを信用すると、BFFに直接到達できた人が
  // 記録者を偽装できてしまうため、黙って劣化させない。
  if (!keySet || !CF_ACCESS_AUD) {
    if (!isDevelopment) {
      return {
        ok: false,
        code: "access_not_configured",
        detail: "CF_ACCESS_TEAM_DOMAIN / CF_ACCESS_AUD が未設定です",
      };
    }
    const devEmail =
      request.headers.get(ACCESS_EMAIL_HEADER) || DEV_RECORDER_EMAIL;
    return { ok: true, email: devEmail };
  }

  if (!token) {
    return {
      ok: false,
      code: "access_token_missing",
      detail: "Cf-Access-Jwt-Assertion がありません",
    };
  }

  try {
    const { payload } = await jwtVerify(token, keySet, {
      audience: CF_ACCESS_AUD,
    });
    const email = typeof payload.email === "string" ? payload.email : "";
    if (!email) {
      return {
        ok: false,
        code: "access_email_missing",
        detail: "トークンにメールが含まれていません",
      };
    }
    return { ok: true, email };
  } catch {
    // 失敗理由（期限切れ・署名不一致など）は攻撃者に手がかりを与えるため返さない
    return {
      ok: false,
      code: "access_token_invalid",
      detail: "アクセストークンを検証できませんでした",
    };
  }
}
