import {
  deleteData,
  fetcher,
  patchData,
  postData,
  postFetcherWithSession,
  putData,
} from '@/api/api';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

/* eslint-disable @typescript-eslint/no-explicit-any */

// データ取得のための共通フック
export const useApiGet = <T>(url: string | null, options?: any) => {
  // sessionの状態を取得
  const { data: session, status } = useSession();

  const shouldFetch = status === 'authenticated' && url;

  const { data, error, isLoading, mutate } = useSWR<T>(
    shouldFetch ? [url, session] : null,
    fetcher,
    options
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

// データ送信のための関数を返すフック
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

// データ送信のための共通フック
export const useSwrMutation = (url: string | null, options?: any) => {
  // sessionの状態を取得
  const { data: session, status } = useSession();

  const shouldFetch = status === 'authenticated' && url;

  return useSWRMutation(
    shouldFetch ? [url, session] : null,
    postFetcherWithSession,
    options
  );
};
