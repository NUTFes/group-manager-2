import { useState } from 'react';
import { useGetVenueMap } from '@/api/venueMapApi';
import { useTranslation } from 'next-i18next';
import { FormItem } from '@/components/FormList/type';
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

  const toEdit = () => {
    setIsEditing(!isEditing);
  };

  // フォーム送信が成功したら表示モードに切り替え
  const handleFormSubmitted = () => {
    setIsEditing(false);
  };

  const formItems: FormItem[] = venueMap
    ? [
        {
          label: t(venueMapLabels.pictureName),
          content:
            venueMap.pictureName || t('applications.venueMap.summary.notSet'),
        },
      ]
    : [];

  return {
    venueMap,
    isLoading: isFetching,
    hasError: !!fetchError,
    isEditing,
    toEdit,
    formItems,
    mutate: mutateVenueMap,
    handleFormSubmitted,
  };
};
