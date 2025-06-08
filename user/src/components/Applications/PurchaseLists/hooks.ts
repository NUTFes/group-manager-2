import { useCallback, useEffect, useState } from 'react';
import {
  useCreatePurchaseList,
  useDeletePurchaseList,
  useGetPurchaseLists,
  useUpdatePurchaseList,
  useUpsertPurchaseLists,
} from '@/api/purchaseListsApi';
import { useGetShops } from '@/api/shopApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FormItem } from '@/components/FormList/type';
import {
  DEFAULT_PURCHASE_ITEM,
  FOOD_PRODUCT_OPTIONS,
  FRESH_OPTIONS,
  NET_ORDER_SHOP_ID,
  OTHER_SHOP_ID,
} from './constants';
import {
  PurchaseItem,
  PurchaseListsFormData,
  purchaseListsFormSchema,
} from './schema';

export const usePurchaseListsState = (
  groupId: number,
  initialIsRegisteredProp?: boolean
) => {
  const { purchaseLists, isLoading, hasError, mutatePurchaseLists } =
    useGetPurchaseLists(groupId);
  const { trigger: deletePurchaseList } = useDeletePurchaseList(1);
  const { shops, isLoading: isShopsLoading } = useGetShops();

  const [isEditing, setIsEditing] = useState(!initialIsRegisteredProp);

  // 販売品オプション
  const foodProductOptions = FOOD_PRODUCT_OPTIONS;

  // ショップオプションをAPIから取得したデータで作成
  const shopOptions = [
    { id: 0, name: '選択してください' },
    ...shops,
    { id: NET_ORDER_SHOP_ID, name: 'ネット注文' },
    { id: OTHER_SHOP_ID, name: 'その他(詳細を備考欄に記入必須)' },
  ];

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleDeleteItem = async (itemId: number) => {
    if (!purchaseLists) return;
    try {
      await deletePurchaseList({ body: { id: itemId } });
      toast.success('購入品が削除されました');
      await mutatePurchaseLists();
      // 最後のアイテムを削除した場合のみ編集モードに切り替え
      if (purchaseLists.length === 1) {
        setIsEditing(true);
      }
    } catch {
      toast.error('削除に失敗しました。');
    }
  };

  const formItems =
    purchaseLists?.map((item) => {
      const shopName =
        shopOptions.find((shop) => shop.id === item.shopId)?.name || '不明';
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
      return singleItemForm;
    }) || [];

  const handleFormSuccess = () => {
    mutatePurchaseLists();
  };

  return {
    purchaseLists,
    isLoading: isLoading || isShopsLoading,
    hasError,
    isEditing,
    toggleEdit,
    handleDeleteItem,
    formItems,
    foodProductOptions,
    shopOptions,
    initialFormData:
      purchaseLists?.map((item) => ({
        ...item,
        url: item.url || undefined,
      })) || [],
    handleFormSuccess,
    mutatePurchaseLists,
  };
};

export const usePurchaseListsForm = (
  groupId: number,
  initialData: PurchaseItem[] | undefined,
  onSuccess: () => void,
  shopOptions: { id: number; name: string }[]
) => {
  const { trigger: createPurchaseList } = useCreatePurchaseList();
  const { trigger: updatePurchaseList } = useUpdatePurchaseList(null);
  const { trigger: upsertPurchaseLists } = useUpsertPurchaseLists();

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

  const resetForm = useCallback(
    (data?: PurchaseItem[]) => {
      reset({
        purchaseLists: data && data.length > 0 ? data : [DEFAULT_PURCHASE_ITEM],
      });
    },
    [reset]
  );

  // initialDataが変更された場合のみフォームをリセット
  useEffect(() => {
    if (initialData) {
      resetForm(initialData);
    }
  }, [initialData, resetForm]);

  const handleActualSubmit = async (formData: PurchaseListsFormData) => {
    try {
      if (formData.purchaseLists.length > 1) {
        // 複数個の場合はupsertを使用
        const purchaseLists = formData.purchaseLists.map((item) => ({
          ...item,
          groupId,
        }));
        await upsertPurchaseLists({ body: purchaseLists });
      } else {
        // 単体の場合は個別のAPIを使用
        const item = formData.purchaseLists[0];
        if (item.id) {
          // 更新
          await updatePurchaseList({ body: { ...item, groupId } });
        } else {
          // 新規作成
          await createPurchaseList({ body: { ...item, groupId } });
        }
      }
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
    shopOptions,
  };
};

// 日付変換のカスタムフック
export const useDateFormatters = () => {
  // YYYY/MM/DD -> YYYY-MM-DD (input[type="date"]用)
  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(
        2,
        '0'
      )}`;
    }
    return dateString;
  };

  // YYYY-MM-DD -> YYYY/MM/DD (保存用)
  const formatDateForStore = (dateString: string | undefined) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[0]}/${Number(parts[1])}/${Number(parts[2])}`;
    }
    return dateString;
  };

  return {
    formatDateForInput,
    formatDateForStore,
  };
};
