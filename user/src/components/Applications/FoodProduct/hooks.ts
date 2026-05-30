import { useEffect, useRef, useState } from 'react';
import {
  FoodProductResponse,
  useGetFoodProducts,
  useUpsertFoodProducts,
} from '@/api/foodProductApi';
import { mutate } from 'swr';
import { useTranslation } from 'next-i18next';
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

export const useFoodProductHooks = (
  groupId: number,
  isRegistered?: boolean
) => {
  const { t } = useTranslation('common');
  const [isEditing, setIsEditing] = useState<boolean | null>(null);
  const hasInitializedEditing = useRef(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // API呼び出し
  const {
    foodProducts: apiFoodProducts,
    isLoading,
    error,
    mutateFoodProducts,
  } = useGetFoodProducts(groupId || 0);

  // upsert用のhook
  const { trigger: upsertFoodProducts, isMutating } = useUpsertFoodProducts();

  // 認証付きAPI呼び出し用（既存の独自実装を使用）
  const { remove } = useApiMutations();

  // APIレスポンスをコンポーネント用の型に変換
  const foodProducts: RegisteredProduct[] | null =
    apiFoodProducts?.length > 0
      ? apiFoodProducts.map((product: FoodProductResponse) => ({
          id: product.id.toString(),
          name: product.name,
          isAlcohol: product.isAlcohol ?? false,
          isCooking: product.isCooking ?? false,
          day1Quantity: product.firstDayNum?.toString() || '0',
          day2Quantity: product.secondDayNum?.toString() || '0',
        }))
      : null;

  const hasError = !!error;

  const foodProductViewTexts = {
    title: t('applications.foodProduct.title'),
    loading: t('applications.foodProduct.loading'),
    errors: {
      fetch: t('applications.foodProduct.errors.fetch'),
    },
    deadline: {
      title: t('applications.foodProduct.deadline.title'),
      description: t('applications.foodProduct.deadline.description'),
    },
  };

  const formItem: FormItem[] = [
    {
      label: t('applications.foodProduct.view.summaryLabel'),
      content: foodProducts?.length
        ? t('applications.foodProduct.view.registered', {
            count: foodProducts.length,
          })
        : t('applications.foodProduct.view.none'),
    },
  ];

  const toEdit = () => {
    setIsEditing((prev) => !prev);
  };

  // 販売品データを完全に置き換える関数（更新時に使用）
  const setFoodProductsData = async (products: ProductInput[]) => {
    try {
      // 現在の登録済み商品のIDを取得
      const currentProductIds = foodProducts?.map((p) => parseInt(p.id)) || [];

      // 新しいフォームデータのIDを取得（既存の商品のID）
      const newProductIds = products
        .map((p) => (p.id ? parseInt(p.id) : null))
        .filter((id): id is number => id !== null);

      // 削除すべき商品ID（現在の商品から新しいフォームに含まれないもの）
      const toDeleteIds = currentProductIds.filter(
        (id) => !newProductIds.includes(id)
      );

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
        is_cooking: product.isCooking,
        first_day_num: parseInt(product.day1Quantity) || 0,
        second_day_num: parseInt(product.day2Quantity) || 0,
        is_alcohol: product.isAlcohol,
      }));

      // upsert処理を実行
      await upsertFoodProducts({
        body: { food_products: apiProducts },
      });

      // データを強制的に再取得（optimistic updateではなく確実な更新）
      await mutateFoodProducts();

      // 少し待ってからもう一度再取得（サーバーへの反映を確実にする）
      setTimeout(async () => {
        await mutateFoodProducts();
      }, 500);

      // 成功時のみビューモードに戻す
      setIsEditing(false);

      toast.success(t('applications.foodProduct.messages.updateSuccess'), {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('販売品更新エラー:', error);

      let errorMessage = t('applications.foodProduct.messages.updateFailed');

      if (error instanceof Error) {
        if (
          error.message.includes('認証が必要') ||
          error.message.includes('User is not authenticated')
        ) {
          errorMessage = t('applications.foodProduct.messages.authRequired');
        } else {
          errorMessage = t(
            'applications.foodProduct.messages.updateFailedDetail',
            {
              message: error.message,
            }
          );
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
        is_cooking: product.isCooking,
        first_day_num: parseInt(product.day1Quantity) || 0,
        second_day_num: parseInt(product.day2Quantity) || 0,
        is_alcohol: product.isAlcohol,
      }));

      // SWR Mutationを使用してAPI呼び出し
      await upsertFoodProducts({
        body: { food_products: apiProducts },
      });

      // データを強制的に再取得
      await mutateFoodProducts();

      // 少し待ってからもう一度再取得
      setTimeout(async () => {
        await mutateFoodProducts();
      }, 500);

      // 成功時のみビューモードに戻す
      setIsEditing(false);

      toast.success(t('applications.foodProduct.messages.createSuccess'), {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('販売品登録エラー:', error);

      let errorMessage = t('applications.foodProduct.messages.createFailed');

      if (error instanceof Error) {
        if (
          error.message.includes('認証が必要') ||
          error.message.includes('User is not authenticated')
        ) {
          errorMessage = t('applications.foodProduct.messages.authRequired');
        } else {
          errorMessage = t(
            'applications.foodProduct.messages.createFailedDetail',
            { message: error.message }
          );
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
        throw new Error(
          result.error?.message ||
            t('applications.foodProduct.messages.deleteFailed')
        );
      }

      // データを強制的に再取得
      await mutateFoodProducts();
      // 調理工程申請のキャッシュも更新して古いデータを消す
      await mutate(
          (key) =>
              Array.isArray(key) &&
              key[0] === `/cooking_process_orders/group/${groupId}`
      );

      // 少し待ってからもう一度再取得
      setTimeout(async () => {
        await mutateFoodProducts();
      }, 500);

      toast.success(
        t('applications.foodProduct.messages.deleteSuccess', {
          name: productToRemove.name,
        }),
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    } catch (error) {
      console.error('販売品削除エラー:', error);

      // エラーの詳細を分析
      if (error instanceof Error) {
        if (
          error.message.includes('User is not authenticated') ||
          error.message.includes('認証が必要')
        ) {
          toast.error(t('applications.foodProduct.messages.authRequired'), {
            position: 'top-right',
            autoClose: 5000,
          });
        } else if (error.message.includes('404')) {
          toast.error(t('applications.foodProduct.messages.deleteNotFound'), {
            position: 'top-right',
            autoClose: 5000,
          });
        } else {
          toast.error(
            t('applications.foodProduct.messages.deleteFailedDetail', {
              message: error.message,
            }),
            {
              position: 'top-right',
              autoClose: 5000,
            }
          );
        }
      } else {
        toast.error(t('applications.foodProduct.messages.deleteFailed'), {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setHasLoadedOnce(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (hasInitializedEditing.current || isRegistered === undefined) {
      return;
    }

    setIsEditing(!isRegistered);
    hasInitializedEditing.current = true;
  }, [isRegistered]);

  // ローディング状態はAPIとMutationを考慮
  const isLoadingWithMutation = (isLoading && !hasLoadedOnce) || isMutating;

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
    foodProductViewTexts,
  };
};
