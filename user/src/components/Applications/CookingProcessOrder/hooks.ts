import { useEffect, useMemo } from 'react';
import {
  useGetCookingProcessOrder,
  useUpsertCookingProcessOrders,
} from '@/api/cookingProcessOrderApi';
import { useGetFoodProducts } from '@/api/foodProductApi';
import {
  HealthCenterSubmissionStatus,
  canEditApplication,
} from '@/api/healthCenterSubmissionStatusApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEditableSection, useSubmissionStatusReset } from '../shared';
import {
  CookingProcessOrderSchema,
  cookingProcessOrderSchema,
} from './CookingProcessOrderForm/schema';

export const useCookingProcessOrder = (
  groupId: number | undefined,
  isDeadline: boolean,
  isRegistered?: boolean,
  status?: HealthCenterSubmissionStatus
) => {
  const { t } = useTranslation('common');

  const cookingProcessOrderTexts = {
    title: t('applications.cookingProcessOrder.title'),
    general: {
      loading: t('general.loading'),
      autoTranslated: t('general.autoTranslated'),
    },
    warning: t('applications.cookingProcessOrder.warning'),
    summary: {
      labels: {
        foodProduct: t(
          'applications.cookingProcessOrder.summary.labels.foodProduct'
        ),
        preOpen: t('applications.cookingProcessOrder.summary.labels.preOpen'),
        duringOpen: t(
          'applications.cookingProcessOrder.summary.labels.duringOpen'
        ),
        description: t(
          'applications.cookingProcessOrder.summary.labels.description'
        ),
      },
      status: {
        use: t('applications.cookingProcessOrder.summary.status.use'),
        notUse: t('applications.cookingProcessOrder.summary.status.notUse'),
        notRegistered: t(
          'applications.cookingProcessOrder.summary.status.notRegistered'
        ),
      },
    },
    buttons: {
      save: t('form.actions.save'),
      register: t('form.actions.register'),
      edit: t('form.actions.edit'),
    },
  };

  const {
    cookingProcessOrders,
    isLoading: isLoadingCookingProcess,
    error: errorCookingProcess,
    mutateCookingProcessOrders,
  } = useGetCookingProcessOrder(groupId);

  const {
    foodProducts,
    isLoading: isLoadingFoodProducts,
    error: errorFoodProducts,
  } = useGetFoodProducts(groupId ?? null);

  const { trigger: upsertCookingProcessOrders, isMutating } =
    useUpsertCookingProcessOrders();

  const methods = useForm<CookingProcessOrderSchema>({
    mode: 'onChange',
    resolver: zodResolver(cookingProcessOrderSchema),
    defaultValues: {
      cookingProcessOrders: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control: methods.control,
    name: 'cookingProcessOrders',
  });

  const cookingTargetFoodProducts = useMemo(() => {
    if (!foodProducts) return [];
    return foodProducts.filter((fp) => fp.isCooking);
  }, [foodProducts]);

  const mergedData = useMemo(() => {
    return cookingTargetFoodProducts.map((fp) => {
      const correspondingOrder = cookingProcessOrders?.find(
        (cpo) => cpo.foodProductId === fp.id
      );
      return {
        foodProduct: fp,
        cookingProcessOrder: correspondingOrder,
      };
    });
  }, [cookingTargetFoodProducts, cookingProcessOrders]);

  const isDataLoading = isLoadingCookingProcess || isLoadingFoodProducts;
  const error = errorCookingProcess || errorFoodProducts;

  const isExist = useMemo(
    () => cookingProcessOrders && cookingProcessOrders.length > 0,
    [cookingProcessOrders]
  );

  // 締切後(再提出可能な場合を除く)は isExist に関わらず一覧表示に強制する。
  // useEditableSection は isRegistered しか見ないため、その判定材料として
  // 「編集不可なら常に登録済み扱い(=一覧)」を isRegistered 側へ織り込む。
  const isApplicationEditable = canEditApplication(isDeadline, status);
  const effectiveIsRegistered = !isApplicationEditable || !!isExist;

  const {
    isEditing,
    toEdit,
    isLoading: isSectionLoading,
  } = useEditableSection({
    isLoading: isDataLoading,
    isRegistered: effectiveIsRegistered,
    // isRegistered(親から渡されるcheck_all_registeredの値)とローカルのデータ取得の
    // 両方が解決するまで初期化を待つ。effectiveIsRegisteredは常にboolean(undefinedに
    // ならない)ため、この追加ゲートが無いと isDataLoading より早く親の解決を待たずに
    // 初期化されてしまう。
    isReady: !isDataLoading && isRegistered !== undefined,
  });

  useEffect(() => {
    if (mergedData.length === 0 || isEditing === true) {
      return;
    }

    const newFields = mergedData.map((data) => ({
      id: data.cookingProcessOrder?.id,
      foodProductId: data.foodProduct.id,
      foodProductName: data.foodProduct.name,
      preOpenKitchen: data.cookingProcessOrder?.preOpenKitchen ?? false,
      duringOpenKitchen: data.cookingProcessOrder?.duringOpenKitchen ?? false,
      tent: data.cookingProcessOrder?.tent ?? '',
      confirmCookingProcess: [],
    }));
    replace(newFields);
  }, [mergedData, replace, isEditing]);

  const shouldShowWarning = useMemo(() => {
    if (isLoadingFoodProducts) return false;
    return cookingTargetFoodProducts.length === 0;
  }, [isLoadingFoodProducts, cookingTargetFoodProducts]);

  const resetSubmissionStatus = useSubmissionStatusReset(
    groupId,
    'cooking_process_order',
    status,
    t('applications.cookingProcessOrder.messages.statusUpdateFailed')
  );

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      const payload = data.cookingProcessOrders.map((order) => ({
        id: order.id,
        group_id: groupId,
        food_product_id: order.foodProductId,
        pre_open_kitchen: order.preOpenKitchen,
        during_open_kitchen: order.duringOpenKitchen,
        tent: order.tent,
      }));

      await upsertCookingProcessOrders({
        body: { cooking_process_orders: payload },
      });
      await mutateCookingProcessOrders();
      toast.success(
        t('applications.cookingProcessOrder.messages.updateSuccess')
      );

      // 再提出完了時
      if (!(await resetSubmissionStatus())) return;
      toEdit();
    } catch (e) {
      console.error(e);
      toast.error(t('applications.cookingProcessOrder.messages.updateFailed'));
    }
  });

  return {
    methods,
    fields,
    isLoading: isSectionLoading,
    isMutating,
    error,
    isEditing,
    isExist,
    handleEditClick: toEdit,
    onSubmit,
    mergedData,
    shouldShowWarning,
    cookingProcessOrderTexts,
  };
};
