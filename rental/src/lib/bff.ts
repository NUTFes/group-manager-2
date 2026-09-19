// BFF（Route Handler）からRails APIを呼ぶための共通処理。
//
// ブラウザはAPIを直接呼ばない。Access のCookieはrentalのドメインにしか無く、
// APIへ識別情報を運べないため、ここでサーバー側から呼ぶ（設計書6章）。
import { resolveRecorderEmail } from "./access";
import {
  API_TOKEN_HEADER,
  RECORDER_EMAIL_HEADER,
  apiErrorBody,
} from "./apiContract";
import { RENTAL_API_TOKEN, SSR_API_URL } from "./serverEnv";

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
  return Response.json(apiErrorBody(status, message), { status });
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
    // 内部の設定名は画面に出さない。現地では画面のコードを、原因はログを見る
    console.error(
      `[rental] access check failed: ${access.code}: ${access.detail}`
    );
    return jsonError(401, `認証情報を確認できませんでした (${access.code})`);
  }

  if (!RENTAL_API_TOKEN) {
    // 設定漏れを黙って200で返さない。settingsリポジトリの.envに追加が必要。
    console.error("[rental] RENTAL_API_TOKEN が設定されていません");
    return jsonError(500, "サーバーの設定が不足しています (api_token_missing)");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    [API_TOKEN_HEADER]: RENTAL_API_TOKEN,
  };
  if (withRecorderEmail) {
    // パスワードの構成では記録者が担当者名の自己申告になる。作業場所の選択からやり直せば
    // 入り直せるので、足りないことをコードで伝える
    if (!access.email) {
      return jsonError(
        401,
        "担当者名が設定されていません (staff_name_missing)"
      );
    }
    // 記録者はアプリの中では平文で扱い、ホップごとに必要な形へ包む。
    // Access のメールと担当者名を同じ型で扱えるようにするためで、HTTPヘッダーには
    // 日本語をそのまま載せられないのでここでURLエンコードする（API側で戻す）
    headers[RECORDER_EMAIL_HEADER] = encodeURIComponent(access.email);
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
