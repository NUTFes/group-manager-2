import { HealthCenterSubmissionStatus } from '@/api/healthCenterSubmissionStatusApi';
import { useTranslation } from 'next-i18next';

export const useRentItemsAccordionHooks = (
  groupId: number,
  groupCategoryId?: number,
  status?: HealthCenterSubmissionStatus
) => {
  const { t } = useTranslation('common');

  const rentItemsAccordionTexts = {
    title: t('applications.rentItems.title'),
  };

  return { rentItemsAccordionTexts, groupId, groupCategoryId, status };
};
