import { useMemo, useState } from 'react';
import { useGetCookingProcessOrder } from '@/api/cookingProcessOrderApi';
import { useGetFoodProducts } from '@/api/foodProdutApi';
import { FormItem } from '@/components/FormList/type';

export const useCookingProcessOrder = (groupId: number | undefined) => {
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

  const [isEditing, setIsEditing] = useState(false);

  const mergedData = useMemo(() => {
    if (!foodProducts || !cookingProcessOrders) return [];
    return foodProducts.map((fp) => {
      const correspondingOrder = cookingProcessOrders.find(
        (cpo) => cpo.foodProductId === fp.id
      );
      return {
        foodProduct: fp,
        cookingProcessOrder: correspondingOrder,
      };
    });
  }, [foodProducts, cookingProcessOrders]);

  const isLoading = isLoadingCookingProcess || isLoadingFoodProducts;
  const error = errorCookingProcess || errorFoodProducts;

  const isExist = mergedData.some((data) => !!data.cookingProcessOrder);

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  // FormListは複数アイテムに対応していないため、一旦先頭のアイテムで表示を仮組する
  const firstItem = mergedData[0]?.cookingProcessOrder;
  const formItems: FormItem[] = firstItem
    ? [
        {
          label: '調理場の仕様有無(営業前)',
          content: firstItem.preOpenKitchen ? '使用する' : '使用しない',
        },
        {
          label: '調理場の仕様有無(営業中)',
          content: firstItem.duringOpenKitchen ? '使用する' : '使用しない',
        },
        {
          label: '調理内容',
          content: firstItem.tent || '',
        },
      ]
    : [];

  return {
    mergedData,
    isLoading,
    error,
    isEditing,
    isExist,
    handleEditClick,
    mutateCookingProcessOrders,
    formItems,
  };
};
