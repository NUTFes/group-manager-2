import { useTranslation } from 'next-i18next';

export const usePowerAccordionHooks = () => {
  const { t } = useTranslation('common');

  const powerAccordionTexts = {
    title: t('applications.power.title'),
    deadline: {
      title: t('applications.power.deadline.title'),
      description: t('applications.power.deadline.description'),
    },
  };

  return {
    powerAccordionTexts,
  };
};
