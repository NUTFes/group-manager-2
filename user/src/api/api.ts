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

  return fetch(fullUrl)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

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

  try {
    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'APIリクエストに失敗しました');
    }

    return response.json();
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
 * @param data - 更新するデータ
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
