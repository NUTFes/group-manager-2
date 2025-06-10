import { useCallback, useEffect, useMemo, useState } from 'react';
import { FoodProductResponse, useGetFoodProducts } from '@/api/foodProductApi';
import {
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

/**
 * 日付の表示形式を変換するためのカスタムフック。
 * - `formatDateForInput`: API等から受け取った `YYYY/MM/DD` 形式を `input[type="date"]` で扱える `YYYY-MM-DD` 形式に変換します。
 * - `formatDateForDisplay`: `YYYY-MM-DD` 形式を `YYYY/MM/DD` の表示形式に変換します。
 * @returns 日付フォーマット関数を含むオブジェクト。
 */
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

/**
 * 指定されたグループIDに基づいて食品情報を取得し、セレクトボックス用のオプションを生成するカスタムフック。
 * @param groupId - 食品情報を取得する対象のグループID。
 * @returns 食品リスト、セレクトボックス用オプション、ローディング状態、エラー状態。
 */
export const useFoodProducts = (groupId: number) => {
  const { foodProducts, isLoading, error } = useGetFoodProducts(groupId);

  const memoizedFoodProducts = useMemo(
    () => foodProducts || [],
    [foodProducts]
  );

  const foodProductOptions = useMemo((): FoodProductOption[] => {
    const initialOptions: FoodProductOption[] = [
      { id: 0, name: '選択してください' },
    ];

    if (!memoizedFoodProducts) {
      return initialOptions;
    }
    const fetchedOptions = memoizedFoodProducts.map((p) => ({
      id: p.id,
      name: p.name,
    }));
    return [...initialOptions, ...fetchedOptions];
  }, [memoizedFoodProducts]);

  return {
    foodProducts: memoizedFoodProducts,
    foodProductOptions,
    isLoading,
    hasError: !!error,
  };
};

/**
 * 購入品リストの表示に関連する状態管理を行うカスタムフック。
 * データ取得、編集状態の管理、表示用データの整形などを行います。
 * @param foodProducts - 食品リスト。
 * @param foodProductOptions - 食品のセレクトボックス用オプション。
 * @param isRegistered - 登録済みかどうかを示すフラグ。
 * @returns 購入品リストの表示に必要なデータとハンドラ。
 */
export const usePurchaseListsState = (
  foodProducts: FoodProductResponse[],
  foodProductOptions: FoodProductOption[],
  isRegistered: boolean | undefined
) => {
  const { purchaseLists, isLoading, hasError, mutatePurchaseLists } =
    useGetPurchaseListsByFoodProduct(foodProducts.map((p) => p.id));

  const { trigger: deletePurchaseList } = useDeletePurchaseList()();
  const { shops, isLoading: isShopsLoading } = useGetShops();

  // isRegisteredがfalseの場合、つまり未登録の場合は初期状態で編集モードにする
  const [isEditing, setIsEditing] = useState(!isRegistered);

  // ショップ情報を取得し、セレクトボックス用のオプションを生成
  const shopOptions = useMemo(
    () => [{ id: 0, name: '選択してください' }, ...shops],
    [shops]
  );

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleDeleteItem = async (itemId: number) => {
    if (!purchaseLists || !itemId) return;
    try {
      await deletePurchaseList(itemId);
      toast.success('購入品が削除されました');
      await mutatePurchaseLists();
      // 最後のアイテムを削除した場合は、新規登録ができるよう編集モードに切り替える
      if (purchaseLists.length === 1) {
        setIsEditing(true);
      }
    } catch {
      toast.error('削除に失敗しました。');
    }
  };

  const { formatDateForInput, formatDateForDisplay } = useDateFormatters();

  // 表示用に整形済みの購入品リストアイテム
  const formItems = useMemo(
    () =>
      purchaseLists?.map((item) => {
        const shopName =
          shopOptions.find((shop) => shop.id === item.shopId)?.name || '';
        const foodProductName =
          foodProductOptions.find(
            (product) => product.id === item.foodProductId
          )?.name || '';
        const freshName =
          FRESH_OPTIONS.find((opt) => opt.id === (item.isFresh ? 1 : 2))
            ?.name || '';

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
      }) || [],
    [purchaseLists, shopOptions, foodProductOptions, formatDateForDisplay]
  );

  // フォーム送信成功後は表示モードに切り替え
  const handleFormSuccess = () => {
    mutatePurchaseLists();
    toggleEdit();
  };

  // フォームの初期値として使用するデータ。APIから取得したデータをフォームの形式に合わせる
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

  const memoizedPurchaseLists = useMemo(
    () =>
      purchaseLists?.map((item) => ({ ...item, url: item.url || undefined })) ??
      [],
    [purchaseLists]
  );

  return {
    purchaseLists: memoizedPurchaseLists,
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

/**
 * 購入品リストのフォームの状態管理と送信処理を行うカスタムフック。
 * react-hook-formを利用して、動的なフォームの追加・削除、バリデーション、送信処理を責務に持つ。
 * @param groupId - グループID。
 * @param initialData - フォームの初期データ。
 * @param onSuccess - フォーム送信成功時のコールバック関数。
 * @returns react-hook-formのメソッドと状態。
 */
export const usePurchaseListsForm = (
  groupId: number,
  initialData: PurchaseItem[] | undefined,
  onSuccess: () => void
) => {
  const { trigger: createPurchaseList } = useCreatePurchaseList();
  const { trigger: updatePurchaseList } = useUpdatePurchaseList()();
  const { trigger: upsertPurchaseLists } = useUpsertPurchaseLists();
  const { trigger: deletePurchaseList } = useDeletePurchaseList()();

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

  // initialDataが変更されたら、フォームの値をリセットする
  // fix: JSON.stringifyを使用しないと再レンダリングをし続ける無限ループに陥ったのでひとまずの対処。
  useEffect(() => {
    if (initialData) {
      setValue(
        'purchaseLists',
        initialData.length > 0 ? initialData : [DEFAULT_PURCHASE_ITEM]
      );
    }
  }, [JSON.stringify(initialData), setValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'purchaseLists',
  });

  // フォームからアイテムを削除する
  // 既に永続化されているアイテム（IDを持つ）の場合は、APIを呼び出して削除する
  const onRemove = async (index: number) => {
    const item = formMethods.getValues().purchaseLists[index];
    if (item && item.id) {
      try {
        await deletePurchaseList(item.id);
        toast.success('購入品が削除されました');
        remove(index);
      } catch (error) {
        toast.error('削除に失敗しました。');
        console.error(error);
      }
    } else {
      // 新規追加されただけのアイテムは、フォームの状態から削除するだけ
      remove(index);
    }
  };

  // フォームの送信処理
  const handleActualSubmit = async (formData: PurchaseListsFormData) => {
    try {
      // 申請が複数ある場合はupsert、単数の場合は作成/更新APIを使い分ける
      if (formData.purchaseLists.length > 1) {
        const requestBody: PurchaseListsFormData = {
          purchaseLists: formData.purchaseLists.map(({ ...item }) => ({
            ...item,
            ...(item.id && { id: item.id }),
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
    setValue,
    reset,
  };
};

/**
 * フォームの特定の行を、選択された食品に基づいて更新するためのコールバック関数を提供するカスタムフック。
 * 販売品名が選択された際に、関連するフォーム項目を自動入力する目的で使用する。
 * @param purchaseLists - 既存の購入品リスト。これをもとに自動入力される。
 * @param setValue - react-hook-formのsetValue関数。
 * @returns foodProductIdとindexを受け取り、フォームの行を更新する関数。
 */
export const usePurchaseListRowUpdater = (
  purchaseLists: PurchaseItem[] | undefined,
  setValue: UseFormSetValue<PurchaseListsFormData>
) => {
  // 指定したfoodProductIdとindexに該当するデータでフォームの値を更新
  return useCallback(
    (foodProductId: number, index: number) => {
      const filtered =
        purchaseLists?.filter((item) => item.foodProductId === foodProductId) ||
        [];
      const item = filtered[0];
      if (item) {
        setValue(`purchaseLists.${index}.items`, item.items);
        setValue(`purchaseLists.${index}.isFresh`, item.isFresh);
        setValue(`purchaseLists.${index}.shopId`, item.shopId);
        setValue(`purchaseLists.${index}.purchaseDate`, item.purchaseDate);
        setValue(`purchaseLists.${index}.url`, item.url ?? undefined);
        // `remark`はPurchaseItemに含まれていない可能性があるため、型キャストで対応。
        // 本来はスキーマで定義されているべき項目。
        setValue(
          `purchaseLists.${index}.remark`,
          (item as { remark?: string }).remark ?? undefined
        );
      } else {
        // 該当するデータがない場合はフォームの値をリセット
        setValue(`purchaseLists.${index}.items`, '');
        setValue(`purchaseLists.${index}.isFresh`, true);
        setValue(`purchaseLists.${index}.shopId`, 0);
        setValue(`purchaseLists.${index}.purchaseDate`, '');
        setValue(`purchaseLists.${index}.url`, undefined);
        setValue(`purchaseLists.${index}.remark`, undefined);
      }
    },
    [purchaseLists, setValue]
  );
};
