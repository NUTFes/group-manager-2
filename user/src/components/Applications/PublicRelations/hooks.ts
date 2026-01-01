import { useEffect, useState } from 'react';
import { usePublicRelationData } from '@/api/publicRelationsApi';
import { useTranslation } from 'next-i18next';
import { FormItem } from '@/components/FormList/type';
import { publicRelationLabels } from '../label';

export const usePublicRelationsHooks = (groupId: number) => {
  const { t } = useTranslation('common');
  const {
    publicRelation,
    error: prError,
    isLoading: prIsLoading,
    mutate: prMutate,
  } = usePublicRelationData(groupId || 0);

  // アナウンスステータスを決定
  // publicRelationsのisAnnouncementRequestedフィールドに基づいて状態を決定
  const getAnnounceStatus = () => {
    if (publicRelation?.isAnnouncementRequested) {
      return t('applications.publicRelations.options.announce.yes');
    } else if (publicRelation) {
      return t('applications.publicRelations.options.announce.no');
    } else {
      return t('applications.publicRelations.state.notSet');
    }
  };

  // モックデータのフォールバックなしでAPIベースのformItemsを作成
  const formItem: FormItem[] = [
    {
      label: t(publicRelationLabels[0]),
      // APIは'blurb'フィールドでPRテキストを返す
      content:
        publicRelation?.blurb ||
        t('applications.publicRelations.state.missingText'),
    },
    {
      label: t(publicRelationLabels[1]),
      content: getAnnounceStatus(),
    },
    {
      label: t(publicRelationLabels[2]),
      // APIからpictureNameを使用
      content:
        publicRelation?.pictureName ||
        t('applications.publicRelations.state.notSet'),
    },
  ];

  const [isEditing, setIsEditing] = useState(true);

  const toEdit = () => {
    setIsEditing(!isEditing);
  };

  // データが読み込まれたら編集状態をリセット
  useEffect(() => {
    if (publicRelation) {
      setIsEditing(false);
    }
  }, [publicRelation]);

  // ローディング状態とエラー状態はpublicRelationのみを参照する
  const isLoading = prIsLoading;
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
  };
};
