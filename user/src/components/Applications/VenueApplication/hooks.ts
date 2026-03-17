import { useEffect, useState } from 'react';
import { useGetPlaceOrder, usePlacesData } from '@/api/venueApplication';
import { FormItem } from '@/components/FormList/type';

export const usePlaceOrdersHooks = (groupId: number) => {
  const {
    placeOrder,
    isLoading: isPlaceOrderLoading,
    hasError,
    mutate: placeOrderMutate,
  } = useGetPlaceOrder(groupId);
  const { places, placesLoading: isPlacesLoading } = usePlacesData(groupId);

  const firstPlace = places.find((place) => place.id === placeOrder?.first);
  const secondPlace = places.find((place) => place.id === placeOrder?.second);
  const thirdPlace = places.find((place) => place.id === placeOrder?.third);
  const formItem: FormItem[] = placeOrder
    ? [
        {
          label: '第一希望',
          content: firstPlace?.name || '',
        },
        {
          label: '第二希望',
          content: secondPlace?.name || '',
        },
        {
          label: '第三希望',
          content: thirdPlace?.name || '',
        },
        {
          label: '備考',
          content: placeOrder?.remark || '',
        },
      ]
    : [];

  const [isEditing, setIsEditing] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const isLoading = isPlaceOrderLoading || isPlacesLoading;

  useEffect(() => {
    if (!isLoading) {
      setHasLoadedOnce(true);
    }
  }, [isLoading]);

  return {
    placeOrder,
    isLoading: isLoading && !hasLoadedOnce,
    hasError,
    isEditing,
    formItem,
    handleEditClick,
    placeOrderMutate,
  };
};
