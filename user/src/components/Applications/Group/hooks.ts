import { useEffect, useState } from 'react';
import { useGetGroupCategories, useGetGroups } from '@/api/groupApi';
import { FormItem } from '@/components/FormList/type';
import { groupLabels } from '../label';

export const useGroupHooks = () => {
  const { groups, isLoading, hasError } = useGetGroups(27);
  const { groupCategories } = useGetGroupCategories();

  // 団体申請のフォーム内容
  const formItem: FormItem[] = [
    {
      label: groupLabels[0],
      content: groups?.name,
    },
    {
      label: groupLabels[1],
      content: groups?.projectName,
    },
    {
      label: groupLabels[2],
      content: groups?.isInternational ? 'はい' : 'いいえ',
    },
    {
      label: groupLabels[3],
      content: groups?.isExternal ? 'はい' : 'いいえ',
    },
    {
      label: groupLabels[4],
      content: groups?.groupCategoryId
        ? groupCategories?.find(
            (category) => category.id === groups.groupCategoryId
          )?.name
        : '',
    },
    {
      label: groupLabels[5],
      content: groups?.activity,
    },
  ];

  // 編集状態の管理
  const [isEditing, setIsEditing] = useState(true);
  const toEdit = () => {
    setIsEditing(!isEditing);
  };

  // groupsが存在する場合，内容確認画面を表示させる（編集状態はfalse）
  useEffect(() => {
    if (groups) {
      setIsEditing(false);
    }
  }, [groups]);

  // 変数と関数を返す
  return {
    groups,
    isLoading,
    hasError,
    isEditing,
    toEdit,
    formItem,
    groupCategories,
  };
};
