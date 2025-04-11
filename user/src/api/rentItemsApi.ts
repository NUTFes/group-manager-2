// src/api/rentItemsApi.ts
import { useApiGet, useApiMutations } from '@/hooks/useApi';

// APIエンドポイント
const API_ENDPOINTS = {
    // 物品関連
    INSIDE_SHOP_RENTABLE_ITEMS: '/api/v1/get_inside_shop_rentable_items', // 屋内模擬店での貸出物品
    OUTSIDE_SHOP_RENTABLE_ITEMS: '/api/v1/get_outside_shop_rentable_items', // 屋外模擬店での貸出物品

    // 物品申請関連
    RENTAL_ORDERS: '/rental_orders',
};

// 物品マスター情報の型
export type RentalItem = {
    id: number;
    name: string;
    is_inside_shop_rentable: boolean;
    is_outside_shop_rentable: boolean;
    is_stage_rentable: boolean;
    created_at: string;
    updated_at: string;
};

// 物品申請情報の型
export type RentalOrder = {
    id: number;
    group_id: number;
    rental_item_id: number;
    num: number;
    created_at: string;
    updated_at: string;
};

// APIレスポンス型
type ApiResponse<T> = {
    status: {
        code: number;
        message: string;
    };
    data: T;
};

// 会場タイプに応じた物品データを取得するフック
export const useRentableItemsByType = (locationType: string) => {
    // 会場タイプに応じてエンドポイントを選択
    const endpoint = locationType === '1'
        ? API_ENDPOINTS.INSIDE_SHOP_RENTABLE_ITEMS
        : API_ENDPOINTS.OUTSIDE_SHOP_RENTABLE_ITEMS;

    const {
        data: response,
        error,
        isLoading,
    } = useApiGet<ApiResponse<RentalItem[]>>(endpoint);

    return {
        items: response?.data || [],
        itemsError: error,
        itemsLoading: isLoading,
    };
};

// グループIDに紐づく物品申請を取得するフック
export const useRentalOrdersByGroupId = (groupId: number) => {
    const {
        data: response,
        error,
        isLoading,
        mutate,
    } = useApiGet<ApiResponse<RentalOrder[]>>(`${API_ENDPOINTS.RENTAL_ORDERS}?group_id=${groupId}`);

    return {
        rentalOrders: response?.data || [],
        rentalOrdersError: error,
        rentalOrdersLoading: isLoading,
        mutateRentalOrders: mutate,
    };
};

// 物品申請の操作用フック
export const useMutateRentalOrders = () => {
    const { post, put, delete: deleteData } = useApiMutations();

    // 物品申請データを送信
    const submitRentalOrders = async (
        items: Array<{group_id: number; rental_item_id: number; num: number}>,
        existingItems: RentalOrder[] = []
    ) => {
        try {
            const promises = [];

            // 既存データと新データの長さを比較
            const minLength = Math.min(items.length, existingItems.length);

            // 更新：既存データの数だけ更新を実行
            for (let i = 0; i < minLength; i++) {
                promises.push(put(
                    `${API_ENDPOINTS.RENTAL_ORDERS}/${existingItems[i].id}`,
                    items[i]
                ));
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
                    promises.push(deleteData(`${API_ENDPOINTS.RENTAL_ORDERS}/${existingItems[i].id}`));
                }
            }

            await Promise.all(promises);
            return { success: true };
        } catch (error) {
            console.error('物品申請エラー:', error);
            return { success: false, error };
        }
    };

    // 物品申請を削除
    const deleteRentalOrders = async (itemIds: number[]) => {
        try {
            const promises = itemIds.map(id =>
                deleteData(`${API_ENDPOINTS.RENTAL_ORDERS}/${id}`)
            );

            await Promise.all(promises);
            return { success: true };
        } catch (error) {
            console.error('物品申請削除エラー:', error);
            return { success: false, error };
        }
    };

    return {
        submitRentalOrders,
        deleteRentalOrders
    };
};