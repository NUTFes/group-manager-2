import {
  authenticatedDeleteFetcher,
  authenticatedGetFetcher,
  authenticatedPatchFetcher,
  authenticatedPostFetcher,
  authenticatedPutFetcher,
  unauthenticatedDeleteFetcher,
  unauthenticatedGetFetcher,
  unauthenticatedPatchFetcher,
  unauthenticatedPostFetcher,
  unauthenticatedPutFetcher,
} from '@/api/api';
// ==========================================
// 独自実装（将来的に削除予定）
import { ApiError, deleteData, patchData, postData, putData } from '@/api/api';
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
    return useSWRMutation<Data, ApiError, MK, Arg>(key!, fetcherFn, options);
  };
};

/**　GETリクエスト用のフック　　*/
export const useAuthenticatedGet = <T>(
  url: string | null,
  options?: SWRConfiguration<T, ApiError>
) => {
  const { data: session, status } = useSession();
  const key =
    status === 'authenticated' && url ? ([url, session!] as const) : null;
  return useSWR<T, ApiError>(key, authenticatedGetFetcher, options);
};

export const useUnauthenticatedGet = <T>(
  url: string | null,
  options?: SWRConfiguration<T, ApiError>
) => useSWR<T, ApiError>(url ?? null, unauthenticatedGetFetcher, options);

/** 認証ありミューテーション用のフック */
export const useAuthenticatedPost = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  readonly [string, Session]
>(authenticatedPostFetcher, (url) => {
  const { data: session, status } = useSession();
  return status === 'authenticated' && url ? ([url, session!] as const) : null;
});

export const useAuthenticatedPut = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  readonly [string, Session]
>(authenticatedPutFetcher, (url) => {
  const { data: session, status } = useSession();
  return status === 'authenticated' && url ? ([url, session!] as const) : null;
});

export const useAuthenticatedPatch = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  readonly [string, Session]
>(authenticatedPatchFetcher, (url) => {
  const { data: session, status } = useSession();
  return status === 'authenticated' && url ? ([url, session!] as const) : null;
});

export const useAuthenticatedDelete = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  readonly [string, Session]
>(authenticatedDeleteFetcher, (url) => {
  const { data: session, status } = useSession();
  return status === 'authenticated' && url ? ([url, session!] as const) : null;
});

export const useAuthenticatedDeleteWithId = <Arg extends { id: number }>(
  url: string | null
) => {
  const { data: session, status } = useSession();
  const key =
    status === 'authenticated' && url ? ([url, session!] as const) : null;

  return useSWRMutation<any, ApiError, readonly [string, Session], Arg>(
    key!,
    (key, { arg }) => {
      const fullUrl = `${key[0]}/${arg.id}`;
      return authenticatedDeleteFetcher(
        [fullUrl, key[1]] as const,
        { arg } as { arg: { body?: any } }
      );
    }
  );
};

export const useAuthenticatedPatchWithId = <
  Arg extends { id: number; body?: any },
>(
  url: string | null
) => {
  const { data: session, status } = useSession();
  const key =
    status === 'authenticated' && url ? ([url, session!] as const) : null;

  return useSWRMutation<any, ApiError, readonly [string, Session], Arg>(
    key!,
    (key, { arg }) => {
      const fullUrl = `${key[0]}/${arg.id}`;
      return authenticatedPatchFetcher([fullUrl, key[1]], {
        arg: { body: arg.body },
      });
    }
  );
};

/** 認証なしミューテーション用のフック */
export const useUnauthenticatedPost = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  string
>(unauthenticatedPostFetcher, (url) => url ?? null);

export const useUnauthenticatedPut = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  string
>(unauthenticatedPutFetcher, (url) => url ?? null);

export const useUnauthenticatedPatch = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  string
>(unauthenticatedPatchFetcher, (url) => url ?? null);

export const useUnauthenticatedDelete = createMutationHook<
  { body?: any; query?: Record<string, any> },
  any,
  string
>(unauthenticatedDeleteFetcher, (url) => url ?? null);

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
