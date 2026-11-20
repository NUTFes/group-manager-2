import { FC } from 'react';
import { Controller, FieldPath } from 'react-hook-form';
import Button from '@/components/Button/Button';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer';
import { FIELD_NAMES, POWER_LIMIT } from '../constants';
import { usePowerDeviceFormHooks } from '../hooks/usePowerDeviceFormHooks';
import { PowerApplicationFormData } from '../schema';
import { DeviceField, PowerFormFieldProps, PowerFormProps } from '../types';

// フォームフィールドコンポーネント
const PowerFormField: FC<PowerFormFieldProps> = ({
  name,
  label,
  control,
  index,
  required = false,
  note,
  getErrorMessage,
  type = 'text',
}) => {
  // 型安全なフィールドパスを構築
  const fieldPath =
    `devices.${index}.${name}` as FieldPath<PowerApplicationFormData>;

  return (
    <div>
      <Controller
        name={fieldPath}
        control={control}
        render={({ field }) => (
          <TextBox
            label={label}
            value={
              type === 'number'
                ? String(field.value || 0)
                : (field.value as string) || ''
            }
            onChange={(value) => {
              field.onChange(type === 'number' ? Number(value) || 0 : value);
            }}
            required={required}
            note={note}
            error={getErrorMessage(name)}
          />
        )}
      />
    </div>
  );
};

const PowerForm: FC<PowerFormProps> = ({ index, form, onRemove }) => {
  const { control, formState } = form;
  const { powerDeviceFormTexts } = usePowerDeviceFormHooks();

  // エラーメッセージを取得 - DeviceField型を受け取るように修正
  const getErrorMessage = (name: DeviceField) => {
    const fieldErrors = formState.errors.devices?.[index];
    return fieldErrors?.[name]?.message as string | undefined;
  };

  return (
    <FormContainer>
      <div className="flex flex-col">
        <div className="flex flex-col gap-10 text-[#484848]">
          <PowerFormField
            name={FIELD_NAMES.PRODUCT_NAME}
            label={powerDeviceFormTexts.fields.productName}
            control={control}
            index={index}
            required
            getErrorMessage={getErrorMessage}
          />

          <PowerFormField
            name={FIELD_NAMES.MANUFACTURER}
            label={powerDeviceFormTexts.fields.manufacturer}
            control={control}
            index={index}
            required
            getErrorMessage={getErrorMessage}
          />

          <PowerFormField
            name={FIELD_NAMES.MODEL}
            label={powerDeviceFormTexts.fields.model}
            control={control}
            index={index}
            required
            getErrorMessage={getErrorMessage}
          />

          <PowerFormField
            name={FIELD_NAMES.URL}
            label={powerDeviceFormTexts.fields.url}
            control={control}
            index={index}
            required
            note={powerDeviceFormTexts.notes.url}
            getErrorMessage={getErrorMessage}
          />

          <PowerFormField
            name={FIELD_NAMES.MAX_POWER}
            label={powerDeviceFormTexts.fields.maxPower}
            control={control}
            index={index}
            required
            note={powerDeviceFormTexts.notes.totalPower(POWER_LIMIT)}
            getErrorMessage={getErrorMessage}
            type="number"
          />

          <div className="text-sm">
            <p>{powerDeviceFormTexts.notes.emailWarning(POWER_LIMIT)}</p>
            <p>{powerDeviceFormTexts.notes.contactEmail}</p>
          </div>

          {index > 0 && !form.getValues().devices[index]?.productName && (
            <div className="flex w-full items-center justify-center">
              <Button
                size="pc"
                color="alert"
                type="button"
                icon="cross"
                variant
                onClick={() => onRemove(index)}
              >
                {powerDeviceFormTexts.actions.delete}
              </Button>
            </div>
          )}
        </div>
      </div>
    </FormContainer>
  );
};

export default PowerForm;
