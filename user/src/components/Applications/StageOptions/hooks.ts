import { useEffect, useState } from 'react';
import { useGetStageOptions } from '@/api/stageOptionApi';
import { useTranslation } from 'next-i18next';
import { FormItem } from '@/components/FormList/type';
import { stageOptionLabels } from '../label';

export const useStageOptionHooks = (groupId: number) => {
  const { t } = useTranslation('common');
  const { stageOptions, isLoading, hasError } = useGetStageOptions(groupId);

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

  const [isEditing, setIsEditing] = useState(true);

  const toEdit = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (stageOptions) {
      setIsEditing(false);
    }
  }, [stageOptions]);

  return {
    stageOptions,
    isLoading,
    hasError,
    isEditing,
    toEdit,
    formItem,
  };
};
