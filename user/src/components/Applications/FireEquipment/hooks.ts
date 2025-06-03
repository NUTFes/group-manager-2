import { useState } from 'react';
import {
  FireEquipmentFuel,
  FireEquipmentResponse,
} from '@/api/fireEquipmentApi';
import { FormItem } from '@/components/FormList/type';
import { fireEquipmentFormFields } from './constant';

export const useFireEquipmentHooks = (groupId: number) => {
  // NOTE:API繋いでないのでフラグで登録済みを判定、TODO: API実装後に削除
  const isRegistered = true;
  const fireEquipment: FireEquipmentResponse | undefined = isRegistered
    ? {
        group_id: groupId,
        name: 'ガスコンロ',
        quantity: 1,
        fuel: FireEquipmentFuel.GAS_BOTTLE,
        usage: 'バーベキュー',
        is_takeaway: true,
        remark: '',
      }
    : undefined;
  const hasUnregistered = false; // TODO: API実装後に修正
  const formItem: FormItem[] = fireEquipment
    ? [
        {
          label: fireEquipmentFormFields.NAME,
          content: fireEquipment?.name || '',
        },
        {
          label: fireEquipmentFormFields.QUANTITY,
          content: fireEquipment?.quantity.toString() || '',
        },
        {
          label: fireEquipmentFormFields.FUEL,
          content: fireEquipment?.fuel.toString() || '',
        },
        {
          label: fireEquipmentFormFields.USAGE,
          content: fireEquipment?.usage || '',
        },
        {
          label: fireEquipmentFormFields.IS_TAKEAWAY,
          content: fireEquipment?.is_takeaway ? 'はい' : 'いいえ',
        },
        {
          label: fireEquipmentFormFields.REMARK,
          content: fireEquipment?.remark || '',
        },
      ]
    : [];

  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
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
    fireEquipment,
  };
};
