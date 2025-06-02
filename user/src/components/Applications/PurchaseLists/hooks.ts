import { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FormItem } from '@/components/FormList/type';
import {
  DEFAULT_PURCHASE_ITEM,
  FOOD_PRODUCT_OPTIONS,
  FRESH_OPTIONS,
  SHOP_OPTIONS,
} from './constants';
import {
  PurchaseItem,
  PurchaseListsFormData,
  purchaseListsFormSchema,
} from './schema';
import { MockPurchaseListResponse } from './types';

// モックデータ管理のためのローカルストレージキー
const getStorageKey = (groupId: number) =>
  `purchase_lists_group_${groupId}_new`;

// モック API フック
const useMockGetPurchaseListsByGroupId = (groupId: number) => {
  const [data, setData] = useState<MockPurchaseListResponse[] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(() => {
    try {
      setIsLoading(true);
      const storageKey = getStorageKey(groupId);
      const storedData = localStorage.getItem(storageKey);
      if (storedData) {
        const parsedData = JSON.parse(storedData) as MockPurchaseListResponse[];
        setData(parsedData);
      } else {
        setData([]);
      }
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('データの読み込みに失敗しました')
      );
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const mutatePurchaseLists = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    purchaseListsData: data,
    isLoading,
    error,
    mutatePurchaseLists,
  };
};

export const usePurchaseListsState = (groupId: number) => {
  const { purchaseListsData, isLoading, error, mutatePurchaseLists } =
    useMockGetPurchaseListsByGroupId(groupId);

  const [isEditing, setIsEditing] = useState(true); // 初期状態は編集モード

  // 販売品オプション
  const foodProductOptions = FOOD_PRODUCT_OPTIONS;

  useEffect(() => {
    if (!isLoading) {
      if (purchaseListsData && purchaseListsData.length > 0) {
        setIsEditing(false); // データがあれば表示モード
      } else {
        setIsEditing(true); // データがなければ編集モード
      }
    }
  }, [purchaseListsData, isLoading]);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleDeleteItem = async (itemId: number) => {
    if (!purchaseListsData) return;
    try {
      const updatedData = purchaseListsData.filter(
        (item) => item.id !== itemId
      );
      localStorage.setItem(getStorageKey(groupId), JSON.stringify(updatedData));
      toast.success('購入品が削除されました');
      mutatePurchaseLists();
      if (updatedData.length === 0) {
        setIsEditing(true); // 全て削除されたら編集モードへ
      }
    } catch {
      toast.error('削除に失敗しました。');
    }
  };

  const formItems: FormItem[][] = useMemo(() => {
    if (!purchaseListsData) return [];
    return purchaseListsData.map((item) => {
      const shopName =
        SHOP_OPTIONS.find((shop) => shop.id === item.shopId)?.name || '不明';
      const foodProductName =
        foodProductOptions.find((product) => product.id === item.foodProductId)
          ?.name || '不明';
      const freshName =
        FRESH_OPTIONS.find((opt) => opt.id === (item.isFresh ? 1 : 2))?.name ||
        '不明';

      const singleItemForm: FormItem[] = [
        { label: '販売品名', content: foodProductName },
        { label: '食材・材料', content: item.items },
        { label: '商品の種類', content: freshName },
        { label: '購入場所', content: shopName },
        { label: '購入日', content: item.purchaseDate },
      ];
      if (item.url) {
        singleItemForm.push({ label: 'URL', content: item.url });
      }
      if (item.remarks) {
        singleItemForm.push({ label: '備考', content: item.remarks });
      }
      return singleItemForm;
    });
  }, [purchaseListsData, foodProductOptions]);

  const handleFormSuccess = () => {
    mutatePurchaseLists();
  };

  return {
    purchaseLists: purchaseListsData,
    isLoading,
    error,
    isEditing,
    toggleEdit,
    handleDeleteItem,
    formItems,
    foodProductOptions,
    initialFormData: purchaseListsData,
    handleFormSuccess,
    mutatePurchaseLists,
  };
};

export const usePurchaseListsForm = (
  groupId: number,
  initialData: PurchaseItem[] | undefined,
  onSuccess: () => void
) => {
  const formMethods = useForm<PurchaseListsFormData>({
    resolver: zodResolver(purchaseListsFormSchema),
    defaultValues: {
      purchaseLists:
        initialData && initialData.length > 0
          ? initialData
          : [DEFAULT_PURCHASE_ITEM],
    },
    mode: 'onChange',
  });

  const { control, handleSubmit, formState, reset } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'purchaseLists',
  });

  // フォームの値をリセットする関数
  const resetForm = useCallback(
    (data?: PurchaseItem[]) => {
      reset({
        purchaseLists: data && data.length > 0 ? data : [DEFAULT_PURCHASE_ITEM],
      });
    },
    [reset]
  );

  // initialDataが変更されたらフォームをリセット
  useEffect(() => {
    resetForm(initialData);
  }, [initialData, resetForm]);

  const handleActualSubmit = async (formData: PurchaseListsFormData) => {
    try {
      const mockDataToSave = formData.purchaseLists.map((item, index) => ({
        ...item,
        id: item.id || Date.now() + index,
        groupId,
      }));
      localStorage.setItem(
        getStorageKey(groupId),
        JSON.stringify(mockDataToSave)
      );
      toast.success('購入品申請が登録されました');
      onSuccess();
    } catch {
      toast.error('登録に失敗しました。');
    }
  };

  return {
    control,
    fields,
    append: (item: Partial<PurchaseItem> = DEFAULT_PURCHASE_ITEM) =>
      append({ ...DEFAULT_PURCHASE_ITEM, ...item }),
    remove,
    triggerSubmit: handleSubmit(handleActualSubmit),
    errors: formState.errors,
    isValid: formState.isValid,
    resetForm,
    getValues: formMethods.getValues,
  };
};
