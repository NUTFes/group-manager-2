import { useEffect, useRef, useState } from 'react';
import {
  FoodProductResponse,
  useGetFoodProducts,
  useUpsertFoodProducts,
} from '@/api/foodProductApi';
import {
  HealthCenterSubmissionStatus,
  useUpdateSubmissionStatusFor,
} from '@/api/healthCenterSubmissionStatusApi';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
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
  isRegistered?: boolean,
  status?: HealthCenterSubmissionStatus
) => {
  const { t } = useTranslation('common');
  const [isEditing, setIsEditing] = useState<boolean | null>(null);
  const hasInitializedEditing = useRef(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const isResubmission = status === 'waiting_resubmission';

  // API呼び出し
  const {
    foodProducts: apiFoodProducts,
    isLoading,
    error,
    mutateFoodProducts,
  } = useGetFoodProducts(groupId || 0);

  const { trigger: upsertFoodProducts, isMutating } = useUpsertFoodProducts();
  const { remove } = useApiMutations();

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

  const updateStatus = useUpdateSubmissionStatusFor(groupId, 'food_product');

  // 販売品データを完全に置き換える関数（更新時に使用）
  const mutateCookingProcessOrders = async () => {
    await mutate(
      (key) =>
        Array.isArray(key) &&
        key[0] === `/cooking_process_orders/group/${groupId}`
    );
  };

  const setFoodProductsData = async (products: ProductInput[]) => {
    try {
      const currentProductIds = foodProducts?.map((p) => parseInt(p.id)) || [];
      const newProductIds = products
        .map((p) => (p.id ? parseInt(p.id) : null))
        .filter((id): id is number => id !== null);
      const toDeleteIds = currentProductIds.filter(
        (id) => !newProductIds.includes(id)
      );

      for (const deleteId of toDeleteIds) {
        try {
          const deleteEndpoint = `${API_ENDPOINTS.FOOD_PRODUCTS}/${deleteId}`;
          await remove(deleteEndpoint);
        } catch (deleteError) {
          console.error(`Failed to delete product ${deleteId}:`, deleteError);
        }
      }

      const apiProducts = products.map((product) => ({
        id: product.id ? parseInt(product.id) : undefined,
        group_id: groupId,
        name: product.name,
        is_cooking: product.isCooking,
        first_day_num: parseInt(product.day1Quantity) || 0,
        second_day_num: parseInt(product.day2Quantity) || 0,
        is_alcohol: product.isAlcohol,
      }));

      await upsertFoodProducts({
        body: { food_products: apiProducts },
      });

      await mutateFoodProducts();
      await mutateCookingProcessOrders();

      setTimeout(async () => {
        try {
          await mutateFoodProducts();
          await mutateCookingProcessOrders();
        } catch (e) {
          console.error('再取得エラー:', e);
        }
      }, 500);

      const updateStatusToUnapproved = async (): Promise<boolean> => {
        if (status === 'unapproved') return true;

        try {
          await updateStatus('unapproved');
          return true;
        } catch (e) {
          console.error(e);
          toast.error(
            t('applications.foodProduct.messages.statusUpdateFailed')
          );
          return false;
        }
      };

      const statusUpdated = await updateStatusToUnapproved();
      if (!statusUpdated) return;

      // ステータス更新まで成功した時だけビューモードへ戻す
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

  const addFoodProducts = async (products: ProductInput[]) => {
    try {
      const apiProducts = products.map((product) => ({
        group_id: groupId,
        name: product.name,
        is_cooking: product.isCooking,
        first_day_num: parseInt(product.day1Quantity) || 0,
        second_day_num: parseInt(product.day2Quantity) || 0,
        is_alcohol: product.isAlcohol,
      }));

      await upsertFoodProducts({
        body: { food_products: apiProducts },
      });

      await mutateFoodProducts();
      await mutate(
        (key) =>
          Array.isArray(key) && key[0] === `/food_products/group/${groupId}`
      );

      // 少し待ってからもう一度再取得
      setTimeout(async () => {
        await mutateFoodProducts();
      }, 500);

      const updateStatusToUnapproved = async (): Promise<boolean> => {
        if (status === 'unapproved') return true;

        try {
          await updateStatus('unapproved');
          return true;
        } catch (e) {
          console.error(e);
          toast.error(
            t('applications.foodProduct.messages.statusUpdateFailed')
          );
          return false;
        }
      };

      const statusUpdated = await updateStatusToUnapproved();
      if (!statusUpdated) return;

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

      const result = await remove(deleteEndpoint);

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

      await mutateFoodProducts();
      await mutate(
        (key) =>
          Array.isArray(key) && key[0] === `/food_products/group/${groupId}`
      );
      await mutateCookingProcessOrders();

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

  const isLoadingWithMutation = (isLoading && !hasLoadedOnce) || isMutating;

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
    isResubmission,
  };
};
