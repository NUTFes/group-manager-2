import { useGetStageOptions } from '@/api/stageOptionApi';
import { useTranslation } from 'next-i18next';
import { FormItem } from '@/components/FormList/type';
import { stageOptionLabels } from '../label';
import { useEditableSection } from '../shared';

export const useStageOptionHooks = (
  groupId: number,
  isRegistered?: boolean
) => {
  const { t } = useTranslation('common');
  const { stageOptions, isLoading, hasError } = useGetStageOptions(groupId);
  const stageOptionTexts = {
    title: t('applications.stageOptions.title'),
    general: {
      loading: t('general.loading'),
    },
    errors: {
      fetch: t('general.errors.fetch'),
    },
    buttons: {
      edit: t('form.actions.edit'),
    },
  };

  const formItem: FormItem[] = [
    {
      label: t(stageOptionLabels[0]),
      content: stageOptions?.ownEquipment
        ? t('applications.stageOptions.options.yes')
        : t('applications.stageOptions.options.no'),
    },
    {
      label: t(stageOptionLabels[1]),
      content: stageOptions?.bgm
        ? t('applications.stageOptions.options.yes')
        : t('applications.stageOptions.options.no'),
    },
    {
      label: t(stageOptionLabels[2]),
      content: stageOptions?.cameraPermission
        ? t('applications.stageOptions.options.yes')
        : t('applications.stageOptions.options.no'),
    },
    {
      label: t(stageOptionLabels[3]),
      content: stageOptions?.loudSound
        ? t('applications.stageOptions.options.yes')
        : t('applications.stageOptions.options.no'),
    },
  ];

  const {
    isEditing,
    toEdit,
    isLoading: isSectionLoading,
  } = useEditableSection({ isLoading, isRegistered });

  return {
    stageOptions,
    isLoading: isSectionLoading,
    hasError,
    isEditing,
    toEdit,
    formItem,
    stageOptionTexts,
  };
};
