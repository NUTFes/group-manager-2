// BFF（/api/rental/*）を叩くクライアント。APIのURLやトークンはサーバー側に
// 隠れているため、ここではブラウザから見える相対パスだけを扱う。
import camelcaseKeys from "camelcase-keys";
import { readStoredRecorder } from "@/hooks/useWorkSession";
import type { ApiResponse } from "@/types/rental";

// 記録者（局名_担当者名）。Access が無い構成ではこれが recorder になる（設計書6章）。
// 日本語をそのままヘッダーに載せられないため encodeURIComponent する
// TODO: 同じヘッダー名が rental/src/lib/access.ts にも独立した文字列リテラル
// として定義されている。共有定数に揃えた方がよい。
const STAFF_NAME_HEADER = "X-Rental-Staff-Name";

// TODO: getFromBff / postToBff の両方から毎回呼ばれるため、記録者メールが
// 不要な GET（進捗確認や場所一覧の取得など）でも毎回 localStorage の読み出しと
// JSON.parse・セッション形式の検証が走る。呼び出し側は useWorkSession() で
// 既にメモ化済みの session を持っているので、そちらを渡す形にできれば無駄がない。
function staffHeaders(): Record<string, string> {
  const recorder = readStoredRecorder();
  return recorder ? { [STAFF_NAME_HEADER]: encodeURIComponent(recorder) } : {};
}

export type ApiError = Error & {
  status?: number;
};

async function parseError(response: Response): Promise<ApiError> {
  const error = new Error(
    `リクエストに失敗しました (${response.status})`
  ) as ApiError;
  error.status = response.status;

  try {
    const body = (await response.json()) as {
      status?: { message?: string; option?: string };
    };
    const message = body.status?.option || body.status?.message;
    if (message) error.message = message;
  } catch {
    // JSONでない応答（502のHTMLなど）はステータスだけで十分
  }

  return error;
}

/** GET。レスポンスの data を camelCase に変換して返す */
export async function getFromBff<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: { Accept: "application/json", ...staffHeaders() },
  });
  if (!response.ok) throw await parseError(response);

  const body = (await response.json()) as ApiResponse<unknown>;
  return camelcaseKeys(body.data as Record<string, unknown>, {
    deep: true,
  }) as T;
}

/** POST。送るボディは呼び出し側で組み立てた形をそのまま渡す */
export async function postToBff<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...staffHeaders(),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await parseError(response);

  const parsed = (await response.json()) as ApiResponse<unknown>;
  return camelcaseKeys(parsed.data as Record<string, unknown>, {
    deep: true,
  }) as T;
}

/** SWR 用の fetcher */
export const bffFetcher = <T>(path: string) => getFromBff<T>(path);
