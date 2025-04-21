import { useEffect, useState } from 'react';
import { usePublicRelationData } from '@/api/publicRelationsApi';
import { FormItem } from '@/components/FormList/type';
import { publicRelationLabels } from '../label';

export const usePublicRelationsHooks = (groupId: number) => {
  const {
    group,
    publicRelation,
    error: hasError,
    isLoading,
    mutate,
  } = usePublicRelationData(groupId || 0);

  console.log('Current groupId:', groupId);
  console.log('PublicRelation data:', publicRelation);

  // モックデータのフォールバックなしでAPIベースのformItemsを作成
  const formItem: FormItem[] = [
    {
      label: publicRelationLabels[0],
      // APIは'blurb'フィールドでPRテキストを返す
      content: publicRelation?.blurb || '(PR文が未入力です)',
    },
    {
      label: publicRelationLabels[1],
      // APIにはannouncementフィールドがないため、デフォルトで「いいえ」を設定
      content: 'いいえ',
    },
    {
      label: publicRelationLabels[2],
      // APIからpicture_nameまたはpictureNameを使用
      content:
        publicRelation?.picture_name || publicRelation?.pictureName || '未設定',
    },
  ];

  const [isEditing, setIsEditing] = useState(true);

  const toEdit = () => {
    setIsEditing(!isEditing);
  };

  // publicRelationデータが読み込まれたら編集状態をリセット
  useEffect(() => {
    if (publicRelation) {
      setIsEditing(false);
    }
  }, [publicRelation]);

  // フォーム送信後にデータを再取得するための関数
  const refetchData = async () => {
    await mutate();
  };

  return {
    publicRelation,
    isLoading,
    hasError,
    isEditing,
    toEdit,
    formItem,
    mutate,
    refetchData,
  };
};