import { FC } from 'react';
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFormReturn,
  useWatch,
} from 'react-hook-form';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector/Selector';
import TextArea from '@/components/Form/TextArea';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer/FormContainer';
import {
  DEFAULT_PURCHASE_ITEM,
  FRESH_OPTIONS,
  FRESH_TYPE_ID,
  NET_ORDER_SHOP_ID,
  OTHER_SHOP_ID,
  PurchaseItemFieldNames,
} from '../constants';
import { PurchaseItem, PurchaseListsFormData } from '../schema';
import { FoodProductOption } from '../types';

export type PurchaseListsFormProps = {
  control: Control<PurchaseListsFormData>;
  fields: FieldArrayWithId<PurchaseListsFormData, 'purchaseLists', 'id'>[];
  append: (item: Partial<PurchaseItem>) => void;
  remove: (index: number) => void;
  onSubmit: () => void;
  errors: UseFormReturn<PurchaseListsFormData>['formState']['errors'];
  foodProductOptions: FoodProductOption[];
  shopOptions: { id: number; name: string }[];
  onFoodProductChange?: (foodProductId: number, index: number) => void;
};

const PurchaseListsForm: FC<PurchaseListsFormProps> = ({
  control,
  fields,
  append,
  remove,
  onSubmit,
  errors,
  foodProductOptions,
  shopOptions,
  onFoodProductChange,
}) => {
  // フォーム全体の値を監視
  const watchedFormValues = useWatch({
    control,
    name: 'purchaseLists',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-fit">
      <div className="flex flex-col space-y-10">
        {fields.map((field, index) => {
          const fieldPathPrefix = `purchaseLists.${index}` as const;
          const currentShopIdPath = `${fieldPathPrefix}.shopId` as const;

          // より安全にshopIdを取得
          const currentShopId = watchedFormValues?.[index]?.shopId ?? 0;

          return (
            <FormContainer key={`${field.id}-${index}`}>
              <div className="flex flex-col space-y-6">
                <Controller
                  key={`food-product-${field.id}-${index}`}
                  name={`${fieldPathPrefix}.${PurchaseItemFieldNames.FOOD_PRODUCT_ID}`}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <Selector
                      label="販売品名"
                      value={controllerField.value}
                      onChange={(value) => {
                        controllerField.onChange(Number(value));
                        if (value) {
                          onFoodProductChange?.(Number(value), index);
                        }
                      }}
                      required
                      options={foodProductOptions}
                      error={fieldState.error?.message}
                      note="販売品申請登録後に選択可能"
                    />
                  )}
                />
                <Controller
                  key={`items-${field.id}-${index}`}
                  name={`${fieldPathPrefix}.${PurchaseItemFieldNames.ITEMS}`}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <TextBox
                      label="選択した料理に使用した食材・使用する材料"
                      value={controllerField.value ?? ''}
                      onChange={controllerField.onChange}
                      required
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  key={`is-fresh-${field.id}-${index}`}
                  name={`${fieldPathPrefix}.${PurchaseItemFieldNames.IS_FRESH}`}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <Radio
                      label="商品の種類"
                      name={`isFresh-${index}`}
                      value={
                        controllerField.value
                          ? FRESH_TYPE_ID.FRESH.toString()
                          : FRESH_TYPE_ID.PROCESSED.toString()
                      } // true: 生鮮品, false: 加工品
                      onChange={(value) =>
                        controllerField.onChange(
                          value === FRESH_TYPE_ID.FRESH.toString()
                        )
                      }
                      required
                      options={FRESH_OPTIONS}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  key={`shop-${field.id}-${index}`}
                  name={currentShopIdPath}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <Selector
                      label="購入場所"
                      value={controllerField.value}
                      onChange={(value) =>
                        controllerField.onChange(Number(value))
                      }
                      required
                      options={shopOptions}
                      error={fieldState.error?.message}
                      note="ネット注文選択時はURL入力が必要です"
                    />
                  )}
                />
                <Controller
                  key={`purchase-date-${field.id}-${index}`}
                  name={`${fieldPathPrefix}.${PurchaseItemFieldNames.PURCHASE_DATE}`}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <TextBox
                      label="購入日"
                      type="date"
                      value={controllerField.value}
                      onChange={controllerField.onChange}
                      required
                      error={fieldState.error?.message}
                      note="例：2025/03/14"
                    />
                  )}
                />
                {/* URLフィールド：ネット注文が選択された時のみ表示 */}
                {currentShopId === NET_ORDER_SHOP_ID && (
                  <Controller
                    key={`url-${field.id}-${index}`}
                    name={`${fieldPathPrefix}.${PurchaseItemFieldNames.URL}`}
                    control={control}
                    render={({ field: controllerField, fieldState }) => (
                      <TextBox
                        label="URL"
                        value={controllerField.value || ''}
                        onChange={controllerField.onChange}
                        required
                        error={fieldState.error?.message}
                        note="購入したECサイトのURLなど"
                      />
                    )}
                  />
                )}
                {/* 備考フィールド*/}
                <Controller
                  key={`remark-${field.id}-${index}`}
                  name={`${fieldPathPrefix}.${PurchaseItemFieldNames.REMARK}`}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <TextArea
                      label="備考"
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                      required={currentShopId === OTHER_SHOP_ID}
                      error={fieldState.error?.message}
                      note={
                        currentShopId === OTHER_SHOP_ID
                          ? '店名・住所・電話番号・営業時間を入力してください'
                          : 'その他補足事項があれば入力してください'
                      }
                    />
                  )}
                />
                {fields.length > 1 && (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      size="pc"
                      color="alert"
                      variant
                      onClick={() => remove(index)}
                      icon="cross"
                    >
                      削除
                    </Button>
                  </div>
                )}
              </div>
            </FormContainer>
          );
        })}
        <div className="flex justify-center gap-3">
          <Button
            type="button"
            size="pc"
            color="main"
            variant
            icon="plus"
            onClick={() => append(DEFAULT_PURCHASE_ITEM as PurchaseItem)}
          >
            購入品を追加
          </Button>
          <Button size="pc" color="main" type="submit">
            登録
          </Button>
        </div>
      </div>

      <div className="mt-10 flex w-full items-center justify-center space-x-4"></div>
      {errors.purchaseLists?.root?.message && (
        <p className="mt-2 text-center text-xs text-alert">
          {errors.purchaseLists.root.message}
        </p>
      )}
      {errors.purchaseLists?.message && (
        <p className="mt-2 text-center text-xs text-alert">
          {errors.purchaseLists.message}
        </p>
      )}
    </form>
  );
};

export default PurchaseListsForm;
