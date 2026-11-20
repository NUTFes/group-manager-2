import { useTranslation } from 'next-i18next';

export const useUploadTexts = () => {
  const { t } = useTranslation('common');
  return {
    labels: {
      required: t('form.required'),
      upload: t('form.actions.upload'),
    },
    translateError: (error?: string) =>
      error ? t(error, { defaultValue: error }) : '',
  };
};
