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
    options.body = JSON.stringify(data);
  }

  return options;
};

export class ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status?: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * 共通のAPIリクエストを実行する関数
 * @param url - エンドポイント
 * @param options - フェッチオプション
 */
export const sendRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; headers: Headers; response: Response }> => {
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

  const response = await fetch(`${API_URL}${endpoint}`, requestOptions);

  // 認証ヘッダーをレスポンスから取得 (現在は未使用)
  // const responseAccessToken = response.headers.get('access-token');
  // const responseClient = response.headers.get('client');
  // const responseUid = response.headers.get('uid');

  if (!response.ok) {
    let errorData: any = null;
    let errorMessage = `APIリクエストに失敗しました (ステータス: ${response.status})`;
    try {
      const errorText = await response.text();
      errorData = JSON.parse(errorText);
      // RailsのDevise Token Authのエラー形式を想定
      if (errorData && errorData.errors) {
        if (Array.isArray(errorData.errors)) {
          // エラーが配列の場合 (full_messagesなど)
          errorMessage = errorData.errors.join(', ');
        } else if (typeof errorData.errors === 'object') {
          // エラーがオブジェクトの場合 (各フィールドのエラー)
          errorMessage = Object.entries(errorData.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('\n');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
      // パースは成功したが期待した形式ではない場合、元のテキストを使うことも検討
    } catch (e) {
      // JSONパース失敗。テキスト形式のエラーの可能性
      console.error('API error response parsing failed:', e);
      // console.error('API error response is not valid JSON:', errorText); // デバッグ用
      // errorText をそのまま使うか、デフォルトメッセージを使う
    }
    throw new ApiError(errorMessage, response.status, errorData?.errors);
  }

  // レスポンスボディが空の場合の対応
  const responseText = await response.text();
  let data: T;
  try {
    data = responseText ? (JSON.parse(responseText) as T) : ({} as T);
  } catch (e) {
    console.error('Failed to parse response JSON:', e);
    // console.error("Failed to parse response JSON:", responseText); // 元のテキストもログ出力する場合
    throw new Error('レスポンスのJSONパースに失敗しました');
  }

  return { data, headers: response.headers, response };
};

/**
 * POSTリクエスト用の関数
 * @param url - エンドポイント
 * @param data - 送信するデータ
 */
export const postData = async (url: string, data: any) => {
  return sendRequest(url, createRequestOptions('POST', data));
};

/**
 * PUTリクエスト用の関数
 * @param url - エンドポイント
 * @param data - 送信するデータ
 */
export const putData = async (url: string, data: any) => {
  return sendRequest(url, createRequestOptions('PUT', data));
};

/**
 * DELETEリクエスト用の関数
 * @param url - 削除対象のエンドポイント
 */
export const deleteData = async (url: string) => {
  return sendRequest(url, createRequestOptions('DELETE'));
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
