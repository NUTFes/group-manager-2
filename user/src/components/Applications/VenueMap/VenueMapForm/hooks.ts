import { useEffect, useState } from 'react';
import {
  VenueMapResponse,
  useCreateVenueMap,
  useGetVenueMap,
  usePatchVenueMap,
} from '@/api/venueMapApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { ResolverOptions, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { useImageObjectUrl } from '@/hooks/useImageObjectUrl';
import { VenueMapFormData, venueMapFormSchema } from './schema';

export const useVenueMapFormHooks = (
  groupId: number,
  venueMapProp?: VenueMapResponse | null,
  onSubmitted?: () => void
) => {
  const { t } = useTranslation('common');
  const {
    venueMap: fetchedVenueMap,
    error: fetchError,
    isLoading: isFetching,
    mutateVenueMap: venueMapMutate,
  } = useGetVenueMap(groupId || 0);

  const venueMap = venueMapProp || fetchedVenueMap;
  const checklistOptions = [
    {
      id: 'trashPosition',
      name: t('applications.venueMap.checklist.options.trashPosition'),
    },
    {
      id: 'foodStorage',
      name: t('applications.venueMap.checklist.options.foodStorage'),
    },
    {
      id: 'allItemsListed',
      name: t('applications.venueMap.checklist.options.allItemsListed'),
    },
    {
      id: 'fireHazardousMaterials',
      name: t('applications.venueMap.checklist.options.fireHazardousMaterials'),
    },
    {
      id: 'partitionPlacement',
      name: t('applications.venueMap.checklist.options.partitionPlacement'),
    },
  ];
  const uploadNotes = t('applications.venueMap.upload.note', {
    returnObjects: true,
  }) as string[];
  const venueMapFormTexts = {
    general: {
      loading: t('general.loading'),
      required: t('form.required'),
    },
    fields: {
      picture: t('applications.venueMap.fields.picture'),
      checklist: t('applications.venueMap.fields.checklist'),
    },
    upload: {
      notes: uploadNotes,
      uploaded: (fileName: string) =>
        t('applications.venueMap.upload.uploaded', {
          fileName,
        }),
    },
    notes: {
      existing: t('applications.venueMap.notes.existing'),
      currentImage: (name: string) =>
        t('applications.venueMap.notes.currentImage', {
          name,
        }),
      unknownFile: t('applications.venueMap.notes.unknownFile'),
    },
    checklist: {
      options: checklistOptions,
      note: t('applications.venueMap.checklist.note'),
    },
    buttons: {
      cancel: t('form.actions.cancel'),
      submitting: t('applications.venueMap.buttons.submitting'),
      edit: t('form.actions.edit'),
      register: t('form.actions.register'),
    },
  };

  const resolver = async (
    values: VenueMapFormData,
    context: unknown,
    options: ResolverOptions<VenueMapFormData>
  ) => {
    const result = await zodResolver(venueMapFormSchema)(
      values,
      context,
      options
    );

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
          message: 'applications.venueMap.validation.imageRequired',
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
  const { previewUrl, setPreviewUrlFromFile } = useImageObjectUrl();

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
        setPreviewUrlFromFile(file);
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
      throw new Error(t('applications.venueMap.messages.imgurMissing'));
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
      throw new Error(t('applications.venueMap.messages.imgurUploadFailed'));
    }
  };

  useEffect(() => {
    if (createError || updateError) {
      toast.error(t('applications.venueMap.messages.submitFailed'));
    }
  }, [createError, updateError, t]);

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

      toast.success(t('applications.venueMap.messages.submitSuccess'));
      reset({ ...formData, image: undefined }); // 送信後は image フィールドをクリア
      onSubmitted?.();
      return true;
    } catch (error) {
      console.error('送信エラー:', error);
      toast.error(t('applications.venueMap.messages.submitFailed'));
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
    previewUrl,
    isFetching,
    fetchError,
    isMutating: createIsMutating || updateIsMutating,
    handleImageUpload,
    onSubmit,
    isDirty,
    reset,
    venueMapFormTexts,
  };
};
