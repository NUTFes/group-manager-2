import { useState } from 'react';
import {
  useFireEquipmentMutations,
  useGetFireEquipmentOrderByGroupId,
} from '@/api/fireEquipmentApi';
import {
  useGetHealthCenterSubmissionStatus,
  useUpdateHealthCenterSubmissionStatus,
} from '@/api/healthCenterSubmissionStatusApi';
import { toast } from 'react-toastify';
import { FormItem } from '@/components/FormList/type';
import { fireEquipmentFormFields } from './constant';

export const useFireEquipmentHooks = (
  groupId: number,
  status: string | undefined
) => {
  const { fireEquipmentOrder, isLoading, mutateFireEquipmentOrder } =
    useGetFireEquipmentOrderByGroupId(groupId);

  const { deleteFireEquipmentOrder } = useFireEquipmentMutations();

  const fireEquipment = fireEquipmentOrder ?? undefined;

  // 火気不使用として登録済みの判定（nameが空の場合）
  const hasUnregistered = fireEquipment !== undefined && !fireEquipment.name;

  const formItem: FormItem[] =
    fireEquipment && !hasUnregistered
      ? [
          {
            label: fireEquipmentFormFields.NAME,
            content: fireEquipment.name,
          },
          {
            label: fireEquipmentFormFields.QUANTITY,
            content: String(fireEquipment.quantity),
          },
          {
            label: fireEquipmentFormFields.FUEL,
            content: String(fireEquipment.fuel),
          },
          {
            label: fireEquipmentFormFields.USAGE,
            content: fireEquipment.usage,
          },
          {
            label: fireEquipmentFormFields.IS_TAKEAWAY,
            content: fireEquipment.is_takeaway ? 'はい' : 'いいえ',
          },
          {
            label: fireEquipmentFormFields.REMARK,
            content: fireEquipment.remark || '',
          },
        ]
      : [];

  const [isEditing, setIsEditing] = useState(false);
  const isResubmission = status === 'waiting_resubmission';

  //ステータス変更処理
  const { healthCenterSubmissionStatus, mutateHealthCenterSubmissionStatus } =
    useGetHealthCenterSubmissionStatus(groupId);
  const { trigger: patchHealthCenterSubmissionStatus } =
    useUpdateHealthCenterSubmissionStatus()();

  const updateStatus = async (status: 'unapproved') => {
    const fireEquipmentSubmission = healthCenterSubmissionStatus.find(
      (submission) => submission.applicationType === 'fire_equipment'
    );

    if (!fireEquipmentSubmission?.id) {
      throw new Error('Fire equipment submission status id not found');
    }

    await patchHealthCenterSubmissionStatus({
      id: fireEquipmentSubmission.id,
      body: { status },
    });

    await mutateHealthCenterSubmissionStatus();
  };

  const handleEditClick = async () => {
    // 再提出完了時
    if (status === 'waiting_resubmission') {
      // status更新処理
      await updateStatus('unapproved');
    }

    setIsEditing((prev) => !prev);
  };

  const handleDeleteClick = async () => {
    if (!fireEquipment?.id) return;
    try {
      await deleteFireEquipmentOrder(fireEquipment.id);
      await mutateFireEquipmentOrder();
      toast.success('火気申請を削除しました');
    } catch (error) {
      console.error('火気申請削除エラー:', error);
      toast.error('削除に失敗しました。もう一度お試しください。');
    }
  };

  const noApplicationItems: FormItem[] = [
    {
      label: '火気申請は不要（登録済み）',
      content: '火気は使用しません。',
    },
  ];

  return {
    hasUnregistered,
    noApplicationItems,
    isEditing,
    formItem,
    handleEditClick,
    handleDeleteClick,
    fireEquipment,
    isLoading,
    mutateFireEquipmentOrder,
    isResubmission,
  };
};
