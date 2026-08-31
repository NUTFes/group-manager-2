import {
  ApiError,
  authenticatedDeleteFetcher,
  authenticatedDeleteFetcherWithId,
  authenticatedGetFetcher,
  authenticatedPatchFetcher,
  authenticatedPatchFetcherWithId,
  authenticatedPostFetcher,
  authenticatedPutFetcher,
  authenticatedPutFetcherWithId,
  unauthenticatedDeleteFetcher,
  unauthenticatedGetFetcher,
  unauthenticatedPatchFetcher,
  unauthenticatedPostFetcher,
  unauthenticatedPutFetcher,
} from '@/api/api';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR, { Key, SWRConfiguration } from 'swr';
import useSWRMutation, {
  MutationFetcher,
  SWRMutationConfiguration,
} from 'swr/mutation';

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

export function createMutationHookWithId<Arg, Data>(
  // ここは MutationFetcher<Data, [string,Session], Arg> 型に合わせる
  fetcher: MutationFetcher<Data, readonly [string, Session], Arg>
) {
  // endpoint: string → Custom Hook を返す
  return (endpoint: string) => {
    return function useAuthenticatedTrigger(
      options?: SWRMutationConfiguration<
        Data,
        ApiError,
        readonly [string, Session],
        Arg
      >
    ) {
      const { data: session, status } = useSession();
      const key =
        status === 'authenticated' && session
          ? ([endpoint, session] as const)
          : null;

      // wrappedFetcher も正しく型注釈する
      const wrappedFetcher: MutationFetcher<
        Data,
        readonly [string, Session],
        Arg
      > = async ([baseUrl, session], { arg }) => {
        let url = baseUrl;
        let actualArg: any = arg;

        // delete のときは Arg＝number
        if (typeof arg === 'number') {
          url = `${baseUrl}/${arg}`;
          actualArg = undefined;
        }
        // put/patch のときは Arg に { id, ... } を想定
        else if (arg && typeof arg === 'object' && 'id' in arg) {
          const { id, ...rest } = arg as any;
          url = `${baseUrl}/${id}`;
          actualArg = rest;
        }

        // 最後にオリジナルの fetcher を呼ぶ
        return fetcher([url, session], { arg: actualArg });
      };

      return useSWRMutation<Data, ApiError, readonly [string, Session], Arg>(
        key!,
        wrappedFetcher,
        options
      );
    };
  };
}

/**　GETリクエスト用のフック　　*/
export const useAuthenticatedGet = <T>(
  url: string | null,
  options?: SWRConfiguration<T, ApiError>
) => {
  const { data: session, status } = useSession();
  const key =
    status === 'authenticated' && url ? ([url, session!] as const) : null;
  const swrOptions: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
    dedupingInterval: 10000,
    ...options,
  };

  return useSWR<T, ApiError>(key, authenticatedGetFetcher, swrOptions);
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

export const useAuthenticatedPutWithId = createMutationHookWithId<
  { id: number; body: any; query?: Record<string, any> },
  any
>(authenticatedPutFetcherWithId);

export const useAuthenticatedPatchWithId = createMutationHookWithId<
  { id: number; body: any; query?: Record<string, any> }, // arg 型
  any // PATCH の返り値の型
>(authenticatedPatchFetcherWithId);

export const useAuthenticatedDeleteWithId = createMutationHookWithId<
  number, // trigger(arg) の arg 型
  void // DELETE の返り値の型
>(authenticatedDeleteFetcherWithId);

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
