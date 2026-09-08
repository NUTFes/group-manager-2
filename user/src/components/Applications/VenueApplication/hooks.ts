import { useGetPlaceOrder, usePlacesData } from '@/api/venueApplication';
import { useTranslation } from 'next-i18next';
import { FormItem } from '@/components/FormList/type';
import { useEditableSection } from '../shared';

export const useVenueApplicationHooks = (
  groupId: number,
  isRegistered?: boolean
) => {
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
  const venueApplicationTexts = {
    title: t('applications.venue.title'),
    loading: t('applications.venue.loading'),
    fields: {
      firstChoice: t('applications.venue.fields.firstChoice'),
      secondChoice: t('applications.venue.fields.secondChoice'),
      thirdChoice: t('applications.venue.fields.thirdChoice'),
      remark: t('applications.venue.fields.remark'),
    },
  };
  const formItem: FormItem[] = placeOrder
    ? [
        {
          label: venueApplicationTexts.fields.firstChoice,
          content: firstPlace?.name || '',
        },
        {
          label: venueApplicationTexts.fields.secondChoice,
          content: secondPlace?.name || '',
        },
        {
          label: venueApplicationTexts.fields.thirdChoice,
          content: thirdPlace?.name || '',
        },
        {
          label: venueApplicationTexts.fields.remark,
          content: placeOrder?.remark || '',
        },
      ]
    : [];
  const isLoading = isPlaceOrderLoading || isPlacesLoading;

  const {
    isEditing,
    toEdit: handleEditClick,
    isLoading: isSectionLoading,
  } = useEditableSection({ isLoading, isRegistered });

  return {
    placeOrder,
    isLoading: isSectionLoading,
    hasError,
    isEditing,
    formItem,
    venueApplicationTexts,
    handleEditClick,
    placeOrderMutate,
  };
};
