import { useEffect, useState } from 'react';
import { useGetVenueMap } from '@/api/venueMapApi';
import { FormItem } from '@/components/FormList/type';
import { venueMapLabels } from '../label';

export const useVenueMapHooks = (groupId: number) => {
  const {
    venueMap,
    error: fetchError,
    isLoading: isFetching,
    mutateVenueMap,
  } = useGetVenueMap(groupId || 0);

  const [isEditing, setIsEditing] = useState(true);

  const toEdit = () => {
    setIsEditing(!isEditing);
  };

  // データが読み込まれたら表示モードに（データがあれば）
  useEffect(() => {
    if (venueMap) {
      setIsEditing(false);
    } else {
      setIsEditing(true); // データがなければ編集モードのまま
    }
  }, [venueMap]);

  // backup.md から流用し、現在の VenueMapResponse 型に合わせて修正
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
  };
};
