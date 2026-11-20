import { useTranslation } from 'next-i18next';

export const useLanguageSwitcherTexts = () => {
  const { t } = useTranslation('common');
  return {
    label: t('languageSwitcher.label'),
    languages: {
      ja: t('languageSwitcher.japanese'),
      en: t('languageSwitcher.english'),
    },
  };
};
