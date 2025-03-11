import useSWR from 'swr';
import { fetcher, postData, putData, deleteData } from '@/api/api';

// データ取得のための共通フック
export const useApiGet = <T>(url: string | null, options?: any) => {
  const { data, error, isLoading, mutate } = useSWR<T>(
    url,
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
  return {
    post: postData,
    put: putData,
    delete: deleteData
  };
};
