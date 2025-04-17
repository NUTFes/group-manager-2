import {
  Place,
  PlaceOrder,
  usePlacesData,
  usePlacesOrderMutations,
} from '@/api/venueApplication';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  DEFAULT_ID,
  VenueApplicationType,
  venueApplicationFormSchema,
} from './schema';

export const useVenueMapHooks = (placeOrder?: PlaceOrder) => {
  const groupId = placeOrder?.group_id ?? 0;
  const first = placeOrder?.first ?? DEFAULT_ID;
  const second = placeOrder?.second ?? DEFAULT_ID;
  const third = placeOrder?.third ?? DEFAULT_ID;
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VenueApplicationType>({
    resolver: zodResolver(venueApplicationFormSchema),
    defaultValues: {
      // FIX: group_idの取得は団体申請実装時に追加。
      groupId: groupId,
      first: first,
      second: second,
      third: third,
      remark: placeOrder?.remark || '',
    },
  });
  const { trigger, error, isMutating } = usePlacesOrderMutations();

  const { places, placesLoading } = usePlacesData();
  const values = watch();

  const options = convertPlacesToOptions(places);
  const disableOptions = extractDisableOptions([
    values.first,
    values.second,
    values.third,
  ]);
  const onSubmit = async (formData: VenueApplicationType) => {
    if (errors.first || errors.second || errors.third || errors.remark) {
      console.error(errors);
      alert('入力エラーがあります。');
      return;
    }
    try {
      await trigger({
        query: formData,
      });
      alert('送信しました');
    } catch {
      console.error(error);
      alert('送信に失敗しました。');
    }
  };

  return {
    placesLoading,
    isMutating,
    options,
    values,
    errors,
    setValue,
    onSubmit,
    handleSubmit,
    disableOptions,
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
