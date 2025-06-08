import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CookingProcessOrderSchema, cookingProcessOrderSchema } from './schema';

export const useCookingProcessOrderForm = () => {
  const [confirmCookingProcessValues, setConfirmCookingProcessValues] =
    useState<string[]>([]);

  const handleConfirmCookingProcessChange = (newValues: string[]) => {
    setConfirmCookingProcessValues(newValues);
  };

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<CookingProcessOrderSchema>({
    resolver: zodResolver(cookingProcessOrderSchema),
    defaultValues: {
      groupId: 0,
      preOpenKitchen: false,
      duringOpenKitchen: false,
      tent: '',
    },
  });

  const onSubmit = (data: CookingProcessOrderSchema) => {
    console.log(data);
    toast.success('調理工程申請が送信されました。');
    // TODO: Implement API call for submission
  };

  const values = watch();

  return {
    handleSubmit,
    setValue,
    errors,
    onSubmit,
    values,
    confirmCookingProcessValues,
    handleConfirmCookingProcessChange,
  };
};
