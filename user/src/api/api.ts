import { useAuthStore } from '@/stores/authStore';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * APIのベースURL
 * 環境変数から読み込む
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** * SWR用のフェッチャー関数
 * @param url - 取得先のURL（エンドポイント）
 */
export const fetcher = (url: string) => {
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  const auth = useAuthStore.getState();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (auth.accessToken) {
    headers['access-token'] = auth.accessToken;
    headers.client = auth.client!;
    headers.uid = auth.uid!;
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
 * @param url - リクエスト先のベースURL
 * @param param1 - SWR Mutationで渡される引数（bodyとqueryを含む）
 * @returns レスポンスのJSON
 */
export async function postFetcher(
  url: string,
  { arg }: { arg: { body?: any; query?: { [key: string]: any } } }
): Promise<any> {
  // queryパラメータが存在する場合、URLに追加
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
 * @param url - リクエスト先のベースURL
 * @param param1 - SWR Mutationで渡される引数（bodyとqueryを含む）
 * @returns レスポンスのJSON
 */
export async function patchFetcher(
  url: string,
  { arg }: { arg: { body?: any; query?: { [key: string]: any } } }
): Promise<any> {
  // URLを組み立てる（スラッシュ漏れ対策込み）
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
 * リクエストオプションを生成するヘルパー関数
 * @param method - HTTPメソッド
 * @param data - リクエストボディ（省略可）
 */
export const createRequestOptions = (method: string, data?: any) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    // スネークケース変換はデータ送信時に適用
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
 */
const extractErrorMessage = (
  errorData: any,
  defaultMessage: string
): string => {
  if (!errorData) return defaultMessage;

  // errorsオブジェクトからメッセージを抽出
  if (errorData.errors) {
    if (Array.isArray(errorData.errors)) {
      // エラーが配列の場合 (full_messagesなど)
      return errorData.errors.join(', ');
    }
    if (typeof errorData.errors === 'object') {
      // エラーがオブジェクトの場合 (各フィールドのエラー)
      return Object.entries(errorData.errors)
        .map(
          ([field, messages]) =>
            `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
        )
        .join('\n');
    }
  }

  // messageプロパティが存在する場合はそれを使用
  if (errorData.message) {
    return errorData.message;
  }

  return defaultMessage;
};

/**
 * エラーレスポンスを処理する関数
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
    // JSONパース失敗。テキスト形式のエラーの可能性
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
 */
const parseResponseData = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  const responseText = await response.text();

  // レスポンスボディが空の場合は空オブジェクトを返す
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
 * @param url - エンドポイント
 * @param options - フェッチオプション
 */
export const sendRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const { accessToken, client, uid } = useAuthStore.getState();

  // デフォルトヘッダー設定
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // 認証情報が存在すればヘッダーに追加
  if (accessToken && client && uid) {
    defaultHeaders['access-token'] = accessToken;
    defaultHeaders['client'] = client;
    defaultHeaders['uid'] = uid;
  }

  // オプションにヘッダーをマージ
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, requestOptions);

    // エラーレスポンスの場合
    if (!response.ok) {
      return handleApiError(response);
    }

    // 正常レスポンスの処理
    return parseResponseData<T>(response);
  } catch (networkError) {
    // fetch自体が失敗した場合 (ネットワークエラーなど)
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
 * @param url - エンドポイント
 * @param data - 送信するデータ
 */
export const postData = async <T>(
  url: string,
  data: any
): Promise<ApiResponse<T>> => {
  return sendRequest<T>(url, createRequestOptions('POST', data));
};

/**
 * PUTリクエスト用の関数
 * @param url - エンドポイント
 * @param data - 送信するデータ
 */
export const putData = async <T>(
  url: string,
  data: any
): Promise<ApiResponse<T>> => {
  return sendRequest<T>(url, createRequestOptions('PUT', data));
};

/**
 * DELETEリクエスト用の関数
 * @param url - 削除対象のエンドポイント
 */
export const deleteData = async <T>(url: string): Promise<ApiResponse<T>> => {
  return sendRequest<T>(url, createRequestOptions('DELETE'));
};

/**
 * オブジェクトをクエリパラメータ文字列に変換するユーティリティ関数
 * @param params - キーと値の組み合わせが格納されたオブジェクト
 * @returns クエリパラメータ形式の文字列
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
