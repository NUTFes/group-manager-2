import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  FoodProductFormData,
  ProductInput,
  RegisteredProduct,
  foodProductSchema,
} from './schema';

// 定数定義
const FORM_VALUES = {
  YES: 1,
  NO: 0,
  DEFAULT_QUANTITY: '1',
  INITIAL_QUANTITY: '0',
  MIN_PRODUCTS_COUNT: 1,
} as const;

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
        isCooking: product.isCooking ?? false,
        day1Quantity: product.day1Quantity || FORM_VALUES.INITIAL_QUANTITY,
        day2Quantity: product.day2Quantity || FORM_VALUES.INITIAL_QUANTITY,
      }));
    }
    return [
      {
        id: '',
        name: '',
        isAlcohol: false,
        isCooking: false,
        day1Quantity: FORM_VALUES.DEFAULT_QUANTITY,
        day2Quantity: FORM_VALUES.DEFAULT_QUANTITY,
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

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'products',
  });

  const values = watch();
  const products = values.products || [];

  const alcoholOptions = [
    { id: FORM_VALUES.YES, name: 'はい' },
    { id: FORM_VALUES.NO, name: 'いいえ' },
  ];

  const licenseOptions = [
    { id: FORM_VALUES.YES, name: '有り　（例：酒類、加熱調理をするものなど）' },
    { id: FORM_VALUES.NO, name: '無し　（例：ソフトドリンク）' },
  ];

  const handleAlcoholChange = (index: number, value: string) => {
    const isAlcohol = parseInt(value) === FORM_VALUES.YES;
    setValue(`products.${index}.isAlcohol`, isAlcohol);

    if (isAlcohol) {
      setValue(`products.${index}.isCooking`, true);
    }
  };

  const handleHasLicenseChange = (index: number, value: string) => {
    setValue(
      `products.${index}.isCooking`,
      parseInt(value) === FORM_VALUES.YES
    );
  };

  const addProduct = () => {
    append({
      id: '',
      name: '',
      isAlcohol: false,
      isCooking: false,
      day1Quantity: FORM_VALUES.DEFAULT_QUANTITY,
      day2Quantity: FORM_VALUES.DEFAULT_QUANTITY,
    });
  };

  const removeProduct = (index: number) => {
    if (products.length > FORM_VALUES.MIN_PRODUCTS_COUNT) {
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
    fields,
    replace,
  };
};
