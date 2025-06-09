import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  FoodProductFormData,
  ProductInput,
  RegisteredProduct,
  foodProductSchema,
} from './schema';

export const useFoodProductFormHooks = (
  groupId: number,
  foodProductsProp?: RegisteredProduct[] | null,
  addFoodProducts?: (products: ProductInput[]) => Promise<void>,
  setFoodProductsData?: (products: ProductInput[]) => Promise<void>
) => {
  // 安全なデフォルト値生成関数
  const createDefaultProducts = (propsData?: RegisteredProduct[] | null) => {
    if (propsData && propsData.length > 0) {
      return propsData.map((product) => ({
        id: product.id || '',
        name: product.name || '',
        isAlcohol: product.isAlcohol ?? false,
        hasLicense: product.hasLicense ?? false,
        day1Quantity: product.day1Quantity || '0',
        day2Quantity: product.day2Quantity || '0',
      }));
    }
    return [
      {
        id: '',
        name: '',
        isAlcohol: false,
        hasLicense: false,
        day1Quantity: '1',
        day2Quantity: '1',
      },
    ];
  };

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm<FoodProductFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(foodProductSchema),
    defaultValues: {
      products: createDefaultProducts(foodProductsProp),
    },
  });

  const { append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const values = watch();
  const products = values.products || [];

  const alcoholOptions = [
    { id: 1, name: 'はい' },
    { id: 0, name: 'いいえ' },
  ];

  const licenseOptions = [
    { id: 1, name: '有り　（例：酒類、加熱調理をするものなど）' },
    { id: 0, name: '無し　（例：ソフトドリンク）' },
  ];

  const handleAlcoholChange = (index: number, value: string) => {
    const isAlcohol = parseInt(value) === 1;
    setValue(`products.${index}.isAlcohol`, isAlcohol);

    if (isAlcohol) {
      setValue(`products.${index}.hasLicense`, true);
    }
  };

  const handleHasLicenseChange = (index: number, value: string) => {
    setValue(`products.${index}.hasLicense`, parseInt(value) === 1);
  };

  const addProduct = () => {
    append({
      id: '',
      name: '',
      isAlcohol: false,
      hasLicense: false,
      day1Quantity: '1',
      day2Quantity: '1',
    });
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (formData: FoodProductFormData): Promise<boolean> => {
    try {
      if (foodProductsProp && foodProductsProp.length > 0) {
        // 更新モード
        const productsWithId = formData.products.map((product, index) => ({
          ...product,
          id: product.id || `product_${Date.now()}_${index}`,
        }));

        if (setFoodProductsData) {
          await setFoodProductsData(productsWithId);
        }
      } else {
        // 新規登録モード
        if (addFoodProducts) {
          const productsWithId = formData.products.map((product, index) => ({
            ...product,
            id: `product_${Date.now()}_${index}`,
          }));
          await addFoodProducts(productsWithId);
        }
      }

      return true;
    } catch (error) {
      console.error('送信エラー:', error);
      return false;
    }
  };

  return {
    handleSubmit,
    errors,
    setValue,
    isFetching: false,
    isMutating: isSubmitting,
    handleAlcoholChange,
    handleHasLicenseChange,
    alcoholOptions,
    licenseOptions,
    onSubmit,
    addProduct,
    removeProduct,
    products,
  };
};
