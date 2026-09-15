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
  isProduction,
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
  { ok: true; email: string } | { ok: false; reason: string };

export async function resolveRecorderEmail(
  request: Request
): Promise<AccessResult> {
  const token = request.headers.get(ACCESS_JWT_HEADER);
  const keySet = getJwks();

  // Access の設定が無い環境（ローカル開発）では検証できないため、
  // 本番以外に限り固定のメールで動かす。本番では必ず設定を要求する。
  if (!keySet || !CF_ACCESS_AUD) {
    if (isProduction) {
      return {
        ok: false,
        reason: "CF_ACCESS_TEAM_DOMAIN / CF_ACCESS_AUD が未設定です",
      };
    }
    const devEmail =
      request.headers.get(ACCESS_EMAIL_HEADER) || DEV_RECORDER_EMAIL;
    return { ok: true, email: devEmail };
  }

  if (!token) {
    return { ok: false, reason: "Cf-Access-Jwt-Assertion がありません" };
  }

  try {
    const { payload } = await jwtVerify(token, keySet, {
      audience: CF_ACCESS_AUD,
    });
    const email = typeof payload.email === "string" ? payload.email : "";
    if (!email) {
      return { ok: false, reason: "トークンにメールが含まれていません" };
    }
    return { ok: true, email };
  } catch {
    // 失敗理由（期限切れ・署名不一致など）は攻撃者に手がかりを与えるため返さない
    return { ok: false, reason: "アクセストークンを検証できませんでした" };
  }
}
