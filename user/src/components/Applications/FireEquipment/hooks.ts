import { useEffect, useState } from 'react';
import {
  useFireEquipmentMutations,
  useGetFireEquipmentOrdersByGroupId,
} from '@/api/fireEquipmentApi';
import { useGetHealthCenterSubmissionStatus } from '@/api/healthCenterSubmissionStatusApi';
import {
  ORDER_TYPES,
  useGetUnregisteredGroup,
  useMutateUnregisteredGroup,
} from '@/api/unRegisteredGroupApi';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';

export type FireEquipmentApplyOption = 'yes' | 'no' | 'undecided';

type FireEquipmentState = {
  isEditing: boolean;
  applyFireEquipment: FireEquipmentApplyOption;
};

export const useFireEquipmentHooks = (groupId: number) => {
  const { t } = useTranslation('common');

  const [state, setState] = useState<FireEquipmentState>({
    isEditing: false,
    applyFireEquipment: 'undecided',
  });
  // 一覧表示の削除ボタンは即時APIを呼ばない。押した行をローカルで除外して
  // 編集フォームへ切り替え、実際の削除は保存ボタンを押すまで確定しない。
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const {
    fireEquipmentOrders,
    isLoading: isOrdersLoading,
    mutateFireEquipmentOrders,
  } = useGetFireEquipmentOrdersByGroupId(groupId);

  const {
    hasUnregistered,
    isLoading: isUnRegisteredLoading,
    mutateUnregisteredGroup,
    unregisteredData,
  } = useGetUnregisteredGroup(groupId, ORDER_TYPES.FIRE_EQUIPMENT_ORDER);

  const { submitFireEquipmentOrders } = useFireEquipmentMutations();
  const { mutateHealthCenterSubmissionStatus } =
    useGetHealthCenterSubmissionStatus(groupId);
  const { registerUnregisteredGroup, deleteUnregisteredGroup } =
    useMutateUnregisteredGroup(ORDER_TYPES.FIRE_EQUIPMENT_ORDER);

  const isLoading = isOrdersLoading || isUnRegisteredLoading;
  const hasExisting = fireEquipmentOrders.length > 0;
  // 編集フォームに渡す一覧。pendingDeleteId がある間は該当行を除いた状態で
  // フォームを開き、保存されるまでサーバ上のデータには手を触れない。
  const editableOrders = pendingDeleteId
    ? fireEquipmentOrders.filter((o) => o.id !== pendingDeleteId)
    : fireEquipmentOrders;

  const updateState = (newState: Partial<FireEquipmentState>) =>
    setState((prev) => ({ ...prev, ...newState }));

  const getRadioValue = (option: FireEquipmentApplyOption): string => {
    if (option === 'yes') return '1';
    if (option === 'no') return '2';
    return '';
  };

  useEffect(() => {
    if (isOrdersLoading || isUnRegisteredLoading) return;
    if (state.applyFireEquipment !== 'undecided') return;

    if (hasExisting) {
      updateState({ applyFireEquipment: 'yes' });
    } else if (hasUnregistered) {
      updateState({ applyFireEquipment: 'no' });
    }
  }, [
    isOrdersLoading,
    isUnRegisteredLoading,
    hasExisting,
    hasUnregistered,
    state.applyFireEquipment,
  ]);

  const handleRadioChange = (value: string) => {
    const option = value === '1' ? 'yes' : value === '2' ? 'no' : 'undecided';
    if (option === 'yes') {
      updateState({ applyFireEquipment: 'yes', isEditing: true });
    } else if (option === 'no') {
      updateState({ applyFireEquipment: 'no', isEditing: false });
    } else {
      updateState({ applyFireEquipment: 'undecided' });
    }
  };

  const prepareFormForEditing = () => {
    setPendingDeleteId(null);
    updateState({ isEditing: true });
  };

  const handleApplyNegative = async () => {
    try {
      const deleteResult = await submitFireEquipmentOrders([], groupId);
      if (!deleteResult.success) {
        await mutateFireEquipmentOrders();
        toast.error(t('applications.fireEquipment.messages.submitFailed'));
        return;
      }

      const result = await registerUnregisteredGroup(groupId);
      if (result.success) {
        updateState({ applyFireEquipment: 'no' });
        await Promise.all([
          mutateFireEquipmentOrders(),
          mutateUnregisteredGroup(),
          mutateHealthCenterSubmissionStatus(),
        ]);
        toast.success(
          t('applications.fireEquipment.messages.noApplicationSuccess')
        );
      } else {
        await mutateFireEquipmentOrders();
        toast.error(t('applications.fireEquipment.messages.submitFailed'));
      }
    } catch (error) {
      console.error('火気不使用登録エラー:', error);
      await mutateFireEquipmentOrders();
      toast.error(t('applications.fireEquipment.messages.submitFailed'));
    }
  };

  // 一覧表示からの削除は即時APIを呼ばない。対象行を除いた編集フォームへ
  // 切り替えるだけで、実際の削除は保存ボタンを押した時点でまとめて反映される。
  const handleDeleteOrder = (id: number) => {
    setPendingDeleteId(id);
    updateState({ isEditing: true });
  };

  const handleCancelUnregistered = async () => {
    try {
      const result = await deleteUnregisteredGroup(unregisteredData);
      if (!result.success) {
        console.error('不使用解除エラー:', result.error);
        toast.error(t('applications.fireEquipment.messages.submitFailed'));
        return;
      }
      updateState({ applyFireEquipment: 'undecided' });
      await mutateUnregisteredGroup();
    } catch (error) {
      console.error('火気不使用解除エラー:', error);
      toast.error(t('applications.fireEquipment.messages.submitFailed'));
    }
  };

  const handleFormComplete = async () => {
    setPendingDeleteId(null);
    await Promise.all([
      mutateFireEquipmentOrders(),
      mutateHealthCenterSubmissionStatus(),
    ]);
    updateState({ applyFireEquipment: 'yes', isEditing: false });
  };

  return {
    state,
    isLoading,
    hasExisting,
    hasUnregistered,
    fireEquipmentOrders,
    editableOrders,
    handleRadioChange,
    handleApplyNegative,
    handleDeleteOrder,
    handleCancelUnregistered,
    prepareFormForEditing,
    handleFormComplete,
    getRadioValue,
    mutateFireEquipmentOrders,
  };
};
