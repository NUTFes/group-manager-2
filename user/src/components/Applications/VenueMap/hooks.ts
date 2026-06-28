import { useEffect, useState } from 'react';
import { useGetVenueMap } from '@/api/venueMapApi';
import { useTranslation } from 'next-i18next';
import { venueMapLabels } from '../label';

export const useVenueMapHooks = (groupId: number) => {
  const { t } = useTranslation('common');
  const {
    venueMap,
    error: fetchError,
    isLoading: isFetching,
    mutateVenueMap,
  } = useGetVenueMap(groupId);

  const [isEditing, setIsEditing] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const toEdit = () => {
    setIsEditing(!isEditing);
  };

  // フォーム送信が成功したら表示モードに切り替え
  const handleFormSubmitted = () => {
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

  return {
    venueMap,
    isLoading: isFetching && !hasLoadedOnce,
    hasError: !!fetchError,
    isEditing,
    toEdit,
    mutate: mutateVenueMap,
    handleFormSubmitted,
    venueMapTexts,
  };
};
