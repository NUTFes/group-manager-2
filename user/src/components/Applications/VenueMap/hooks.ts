import { useEffect, useState } from 'react';
import {
  useGetHealthCenterSubmissionStatus,
  useUpdateHealthCenterSubmissionStatus,
} from '@/api/healthCenterSubmissionStatusApi';
import { useGetVenueMap } from '@/api/venueMapApi';
import { useTranslation } from 'next-i18next';
import { FormItem } from '@/components/FormList/type';
import { venueMapLabels } from '../label';

export const useVenueMapHooks = (groupId: number, status?: string) => {
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

  //ステータス変更処理
  const { healthCenterSubmissionStatus, mutateHealthCenterSubmissionStatus } =
    useGetHealthCenterSubmissionStatus(groupId);
  const { trigger: patchHealthCenterSubmissionStatus } =
    useUpdateHealthCenterSubmissionStatus()();

  const updateStatus = async (status: 'unapproved') => {
    const venueMapSubmission = healthCenterSubmissionStatus.find(
      (submission) => submission.applicationType === 'venue_map'
    );

    if (!venueMapSubmission?.id) {
      throw new Error('Venue map submission status id not found');
    }

    await patchHealthCenterSubmissionStatus({
      id: venueMapSubmission.id,
      body: { status },
    });

    await mutateHealthCenterSubmissionStatus();
  };

  // フォーム送信が成功したら表示モードに切り替え
  const handleFormSubmitted = async () => {
    if (status === 'waiting_resubmission') {
      // status更新処理
      await updateStatus('unapproved');
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
