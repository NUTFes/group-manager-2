import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import './schema';
import { FireEquipmentSchema, FireEquipmentSchemaForm } from './schema';

export const useFireEquipmentOrder = () => {
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

  const values = watch();

  const onSubmit = async (formData: FireEquipmentSchemaForm) => {
    console.log('Submitted Data:', formData);
    toast.success('火器申請が送信されました！');
  };

  const submitHandler = handleSubmit(onSubmit);

  return {
    values,
    errors,
    setValue,
    submitHandler,
  };
};

export const convertToBoolToString = (value: boolean): '1' | '2' => {
  return value ? '1' : '2';
};
