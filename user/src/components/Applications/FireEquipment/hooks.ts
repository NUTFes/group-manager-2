import { useEffect, useState } from 'react';
import {
  useFireEquipmentMutations,
  useGetFireEquipmentOrdersByGroupId,
} from '@/api/fireEquipmentApi';
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

  const { deleteFireEquipmentOrder } = useFireEquipmentMutations();
  const { registerUnregisteredGroup, deleteUnregisteredGroup } =
    useMutateUnregisteredGroup(ORDER_TYPES.FIRE_EQUIPMENT_ORDER);

  const isLoading = isOrdersLoading || isUnRegisteredLoading;
  const hasExisting = fireEquipmentOrders.length > 0;

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
    updateState({ isEditing: true });
  };

  const handleApplyNegative = async () => {
    try {
      if (hasExisting) {
        await Promise.allSettled(
          fireEquipmentOrders.map((o) => deleteFireEquipmentOrder(o.id))
        );
      }
      const result = await registerUnregisteredGroup(groupId);
      if (result.success) {
        updateState({ applyFireEquipment: 'no' });
        await Promise.all([
          mutateFireEquipmentOrders(),
          mutateUnregisteredGroup(),
        ]);
        toast.success(
          t('applications.fireEquipment.messages.noApplicationSuccess')
        );
      } else {
        // 登録失敗時は再取得して現状を同期
        await mutateFireEquipmentOrders();
        toast.error(
          t('applications.fireEquipment.messages.submitFailed', { message: '' })
        );
      }
    } catch (error) {
      console.error('火気不使用登録エラー:', error);
      await mutateFireEquipmentOrders();
      toast.error(
        t('applications.fireEquipment.messages.submitFailed', { message: '' })
      );
    }
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      await deleteFireEquipmentOrder(id);
      await mutateFireEquipmentOrders();
      toast.success(t('applications.fireEquipment.messages.deleteSuccess'));

      if (fireEquipmentOrders.length === 1) {
        updateState({ applyFireEquipment: 'yes', isEditing: false });
      }
    } catch (error) {
      console.error('火気申請削除エラー:', error);
      toast.error(t('applications.fireEquipment.messages.deleteFailed'));
    }
  };

  const handleCancelUnregistered = async () => {
    try {
      const result = await deleteUnregisteredGroup(unregisteredData);
      if (!result.success) {
        console.error('不使用解除エラー:', result.error);
        // 失敗時はエラートーストで通知
        toast.error(
          t('applications.fireEquipment.messages.submitFailed', { message: '' })
        );
        return;
      }
      updateState({ applyFireEquipment: 'undecided' });
      await mutateUnregisteredGroup();
    } catch (error) {
      console.error('火気不使用解除エラー:', error);
      toast.error(
        t('applications.fireEquipment.messages.submitFailed', { message: '' })
      );
    }
  };

  const handleFormComplete = async () => {
    await mutateFireEquipmentOrders();
    updateState({ applyFireEquipment: 'yes', isEditing: false });
  };

  return {
    state,
    isLoading,
    hasExisting,
    hasUnregistered,
    fireEquipmentOrders,
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
