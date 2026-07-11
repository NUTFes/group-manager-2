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
  FRESH_TYPE_ID,
  NET_ORDER_SHOP_ID,
  OTHER_SHOP_ID,
  PurchaseItemFieldNames,
} from '../constants';
import { usePurchaseListsFormTexts } from '../hooks';
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
  canAdd?: boolean;
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
  canAdd = false,
}) => {
  const purchaseListsFormTexts = usePurchaseListsFormTexts();
  // フォーム全体の値を監視
  const watchedFormValues = useWatch({
    control,
    name: 'purchaseLists',
  });
  const freshOptions = purchaseListsFormTexts.radio.options;

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
                      label={purchaseListsFormTexts.fields.foodProduct}
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
                      note={purchaseListsFormTexts.notes.foodProduct}
                    />
                  )}
                />
                <Controller
                  key={`items-${field.id}-${index}`}
                  name={`${fieldPathPrefix}.${PurchaseItemFieldNames.ITEMS}`}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <TextBox
                      label={purchaseListsFormTexts.fields.items}
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
                      label={purchaseListsFormTexts.radio.label}
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
                      options={freshOptions}
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
                      label={purchaseListsFormTexts.fields.shop}
                      value={controllerField.value}
                      onChange={(value) =>
                        controllerField.onChange(Number(value))
                      }
                      required
                      options={shopOptions}
                      error={fieldState.error?.message}
                      note={purchaseListsFormTexts.notes.shop}
                    />
                  )}
                />
                <Controller
                  key={`purchase-date-${field.id}-${index}`}
                  name={`${fieldPathPrefix}.${PurchaseItemFieldNames.PURCHASE_DATE}`}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <TextBox
                      label={purchaseListsFormTexts.fields.purchaseDate}
                      type="date"
                      value={controllerField.value}
                      onChange={controllerField.onChange}
                      required
                      error={fieldState.error?.message}
                      note={purchaseListsFormTexts.notes.purchaseDate}
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
                        label={purchaseListsFormTexts.fields.url}
                        value={controllerField.value || ''}
                        onChange={controllerField.onChange}
                        required
                        error={fieldState.error?.message}
                        note={purchaseListsFormTexts.notes.url}
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
                      label={purchaseListsFormTexts.fields.remark}
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                      required={currentShopId === OTHER_SHOP_ID}
                      error={fieldState.error?.message}
                      note={
                        currentShopId === OTHER_SHOP_ID
                          ? purchaseListsFormTexts.notes.remark.other
                          : purchaseListsFormTexts.notes.remark.default
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
                      {purchaseListsFormTexts.buttons.delete}
                    </Button>
                  </div>
                )}
              </div>
            </FormContainer>
          );
        })}
        <div className="flex justify-center gap-3">
          {canAdd && (
            <Button
              type="button"
              size="pc"
              color="main"
              variant
              icon="plus"
              onClick={() => append(DEFAULT_PURCHASE_ITEM as PurchaseItem)}
            >
              {purchaseListsFormTexts.buttons.addItem}
            </Button>
          )}
          <Button size="pc" color="main" type="submit">
            {purchaseListsFormTexts.buttons.register}
          </Button>
        </div>
      </div>

      <div className="mt-10 flex w-full items-center justify-center space-x-4"></div>
      {errors.purchaseLists?.root?.message && (
        <p className="mt-2 text-center text-xs text-alert">
          {purchaseListsFormTexts.errors.format(
            errors.purchaseLists.root.message
          )}
        </p>
      )}
      {errors.purchaseLists?.message && (
        <p className="mt-2 text-center text-xs text-alert">
          {purchaseListsFormTexts.errors.format(errors.purchaseLists.message)}
        </p>
      )}
    </form>
  );
};

export default PurchaseListsForm;
