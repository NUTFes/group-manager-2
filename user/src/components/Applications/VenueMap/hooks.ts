import { useEffect, useState } from 'react';
import {
  HealthCenterSubmissionStatus,
  useUpdateSubmissionStatusFor,
} from '@/api/healthCenterSubmissionStatusApi';
import { useGetVenueMap } from '@/api/venueMapApi';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { FormItem } from '@/components/FormList/type';
import { venueMapLabels } from '../label';

export const useVenueMapHooks = (
  groupId: number,
  status?: HealthCenterSubmissionStatus
) => {
  const { t } = useTranslation('common');
  const {
    venueMap,
    error: fetchError,
    isLoading: isFetching,
    mutateVenueMap,
  } = useGetVenueMap(groupId);

  const [isEditing, setIsEditing] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const isResubmission = status === 'waiting_resubmission';

  const toEdit = () => {
    setIsEditing(!isEditing);
  };

  const updateStatus = useUpdateSubmissionStatusFor(groupId, 'venue_map');

  // フォーム送信が成功したら表示モードに切り替え
  const handleFormSubmitted = async () => {
    if (status !== 'unapproved') {
      try {
        await updateStatus('unapproved');
      } catch (e) {
        console.error(e);
        toast.error(t('applications.venueMap.messages.statusUpdateFailed'));
      }
    }

    setIsEditing(false);
  };

  useEffect(() => {
    if (!isFetching) {
      setHasLoadedOnce(true);
    }
  }, [isFetching]);

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

  const formItems: FormItem[] = venueMap
    ? [
        {
          label: venueMapTexts.summary.pictureLabel,
          content: venueMap.pictureName || venueMapTexts.summary.notSet,
        },
      ]
    : [];

  return {
    venueMap,
    isLoading: isFetching && !hasLoadedOnce,
    hasError: !!fetchError,
    isEditing,
    toEdit,
    formItems,
    mutate: mutateVenueMap,
    handleFormSubmitted,
    venueMapTexts,
    isResubmission,
    updateStatus,
  };
};
