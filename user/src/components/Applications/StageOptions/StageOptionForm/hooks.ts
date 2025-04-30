import {
  StageOptionResponse,
  useCreateStageOptions,
  useUpdateStageOptions,
} from '@/api/stageOptionApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { StageOptionForm, stageOptionSchema } from './schema';

export const useStageOptionFormHooks = (
  stageOptions: StageOptionResponse | undefined,
  groupId: number | undefined
) => {
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
      groupId: groupId,
      ownEquipment: stageOptions?.ownEquipment,
      bgm: stageOptions?.bgm,
      cameraPermission: stageOptions?.cameraPermission,
      loudSound: stageOptions?.loudSound,
    },
  });

  const values = watch();

  const formatRadioValue = (v: boolean | undefined): '' | '1' | '0' => {
    if (v === undefined) return '';
    return v ? '1' : '0';
  };

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
      } catch {
        toast.error('送信に失敗しました。');
      }
    } else {
      try {
        await create({ query: formData });
        mutate(`/stage_common_options/group/${formData.groupId}`);
        mutate(`/check_all_registered/${formData.groupId}`);
        toast.success('送信しました');
      } catch {
        toast.error('送信に失敗しました。');
      }
      reset();
    }
  };

  const options = [
    { id: 1, name: 'はい' },
    { id: 0, name: 'いいえ' },
  ];

  const convertToBoolean = (value: string): boolean => {
    return value === '1' ? true : false;
  };

  const validateEdit = () => {
    if (stageOptions && values) {
      if (
        stageOptions.bgm === values.bgm &&
        stageOptions.cameraPermission === values.cameraPermission &&
        stageOptions.loudSound === values.loudSound &&
        stageOptions.ownEquipment === values.ownEquipment
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
    onSubmit,
    setValue,
    values,
    createError,
    createIsMutating,
    updateError,
    updateIsMutating,
    options,
    convertToBoolean,
    validateEdit,
    formatRadioValue,
  };
};
