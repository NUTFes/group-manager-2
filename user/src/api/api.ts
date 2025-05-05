import { useAuthStore } from '@/stores/authStore';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * APIのベースURL
 * 環境変数から読み込む
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * SWR用のフェッチャー関数
 * 認証情報がある場合は自動的にヘッダーに追加
 * レスポンスは自動的にキャメルケースに変換
 */
export const fetcher = (url: string) => {
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  const auth = useAuthStore.getState();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (auth.accessToken) {
    headers['access-token'] = auth.accessToken;
    headers['client'] = auth.client!;
    headers['uid'] = auth.uid!;
  }

  return fetch(fullUrl, {
    headers,
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      const json = await res.json();
      return camelcaseKeys(json, { deep: true });
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

/**
 * POSTリクエスト用のfetcher関数
 * クエリパラメータとボディをサポート
 */
export async function postFetcher(
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
 * PATCHリクエスト用のfetcher関数
 * クエリパラメータとボディをサポート
 * エラー時はレスポンスの詳細をログ出力
 */
export async function patchFetcher(
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
//DELETEリクエスト用のfetcher関数
export async function deleteFetcher(
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
export const sendRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const { accessToken, client, uid } = useAuthStore.getState();

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (accessToken && client && uid) {
    defaultHeaders['access-token'] = accessToken;
    defaultHeaders['client'] = client;
    defaultHeaders['uid'] = uid;
  }

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
  data: any
): Promise<ApiResponse<T>> => {
  return sendRequest<T>(url, createRequestOptions('POST', data));
};

/**
 * PUTリクエスト用の関数
 * データは自動的にスネークケースに変換
 */
export const putData = async <T>(
  url: string,
  data: any
): Promise<ApiResponse<T>> => {
  return sendRequest<T>(url, createRequestOptions('PUT', data));
};

/**
 * DELETEリクエスト用の関数
 */
export const deleteData = async <T>(url: string): Promise<ApiResponse<T>> => {
  return sendRequest<T>(url, createRequestOptions('DELETE'));
};

/**
 * オブジェクトをクエリパラメータ文字列に変換する関数
 * キーは自動的にスネークケースに変換
 */
function objectToQueryString(params: { [key: string]: any }): string {
  const snakeParams = snakecaseKeys(params, { deep: true });
  return Object.keys(snakeParams)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(snakeParams[key])}`
    )
    .join('&');
}
