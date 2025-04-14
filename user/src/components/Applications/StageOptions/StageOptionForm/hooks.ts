import { useCallback, useEffect, useState } from 'react';
import {
  StageOptionResponse,
  useCreateStageOptions,
  useGetStageOptions,
  useUpdateStageOptions,
} from '@/api/stageOptionApi';
import { useGetUserPageSettings } from '@/api/userPageSettingAPI';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { FormItem } from '@/components/FormList/type';
import { stageOptionLabels } from '../../label';
import { StageOptionForm, stageOptionSchema } from './schema';

export const useStageOptionHooks = () => {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<StageOptionForm>({
    resolver: zodResolver(stageOptionSchema),
    mode: 'onChange',
    defaultValues: {
      groupId: 5,
    },
  });

  const values = watch();

  const {
    userPageSettings,
    isLoading: userPageSettingIsLoading,
    hasError: userPageSettingHasError,
  } = useGetUserPageSettings();

  const { stageOptions, isLoading, hasError } = useGetStageOptions(
    values.groupId
  );

  const setValuesStageOptions = useCallback(
    (res: StageOptionResponse) => {
      setValue('ownEquipment', res.ownEquipment ? 1 : 0);
      setValue('bgm', res.bgm ? 1 : 0);
      setValue('cameraPermission', res.cameraPermission ? 1 : 0);
      setValue('loudSound', res.loudSound ? 1 : 0);
    },
    [setValue]
  );

  useEffect(() => {
    if (stageOptions) {
      {
        setValuesStageOptions(stageOptions);
      }
    }
  }, [stageOptions, setValuesStageOptions]);

  const {
    trigger: create,
    error: createError,
    isMutating: createIsMutating,
  } = useCreateStageOptions();

  const {
    trigger: update,
    error: updateError,
    isMutating: updateIsMutating,
  } = useUpdateStageOptions(stageOptions?.id ?? 0);

  const onSubmit = async (formData: StageOptionForm) => {
    if (stageOptions) {
      try {
        await update({ query: formData });
        mutate(`/stage_common_options/group/${formData.groupId}`);
        toast.success('送信しました');
        toEdit();
        setIsEditing(true);
      } catch {
        toast.error('送信に失敗しました。');
      }
    } else {
      try {
        await create({ query: formData });
        mutate(`/stage_common_options/group/${formData.groupId}`);
        toast.success('送信しました');
        toEdit();
      } catch {
        toast.error('送信に失敗しました。');
      }
      reset();
    }
  };

  const [isEditing, setIsEditing] = useState(true);

  const toEdit = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (stageOptions) {
      setIsEditing(false);
    }
  }, [stageOptions]);

  const options = [
    { id: 1, name: 'はい' },
    { id: 0, name: 'いいえ' },
  ];

  const formItem: FormItem[] = [
    {
      label: stageOptionLabels[0],
      content: stageOptions?.ownEquipment ? options[0].name : options[1].name,
    },
    {
      label: stageOptionLabels[1],
      content: stageOptions?.bgm ? options[0].name : options[1].name,
    },
    {
      label: stageOptionLabels[2],
      content: stageOptions?.cameraPermission
        ? options[0].name
        : options[1].name,
    },
    {
      label: stageOptionLabels[3],
      content: stageOptions?.loudSound ? options[0].name : options[1].name,
    },
  ];

  const convertToString = (value: boolean | null): string => {
    if (value === null) return '';
    return value ? '1' : '0';
  };

  const validateEdit = () => {
    if (stageOptions && values) {
      if (
        Number(stageOptions.bgm) === values.bgm &&
        Number(stageOptions.cameraPermission) === values.cameraPermission &&
        Number(stageOptions.loudSound) === values.loudSound &&
        Number(stageOptions.ownEquipment) === values.ownEquipment
      ) {
        return true;
      }
    }
    return false;
  };

  return {
    handleSubmit,
    errors,
    stageOptions,
    isLoading,
    hasError,
    onSubmit,
    setValue,
    values,
    createError,
    createIsMutating,
    updateError,
    updateIsMutating,
    isEditing,
    toEdit,
    formItem,
    options,
    convertToString,
    userPageSettingIsLoading,
    userPageSettingHasError,
    userPageSettings,
    validateEdit,
  };
};
