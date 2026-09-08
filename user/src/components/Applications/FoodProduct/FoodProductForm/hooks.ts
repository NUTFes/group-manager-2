import { useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useFieldArray, useForm } from 'react-hook-form';
import { isUnchanged } from '../../shared';
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
  setFoodProductsData?: (products: ProductInput[]) => Promise<void>,
  // 既存申請の編集中かどうか（呼び出し元の hasExistingProducts をそのまま渡す）。
  // 一覧の削除ボタンから全件をローカル除外して foodProductsProp が空になっても、
  // これは変わらないので「新規登録」と区別できる。
  hasExistingProducts = false
) => {
  const { t } = useTranslation('common');
  // 安全なデフォルト値生成関数。
  // 既存データが1件以上あればそれを使う。0件でも、既存申請の編集中
  // （＝一覧から全件削除された直後）なら空テンプレートを補わずそのまま0件にする
  // （保存ボタン側がdisabledになり、確定は保存を押すまで待つ）。
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
    if (hasExistingProducts) {
      return [];
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
    reset,
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

  // FoodProductForm はビュー/編集モードの切り替えでコンポーネントが
  // アンマウントされない。一覧の削除ボタンで foodProductsProp が変わっても
  // useForm の defaultValues は初回マウント時のまま更新されないため、
  // 明示的に reset して同期する（FireEquipmentFormと同じパターン）。
  const prevProductIdsRef = useRef<string>('__initial__');
  useEffect(() => {
    const nextIds = (foodProductsProp ?? []).map((p) => p.id).join(',');
    if (prevProductIdsRef.current !== nextIds) {
      reset(
        { products: createDefaultProducts(foodProductsProp) },
        {
          keepDirty: false,
          keepErrors: false,
          keepDirtyValues: false,
          keepValues: false,
          keepDefaultValues: false,
        }
      );
      prevProductIdsRef.current = nextIds;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foodProductsProp, reset, hasExistingProducts]);

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
        allDeleted: t('applications.foodProduct.notes.allDeleted'),
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

  // 送信ボタンの無効化判定(B-2: isSubmitting || isUnchanged(...)へ統一)。
  // productsは配列のため、既存の商品数と一致し、かつ全項目がisUnchanged()となる
  // 場合のみ「未変更」とみなす。新規登録(foodProductsProp未指定)や、
  // 行の追加・削除で件数が変わった場合は常にfalse(=送信可能)になる。
  const validateEdit = () => {
    if (!foodProductsProp || foodProductsProp.length === 0) return false;
    if (foodProductsProp.length !== products.length) return false;
    return foodProductsProp.every((original, index) =>
      isUnchanged(original, products[index], [
        'name',
        'isAlcohol',
        'isCooking',
        'day1Quantity',
        'day2Quantity',
      ])
    );
  };

  // isAlcoholがtrueになった場合は、isCookingも強制的にtrueにする副作用。
  // isAlcohol自体の値はControllerのfield.onChangeで更新されるため、
  // ここではisCooking側への波及だけを担う。
  const applyAlcoholSideEffect = (index: number, isAlcohol: boolean) => {
    if (isAlcohol) {
      setValue(`products.${index}.isCooking`, true);
    }
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

  // 最後の1件も削除できる。0件になった場合は呼び出し側で保存ボタンを
  // disabledにする（削除の確定は保存を押した時点）。
  const removeProduct = (index: number) => {
    remove(index);
  };

  const onSubmit = async (formData: FoodProductFormData): Promise<boolean> => {
    try {
      if (hasExistingProducts) {
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
    control,
    isFetching: false,
    isMutating: isSubmitting,
    applyAlcoholSideEffect,
    alcoholOptions,
    licenseOptions,
    onSubmit,
    addProduct,
    removeProduct,
    validateEdit,
    products,
    fields,
    replace,
    foodProductFormTexts,
  };
};
