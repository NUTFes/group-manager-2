import { useEffect, useRef, useState } from 'react';
import { useGetStageOptions } from '@/api/stageOptionApi';
import { useTranslation } from 'next-i18next';
import { FormItem } from '@/components/FormList/type';
import { stageOptionLabels } from '../label';

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

  const [isEditing, setIsEditing] = useState<boolean | null>(null);
  const hasInitializedEditing = useRef(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const toEdit = () => {
    setIsEditing((prev) => !prev);
  };

  useEffect(() => {
    if (!isLoading) {
      setHasLoadedOnce(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (hasInitializedEditing.current || isRegistered === undefined) {
      return;
    }

    setIsEditing(!isRegistered);
    hasInitializedEditing.current = true;
  }, [isRegistered]);

  return {
    stageOptions,
    isLoading: isLoading && !hasLoadedOnce,
    hasError,
    isEditing,
    toEdit,
    formItem,
    stageOptionTexts,
  };
};
