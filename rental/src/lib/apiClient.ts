// BFF（/api/rental/*）を叩くクライアント。APIのURLやトークンはサーバー側に
// 隠れているため、ここではブラウザから見える相対パスだけを扱う。
import camelcaseKeys from "camelcase-keys";
import { readStoredRecorder } from "@/hooks/useWorkSession";
import type { ApiResponse } from "@/types/rental";

// 記録者（局名 担当者名）。Access が無い構成ではこれが recorder になる（設計書6章）。
// 日本語をそのままヘッダーに載せられないため encodeURIComponent する
const STAFF_NAME_HEADER = "X-Rental-Staff-Name";

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
