import { useState } from 'react';
import {
  FireEquipmentFuel,
  FireEquipmentResponse,
} from '@/api/fireEquipmentApi';
import { FormItem } from '@/components/FormList/type';
import { fireEquipmentFormFields } from './constant';

export const useFireEquipmentHooks = (groupId: number) => {
  const isRegistered = false;
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

  return {
    isEditing,
    formItem,
    handleEditClick,
    fireEquipment,
  };
};
