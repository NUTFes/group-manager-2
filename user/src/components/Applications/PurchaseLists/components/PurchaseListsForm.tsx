import { FC } from 'react';
import { Controller, FieldPath, useWatch } from 'react-hook-form';
import Button from '@/components/Button/Button';
import Selector from '@/components/Form/Selector/Selector';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer/FormContainer';
import {
  FIELD_NAMES,
  FRESH_OPTIONS,
  NET_ORDER_SHOP_ID,
  SHOP_OPTIONS,
} from '../constants';
import { PurchaseListsApplicationFormData } from '../schema';
import {
  PurchaseListsField,
  PurchaseListsFormFieldProps,
  PurchaseListsFormProps,
} from '../types';

const PurchaseListsFormField: FC<PurchaseListsFormFieldProps> = ({
  name,
  label,
  control,
  index,
  required = false,
  note,
  getErrorMessage,
  fieldType,
  options,
}) => {
  const fieldPath =
    `purchaseLists.${index}.${name}` as FieldPath<PurchaseListsApplicationFormData>;

  const uniqueFieldName = fieldPath;
  const displayLabel = label;

  // YYYY/MM/DD > YYYY-MM-DD
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(
        2,
        '0'
      )}`;
    }
    return dateString;
  };

  // YYYY-MM-DD > YYYY/MM/DD
  const formatDateForStore = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[0]}/${Number(parts[1])}/${Number(parts[2])}`;
    }
    return dateString;
  };

  return (
    <div>
      <Controller
        name={fieldPath}
        control={control}
        render={({ field }) => {
          if (fieldType === 'radio' && options) {
            const currentValue = field.value ? '1' : '2';

            return (
              <div>
                <div className="mb-[5px] flex items-center gap-6">
                  <p className="text-base text-font">{displayLabel}</p>
                  {required && <p className="text-xs text-alert">※必須</p>}
                </div>

                <div className="my-6 flex w-[400px] flex-col gap-4">
                  {options.map((option) => (
                    <label key={option.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={uniqueFieldName}
                        value={option.id}
                        checked={currentValue === option.id.toString()}
                        onChange={(e) => field.onChange(e.target.value === '1')}
                        className={`form-radio size-4 ${
                          getErrorMessage(name) ? 'accent-alert' : 'accent-main'
                        }`}
                      />
                      <span
                        className={`${
                          getErrorMessage(name) ? 'text-alert' : 'text-font'
                        }`}
                      >
                        {option.name}
                      </span>
                    </label>
                  ))}
                </div>

                {note && <p className="text-xs text-sub">{note}</p>}
                {getErrorMessage(name) && (
                  <p className="text-xs text-alert">{getErrorMessage(name)}</p>
                )}
              </div>
            );
          }

          if (fieldType === 'select' && options) {
            return (
              <Selector
                label={label}
                value={field.value as number}
                onChange={(value) => {
                  field.onChange(Number(value));
                }}
                required={required}
                note={note}
                options={options.map((option) => ({
                  ...option,
                  id:
                    typeof option.id === 'string'
                      ? Number(option.id)
                      : option.id,
                }))}
                error={getErrorMessage(name)}
              />
            );
          }

          if (fieldType === 'date') {
            return (
              <TextBox
                label={label}
                value={formatDateForInput(field.value as string)}
                onChange={(value) => {
                  field.onChange(formatDateForStore(value));
                }}
                required={required}
                note={note}
                error={getErrorMessage(name)}
                type="date"
              />
            );
          }

          return (
            <TextBox
              label={label}
              value={
                fieldType === 'number'
                  ? String(field.value || 0)
                  : (field.value as string) || ''
              }
              onChange={(value) => {
                field.onChange(
                  fieldType === 'number' ? Number(value) || 0 : value
                );
              }}
              required={required}
              note={note}
              error={getErrorMessage(name)}
              type={fieldType === 'number' ? 'number' : 'text'}
            />
          );
        }}
      />
    </div>
  );
};

const PurchaseListsForm: FC<PurchaseListsFormProps> = ({
  index,
  formMethods,
  onRemove,
  foodProductOptions,
}) => {
  const { control, formState, getValues } = formMethods;

  const getErrorMessage = (name: PurchaseListsField) => {
    const fieldErrors = formState.errors.purchaseLists?.[index];
    return fieldErrors?.[name]?.message as string | undefined;
  };

  const netOrderShopId = NET_ORDER_SHOP_ID;

  const currentShopId = useWatch({
    control,
    name: `purchaseLists.${index}.shopId`,
  });
  const isNetOrder = currentShopId === netOrderShopId;

  return (
    <FormContainer>
      <div className="flex flex-col">
        <div className="flex flex-col gap-10 text-[#484848]">
          <PurchaseListsFormField
            name={FIELD_NAMES.FOOD_PRODUCT_ID}
            label="販売品名"
            control={control}
            index={index}
            required
            note="販売品申請登録後に選択可能"
            getErrorMessage={getErrorMessage}
            fieldType="select"
            options={foodProductOptions}
          />

          <PurchaseListsFormField
            name={FIELD_NAMES.ITEMS}
            label="選択した料理に使用した食材・使用する材料"
            control={control}
            index={index}
            required
            getErrorMessage={getErrorMessage}
            fieldType="text"
          />

          <PurchaseListsFormField
            name={FIELD_NAMES.IS_FRESH}
            label="商品の種類"
            control={control}
            index={index}
            required
            getErrorMessage={getErrorMessage}
            fieldType="radio"
            options={FRESH_OPTIONS}
          />

          <PurchaseListsFormField
            name={FIELD_NAMES.SHOP_ID}
            label="購入場所"
            control={control}
            index={index}
            required
            getErrorMessage={getErrorMessage}
            fieldType="select"
            note="ネット注文の場合はURLを入力してください"
            options={SHOP_OPTIONS}
          />

          <PurchaseListsFormField
            name={FIELD_NAMES.PURCHASE_DATE}
            label="購入日"
            control={control}
            index={index}
            required
            note="例：2025/03/14"
            getErrorMessage={getErrorMessage}
            fieldType="date"
          />

          {isNetOrder && (
            <PurchaseListsFormField
              name={FIELD_NAMES.URL}
              label="ネットで購入した場合"
              control={control}
              index={index}
              required={isNetOrder}
              note="URL "
              getErrorMessage={getErrorMessage}
              fieldType="text"
            />
          )}

          {index > 0 && !getValues().purchaseLists[index]?.items && (
            <div className="flex w-full items-center justify-center">
              <Button
                size="pc"
                color="alert"
                type="button"
                icon="cross"
                variant
                isDisable={false}
                onClick={() => onRemove(index)}
              >
                削除
              </Button>
            </div>
          )}
        </div>
      </div>
    </FormContainer>
  );
};

export default PurchaseListsForm;
