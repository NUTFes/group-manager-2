import {
  StageOptionResponse,
  useCreateStageOptions,
  useUpdateStageOptions,
} from '@/api/stageOptionApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { stageOptionLabels } from '../../label';
import {
  isUnchanged,
  revalidateByUrl,
  revalidateCheckAllRegistered,
} from '../../shared';
import { StageOptionForm, stageOptionSchema } from './schema';

export const useStageOptionFormHooks = (
  stageOptions: StageOptionResponse | undefined,
  groupId: number | undefined
) => {
  const { t } = useTranslation('common');
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
        await update({ body: formData });
        await revalidateByUrl(
          `/stage_common_options/group/${formData.groupId}`
        );

        toast.success(t('applications.stageOptions.messages.submitSuccess'));
        return true;
      } catch {
        toast.error(t('applications.stageOptions.messages.submitFailed'));
        return false;
      }
    } else {
      try {
        await create({ body: formData });
        await revalidateByUrl(
          `/stage_common_options/group/${formData.groupId}`
        );
        await revalidateCheckAllRegistered(formData.groupId);
        toast.success(t('applications.stageOptions.messages.submitSuccess'));
        reset();
        return true;
      } catch {
        toast.error(t('applications.stageOptions.messages.submitFailed'));
        return false;
      }
    }
  };

  const options = [
    { id: 1, name: t('applications.stageOptions.options.yes') },
    { id: 0, name: t('applications.stageOptions.options.no') },
  ];
  const stageOptionFormTexts = {
    labels: stageOptionLabels.map((labelKey) => t(labelKey)),
    notes: {
      select: t('applications.stageOptions.notes.select'),
    },
    options,
    buttons: {
      cancel: t('form.actions.cancel'),
      save: t('form.actions.save'),
      register: t('form.actions.register'),
    },
    messages: {
      submitFailed: t('applications.stageOptions.messages.submitFailed'),
    },
  };

  const convertToBoolean = (value: string): boolean => {
    return value === '1' ? true : false;
  };

  const validateEdit = () =>
    isUnchanged(stageOptions, values, [
      'ownEquipment',
      'bgm',
      'cameraPermission',
      'loudSound',
    ]);

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
    convertToBoolean,
    validateEdit,
    formatRadioValue,
    stageOptionFormTexts,
  };
};
