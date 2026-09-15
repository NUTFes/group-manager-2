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

// ==========================================
// 独自実装（将来的に削除予定）
// ==========================================

/**
 * POSTリクエスト用の関数（独自実装）
 * クエリパラメータとボディをサポート
 */
export async function legacyPostFetcher(
  url: string,
  { arg }: { arg: { body?: any; query?: { [key: string]: any } } }
): Promise<any> {
  let finalUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  if (arg.query) {
    const queryStr = objectToQueryString(arg.query);
    finalUrl = `${API_URL}${url}?${queryStr}`;
  }

  const response = await fetch(finalUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg.body),
  });

  if (!response.ok) {
    throw new Error('Error posting data');
  }
  return response.json();
}

/**
 * PATCHリクエスト用の関数（独自実装）
 * クエリパラメータとボディをサポート
 * エラー時はレスポンスの詳細をログ出力
 */
export async function legacyPatchFetcher(
  url: string,
  { arg }: { arg: { body?: any; query?: { [key: string]: any } } }
): Promise<any> {
  let finalUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  if (arg.query) {
    const queryStr = objectToQueryString(arg.query);
    finalUrl = `${finalUrl}?${queryStr}`;
  }

  const response = await fetch(finalUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg.body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('PATCH failed:', errorText);
    throw new Error('Error patching data');
  }

  return response.json();
}

/**
 * DELETEリクエスト用の関数（独自実装）
 * クエリパラメータをサポート
 */
export async function legacyDeleteFetcher(
  url: string,
  { arg }: { arg?: { query?: { [key: string]: any } } } = {}
): Promise<any> {
  let finalUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  if (arg?.query) {
    const queryStr = objectToQueryString(arg.query);
    finalUrl = `${finalUrl}?${queryStr}`;
  }

  const response = await fetch(finalUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('DELETE failed:', errorText);
    throw new Error('Error deleting data');
  }

  return response.json();
}

/**
 * リクエストオプションを生成するヘルパー関数
 * データがある場合は自動的にスネークケースに変換
 */
export const createRequestOptions = (method: string, data?: any) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(snakecaseKeys(data, { deep: true }));
  }

  return options;
};

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

/**
 * エラーレスポンスからメッセージを抽出する関数
 * 以下の形式に対応:
 * - errors配列
 * - errorsオブジェクト（フィールドごとのエラー）
 * - messageプロパティ
 */
const extractErrorMessage = (
  errorData: any,
  defaultMessage: string
): string => {
  if (!errorData) return defaultMessage;

  if (errorData.errors) {
    if (Array.isArray(errorData.errors)) {
      return errorData.errors.join(', ');
    }
    if (typeof errorData.errors === 'object') {
      return Object.entries(errorData.errors)
        .map(
          ([field, messages]) =>
            `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
        )
        .join('\n');
    }
  }

  if (errorData.message) {
    return errorData.message;
  }

  return defaultMessage;
};

/**
 * エラーレスポンスを処理する関数
 * エラーメッセージの抽出とログ出力を行う
 */
const handleApiError = async (
  response: Response
): Promise<ApiResponse<never>> => {
  const defaultErrorMessage = `APIリクエストに失敗しました (ステータス: ${response.status})`;
  let errorData = null;
  let errorMessage = defaultErrorMessage;

  try {
    const errorText = await response.text();
    if (errorText) {
      errorData = JSON.parse(errorText);
      errorMessage = extractErrorMessage(errorData, defaultErrorMessage);
    }
  } catch (e) {
    console.error('API error response parsing failed:', e);
  }

  return {
    success: false,
    error: {
      message: errorMessage,
      status: response.status,
      errors: errorData?.errors,
    },
    headers: response.headers,
    response: response,
  };
};

/**
 * レスポンスのJSONをパースする関数
 * 空のレスポンスの場合は空オブジェクトを返す
 */
const parseResponseData = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  const responseText = await response.text();

  if (!responseText) {
    return {
      success: true,
      data: {} as T,
      headers: response.headers,
      response,
    };
  }

  try {
    const data = JSON.parse(responseText) as T;
    return {
      success: true,
      data,
      headers: response.headers,
      response,
    };
  } catch (e) {
    console.error('Failed to parse response JSON:', e);
    return {
      success: false,
      error: {
        message: 'レスポンスのJSONパースに失敗しました',
        status: response.status,
      },
      headers: response.headers,
      response: response,
    };
  }
};

/**
 * 共通のAPIリクエストを実行する関数
 * 認証情報の自動付与とエラーハンドリングを行う
 */
const sendRequest = async <T>(
  endpoint: string,
  session: Session,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const defaultHeaders: HeadersInit = buildHeaders(session);

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, requestOptions);

    if (!response.ok) {
      return handleApiError(response);
    }

    return parseResponseData<T>(response);
  } catch (networkError) {
    console.error('Network error during API request:', networkError);
    const message =
      networkError instanceof Error
        ? networkError.message
        : 'ネットワークエラーが発生しました';

    return {
      success: false,
      error: {
        message: `ネットワークリクエストに失敗しました: ${message}`,
      },
    };
  }
};

/**
 * POSTリクエスト用の関数
 * データは自動的にスネークケースに変換
 */
export const postData = async <T>(
  url: string,
  data: any,
  session: Session
): Promise<ApiResponse<T>> => {
  return sendRequest<T>(url, session, createRequestOptions('POST', data));
};

/**
 * PUTリクエスト用の関数
 * データは自動的にスネークケースに変換
 */
export const putData = async <T>(
  url: string,
  data: any,
  session: Session
): Promise<ApiResponse<T>> => {
  return sendRequest<T>(url, session, createRequestOptions('PUT', data));
};

/**
 * DELETEリクエスト用の関数
 */
export const deleteData = async <T>(
  url: string,
  session: Session
): Promise<ApiResponse<T>> => {
  return sendRequest<T>(url, session, createRequestOptions('DELETE'));
};

export const patchData = async <T>(
  url: string,
  data: any,
  session: Session
): Promise<ApiResponse<T>> => {
  return sendRequest<T>(url, session, createRequestOptions('PATCH', data));
};
