import { useEffect, useRef, useState } from 'react';
import { usePublicRelationData } from '@/api/publicRelationsApi';
import { FormItem } from '@/components/FormList/type';
import { publicRelationLabels } from '../label';

export const usePublicRelationsHooks = (
  groupId: number,
  isRegistered?: boolean
) => {
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
  };
};
