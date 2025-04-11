// src/components/RentItems/hooks/useRentItemsFormLogic.ts
import { FormEvent, useEffect, useState } from 'react';
import { useApiGet, useApiMutations } from '@/hooks/useApi';

// フォームのエラー型
type FormErrors = {
  hasItems?: string;
  locationType?: string;
  items?: Array<{
    name?: string;
    count?: string;
  }>;
};

// フォームで使用する物品の型
type ItemForm = {
  itemId: string;
  count: number;
};

// APIエンドポイント
const API_ENDPOINTS = {
  // 物品関連
  INSIDE_SHOP_RENTABLE_ITEMS: '/api/v1/get_inside_shop_rentable_items', // 屋内模擬店での貸出物品
  OUTSIDE_SHOP_RENTABLE_ITEMS: '/api/v1/get_outside_shop_rentable_items', // 屋外模擬店での貸出物品

  // 物品申請関連
  RENTAL_ORDERS: '/rental_orders',
};

// APIレスポンス型
type ApiResponse<T> = {
  status: {
    code: number;
    message: string;
  };
  data: T;
};

// 物品マスター情報の型
type RentalItem = {
  id: number;
  name: string;
  is_inside_shop_rentable: boolean;
  is_outside_shop_rentable: boolean;
  is_stage_rentable: boolean;
  created_at: string;
  updated_at: string;
};

// 物品申請情報の型
type RentalOrder = {
  id: number;
  group_id: number;
  rental_item_id: number;
  num: number;
  created_at: string;
  updated_at: string;
};

export const useRentItemsFormLogic = () => {
  // 認証基盤ができたら、グループIDを取得する
  const [currentGroupId] = useState<number>(1);
  const [hasItems, setHasItems] = useState<boolean>(false);
  const [locationType, setLocationType] = useState<string>('1'); // デフォルトは「屋内」
  const [itemList, setItemList] = useState<ItemForm[]>([
    { itemId: '', count: 1 },
  ]);
  const [errors, setErrors] = useState<FormErrors | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  // 会場タイプに基づいて適切なエンドポイントを選択
  const itemsEndpoint =
    locationType === '1'
      ? API_ENDPOINTS.INSIDE_SHOP_RENTABLE_ITEMS
      : API_ENDPOINTS.OUTSIDE_SHOP_RENTABLE_ITEMS;

  // 物品データの取得
  const {
    data: itemsResponse,
    error: itemsError,
    isLoading: itemsLoading,
  } = useApiGet<ApiResponse<RentalItem[]>>(itemsEndpoint);

  // 物品申請データの取得
  const {
    data: rentalOrdersResponse,
    error: rentalOrdersError,
    isLoading: rentalOrdersLoading,
    mutate: mutateRentalOrders,
  } = useApiGet<ApiResponse<RentalOrder[]>>(
    `${API_ENDPOINTS.RENTAL_ORDERS}?group_id=${currentGroupId}`
  );

  // API操作のための関数
  const { post, put, delete: deleteData } = useApiMutations();

  const rentalOrders = rentalOrdersResponse?.data || [];

  // 初期データの設定
  useEffect(() => {
    if (rentalOrders.length > 0) {
      setHasItems(true);
      // 保存されている物品データを設定
      const savedItems = rentalOrders.map((item) => ({
        itemId: item.rental_item_id.toString(),
        count: item.num,
      }));
      setItemList(savedItems);

      // APIから取得した物品データをチェック
      if (itemsResponse?.data && itemsResponse.data.length > 0) {
        // 各申請物品が屋内用か屋外用かを判定
        const isInsideOnly = rentalOrders.every((order) => {
          const item = itemsResponse.data.find(
            (i) => i.id === order.rental_item_id
          );
          return (
            item?.is_inside_shop_rentable && !item?.is_outside_shop_rentable
          );
        });

        const isOutsideOnly = rentalOrders.every((order) => {
          const item = itemsResponse.data.find(
            (i) => i.id === order.rental_item_id
          );
          return (
            !item?.is_inside_shop_rentable && item?.is_outside_shop_rentable
          );
        });

        // 明確に屋内のみ、または屋外のみと判定できる場合
        if (isInsideOnly) {
          setLocationType('1'); // 屋内
        } else if (isOutsideOnly) {
          setLocationType('2'); // 屋外
        } else {
          // 混在している場合は、物品の数でより多い方を判定
          let insideCount = 0;
          let outsideCount = 0;

          for (const order of rentalOrders) {
            const item = itemsResponse.data.find(
              (i) => i.id === order.rental_item_id
            );
            if (item) {
              if (item.is_inside_shop_rentable) insideCount += order.num;
              if (item.is_outside_shop_rentable) outsideCount += order.num;
            }
          }

          // 屋外物品が多ければ屋外、そうでなければ屋内をデフォルトに
          setLocationType(outsideCount > insideCount ? '2' : '1');
        }
      }
    }
  }, [rentalOrders, itemsResponse]);

  // 物品のオプション
  const itemOptions = itemsResponse?.data
    ? [
        { id: 0, name: '選んでください' },
        ...itemsResponse.data.map((item) => ({
          id: item.id,
          name: item.name,
        })),
      ]
    : [{ id: 0, name: '選んでください' }];

  // 物品を追加
  const addItem = () => {
    setItemList([...itemList, { itemId: '', count: 1 }]);
  };

  // 物品を削除
  const removeItem = (index: number) => {
    if (itemList.length <= 1) {
      return;
    }
    const newList = [...itemList];
    newList.splice(index, 1);
    setItemList(newList);
    validateForm();
  };

  // 物品名を更新
  const updateItemName = (index: number, value: string) => {
    const newList = [...itemList];
    newList[index].itemId = value;
    setItemList(newList);
    validateForm();
  };

  // 個数を更新
  const updateItemCount = (index: number, value: string) => {
    const newList = [...itemList];
    newList[index].count = parseInt(value, 10);
    setItemList(newList);
    validateForm();
  };

  // 会場タイプのラジオボタンを更新
  const updateLocationType = (value: string) => {
    setLocationType(value);
    validateForm();
  };

  // フォームのバリデーション
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (hasItems) {
      // 会場タイプの選択を検証
      if (!locationType || (locationType !== '1' && locationType !== '2')) {
        newErrors.locationType = '会場タイプを選択してください';
      }

      const itemErrors: Array<{ name?: string; count?: string }> = [];
      let hasItemError = false;

      itemList.forEach((item, index) => {
        const errors: { name?: string; count?: string } = {};

        if (!item.itemId || item.itemId === '0') {
          errors.name = '物品を選択してください';
          hasItemError = true;
        }

        if (!item.count || item.count <= 0) {
          errors.count = '1つ以上選択してください';
          hasItemError = true;
        }

        itemErrors[index] = errors;
      });

      if (hasItemError) {
        newErrors.items = itemErrors;
      }
    }

    setErrors(Object.keys(newErrors).length > 0 ? newErrors : null);
    setIsValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  };

  // 物品申請を削除
  const deleteRentalOrders = async (itemIds: number[]) => {
    try {
      const promises = itemIds.map((id) =>
        deleteData(`${API_ENDPOINTS.RENTAL_ORDERS}/${id}`)
      );

      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      console.error('物品申請削除エラー:', error);
      return { success: false, error };
    }
  };

  // 物品申請を送信
  const submitRentalOrders = async (
    items: Array<{ group_id: number; rental_item_id: number; num: number }>,
    existingItems: RentalOrder[] = []
  ) => {
    try {
      const promises = [];

      // 既存データと新データの長さを比較
      const minLength = Math.min(items.length, existingItems.length);

      // 更新：既存データの数だけ更新を実行
      for (let i = 0; i < minLength; i++) {
        promises.push(
          put(`${API_ENDPOINTS.RENTAL_ORDERS}/${existingItems[i].id}`, items[i])
        );
      }

      // 追加：新データが多い場合、残りを新規作成
      if (items.length > existingItems.length) {
        for (let i = existingItems.length; i < items.length; i++) {
          promises.push(post(API_ENDPOINTS.RENTAL_ORDERS, items[i]));
        }
      }

      // 削除：既存データが多い場合、余分なものを削除
      if (existingItems.length > items.length) {
        for (let i = items.length; i < existingItems.length; i++) {
          promises.push(
            deleteData(`${API_ENDPOINTS.RENTAL_ORDERS}/${existingItems[i].id}`)
          );
        }
      }

      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      console.error('物品申請エラー:', error);
      return { success: false, error };
    }
  };

  // フォームの送信
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitError('');

      // 「いいえ」が選択された場合、既存のデータを削除
      if (!hasItems) {
        if (rentalOrders.length > 0) {
          // 既存のデータをすべて削除
          const result = await deleteRentalOrders(
            rentalOrders.map((item) => item.id)
          );

          if (result.success) {
            alert('物品申請を取り消しました。');
            mutateRentalOrders();
          } else {
            setSubmitError(
              '削除中にエラーが発生しました。もう一度お試しください。'
            );
          }
        } else {
          alert('物品申請がありません。');
        }
        return;
      }

      // 「はい」が選択された場合、データを保存または更新
      // 新しい物品データを作成
      const newItemsData = itemList.map((item) => ({
        group_id: currentGroupId,
        rental_item_id: parseInt(item.itemId, 10),
        num: item.count,
      }));

      // データを送信
      const result = await submitRentalOrders(newItemsData, rentalOrders);

      if (result.success) {
        alert(
          rentalOrders.length > 0
            ? '物品申請を更新しました。'
            : '物品申請を登録しました。'
        );
        mutateRentalOrders();
      } else {
        setSubmitError(
          '送信中にエラーが発生しました。もう一度お試しください。'
        );
      }
    } catch (error) {
      console.error('物品申請エラー:', error);
      setSubmitError('予期せぬエラーが発生しました。もう一度お試しください。');
    }
  };

  const isLoading = itemsLoading || rentalOrdersLoading;
  const hasError = !!(itemsError || rentalOrdersError);
  const hasExisting = rentalOrders.length > 0;

  return {
    hasItems,
    setHasItems,
    locationType,
    updateLocationType,
    itemList,
    itemOptions,
    addItem,
    removeItem,
    updateItemName,
    updateItemCount,
    onSubmit,
    isLoading,
    hasError,
    errors,
    submitError,
    isValid,
    hasExisting,
  };
};
