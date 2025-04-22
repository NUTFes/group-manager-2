import { useEffect, useState } from 'react';
import { usePublicRelationData } from '@/api/publicRelationsApi';
import { FormItem } from '@/components/FormList/type';
import { publicRelationLabels } from '../label';

export const usePublicRelationsHooks = (groupId: number) => {
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
      return 'はい';
    } else if (publicRelation) {
      return 'いいえ';
    } else {
      return '未設定';
    }
  };

  // モックデータのフォールバックなしでAPIベースのformItemsを作成
  const formItem: FormItem[] = [
    {
      label: publicRelationLabels[0],
      // APIは'blurb'フィールドでPRテキストを返す
      content: publicRelation?.blurb || '(PR文が未入力です)',
    },
    {
      label: publicRelationLabels[1],
      content: getAnnounceStatus(),
    },
    {
      label: publicRelationLabels[2],
      // APIからpictureNameを使用
      content: publicRelation?.pictureName || '未設定',
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
