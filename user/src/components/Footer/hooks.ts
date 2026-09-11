import { useTranslation } from 'next-i18next';

export const useFooterTexts = () => {
  const { t } = useTranslation('common');
  const copyright = (year: number) => t('footer.copyright', { year });

  return { copyright };
};
