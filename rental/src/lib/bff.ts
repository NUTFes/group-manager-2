// BFF（Route Handler）からRails APIを呼ぶための共通処理。
//
// ブラウザはAPIを直接呼ばない。Access のCookieはrentalのドメインにしか無く、
// APIへ識別情報を運べないため、ここでサーバー側から呼ぶ（設計書6章）。
import { resolveRecorderEmail } from "./access";
import { RENTAL_API_TOKEN, SSR_API_URL } from "./serverEnv";

const API_TOKEN_HEADER = "X-Rental-Api-Token";
// 記録者のヘッダーに Cf-Access-* をそのまま使わない。SSR_API_URL が公開URLだと
// この区間が Cloudflare を通り、クライアント由来の Cf- ヘッダーは偽装防止のため
// 削除されてしまう（本番で記録のPOSTだけ401になっていた原因）。
// 値は下の resolveRecorderEmail が Access のJWTを検証して取り出したもの。
const RECORDER_EMAIL_HEADER = "X-Rental-Recorder-Email";

type ForwardOptions = {
  path: string;
  method?: "GET" | "POST";
  query?: Record<string, string | null | undefined>;
  body?: unknown;
  // 記録を作成するときだけ記録者メールを転送する
  withRecorderEmail?: boolean;
};

function buildUrl(path: string, query: ForwardOptions["query"]): string {
  const url = new URL(path.replace(/^\//, ""), `${SSR_API_URL}/`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === null || value === undefined || value === "") continue;
    url.searchParams.set(key, value);
  }
  return url.toString();
}

function jsonError(status: number, message: string) {
  return Response.json({ status: { code: status, message } }, { status });
}

/**
 * APIへ転送する。Accessの検証、サービストークンの付与、記録者メールの転送を担う。
 */
export async function forwardToApi(
  request: Request,
  {
    path,
    method = "GET",
    query,
    body,
    withRecorderEmail = false,
  }: ForwardOptions
): Promise<Response> {
  const access = await resolveRecorderEmail(request);
  if (!access.ok) {
    return jsonError(401, access.reason);
  }

  if (!RENTAL_API_TOKEN) {
    // 設定漏れを黙って200で返さない。settingsリポジトリの.envに追加が必要。
    return jsonError(500, "RENTAL_API_TOKEN が設定されていません");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    [API_TOKEN_HEADER]: RENTAL_API_TOKEN,
  };
  if (withRecorderEmail) {
    headers[RECORDER_EMAIL_HEADER] = access.email;
  }

  try {
    const response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      // 記録は常に最新を取りたいため、Route Handler側でキャッシュしない
      cache: "no-store",
    });

    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // APIコンテナが落ちている場合など。内部URLを漏らさないメッセージにする
    return jsonError(502, "APIに接続できませんでした");
  }
}

export { jsonError };
