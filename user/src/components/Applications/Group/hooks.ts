import { useEffect, useRef, useState } from 'react';
import { useGetGroupCategories, useGetGroups } from '@/api/groupApi';
import { useTranslation } from 'next-i18next';
import { FormItem } from '@/components/FormList/type';
import { groupLabels } from '../label';

export const useGroupHooks = (
  groupId: number,
  isRegistered?: boolean | undefined,
  isGroupResolved?: boolean
) => {
  const { t } = useTranslation('common');
  const { groups, isLoading, hasError, mutateGroups } = useGetGroups(groupId);
  const { groupCategories } = useGetGroupCategories();
  const groupTexts = {
    title: t('applications.group.title'),
    loading: t('applications.group.loading'),
    errors: {
      fetch: t('applications.group.errors.fetch'),
    },
    boolean: {
      yes: t('applications.group.boolean.yes'),
      no: t('applications.group.boolean.no'),
    },
    summaryLabels: groupLabels.map((labelKey) => t(labelKey)),
  };

  // 団体申請のフォーム内容
  const formItem: FormItem[] = [
    {
      label: groupTexts.summaryLabels[0],
      content: groups?.name,
    },
    {
      label: groupTexts.summaryLabels[1],
      content: groups?.projectName,
    },
    {
      label: groupTexts.summaryLabels[2],
      content: groups?.isInternational
        ? groupTexts.boolean.yes
        : groupTexts.boolean.no,
    },
    {
      label: groupTexts.summaryLabels[3],
      content: groups?.isExternal
        ? groupTexts.boolean.yes
        : groupTexts.boolean.no,
    },
    {
      label: groupTexts.summaryLabels[4],
      content: groups?.groupCategoryId
        ? groupCategories?.find(
            (category) => category.id === groups.groupCategoryId
          )?.name
        : '',
    },
    {
      label: groupTexts.summaryLabels[5],
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
    groupTexts,
  };
};
