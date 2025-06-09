import { useState } from 'react';
import {
  CookingProcessOrderResponse,
  usePostCookingProcessOrder,
  useUpdateCookingProcessOrder,
} from '@/api/cookingProcessOrderApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CookingProcessOrderSchema, cookingProcessOrderSchema } from './schema';

export const useCookingProcessOrderForm = (
  groupId: number | undefined,
  foodProductId: number,
  onSuccess: () => void,
  defaultValues?: CookingProcessOrderResponse
) => {
  const methods = useForm<CookingProcessOrderSchema>({
    resolver: zodResolver(cookingProcessOrderSchema),
    defaultValues: {
      groupId: groupId,
      foodProductId: foodProductId,
      preOpenKitchen: defaultValues?.preOpenKitchen ?? false,
      duringOpenKitchen: defaultValues?.duringOpenKitchen ?? false,
      tent: defaultValues?.tent ?? '',
    },
  });

  const { trigger: post, isMutating: isPosting } = usePostCookingProcessOrder();
  const { trigger: update, isMutating: isUpdating } =
    useUpdateCookingProcessOrder(defaultValues?.id ?? 0);

  const onSubmit = methods.handleSubmit(async (data) => {
    const payload = { ...data, groupId, foodProductId };
    try {
      if (defaultValues) {
        await update({ body: payload });
      } else {
        await post({ body: payload });
      }
      toast.success('登録しました。');
      onSuccess();
    } catch (e) {
      console.error(e);
      toast.error('登録に失敗しました。');
    }
  });

  const values = methods.watch();

  const [confirmCookingProcessValues, setConfirmCookingProcessValues] =
    useState<string[]>([]);

  const handleConfirmCookingProcessChange = (newValues: string[]) => {
    setConfirmCookingProcessValues(newValues);
  };

  return {
    methods,
    values,
    confirmCookingProcessValues,
    handleConfirmCookingProcessChange,
    onSubmit,
    isSubmitting: isPosting || isUpdating,
  };
};
