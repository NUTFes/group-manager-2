import { useEffect, useState } from 'react';
import {
  FoodProductResponse,
  useGetFoodProducts,
  useUpdateFoodProducts,
} from '@/api/foodProductApi';
import { toast } from 'react-toastify';
import {
  ProductInput,
  RegisteredProduct,
} from '@/components/Applications/FoodProduct/FoodProductForm/schema';
import { FormItem } from '@/components/FormList/type';
import { useApiMutations } from '@/hooks/useApi';

const API_ENDPOINTS = {
  FOOD_PRODUCTS: '/food_products',
} as const;

export const useFoodProductHooks = (groupId: number) => {
  const [isEditing, setIsEditing] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // API呼び出し
  const {
    foodProducts: apiFoodProducts,
    isLoading,
    error,
    mutateFoodProducts,
  } = useGetFoodProducts(groupId || 0);

  // upsert用のhook
  const { trigger: updateFoodProducts, isMutating } = useUpdateFoodProducts();

  // 認証付きAPI呼び出し用（既存の独自実装を使用）
  const { remove } = useApiMutations();

  // APIレスポンスをコンポーネント用の型に変換
  const foodProducts: RegisteredProduct[] | null =
      apiFoodProducts?.length > 0
          ? apiFoodProducts.map((product: FoodProductResponse) => ({
            id: product.id.toString(),
            name: product.name,
            isAlcohol: product.isCooking ?? false,
            hasLicense: product.isCooking ?? false,
            day1Quantity: product.firstDayNum?.toString() || '0',
            day2Quantity: product.secondDayNum?.toString() || '0',
          }))
          : null;

  const hasError = !!error;

  const formItem: FormItem[] = [
    {
      label: '販売品一覧',
      content: foodProducts?.length
          ? `${foodProducts.length}品目登録済み`
          : '未登録',
    },
  ];

  const toEdit = () => {
    setIsEditing(!isEditing);
  };

  // 販売品データを完全に置き換える関数（更新時に使用）
  const setFoodProductsData = async (products: ProductInput[]) => {
    try {
      // 現在の登録済み商品のIDを取得
      const currentProductIds = foodProducts?.map(p => parseInt(p.id)) || [];

      // 新しいフォームデータのIDを取得（既存の商品のID）
      const newProductIds = products
          .map(p => p.id ? parseInt(p.id) : null)
          .filter((id): id is number => id !== null);

      // 削除すべき商品ID（現在の商品から新しいフォームに含まれないもの）
      const toDeleteIds = currentProductIds.filter(id => !newProductIds.includes(id));

      // まず削除を実行
      for (const deleteId of toDeleteIds) {
        try {
          const deleteEndpoint = `${API_ENDPOINTS.FOOD_PRODUCTS}/${deleteId}`;
          await remove(deleteEndpoint);
        } catch (deleteError) {
          console.error(`Failed to delete product ${deleteId}:`, deleteError);
          // 削除エラーがあっても処理を続行
        }
      }

      // APIリクエスト用のデータに変換（削除されない商品のみ）
      const apiProducts = products.map((product) => ({
        id: product.id ? parseInt(product.id) : undefined,
        group_id: groupId,
        name: product.name,
        is_cooking: product.hasLicense,
        first_day_num: parseInt(product.day1Quantity) || 0,
        second_day_num: parseInt(product.day2Quantity) || 0,
      }));

      // upsert処理を実行
      await updateFoodProducts({
        food_products: apiProducts,
      });

      // データを強制的に再取得（optimistic updateではなく確実な更新）
      await mutateFoodProducts();

      // 少し待ってからもう一度再取得（サーバーへの反映を確実にする）
      setTimeout(async () => {
        await mutateFoodProducts();
      }, 500);

      // 成功時のみビューモードに戻す
      setIsEditing(false);

      toast.success('販売品を更新しました', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('販売品更新エラー:', error);

      let errorMessage = '販売品の更新に失敗しました';

      if (error instanceof Error) {
        if (
            error.message.includes('認証が必要') ||
            error.message.includes('User is not authenticated')
        ) {
          errorMessage = '認証が必要です。ログインしてください。';
        } else {
          errorMessage = `販売品の更新に失敗しました: ${error.message}`;
        }
      }

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  // 新しい販売品データを追加する関数（初回登録時に使用）
  const addFoodProducts = async (products: ProductInput[]) => {
    try {
      // APIリクエスト用のデータに変換
      const apiProducts = products.map((product) => ({
        group_id: groupId,
        name: product.name,
        is_cooking: product.hasLicense,
        first_day_num: parseInt(product.day1Quantity) || 0,
        second_day_num: parseInt(product.day2Quantity) || 0,
      }));

      // SWR Mutationを使用してAPI呼び出し
      await updateFoodProducts({
        food_products: apiProducts,
      });

      // データを強制的に再取得
      await mutateFoodProducts();

      // 少し待ってからもう一度再取得
      setTimeout(async () => {
        await mutateFoodProducts();
      }, 500);

      // 成功時のみビューモードに戻す
      setIsEditing(false);

      toast.success('販売品申請を送信しました', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('販売品登録エラー:', error);

      let errorMessage = '販売品の登録に失敗しました';

      if (error instanceof Error) {
        if (
            error.message.includes('認証が必要') ||
            error.message.includes('User is not authenticated')
        ) {
          errorMessage = '認証が必要です。ログインしてください。';
        } else {
          errorMessage = `販売品の登録に失敗しました: ${error.message}`;
        }
      }

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  // 個別削除機能（ビューモードでの削除ボタン用）
  const removeFoodProduct = async (id: string) => {
    try {
      const productToRemove = foodProducts?.find(
          (product) => product.id === id
      );

      if (!productToRemove) {
        throw new Error(`削除対象の販売品が見つかりません。ID: ${id}`);
      }

      const productId = parseInt(id);
      const deleteEndpoint = `${API_ENDPOINTS.FOOD_PRODUCTS}/${productId}`;

      // 個別削除を実行
      const result = await remove(deleteEndpoint);

      // 結果が {success: false} の場合はエラーを投げる
      if (
          result &&
          typeof result === 'object' &&
          'success' in result &&
          !result.success
      ) {
        throw new Error(result.error?.message || '削除に失敗しました');
      }

      // データを強制的に再取得
      await mutateFoodProducts();

      // 少し待ってからもう一度再取得
      setTimeout(async () => {
        await mutateFoodProducts();
      }, 500);

      toast.success(`「${productToRemove.name}」を削除しました`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('販売品削除エラー:', error);

      // エラーの詳細を分析
      if (error instanceof Error) {
        if (
            error.message.includes('User is not authenticated') ||
            error.message.includes('認証が必要')
        ) {
          toast.error('認証が必要です。ログインしてください。', {
            position: 'top-right',
            autoClose: 5000,
          });
        } else if (error.message.includes('404')) {
          toast.error('削除対象の商品が見つかりませんでした。', {
            position: 'top-right',
            autoClose: 5000,
          });
        } else {
          toast.error(`販売品の削除に失敗しました: ${error.message}`, {
            position: 'top-right',
            autoClose: 5000,
          });
        }
      } else {
        toast.error('販売品の削除に失敗しました。', {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    }
  };

  // 初回データ読み込み時のみ編集状態を設定
  useEffect(() => {
    // ローディング完了後かつ初期化前の場合のみ実行
    if (!isLoading && !hasInitialized) {
      if (apiFoodProducts && apiFoodProducts.length > 0) {
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
      setHasInitialized(true);
    }
  }, [apiFoodProducts, isLoading, hasInitialized]);

  // データが更新された時にフォームの編集状態をリセット
  useEffect(() => {
    if (!isLoading && hasInitialized) {
      // データが存在する場合はビューモードに、ない場合は編集モードに
      if (apiFoodProducts && apiFoodProducts.length > 0) {
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    }
  }, [apiFoodProducts, isLoading, hasInitialized]);

  // ローディング状態はAPIとMutationを考慮
  const isLoadingWithMutation = isLoading || isMutating;

  // フォーム送信後にデータを再取得するための関数
  const refetchData = async () => {
    await mutateFoodProducts();
  };

  return {
    foodProducts,
    isLoading: isLoadingWithMutation,
    hasError,
    isEditing,
    toEdit,
    formItem,
    addFoodProducts,
    removeFoodProduct,
    setFoodProductsData,
    mutate: refetchData,
    refetchData,
  };
};