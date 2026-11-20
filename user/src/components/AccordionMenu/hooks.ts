import { useTranslation } from 'next-i18next';

export const useAccordionMenuTexts = () => {
  const { t } = useTranslation('common');
  return {
    labels: {
      required: t('form.required'),
      optional: t('form.optional'),
    },
  };
};
