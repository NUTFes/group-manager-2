import { useTranslation } from 'next-i18next';

export const useWelcomeBoxTexts = () => {
  const { t } = useTranslation('common');
  return {
    buttons: {
      register: t('welcomeBox.register'),
      login: t('welcomeBox.login'),
    },
    descriptions: {
      register: t('welcomeBox.registerDescription'),
      login: t('welcomeBox.loginDescription'),
    },
  };
};
