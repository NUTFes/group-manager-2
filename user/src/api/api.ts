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

  // 認証情報を取得
  const authStr = localStorage.getItem('auth');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (authStr) {
    const auth = JSON.parse(authStr);
    headers['access-token'] = auth['access-token'];
    headers.client = auth.client;
    headers.uid = auth.uid;
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

/**
 * 共通のAPIリクエストを実行する関数
 * @param url - エンドポイント
 * @param options - フェッチオプション
 */
export const sendRequest = async (url: string, options: RequestInit) => {
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;

  // 認証情報を取得
  const authStr = localStorage.getItem('auth');
  if (authStr) {
    const auth = JSON.parse(authStr);
    options.headers = {
      ...options.headers,
      'access-token': auth['access-token'],
      client: auth.client,
      uid: auth.uid,
    };
  }

  try {
    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'APIリクエストに失敗しました');
    }

    const data = await response.json();

    // 認証ヘッダーを取得
    const authHeaders = {
      'access-token': response.headers.get('access-token'),
      client: response.headers.get('client'),
      uid: response.headers.get('uid'),
    };

    // 認証ヘッダーが存在する場合、localStorageに保存
    if (authHeaders['access-token']) {
      localStorage.setItem('auth', JSON.stringify(authHeaders));
    }

    return {
      data,
      headers: response.headers,
      auth: authHeaders,
    };
  } catch (error) {
    throw error;
  }
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
