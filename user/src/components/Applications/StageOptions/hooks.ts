import { useEffect, useState } from 'react';
import { useGetStageOptions } from '@/api/stageOptionApi';
import { FormItem } from '@/components/FormList/type';
import { stageOptionLabels } from '../label';

export const useStageOptionHooks = () => {
  // todo: ログイン時に取得したgroupIDを使う
  const { stageOptions, isLoading, hasError } = useGetStageOptions(9);

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
