import { ApiResponse } from '@/api/stageOptionApi';
import {
  Place,
  PlaceOrder,
  usePlacesData,
  usePlacesOrderMutations,
  useUpdatePlacesOrderMutations,
} from '@/api/venueApplication';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';
import { isUnchanged, revalidateCheckAllRegistered } from '../../shared';
import {
  DEFAULT_ID,
  VenueApplicationType,
  venueApplicationFormSchema,
} from './schema';

export const useVenueApplicationFormHooks = (
  groupId: number,
  placeOrderMutate: KeyedMutator<ApiResponse<PlaceOrder>>,
  placeOrder?: PlaceOrder,
  handleClose?: () => void
) => {
  const { t } = useTranslation('common');
  const first = placeOrder?.first ?? DEFAULT_ID;
  const second = placeOrder?.second ?? DEFAULT_ID;
  const third = placeOrder?.third ?? DEFAULT_ID;
  const isEdit = !!placeOrder;

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VenueApplicationType>({
    mode: 'onChange',
    resolver: zodResolver(venueApplicationFormSchema),
    defaultValues: {
      groupId: groupId,
      first: first,
      second: second,
      third: third,
      remark: placeOrder?.remark || '',
    },
  });
  const {
    trigger: registerTrigger,
    error,
    isMutating,
  } = usePlacesOrderMutations();

  const {
    trigger: updateTrigger,
    isMutating: isUpdating,
    error: updateError,
  } = useUpdatePlacesOrderMutations(placeOrder?.id ?? 0);

  const isLoading = isMutating || isUpdating;

  const { places, placesLoading } = usePlacesData(groupId);
  const values = watch();

  const options = convertPlacesToOptions(places);
  const disableOptions = extractDisableOptions([
    values.first,
    values.second,
    values.third,
  ]);

  const venueApplicationFormTexts = {
    loading: t('applications.venue.loading'),
    fields: {
      firstChoice: t('applications.venue.fields.firstChoice'),
      secondChoice: t('applications.venue.fields.secondChoice'),
      thirdChoice: t('applications.venue.fields.thirdChoice'),
      remark: t('applications.venue.fields.remark'),
    },
    actions: {
      cancel: t('form.actions.cancel'),
      save: t('form.actions.save'),
      register: t('form.actions.register'),
    },
  };

  const submitHandler = async (formData: VenueApplicationType) => {
    if (isEdit) {
      await updateTrigger({
        body: formData,
      });
    } else {
      await registerTrigger({
        body: formData,
      });
    }
  };

  const onSubmit = async (formData: VenueApplicationType) => {
    try {
      await submitHandler(formData);
      toast.success(t('form.messages.registerSuccess'));
      if (placeOrderMutate) {
        placeOrderMutate();
      }
      if (handleClose) {
        handleClose();
      }
      await revalidateCheckAllRegistered(formData.groupId);
    } catch {
      console.error(error);
      console.error(updateError);
      toast.error(t('form.messages.registerFailed'));
    }
  };

  const validateEdit = () =>
    isUnchanged(placeOrder, values, ['first', 'second', 'third', 'remark']);

  return {
    placesLoading,
    isLoading,
    options,
    values,
    errors,
    setValue,
    onSubmit,
    handleSubmit,
    disableOptions,
    validateEdit,
    venueApplicationFormTexts,
  };
};

const convertPlacesToOptions = (places: Place[]) => {
  return places.map((place) => {
    return { id: place.id, name: place.name };
  });
};

const extractDisableOptions = (values: number[]) => {
  return values.filter((value) => value !== DEFAULT_ID);
};
