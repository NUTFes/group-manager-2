import { useState } from 'react';
import { useGetPlaceOrder, usePlacesData } from '@/api/venueApplication';
import { FormItem } from '@/components/FormList/type';

export const usePlaceOrdersHooks = (groupId: number) => {
  const {
    placeOrder,
    isLoading: isPlaceOrderLoading,
    hasError,
  } = useGetPlaceOrder(groupId);
  const { places, placesLoading: isPlacesLoading } = usePlacesData();

  console.log('placeOrder', placeOrder);
  const formItem: FormItem[] = placeOrder
    ? [
        {
          label: '第一希望',
          content: places[placeOrder?.first ?? 0]?.name || '',
        },
        {
          label: '第二希望',
          content: places[placeOrder?.second ?? 0]?.name || '',
        },
        {
          label: '第三希望',
          content: places[placeOrder?.third ?? 0]?.name || '',
        },
      ]
    : [];

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const isLoading = isPlaceOrderLoading || isPlacesLoading;

  return {
    placeOrder,
    isLoading,
    hasError,
    isEditing,
    formItem,
    handleEditClick,
  };
};
