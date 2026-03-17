import { useEffect, useRef, useState } from 'react';
import { useGetGroupCategories, useGetGroups } from '@/api/groupApi';
import { FormItem } from '@/components/FormList/type';
import { groupLabels } from '../label';

export const useGroupHooks = (
  groupId: number,
  isRegistered?: boolean | undefined,
  isGroupResolved?: boolean
) => {
  const { groups, isLoading, hasError, mutateGroups } = useGetGroups(groupId);
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

  // 初回だけ登録状態に応じて編集モードを決め、再取得時は維持する
  useEffect(() => {
    if (
      hasInitializedEditing.current ||
      !isGroupResolved ||
      isRegistered === undefined
    ) {
      return;
    }

    setIsEditing(!isRegistered);
    hasInitializedEditing.current = true;
  }, [isRegistered, isGroupResolved]);

  // 変数と関数を返す
  return {
    groups,
    isLoading: isLoading && !hasLoadedOnce,
    hasError,
    isEditing,
    toEdit,
    formItem,
    groupCategories,
    mutateGroups,
  };
};
