import { useCallback, useEffect, useState } from 'react';
import {
  StageOptionResponse,
  useCreateStageOptions,
  useGetStageOptions,
  useUpdateStageOptions,
} from '@/api/stageOptionApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
    if (stageOptions && stageOptions !== null) {
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

  // alert以外で通知したい。
  const onSubmit = async (formData: StageOptionForm) => {
    if (stageOptions) {
      try {
        await update({ query: formData });
        mutate(`/stage_common_options/group/${formData.groupId}`);
        alert('送信しました');
        toEdit();
        setIsEditing(true);
      } catch {
        reset();
        alert('送信に失敗しました。');
      }
    } else {
      try {
        await create({ query: formData });
        mutate(`/stage_common_options/group/${formData.groupId}`);
        alert('送信しました');
        toEdit();
      } catch {
        reset();
        alert('送信に失敗しました。');
      }
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

  const formItem: FormItem[] = [
    {
      label: stageOptionLabels[0],
      content: stageOptions?.ownEquipment ? 'あり' : 'なし',
    },
    {
      label: stageOptionLabels[1],
      content: stageOptions?.bgm ? 'あり' : 'なし',
    },
    {
      label: stageOptionLabels[2],
      content: stageOptions?.cameraPermission ? 'はい' : 'いいえ',
    },
    {
      label: stageOptionLabels[3],
      content: stageOptions?.loudSound ? 'はい' : 'いいえ',
    },
  ];

  const options1 = [
    { id: 1, name: 'あり' },
    { id: 0, name: 'なし' },
  ];

  const options2 = [
    { id: 1, name: 'はい' },
    { id: 0, name: 'いいえ' },
  ];

  const convertToString = (value: boolean | null): string => {
    if (value === null) return '';
    return value ? '1' : '0';
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
    options1,
    options2,
    convertToString,
  };
};
