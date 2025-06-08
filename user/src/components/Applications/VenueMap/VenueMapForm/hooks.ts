import { useEffect, useState } from 'react';
import {
  VenueMapResponse,
  useCreateVenueMap,
  useGetVenueMap,
  usePatchVenueMap,
} from '@/api/venueMapApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResolverOptions, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { VenueMapFormData, venueMapSchema } from './schema';

export const useVenueMapFormHooks = (
  groupId: number,
  venueMapProp?: VenueMapResponse | null
) => {
  const {
    venueMap: fetchedVenueMap,
    error: fetchError,
    isLoading: isFetching,
    mutateVenueMap: venueMapMutate,
  } = useGetVenueMap(groupId || 0);

  const venueMap = venueMapProp || fetchedVenueMap;

  const resolver = async (
    values: VenueMapFormData,
    context: unknown,
    options: ResolverOptions<VenueMapFormData>
  ) => {
    const result = await zodResolver(venueMapSchema)(values, context, options);

    const errors = result.errors as Record<
      string,
      { type: string; message: string }
    >;

    if (venueMap) {
      // 既存データがある場合は、画像がなくてもエラーにしない
      if (errors.image) {
        delete errors.image;
      }
    } else {
      // 新規作成の場合は画像が必須
      if (!values.image) {
        errors.image = {
          type: 'custom',
          message: '模擬店平面図画像をアップロードしてください。',
        };
      }
    }

    return {
      values: result.values,
      errors: errors,
    };
  };

  const {
    handleSubmit,
    formState: { errors: formErrors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<VenueMapFormData>({
    mode: 'onSubmit',
    criteriaMode: 'all',
    resolver: resolver,
    defaultValues: {
      image: venueMap?.picturePath || undefined,
      checklist: [],
    },
  });

  const {
    trigger: createVenueMap,
    error: createError,
    isMutating: createIsMutating,
  } = useCreateVenueMap();

  const updateId = venueMap?.id || 0;
  const {
    trigger: updateVenueMap,
    error: updateError,
    isMutating: updateIsMutating,
  } = usePatchVenueMap(updateId);

  const [fileName, setFileName] = useState<string | null>(
    venueMap?.pictureName || null
  );

  const values = watch();

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg';
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        setValue('image', file, { shouldDirty: true });
        setFileName(file.name);
      }
    };
    input.click();
  };

  const uploadImageToImgur = async (file: File): Promise<string> => {
    console.log('uploadImageToImgur called with:', file.name);
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(`https://i.imgur.com/dummy_${file.name}.png`),
        1000
      )
    );
  };

  useEffect(() => {
    if (createError || updateError) {
      toast.error('送信に失敗しました。時間を置いて再度お試しください。');
    }
  }, [createError, updateError]);

  const onSubmit = async (formData: VenueMapFormData) => {
    try {
      let picturePath = venueMap?.picturePath || '';
      let pictureName = venueMap?.pictureName || '';

      if (formData.image && typeof formData.image !== 'string') {
        picturePath = await uploadImageToImgur(formData.image as File);
        pictureName = (formData.image as File).name;
      } else if (typeof formData.image === 'string') {
        picturePath = formData.image;
      }

      const apiData = {
        groupId,
        picturePath,
        pictureName,
      };

      if (venueMap) {
        await updateVenueMap({ query: { ...apiData, id: venueMap.id } });
      } else {
        await createVenueMap({ query: apiData });
      }

      await venueMapMutate();
      mutate(`check_all_registered/${groupId}`);

      toast.success(venueMap ? '修正しました' : '登録しました');
      reset({ ...formData, image: picturePath }); // 送信後の画像パスを維持しつつリセット
      return true;
    } catch (error) {
      console.error('送信エラー:', error);
      toast.error('送信に失敗しました。時間を置いて再度お試しください。');
      return false;
    }
  };

  return {
    handleSubmit,
    errors: formErrors,
    setValue,
    values,
    fileName,
    setFileName,
    isFetching,
    fetchError,
    isMutating: createIsMutating || updateIsMutating,
    handleImageUpload,
    onSubmit,
    isDirty,
    reset,
  };
};
