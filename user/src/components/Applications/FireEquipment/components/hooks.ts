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

export const useFireEquipmentOrder = (groupId: number) => {
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

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FireEquipmentSchemaForm>({
    resolver: zodResolver(FireEquipmentSchema),
    defaultValues: {
      name: '',
      quantity: 0,
      fuel: 0,
      usage: '',
      isTakeaway: true,
      remarks: '',
    },
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

    toast.success('火器申請を行わない登録が完了しました');
  };
  const submitUnregisteredHandler =
    handleSubmitUnregistered(onSubmitUnregistered);

  const values = watch();

  const onSubmitFireEquipment = async (formData: FireEquipmentSchemaForm) => {
    console.log('Submitted Data:', formData);
    toast.success('火器申請が送信されました！');
  };

  const submitHandler = handleSubmit(onSubmitFireEquipment);

  return {
    isRegister,
    submitUnregisteredHandler,
    errorsUnregistered,
    isRegisterValue,
    setIsRegisterValue,
    values,
    errors,
    setValue,
    submitHandler,
  };
};

export const convertToBoolToString = (value: boolean) => {
  return value ? YES_ID_STRING : NO_ID_STRING;
};
