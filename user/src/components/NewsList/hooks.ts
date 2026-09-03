import { useTranslation } from 'next-i18next';

export const useNewsListTexts = () => {
  const { t } = useTranslation('common');
  return {
    title: t('news.title'),
    loading: t('news.loading'),
    error: t('news.error'),
    none: t('news.none'),
  };
};
