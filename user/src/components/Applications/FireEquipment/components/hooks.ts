import { FireEquipmentResponse } from '@/api/fireEquipmentApi';
import { NO_ID_STRING, YES_ID_STRING } from '@/utils/constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import './schema';
import {
  FireEquipmentSchema,
  FireEquipmentSchemaForm,
  UnRegisteredFireEquipmentSchema,
  UnRegisteredFireEquipmentSchemaForm,
} from './schema';

export const useFireEquipmentOrder = (
  groupId: number,
  fireEquipmentData?: FireEquipmentResponse
) => {
  const {
    handleSubmit: handleSubmitUnregistered,
    formState: { errors: errorsUnregistered },
    setValue: setValueUnregistered,
    watch: watchUnregistered,
  } = useForm<UnRegisteredFireEquipmentSchemaForm>({
    resolver: zodResolver(UnRegisteredFireEquipmentSchema),
    defaultValues: {
      groupId: groupId,
      isRegister: true,
    },
  });

  // 既存の火気申請データがある場合は、編集モードにする
  const isEditing = !!fireEquipmentData;

  const defaultValues: FireEquipmentSchemaForm = {
    name: fireEquipmentData?.name || '',
    quantity: fireEquipmentData?.quantity || 0,
    fuel: fireEquipmentData?.fuel || 0,
    usage: fireEquipmentData?.usage || '',
    isTakeaway: fireEquipmentData?.is_takeaway || true,
    remarks: fireEquipmentData?.remark || '',
  };

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FireEquipmentSchemaForm>({
    resolver: zodResolver(FireEquipmentSchema),
    defaultValues: defaultValues,
  });

  const valuesUnregistered = watchUnregistered();
  const isRegister = valuesUnregistered.isRegister;
  const isRegisterValue = isRegister ? YES_ID_STRING : NO_ID_STRING;
  const setIsRegisterValue = (
    value: typeof YES_ID_STRING | typeof NO_ID_STRING
  ) => {
    setValueUnregistered('isRegister', value === YES_ID_STRING);
  };

  const onSubmitUnregistered = async (
    formData: UnRegisteredFireEquipmentSchemaForm
  ) => {
    if (formData.isRegister) {
      // trueの場合は、未登録には登録しないのでreturn
      return;
    }
    console.log('Unregistered Data:', formData);

    toast.success('火気申請を行わない登録が完了しました');
  };
  const submitUnregisteredHandler =
    handleSubmitUnregistered(onSubmitUnregistered);

  const values = watch();

  const validate = () => {
    if (!fireEquipmentData) {
      return false; // 既存の火気申請データがない場合は常に有効
    }

    return (
      defaultValues.name === values.name &&
      defaultValues.quantity === values.quantity &&
      defaultValues.fuel === values.fuel &&
      defaultValues.usage === values.usage &&
      defaultValues.isTakeaway === values.isTakeaway &&
      defaultValues.remarks === values.remarks
    );
  };

  const onSubmitFireEquipment = async (formData: FireEquipmentSchemaForm) => {
    console.log('Submitted Data:', formData);
    toast.success('火気申請が送信されました！');
  };

  const submitHandler = handleSubmit(onSubmitFireEquipment);

  return {
    // 未登録周り
    isRegister,
    submitUnregisteredHandler,
    errorsUnregistered,
    isRegisterValue,
    setIsRegisterValue,
    // 火気申請周り
    values,
    errors,
    setValue,
    submitHandler,
    // 既存の火気申請データがあるかどうか
    isEditing,
    // バリデーション
    validate,
  };
};

export const convertToBoolToString = (value: boolean) => {
  return value ? YES_ID_STRING : NO_ID_STRING;
};
