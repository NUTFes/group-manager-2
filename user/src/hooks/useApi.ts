import { deleteData, fetcher, postData, putData } from '@/api/api';
import useSWR from 'swr';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const useApiGet = <T>(url: string | null, options?: any) => {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    //SWRの自動リフェッチが原因でフォームがリセットされるのを防止
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    ...options,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

// データ送信のための関数を返すフック
export const useApiMutations = () => {
  return {
    post: postData,
    put: putData,
    delete: deleteData,
  };
};
