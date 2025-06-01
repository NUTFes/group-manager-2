import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { DEFAULT_BOUGHT_ITEM } from '../constants';
import {
  PurchaseListsApplicationFormData,
  PurchaseListsApplicationSchema,
} from '../schema';

export const usePurchaseListsForm = () => {
  // フォームの初期化
  const formMethods = useForm<PurchaseListsApplicationFormData>({
    resolver: zodResolver(PurchaseListsApplicationSchema),
    defaultValues: {
      purchaseLists: [DEFAULT_BOUGHT_ITEM],
    },
    mode: 'onChange',
  });

  const { control, formState, reset } = formMethods;

  // フィールド配列の管理
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'purchaseLists',
  });

  // 購入品を追加
  const addItem = () => {
    append(DEFAULT_BOUGHT_ITEM);
  };

  // 購入品を削除
  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // フォームの妥当性
  const isValid = formState.isValid;

  // フォームをリセット
  const resetForm = () => {
    reset({
      purchaseLists: [DEFAULT_BOUGHT_ITEM],
    });
  };

  // 既存データでフォームを初期化
  const initializeForm = (data: PurchaseListsApplicationFormData) => {
    reset(data);
  };

  return {
    formMethods,
    fields,
    addItem,
    removeItem,
    isValid,
    resetForm,
    initializeForm,
  };
};
