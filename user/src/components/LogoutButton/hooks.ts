import { useTranslation } from 'next-i18next';

export const useLogoutButtonTexts = () => {
  const { t } = useTranslation('common');
  return {
    label: t('auth.logout'),
  };
};
