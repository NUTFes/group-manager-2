import {
  HealthCenterSubmissionStatus,
  isResubmissionStatus,
} from '@/api/healthCenterSubmissionStatusApi';
import { useGetVenueMap } from '@/api/venueMapApi';
import { useTranslation } from 'next-i18next';
import { venueMapLabels } from '../label';
import { useEditableSection, useSubmissionStatusReset } from '../shared';

export const useVenueMapHooks = (
  groupId: number,
  isRegistered?: boolean,
  status?: HealthCenterSubmissionStatus
) => {
  const { t } = useTranslation('common');
  const {
    venueMap,
    error: fetchError,
    isLoading: isFetching,
    mutateVenueMap,
  } = useGetVenueMap(groupId);

  const isResubmission = isResubmissionStatus(status);

  const {
    isEditing,
    toEdit,
    isLoading: isSectionLoading,
  } = useEditableSection({ isLoading: isFetching, isRegistered });

  const resetSubmissionStatus = useSubmissionStatusReset(
    groupId,
    'venue_map',
    status,
    t('applications.venueMap.messages.statusUpdateFailed')
  );

  // フォーム送信が成功したら表示モードに切り替え
  const handleFormSubmitted = async () => {
    if (!(await resetSubmissionStatus())) return;

    if (isEditing) {
      toEdit();
    }
  };

  const venueMapTexts = {
    title: t('applications.venueMap.title'),
    loading: t('general.loading'),
    errors: {
      fetch: t('general.errors.fetch'),
    },
    summary: {
      pictureLabel: t(venueMapLabels.pictureName),
      notSet: t('applications.venueMap.summary.notSet'),
    },
  };

  return {
    venueMap,
    isLoading: isSectionLoading,
    hasError: !!fetchError,
    isEditing,
    toEdit,
    mutate: mutateVenueMap,
    handleFormSubmitted,
    venueMapTexts,
    isResubmission,
  };
};
