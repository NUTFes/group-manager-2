import { useTranslation } from 'next-i18next';

export const useRentItemsAccordionHooks = () => {
  const { t } = useTranslation('common');

  const rentItemsAccordionTexts = {
    title: t('applications.rentItems.title'),
  };

  return { rentItemsAccordionTexts };
};
