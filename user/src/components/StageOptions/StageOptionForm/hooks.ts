import {
  StageOption,
  useGetStageOptions,
  useMutateStageOptions,
} from '@/api/stageOptionApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import { stageOptionSchema } from './schema';
import { StageOptionForm } from './schema';

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
      groupId: 3,
    },
  });

  const values = watch();

  const { trigger, error, isMutating } = useMutateStageOptions();

  const { stageOptions, isLoading, hasError } = useGetStageOptions(
    values.groupId
  );

  // alert以外で通知したい。
  const onSubmit = async (formData: StageOption) => {
    try {
      await trigger({ query: formData });
      mutate(`/stage_common_options/${formData.groupId}`);
      reset();
      alert('送信しました');
    } catch {
      alert('送信に失敗しました。');
    }
  };

  return {
    handleSubmit,
    errors,
    isMutating,
    stageOptions,
    isLoading,
    hasError,
    onSubmit,
    setValue,
    values,
  };
};
