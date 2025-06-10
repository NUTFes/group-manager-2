import { useEffect, useMemo, useState } from 'react';
import {
  useGetCookingProcessOrder,
  useUpsertCookingProcessOrders,
} from '@/api/cookingProcessOrderApi';
import { useGetFoodProducts } from '@/api/foodProductApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  CookingProcessOrderSchema,
  cookingProcessOrderSchema,
} from './CookingProcessOrderForm/schema';

export const useCookingProcessOrder = (
  groupId: number | undefined,
  isDeadline: boolean
) => {
  const [isEditing, setIsEditing] = useState(false);

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

  useEffect(() => {
    if (mergedData.length > 0) {
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
    }
  }, [mergedData, replace]);

  const isLoading =
    isLoadingCookingProcess || isLoadingFoodProducts || isMutating;
  const error = errorCookingProcess || errorFoodProducts;

  const isExist = useMemo(
    () => cookingProcessOrders && cookingProcessOrders.length > 0,
    [cookingProcessOrders]
  );

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

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
      toast.success('調理工程を更新しました');
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      toast.error('調理工程の更新に失敗しました');
    }
  });

  useEffect(() => {
    if (!isLoading && cookingProcessOrders) {
      if (
        cookingProcessOrders.length === 0 &&
        cookingTargetFoodProducts.length > 0 &&
        !isDeadline
      ) {
        setIsEditing(true);
      }
    }
  }, [isLoading, cookingProcessOrders, cookingTargetFoodProducts]);

  return {
    methods,
    fields,
    isLoading,
    error,
    isEditing,
    isExist,
    handleEditClick,
    onSubmit,
    mergedData,
  };
};
