import { ApiResponse } from '@/api/stageOptionApi';
import {
  Place,
  PlaceOrder,
  usePlacesData,
  usePlacesOrderMutations,
  useUpdatePlacesOrderMutations,
} from '@/api/venueApplication';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';
import {
  DEFAULT_ID,
  VenueApplicationType,
  venueApplicationFormSchema,
} from './schema';

export const useVenueMapHooks = (
  groupId: number,
  mutate: KeyedMutator<ApiResponse<PlaceOrder>>,
  placeOrder?: PlaceOrder,
  handleClose?: () => void
) => {
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

  const submitHandler = async (formData: VenueApplicationType) => {
    if (isEdit) {
      await updateTrigger({
        query: formData,
      });
    } else {
      await registerTrigger({
        query: formData,
      });
    }
  };

  const onSubmit = async (formData: VenueApplicationType) => {
    if (errors.first || errors.second || errors.third || errors.remark) {
      console.error(errors);
      toast.error('入力エラーがあります。');
      return;
    }

    try {
      await submitHandler(formData);
      toast.success('登録しました。');
      if (mutate) {
        mutate();
      }
      if (handleClose) {
        handleClose();
      }
    } catch {
      console.error(error);
      console.error(updateError);
      toast.error('登録に失敗しました。');
    }
  };

  const validateEdit = () => {
    if (placeOrder && values) {
      if (
        placeOrder.first === values.first &&
        placeOrder.second === values.second &&
        placeOrder.third === values.third &&
        placeOrder.remark === values.remark
      ) {
        return true;
      }
    }
    return false;
  };

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
