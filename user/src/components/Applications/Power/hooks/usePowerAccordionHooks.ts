import { useTranslation } from 'next-i18next';

export const usePowerAccordionHooks = () => {
  const { t } = useTranslation('common');

  const powerAccordionTexts = {
    title: t('applications.power.title'),
  };

  return {
    powerAccordionTexts,
  };
};
