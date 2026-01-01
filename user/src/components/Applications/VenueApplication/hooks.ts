import { useState } from 'react';
import { useGetPlaceOrder, usePlacesData } from '@/api/venueApplication';
import { useTranslation } from 'next-i18next';
import { FormItem } from '@/components/FormList/type';

export const usePlaceOrdersHooks = (groupId: number) => {
  const { t } = useTranslation('common');
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
          label: t('applications.venue.fields.firstChoice'),
          content: firstPlace?.name || '',
        },
        {
          label: t('applications.venue.fields.secondChoice'),
          content: secondPlace?.name || '',
        },
        {
          label: t('applications.venue.fields.thirdChoice'),
          content: thirdPlace?.name || '',
        },
        {
          label: t('applications.venue.fields.remark'),
          content: placeOrder?.remark || '',
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
    placeOrderMutate,
  };
};
