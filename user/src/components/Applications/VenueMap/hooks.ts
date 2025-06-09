import { useState } from 'react';
import { useGetVenueMap } from '@/api/venueMapApi';
import { FormItem } from '@/components/FormList/type';
import { venueMapLabels } from '../label';

export const useVenueMapHooks = (groupId: number) => {
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
          label: venueMapLabels.pictureName,
          content: venueMap.pictureName || '未設定',
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
