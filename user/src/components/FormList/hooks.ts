import { useTranslation } from 'next-i18next';

export const useFormListTexts = () => {
  const { t } = useTranslation('common');
  return {
    actions: {
      edit: t('form.actions.edit'),
      delete: t('form.actions.delete'),
    },
    messages: {
      nonEditable: t('form.messages.nonEditable'),
    },
  };
};
