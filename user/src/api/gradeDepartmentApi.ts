import { useEffect, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { useUnauthenticatedGet } from '@/hooks/useApi';

const API_ENDPOINTS = {
  GRADES: '/grades',
  DEPARTMENTS: '/departments',
};

type ApiResponse<T> = {
  status: { code: number; message: string };
  data: T;
};

type MasterResponse = {
  id: number;
  name: string;
  nameEn?: string | null;
};

export type SelectorOption = {
  id: number;
  name: string;
  disabled?: boolean;
};

// 登録画面など未ログインの画面でも使うため、認証なしで取得する
const useLocalizedMasterOptions = (endpoint: string) => {
  const { t, i18n } = useTranslation('common');
  const { data, error, isLoading } =
    useUnauthenticatedGet<ApiResponse<MasterResponse[]>>(endpoint);
  const isEnglish = i18n.language.startsWith('en');

  const options: SelectorOption[] = useMemo(() => {
    const records = data?.status?.code === 200 ? data.data : [];
    return [
      { id: 0, name: t('lists.select') },
      ...records.map((record) => ({
        id: record.id,
        name: isEnglish && record.nameEn ? record.nameEn : record.name,
      })),
    ];
  }, [data, isEnglish, t]);

  const hasError = !!error;

  // 取得に失敗すると選択肢がプレースホルダーだけになるため、原因が分かるように通知する
  useEffect(() => {
    if (hasError) {
      toast.error(t('general.errors.fetch'));
    }
  }, [hasError, t]);

  return { options, isLoading, hasError };
};

// 学年の選択肢を取得するフック
export const useGradeOptions = () =>
  useLocalizedMasterOptions(API_ENDPOINTS.GRADES);

// 学部・専攻の選択肢を取得するフック
export const useDepartmentOptions = () =>
  useLocalizedMasterOptions(API_ENDPOINTS.DEPARTMENTS);
