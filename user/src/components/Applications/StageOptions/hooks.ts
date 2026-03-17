import { useEffect, useRef, useState } from 'react';
import { useGetStageOptions } from '@/api/stageOptionApi';
import { FormItem } from '@/components/FormList/type';
import { stageOptionLabels } from '../label';

export const useStageOptionHooks = (
  groupId: number,
  isRegistered?: boolean
) => {
  const { stageOptions, isLoading, hasError } = useGetStageOptions(groupId);

  const formItem: FormItem[] = [
    {
      label: stageOptionLabels[0],
      content: stageOptions?.ownEquipment ? 'はい' : 'いいえ',
    },
    {
      label: stageOptionLabels[1],
      content: stageOptions?.bgm ? 'はい' : 'いいえ',
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
  };
};
