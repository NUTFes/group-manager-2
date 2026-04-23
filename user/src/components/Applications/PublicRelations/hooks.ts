import { useEffect, useRef, useState } from 'react';
import { usePublicRelationData } from '@/api/publicRelationsApi';
import { useTranslation } from 'next-i18next';
import { FormItem } from '@/components/FormList/type';
import { publicRelationLabels } from '../label';

export const usePublicRelationsHooks = (
  groupId: number,
  isRegistered?: boolean
) => {
  const { t } = useTranslation('common');
  const {
    publicRelation,
    error: prError,
    isLoading: prIsLoading,
    mutate: prMutate,
  } = usePublicRelationData(groupId || 0);
  const summaryLabels = publicRelationLabels.map((labelKey) => t(labelKey));
  const publicRelationsTexts = {
    title: t('applications.publicRelations.title'),
    loading: t('general.loading'),
    errors: {
      fetch: t('general.errors.fetch'),
    },
    announce: {
      yes: t('applications.publicRelations.options.announce.yes'),
      no: t('applications.publicRelations.options.announce.no'),
    },
    states: {
      notSet: t('applications.publicRelations.state.notSet'),
      missingText: t('applications.publicRelations.state.missingText'),
    },
    summaryLabels,
  };

  // アナウンスステータスを決定
  // publicRelationsのisAnnouncementRequestedフィールドに基づいて状態を決定
  const getAnnounceStatus = () => {
    if (publicRelation?.isAnnouncementRequested) {
      return publicRelationsTexts.announce.yes;
    } else if (publicRelation) {
      return publicRelationsTexts.announce.no;
    } else {
      return publicRelationsTexts.states.notSet;
    }
  };

  // モックデータのフォールバックなしでAPIベースのformItemsを作成
  const formItem: FormItem[] = [
    {
      label: publicRelationsTexts.summaryLabels[0],
      // APIは'blurb'フィールドでPRテキストを返す
      content: publicRelation?.blurb || publicRelationsTexts.states.missingText,
    },
    {
      label: publicRelationsTexts.summaryLabels[1],
      content: getAnnounceStatus(),
    },
    {
      label: publicRelationsTexts.summaryLabels[2],
      // APIからpictureNameを使用
      content:
        publicRelation?.pictureName || publicRelationsTexts.states.notSet,
    },
  ];

  const [isEditing, setIsEditing] = useState<boolean | null>(null);
  const hasInitializedEditing = useRef(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const toEdit = () => {
    setIsEditing((prev) => !prev);
  };

  useEffect(() => {
    if (!prIsLoading) {
      setHasLoadedOnce(true);
    }
  }, [prIsLoading]);

  useEffect(() => {
    if (hasInitializedEditing.current || isRegistered === undefined) {
      return;
    }

    setIsEditing(!isRegistered);
    hasInitializedEditing.current = true;
  }, [isRegistered]);

  // ローディング状態とエラー状態はpublicRelationのみを参照する
  const isLoading = prIsLoading && !hasLoadedOnce;
  const hasError = prError;

  // フォーム送信後にデータを再取得するための関数
  const refetchData = async () => {
    await prMutate();
  };

  return {
    publicRelation,
    isLoading,
    hasError,
    isEditing,
    toEdit,
    formItem,
    mutate: refetchData,
    refetchData,
    publicRelationsTexts,
  };
};
