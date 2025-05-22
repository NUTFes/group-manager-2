import {
  deleteFetcher,
  deleteFetcherWithSession,
  fetcher,
  noSessionFetcher,
  patchFetcher,
  patchFetcherWithSession,
  postFetcher,
  postFetcherWithSession,
  putFetcher,
  putFetcherWithSession,
} from '@/api/api';
// ==========================================
// 独自実装（将来的に削除予定）
import { deleteData, patchData, postData, putData } from '@/api/api';
import { Session } from 'next-auth';
// ==========================================

import { useSession } from 'next-auth/react';
import useSWR, { Key, SWRConfiguration } from 'swr';
import useSWRMutation, { MutationFetcher } from 'swr/mutation';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Mutationフックの共通生成関数
 * @template Arg ミューテーション時の引数型
 * @template Data レスポンスデータ型
 * @template MK mutaton key の型 (SWRのKeyに制約)
 */
const createMutationHook = <Arg, Data, MK extends Key>(
  fetcherFn: MutationFetcher<Data, MK, Arg>,
  getKey: (url: string | null) => MK | null
) => {
  return (url: string | null, options?: any) => {
    const key = getKey(url);
    return useSWRMutation<Data, Error, MK, Arg>(key!, fetcherFn, options);
  };
};

/**
 * GETリクエスト用のフック
 * @returns {SWRResponse<T, Error>} - データ、ローディング状態、エラー情報を含むオブジェクト
 *   - data: T | undefined - 取得したデータ
 *   - error: Error | undefined - エラー情報
 *   - isLoading: boolean - ローディング中かどうか
 *   - isValidating: boolean - 再検証中かどうか
 *   - mutate: (data?: T | Promise<T>, shouldRevalidate?: boolean) => Promise<T | undefined> - データの更新関数
 */
export const useApiGet = <T>(
  url: string | null,
  options?: SWRConfiguration<T, Error>
) => {
  const { data: session, status } = useSession();
  const key =
    status === 'authenticated' && url ? ([url, session!] as const) : null;
  return useSWR<T, Error>(key, fetcher, options);
};

export const useApiGetNoAuth = <T>(
  url: string | null,
  options?: SWRConfiguration<T, Error>
) => useSWR<T, Error>(url ?? null, noSessionFetcher, options);

/** 認証ありミューテーション */
/**
 * @returns {SWRMutationResponse<T, Error>} {
 *   data: T | undefined;        // レスポンスデータ
 *   error: Error | undefined;   // エラー情報
 *   isMutating: boolean;        // ミューテーション実行中かどうか
 *   reset: () => void;          // 状態のリセット関数
 *   // POST,PUT,PATCH
 *   trigger: (arg?: { body?: any; query?: Record<string, any> }) => Promise<T | undefined>; // ミューテーション実行関数
 *   // DELETE
 *   trigger: (arg?: { query?: Record<string, any> }) => Promise<T | undefined>; // ミューテーション実行関数
 * }
 */
export const useApiPost = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  readonly [string, Session]
>(postFetcherWithSession, (url) => {
  const { data: session, status } = useSession();
  return status === 'authenticated' && url ? ([url, session!] as const) : null;
});

export const useApiPut = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  readonly [string, Session]
>(putFetcherWithSession, (url) => {
  const { data: session, status } = useSession();
  return status === 'authenticated' && url ? ([url, session!] as const) : null;
});

export const useApiPatch = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  readonly [string, Session]
>(patchFetcherWithSession, (url) => {
  const { data: session, status } = useSession();
  return status === 'authenticated' && url ? ([url, session!] as const) : null;
});

export const useApiDelete = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  readonly [string, Session]
>(deleteFetcherWithSession, (url) => {
  const { data: session, status } = useSession();
  return status === 'authenticated' && url ? ([url, session!] as const) : null;
});

/** 認証なしミューテーション */
/**
 * @returns {SWRMutationResponse<T, Error>} {
 *   data: T | undefined;        // レスポンスデータ
 *   error: Error | undefined;   // エラー情報
 *   isMutating: boolean;        // ミューテーション実行中かどうか
 *   reset: () => void;          // 状態のリセット関数
 *   // POST,PUT,PATCH
 *   trigger: (arg?: { body?: any; query?: Record<string, any> }) => Promise<T | undefined>; // ミューテーション実行関数
 *   // DELETE
 *   trigger: (arg?: { query?: Record<string, any> }) => Promise<T | undefined>; // ミューテーション実行関数
 * }
 */
export const useApiPostNoAuth = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  string
>(postFetcher, (url) => url ?? null);

export const useApiPutNoAuth = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  string
>(putFetcher, (url) => url ?? null);

export const useApiPatchNoAuth = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  string
>(patchFetcher, (url) => url ?? null);

export const useApiDeleteNoAuth = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  string
>(deleteFetcher, (url) => url ?? null);

// ==========================================
// 独自実装（将来的に削除予定）
// ==========================================

// データ送信のための関数を返すフック（独自実装）
export const useApiMutations = () => {
  const { data: session, status } = useSession();

  // セッションがまだ取得されていない場合や、未認証の場合は、適切にハンドリングする
  if (status !== 'authenticated') {
    return {
      post: async () => {
        throw new Error('User is not authenticated');
      },
      put: async () => {
        throw new Error('User is not authenticated');
      },
      remove: async () => {
        throw new Error('User is not authenticated');
      },
      patch: async () => {
        throw new Error('User is not authenticated');
      },
    };
  }

  return {
    post: (url: string, data: any) => postData(url, data, session),
    put: (url: string, data: any) => putData(url, data, session),
    remove: (url: string) => deleteData(url, session),
    patch: (url: string, data: any) => patchData(url, data, session),
  };
};
