import { useEffect, useState } from 'react';
import { FormItem } from '@/components/FormList/type';

type RegisteredProduct = {
  id: string;
  name: string;
  isAlcohol: boolean;
  hasLicense: boolean;
  day1Quantity: string;
  day2Quantity: string;
};

type ProductInput = {
  id?: string;
  name: string;
  isAlcohol: boolean;
  hasLicense: boolean;
  day1Quantity: string;
  day2Quantity: string;
};

export const useFoodProductHooks = () => {
  const [foodProducts, setFoodProducts] = useState<RegisteredProduct[] | null>(
      null
  );
  const [isLoading] = useState(false);
  const [hasError] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

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
  const setFoodProductsData = (products: ProductInput[]) => {
    const registeredProducts: RegisteredProduct[] = products.map(
        (product, index) => ({
          id: product.id || `product_${Date.now()}_${index}`,
          name: product.name,
          isAlcohol: product.isAlcohol,
          hasLicense: product.hasLicense,
          day1Quantity: product.day1Quantity,
          day2Quantity: product.day2Quantity,
        })
    );

    setFoodProducts(registeredProducts);
    setIsEditing(false);
  };

  // 新しい販売品データを追加する関数（初回登録時に使用）
  const addFoodProducts = (products: ProductInput[]) => {
    const registeredProducts: RegisteredProduct[] = products.map(
        (product, index) => ({
          id: product.id || `product_${Date.now()}_${index}`,
          name: product.name,
          isAlcohol: product.isAlcohol,
          hasLicense: product.hasLicense,
          day1Quantity: product.day1Quantity,
          day2Quantity: product.day2Quantity,
        })
    );

    setFoodProducts((prev) =>
        prev ? [...prev, ...registeredProducts] : registeredProducts
    );
    setIsEditing(false);
  };

  // 販売品を削除する関数
  const removeFoodProduct = (id: string) => {
    setFoodProducts((prev) =>
        prev ? prev.filter((product) => product.id !== id) : null
    );
  };

  useEffect(() => {
    if (foodProducts) {
      setIsEditing(false);
    }
  }, [foodProducts]);

  return {
    foodProducts,
    isLoading,
    hasError,
    isEditing,
    toEdit,
    formItem,
    addFoodProducts,
    removeFoodProduct,
    setFoodProductsData,
  };
};
