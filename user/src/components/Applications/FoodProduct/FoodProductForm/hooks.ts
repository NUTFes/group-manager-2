import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation('common');
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
    mode: 'onChange',
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
    {
      id: FORM_VALUES.YES,
      name: t('applications.foodProduct.radio.alcohol.options.yes'),
    },
    {
      id: FORM_VALUES.NO,
      name: t('applications.foodProduct.radio.alcohol.options.no'),
    },
  ];

  const licenseOptions = [
    {
      id: FORM_VALUES.YES,
      name: t('applications.foodProduct.radio.cooking.options.yes'),
    },
    {
      id: FORM_VALUES.NO,
      name: t('applications.foodProduct.radio.cooking.options.no'),
    },
  ];

  const foodProductFormTexts = {
    statuses: {
      processing: t('applications.foodProduct.notes.processing'),
    },
    view: {
      empty: t('applications.foodProduct.view.empty'),
      addButton: t('applications.foodProduct.view.addButton'),
      summaryLabels: {
        name: t('applications.foodProduct.summary.labels.name'),
        alcohol: t('applications.foodProduct.summary.labels.alcohol'),
        cooking: t('applications.foodProduct.summary.labels.cooking'),
        day1: t('applications.foodProduct.summary.labels.day1'),
        day2: t('applications.foodProduct.summary.labels.day2'),
      },
      radio: {
        alcohol: {
          yes: t('applications.foodProduct.radio.alcohol.options.yes'),
          no: t('applications.foodProduct.radio.alcohol.options.no'),
        },
        cooking: {
          yes: t('applications.foodProduct.radio.cooking.options.yes'),
          no: t('applications.foodProduct.radio.cooking.options.no'),
        },
      },
    },
    form: {
      fields: {
        name: t('applications.foodProduct.fields.name'),
        day1: t('applications.foodProduct.fields.day1'),
        day2: t('applications.foodProduct.fields.day2'),
      },
      radio: {
        alcohol: {
          label: t('applications.foodProduct.radio.alcohol.label'),
          note: t('applications.foodProduct.radio.alcohol.note'),
          options: alcoholOptions,
        },
        cooking: {
          label: t('applications.foodProduct.radio.cooking.label'),
          options: licenseOptions,
        },
      },
      notes: {
        quantity: t('applications.foodProduct.notes.quantity'),
      },
    },
    buttons: {
      edit: t('form.actions.edit'),
      delete: t('form.actions.delete'),
      add: t('applications.foodProduct.buttons.add'),
      save: t('form.actions.save'),
      register: t('form.actions.register'),
    },
  };

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
    foodProductFormTexts,
  };
};
