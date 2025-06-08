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

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadImageToImgur = async (base64Image: string): Promise<string> => {
    const imgurClientId = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID;

    if (!imgurClientId) {
      throw new Error(
        'Imgur Client IDが設定されていません。環境変数を確認してください。'
      );
    }
    const base64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

    try {
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${imgurClientId}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });

      if (!response.ok) {
        throw new Error(`エラー: ${response.status}`);
      }

      const data = await response.json();
      return data.data.link;
    } catch (error) {
      console.error('Imgurアップロードエラー:', error);
      throw new Error('画像のアップロードに失敗しました');
    }
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
        const base64Image = await convertImageToBase64(formData.image as File);
        picturePath = await uploadImageToImgur(base64Image);
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
      reset({ ...formData, image: undefined }); // 送信後は image フィールドをクリア
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
