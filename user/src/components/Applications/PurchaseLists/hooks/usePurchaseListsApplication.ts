import { useCallback, useEffect, useMemo, useState } from 'react';
// import { useGetPurchaseListsByGroupId } from '@/api/purchaseListsApi';
import { toast } from 'react-toastify';
import { PurchaseListsApplicationFormData } from '../schema';
import { FoodProductOption, PurchaseLists } from '../types';
import { usePurchaseListsForm } from './usePurchaseListsForm';

interface UsePurchaseListsApplicationState {
  isEditing: boolean;
  submitError: string | null;
  isSubmitted: boolean;
}

// モックデータ管理のためのローカルストレージキー
const getStorageKey = (groupId: number) => `purchase_lists_group_${groupId}`;

// モックAPIレスポンス型
type MockPurchaseListResponse = {
  id: number;
  groupId: number;
  foodProductId: number;
  shopId: number;
  items: string;
  isFresh: boolean;
  purchaseDate: string;
  url?: string;
};

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
    purchaseLists: data,
    isLoading,
    error,
    mutatePurchaseLists,
  };
};

export const usePurchaseListsApplication = (groupId: number) => {
  const [state, setState] = useState<UsePurchaseListsApplicationState>({
    isEditing: false,
    submitError: null,
    isSubmitted: false,
  });

  // モック API フック
  const {
    purchaseLists: apiPurchaseLists,
    isLoading,
    error,
    mutatePurchaseLists,
  } = useMockGetPurchaseListsByGroupId(groupId);

  // フォーム管理
  const purchaseListsForm = usePurchaseListsForm();

  // 販売品オプション（将来的にはAPIから取得）
  const foodProductOptions: FoodProductOption[] = useMemo(
    () => [
      { id: 0, name: '選択してください' },
      { id: 1, name: 'からあげ（仮）' },
      { id: 2, name: 'フランクフルト（仮）' },
      { id: 3, name: 'チョコバナナ（仮）' },
      { id: 4, name: 'たこ焼き（仮）' },
      { id: 5, name: 'かき氷（仮）' },
    ],
    []
  );

  const hasExisting = useMemo(() => {
    return apiPurchaseLists && apiPurchaseLists.length > 0;
  }, [apiPurchaseLists]);

  useEffect(() => {
    if (!isLoading && apiPurchaseLists !== undefined) {
      if (hasExisting) {
        // 既存データがある場合、表示モード
        setState((prev) => ({
          ...prev,
          isEditing: false,
          isSubmitted: true,
        }));
      } else {
        // 新規申請の場合、編集モード
        setState((prev) => ({
          ...prev,
          isEditing: true,
          isSubmitted: false,
        }));
      }
    }
  }, [isLoading, hasExisting, apiPurchaseLists]);

  // 未登録データの有無
  const hasUnregistered = false;

  const purchaseLists: PurchaseLists[] = useMemo(() => {
    if (!apiPurchaseLists) return [];
    return apiPurchaseLists.map((item: MockPurchaseListResponse) => ({
      id: item.id,
      foodProductId: item.foodProductId,
      shopId: item.shopId,
      items: item.items,
      isFresh: item.isFresh,
      purchaseDate: item.purchaseDate,
      url: item.url || '',
    }));
  }, [apiPurchaseLists]);

  // ローカルストレージにデータを保存
  const saveToStorage = useCallback(
    (data: MockPurchaseListResponse[]) => {
      const storageKey = getStorageKey(groupId);
      localStorage.setItem(storageKey, JSON.stringify(data));
    },
    [groupId]
  );

  // フォーム送信ハンドラ
  const handleFormSubmit = useCallback(
    async (data: PurchaseListsApplicationFormData) => {
      setState((prev) => ({ ...prev, submitError: null }));

      try {
        // モックデータとして保存
        const mockData: MockPurchaseListResponse[] = data.purchaseLists.map(
          (item, index) => ({
            id: item.id || Date.now() + index,
            groupId: groupId,
            foodProductId: item.foodProductId,
            shopId: item.shopId,
            items: item.items,
            isFresh: item.isFresh,
            purchaseDate: item.purchaseDate,
            url: item.url,
          })
        );

        saveToStorage(mockData);
        toast.success('購入品申請が登録されました');

        setState((prev) => ({
          ...prev,
          isEditing: false,
          isSubmitted: true,
        }));

        // 最新データを再取得
        mutatePurchaseLists();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '登録に失敗しました';
        setState((prev) => ({ ...prev, submitError: errorMessage }));
        toast.error(errorMessage);
      }
    },
    [groupId, saveToStorage, mutatePurchaseLists]
  );

  // 購入品削除ハンドラ
  const handleDeleteItem = useCallback(
    async (id: number) => {
      try {
        const currentData = apiPurchaseLists || [];
        const updatedData = currentData.filter((item) => item.id !== id);
        saveToStorage(updatedData);
        toast.success('購入品が削除されました');
        mutatePurchaseLists();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '削除に失敗しました';
        toast.error(errorMessage);
      }
    },
    [apiPurchaseLists, saveToStorage, mutatePurchaseLists]
  );

  // 編集モードへの切り替え
  const prepareFormForEditing = useCallback(() => {
    if (hasExisting) {
      // 既存データでフォームを初期化
      const formData: PurchaseListsApplicationFormData = {
        purchaseLists: purchaseLists,
      };
      purchaseListsForm.initializeForm(formData);
    }
    setState((prev) => ({
      ...prev,
      isEditing: true,
    }));
  }, [hasExisting, purchaseLists, purchaseListsForm]);

  // 送信完了
  const completeSubmission = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSubmitted: true,
      isEditing: false,
    }));
  }, []);

  return {
    state,
    hasExisting,
    hasUnregistered,
    purchaseLists,
    purchaseListsForm,
    handleFormSubmit,
    handleDeleteItem,
    prepareFormForEditing,
    completeSubmission,
    isLoading,
    error,
    foodProductOptions,
  };
};
