import camelcaseKeys from 'camelcase-keys';
import type { Session } from 'next-auth';
import snakecaseKeys from 'snakecase-keys';
import { MutationFetcher } from 'swr/mutation';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ==========================================
// 簡素化＆共通化したFetcher実装
// ==========================================
/** APIのベースURL */
export type ApiError = Error & {
  info?: {
    exception?: string;
    errors?: Record<string, string[]>;
  };
  status?: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  session?: Session;
  query?: Record<string, unknown>;
  body?: any;
};

type MutationArgs = { body?: any; query?: Record<string, any> };

/** ヘッダー組み立て */
function buildHeaders(session?: Session): HeadersInit {
  const haaders: HeadersInit = { 'Content-Type': 'application/json' };
  if (session) {
    haaders['access-token'] = session.accessToken!;
    haaders['client'] = session.client!;
    haaders['uid'] = session.uid!;
  }
  return haaders;
}

/** クエリ文字列化 */
function objectToQueryString(params: Record<string, unknown>): string {
  const snake = snakecaseKeys(params, { deep: true });
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(snake)) {
    if (value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  }
  return searchParams.toString();
}

/** 汎用リクエスト */
async function request<T>(
  url: string,
  { method = 'GET', session, query, body }: FetchOptions = {}
): Promise<T> {
  let fullURL = url.startsWith('http') ? url : `${API_URL}${url}`;
  if (query) {
    fullURL += `?${objectToQueryString(query)}`;
  }
  const res = await fetch(fullURL, {
    method,
    headers: buildHeaders(session),
    body: body
      ? JSON.stringify(snakecaseKeys(body, { deep: true }))
      : undefined,
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const err = new Error(
      `${method} ${fullURL} failed (status ${res.status})`
    ) as ApiError;
    (err as any).info = errorBody;
    (err as any).status = res.status;
    throw err;
  }
  const json = await res.json();
  return camelcaseKeys(json, { deep: true }) as T;
}

// GET用Fetcher
export const authenticatedGetFetcher = <T>([url, session]: readonly [
  string,
  Session,
]): Promise<T> => request<T>(url, { session });
export const unauthenticatedGetFetcher = <T>(url: string): Promise<T> =>
  request<T>(url);

/** ミューテーション用Fetcherの共通化 */
const authenticatedMutationFetcher =
  (method: FetchOptions['method']) =>
  <T>(
    [url, session]: readonly [string, Session],
    { arg }: { arg?: MutationArgs } = {}
  ): Promise<T> => {
    const opts: FetchOptions = { method, session };
    if (arg?.body) opts.body = arg.body;
    if (arg?.query) opts.query = arg.query;
    return request<T>(url, opts);
  };

const authenticatedMutationFetcherWithId =
  <Data, Arg = undefined>(
    method: FetchOptions['method']
  ): MutationFetcher<Data, readonly [string, Session], Arg> =>
  async (
    [url, session],
    // 明示的に { arg: Arg } 型を受ける
    { arg }: { arg: Arg }
  ) => {
    const opts: FetchOptions = { method, session };
    // Arg が { body, query } を持っていればコピー
    if (arg && typeof arg === 'object') {
      if ('body' in arg) opts.body = (arg as any).body;
      if ('query' in arg) opts.query = (arg as any).query;
    }
    return request<Data>(url, opts);
  };

const unauthenticatedMutationFetcher =
  (method: FetchOptions['method']) =>
  <T>(url: string, { arg }: { arg?: MutationArgs } = {}): Promise<T> => {
    const opts: FetchOptions = { method };
    if (arg?.body) opts.body = arg.body;
    if (arg?.query) opts.query = arg.query;
    return request<T>(url, opts);
  };

// 認証ありミューテーションFetcher（POST, PUT, PATCH, DELETE）
export const authenticatedPostFetcher = authenticatedMutationFetcher('POST');
export const authenticatedPutFetcher = authenticatedMutationFetcher('PUT');
export const authenticatedPatchFetcher = authenticatedMutationFetcher('PATCH');
export const authenticatedDeleteFetcher =
  authenticatedMutationFetcher('DELETE');

export const authenticatedPutFetcherWithId = authenticatedMutationFetcherWithId<
  any,
  { id: number; body: any; query?: any }
>('PUT');
export const authenticatedPatchFetcherWithId =
  authenticatedMutationFetcherWithId<
    any,
    { id: number; body: any; query?: any }
  >('PATCH');
export const authenticatedDeleteFetcherWithId =
  authenticatedMutationFetcherWithId<void, number>('DELETE');

// 認証なしミューテーションFetcher（POST, PUT, PATCH, DELETE）
export const unauthenticatedPostFetcher =
  unauthenticatedMutationFetcher('POST');
export const unauthenticatedPutFetcher = unauthenticatedMutationFetcher('PUT');
export const unauthenticatedPatchFetcher =
  unauthenticatedMutationFetcher('PATCH');
export const unauthenticatedDeleteFetcher =
  unauthenticatedMutationFetcher('DELETE');

// 新しい戻り値の型を定義
export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      headers: Headers;
      response: Response;
      error?: never; // エラーがないことを示す
    }
  | {
      success: false;
      error: {
        message: string;
        status?: number;
        errors?: Record<string, string[]>;
      };
      data?: never; // データがないことを示す
      headers?: Headers; // エラー時でもヘッダーを返す場合がある
      response?: Response; // エラー時でもレスポンスを返す場合がある
    };
