import { useState } from 'react';
import {
  FoodProductResponse,
  useGetFoodProducts,
  useUpsertFoodProducts,
} from '@/api/foodProductApi';
import {
  HealthCenterSubmissionStatus,
  isResubmissionStatus,
} from '@/api/healthCenterSubmissionStatusApi';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import {
  ProductInput,
  RegisteredProduct,
} from '@/components/Applications/FoodProduct/FoodProductForm/schema';
import { FormItem } from '@/components/FormList/type';
import { useAuthenticatedDeleteWithId } from '@/hooks/useApi';
import { useEditableSection, useSubmissionStatusReset } from '../shared';

const API_ENDPOINTS = {
  FOOD_PRODUCTS: '/food_products',
} as const;

export const useFoodProductHooks = (
  groupId: number,
  isRegistered?: boolean,
  status?: HealthCenterSubmissionStatus
) => {
  const { t } = useTranslation('common');

  const isResubmission = isResubmissionStatus(status);

  // API呼び出し
  const {
    foodProducts: apiFoodProducts,
    isLoading,
    error,
    mutateFoodProducts,
  } = useGetFoodProducts(groupId || 0);

  const { trigger: upsertFoodProducts, isMutating } = useUpsertFoodProducts();
  const { trigger: removeFoodProductById } = useAuthenticatedDeleteWithId(
    API_ENDPOINTS.FOOD_PRODUCTS
  )();

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

  // 一覧表示の削除ボタンは即時APIを呼ばない。対象をローカルで除外して
  // 編集フォームへ切り替え、実際の削除は保存ボタンを押すまで確定しない。
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const editableFoodProducts: RegisteredProduct[] | null = pendingDeleteId
    ? (foodProducts ?? []).filter((p) => p.id !== pendingDeleteId)
    : foodProducts;

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

  const {
    isEditing,
    toEdit,
    isLoading: isSectionLoading,
  } = useEditableSection({ isLoading, isRegistered });

  const resetSubmissionStatus = useSubmissionStatusReset(
    groupId,
    'food_product',
    status,
    t('applications.foodProduct.messages.statusUpdateFailed')
  );

  // 販売品データを完全に置き換える関数（更新時に使用）
  const mutateCookingProcessOrders = async () => {
    await mutate(
      (key) =>
        Array.isArray(key) &&
        key[0] === `/cooking_process_orders/group/${groupId}`
    );
  };

  // upsert後の再検証・再提出ステータス更新・編集モード終了・成功トーストは
  // 作成/更新のどちらでも同じ処理なので共通化する
  // (cookingProcessOrdersの再検証だけは更新時のみ必要)。
  const finishFoodProductSubmit = async (
    successMessage: string,
    {
      revalidateCookingProcessOrders,
    }: { revalidateCookingProcessOrders: boolean }
  ) => {
    await mutateFoodProducts();
    if (revalidateCookingProcessOrders) {
      await mutateCookingProcessOrders();
    }

    // ステータス更新まで成功した時だけビューモードへ戻す
    if (!(await resetSubmissionStatus())) return;

    setPendingDeleteId(null);
    if (isEditing) {
      toEdit();
    }

    toast.success(successMessage, {
      position: 'top-right',
      autoClose: 3000,
    });
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
          await removeFoodProductById(deleteId);
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

      await finishFoodProductSubmit(
        t('applications.foodProduct.messages.updateSuccess'),
        { revalidateCookingProcessOrders: true }
      );
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

      await finishFoodProductSubmit(
        t('applications.foodProduct.messages.createSuccess'),
        { revalidateCookingProcessOrders: false }
      );
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

  // 一覧表示からの削除は即時APIを呼ばない。対象を除いた編集フォームへ
  // 切り替えるだけで、実際の削除は保存ボタンを押した時点で
  // setFoodProductsData の差分削除にまとめて反映される。
  const removeFoodProduct = (id: string) => {
    setPendingDeleteId(id);
    toEdit();
  };

  const isLoadingWithMutation = isSectionLoading || isMutating;

  return {
    foodProducts,
    editableFoodProducts,
    hasExistingProducts: !!foodProducts,
    isLoading: isLoadingWithMutation,
    hasError,
    isEditing,
    toEdit,
    formItem,
    addFoodProducts,
    removeFoodProduct,
    setFoodProductsData,
    mutate: mutateFoodProducts,
    foodProductViewTexts,
    isResubmission,
  };
};
