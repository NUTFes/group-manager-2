import { useState } from 'react';
import { useGetCookingProcessOrder } from '@/api/cookingProcessOrderApi';
import { FormItem } from '@/components/FormList/type';

export const useCookingProcessOrder = (groupId: number | undefined) => {
  const { cookingProcessOrders, isLoading, error, mutateCookingProcessOrders } =
    useGetCookingProcessOrder(groupId);

  const [isEditing, setIsEditing] = useState(false);

  const isExist = cookingProcessOrders !== undefined;

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const formItems: FormItem[] = isExist
    ? [
        {
          label: '調理場の仕様有無(営業前)',
          content: cookingProcessOrders?.preOpenKitchen
            ? '使用する'
            : '使用しない',
        },
        {
          label: '調理場の仕様有無(営業中)',
          content: cookingProcessOrders?.duringOpenKitchen
            ? '使用する'
            : '使用しない',
        },
        {
          label: '調理内容',
          content: cookingProcessOrders?.tent || '',
        },
      ]
    : [];

  return {
    cookingProcessOrder: cookingProcessOrders,
    isLoading,
    error,
    isEditing,
    isExist,
    handleEditClick,
    mutateCookingProcessOrders,
    formItems,
  };
};
