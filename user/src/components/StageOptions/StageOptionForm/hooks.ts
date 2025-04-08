import {
  useCreateStageOptions,
  useGetStageOptions,
  useUpdateStageOptions,
} from '@/api/stageOptionApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
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
      groupId: 4,
    },
  });

  const values = watch();

  const {
    trigger: create,
    error: createError,
    isMutating: createIsMutating,
  } = useCreateStageOptions();

  const {
    trigger: update,
    error: updateError,
    isMutating: updateIsMutating,
  } = useUpdateStageOptions();

  const { stageOptions, isLoading, hasError } = useGetStageOptions(
    values.groupId
  );

  // alert以外で通知したい。
  const onSubmit = async (formData: StageOptionForm) => {
    if (stageOptions) {
      try {
        await update({ query: formData });
        mutate(`/stage_common_options/group/${formData.groupId}`);
        reset();
        alert('送信しました');
      } catch {
        alert('送信に失敗しました。');
      }
    } else {
      try {
        await create({ query: formData });
        mutate(`/stage_common_options/group/${formData.groupId}`);
        reset();
        alert('送信しました');
      } catch {
        alert('送信に失敗しました。');
      }
    }
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
  };
};
