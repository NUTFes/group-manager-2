import { useState } from 'react';
import {
  useFireEquipmentMutations,
  useGetFireEquipmentOrderByGroupId,
} from '@/api/fireEquipmentApi';
import { toast } from 'react-toastify';
import { FormItem } from '@/components/FormList/type';
import { useFireEquipmentTexts } from './constant';

export const useFireEquipmentHooks = (groupId: number) => {
  const fireEquipmentTexts = useFireEquipmentTexts();
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
            label: fireEquipmentTexts.fields.name,
            content: fireEquipment.name,
          },
          {
            label: fireEquipmentTexts.fields.quantity,
            content: String(fireEquipment.quantity),
          },
          {
            label: fireEquipmentTexts.fields.fuel,
            content: fireEquipmentTexts.fuelLabel(fireEquipment.fuel),
          },
          {
            label: fireEquipmentTexts.fields.usage,
            content: fireEquipment.usage,
          },
          {
            label: fireEquipmentTexts.fields.isTakeaway,
            content: fireEquipment.is_takeaway
              ? fireEquipmentTexts.radio.options.yes
              : fireEquipmentTexts.radio.options.no,
          },
          {
            label: fireEquipmentTexts.fields.remark,
            content: fireEquipment.remark || '',
          },
        ]
      : [];

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const handleDeleteClick = async () => {
    if (!fireEquipment?.id) return;
    try {
      await deleteFireEquipmentOrder(fireEquipment.id);
      await mutateFireEquipmentOrder();
      toast.success(fireEquipmentTexts.messages.deleteSuccess);
    } catch {
      toast.error(fireEquipmentTexts.messages.deleteFailed);
    }
  };

  const noApplicationItems: FormItem[] = [
    {
      label: fireEquipmentTexts.summary.noApplicationLabel,
      content: fireEquipmentTexts.summary.noApplicationDescription,
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
  };
};
