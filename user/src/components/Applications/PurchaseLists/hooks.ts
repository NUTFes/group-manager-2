import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetFoodProducts } from '@/api/foodProductApi';
import {
  UpdatePurchaseListsRequest,
  useCreatePurchaseList,
  useDeletePurchaseList,
  useGetPurchaseListsByFoodProduct,
  useUpdatePurchaseList,
  useUpsertPurchaseLists,
} from '@/api/purchaseListsApi';
import { useGetShops } from '@/api/shopApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormSetValue, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FormItem } from '@/components/FormList/type';
import { DEFAULT_PURCHASE_ITEM, FRESH_OPTIONS } from './constants';
import {
  PurchaseItem,
  PurchaseListsFormData,
  purchaseListsFormSchema,
} from './schema';
import { FoodProductOption } from './types';

// 日付変換のカスタムフック
export const useDateFormatters = () => {
  // YYYY/MM/DD -> YYYY-MM-DD (input[type="date"]用)
  const formatDateForInput = useCallback((dateString: string | undefined) => {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(
        2,
        '0'
      )}`;
    }
    return dateString;
  }, []);

  const formatDateForDisplay = useCallback((dateString: string | undefined) => {
    if (!dateString) return '';
    const parts = dateString.replace(/-/g, '/').split('/');
    if (parts.length === 3) {
      return `${parts[0]}/${Number(parts[1])}/${Number(parts[2])}`;
    }
    return dateString;
  }, []);

  return {
    formatDateForInput,
    formatDateForDisplay,
  };
};

export const useFoodProducts = (groupId: number) => {
  const { foodProducts, isLoading, error } = useGetFoodProducts(groupId);

  const foodProductOptions = useMemo((): FoodProductOption[] => {
    const initialOptions: FoodProductOption[] = [
      { id: 0, name: '選択してください' },
    ];

    if (!foodProducts) {
      return initialOptions;
    }
    const fetchedOptions = foodProducts.map((p) => ({
      id: p.id,
      name: p.name,
    }));
    return [...initialOptions, ...fetchedOptions];
  }, [foodProducts]);

  return {
    foodProducts: foodProducts || [],
    foodProductOptions,
    isLoading,
    hasError: !!error,
  };
};

export const usePurchaseListsState = (
  groupId: number,
  selectedFoodProductId: number | null,
  initialIsRegisteredProp?: boolean
) => {
  const { purchaseLists, isLoading, hasError, mutatePurchaseLists } =
    useGetPurchaseListsByFoodProduct(selectedFoodProductId);

  const { trigger: deletePurchaseList } = useDeletePurchaseList();
  const { shops, isLoading: isShopsLoading } = useGetShops();
  const { foodProductOptions } = useFoodProducts(groupId);

  const [isEditing, setIsEditing] = useState(!initialIsRegisteredProp);

  // ショップオプションをAPIから取得したデータで作成
  const shopOptions = useMemo(
    () => [{ id: 0, name: '選択してください' }, ...shops],
    [shops]
  );

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleDeleteItem = async (itemId: number) => {
    if (!purchaseLists || !itemId) return;
    try {
      await deletePurchaseList({ id: itemId });
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

  const { formatDateForInput, formatDateForDisplay } = useDateFormatters();

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
        { label: '購入日', content: formatDateForDisplay(item.purchaseDate) },
      ];
      if (item.url) {
        singleItemForm.push({ label: 'URL', content: item.url });
      }
      return singleItemForm;
    }) || [];

  const handleFormSuccess = () => {
    mutatePurchaseLists();
  };

  // 選択された販売品の購入リストを初期値として設定
  const initialFormData = useMemo(
    () =>
      purchaseLists?.map((item) => ({
        ...item,
        fesDateId: 1,
        purchaseDate: formatDateForInput(item.purchaseDate),
        url: item.url || undefined,
      })) || [DEFAULT_PURCHASE_ITEM],
    [purchaseLists, formatDateForInput]
  );

  return {
    purchaseLists:
      purchaseLists?.map((item) => ({ ...item, url: item.url || undefined })) ??
      [],
    isLoading: isLoading || isShopsLoading,
    hasError,
    isEditing,
    toggleEdit,
    handleDeleteItem,
    formItems,
    foodProductOptions,
    shopOptions,
    initialFormData,
    handleFormSuccess,
    mutatePurchaseLists,
  };
};

export const usePurchaseListsForm = (
  groupId: number,
  initialData: PurchaseItem[] | undefined,
  onSuccess: () => void
) => {
  const { trigger: createPurchaseList } = useCreatePurchaseList();
  const { trigger: updatePurchaseList } = useUpdatePurchaseList();
  const { trigger: upsertPurchaseLists } = useUpsertPurchaseLists();
  const { trigger: deletePurchaseList } = useDeletePurchaseList();

  const formMethods = useForm<PurchaseListsFormData>({
    resolver: zodResolver(purchaseListsFormSchema),
    defaultValues: {
      purchaseLists:
        initialData && initialData.length > 0
          ? initialData
          : [DEFAULT_PURCHASE_ITEM],
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { control, handleSubmit, formState, reset, setValue } = formMethods;

  useEffect(() => {
    if (initialData) {
      setValue(
        'purchaseLists',
        initialData.length > 0 ? initialData : [DEFAULT_PURCHASE_ITEM]
      );
    }
  }, [initialData, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'purchaseLists',
  });

  const onRemove = async (index: number) => {
    const item = formMethods.getValues().purchaseLists[index];
    if (item && item.id) {
      try {
        await deletePurchaseList({ id: item.id });
        toast.success('購入品が削除されました');
        remove(index);
      } catch (error) {
        toast.error('削除に失敗しました。');
        console.error(error);
      }
    } else {
      remove(index);
    }
  };

  const handleActualSubmit = async (formData: PurchaseListsFormData) => {
    try {
      if (formData.purchaseLists.length > 1) {
        // 複数個の場合はupsertを使用
        const requestBody: UpdatePurchaseListsRequest = {
          purchaseLists: formData.purchaseLists.map((item) => ({
            ...item,
            fesDateId: 1,
            groupId,
          })),
        };
        await upsertPurchaseLists({ body: requestBody });
        toast.success('複数の購入品申請が登録されました');
      } else {
        // 単体の場合は個別のAPIを使用
        const item = formData.purchaseLists[0];
        const itemWithFesDateId = { ...item, fesDateId: 1, groupId };

        if (item.id) {
          // 更新
          await updatePurchaseList({
            id: item.id,
            body: itemWithFesDateId,
          });
          toast.success('購入品申請が更新されました');
        } else {
          // 新規作成
          await createPurchaseList({ body: itemWithFesDateId });
          toast.success('購入品申請が登録されました');
        }
      }
      onSuccess();
      reset(formData); // 送信後もフォーム内容は維持
    } catch (error) {
      toast.error('登録に失敗しました');
      console.error(error);
    }
  };

  return {
    control,
    fields,
    append,
    remove: onRemove,
    triggerSubmit: handleSubmit(handleActualSubmit),
    errors: formState.errors,
    isValid: formState.isValid,
    setValue,
    reset,
  };
};

export const usePurchaseListRowUpdater = (
  purchaseLists: PurchaseItem[] | undefined,
  setValue: UseFormSetValue<PurchaseListsFormData>
) => {
  // 指定したfoodProductIdとindexに該当するデータでフォームの値を更新
  return (foodProductId: number, index: number) => {
    const filtered =
      purchaseLists?.filter((item) => item.foodProductId === foodProductId) ||
      [];
    const item = filtered[index];
    if (item) {
      setValue(`purchaseLists.${index}.items`, item.items);
      setValue(`purchaseLists.${index}.isFresh`, item.isFresh);
      setValue(`purchaseLists.${index}.shopId`, item.shopId);
      setValue(`purchaseLists.${index}.purchaseDate`, item.purchaseDate);
      setValue(`purchaseLists.${index}.url`, item.url ?? undefined);
      setValue(
        `purchaseLists.${index}.remark`,
        (item as { remark?: string }).remark ?? undefined
      );
    } else {
      setValue(`purchaseLists.${index}.items`, '');
      setValue(`purchaseLists.${index}.isFresh`, true);
      setValue(`purchaseLists.${index}.shopId`, 0);
      setValue(`purchaseLists.${index}.purchaseDate`, '');
      setValue(`purchaseLists.${index}.url`, undefined);
      setValue(`purchaseLists.${index}.remark`, undefined);
    }
  };
};
