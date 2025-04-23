import { FC } from 'react';
import { Control, Controller, FieldPath, UseFormReturn } from 'react-hook-form';
import Button from '@/components/Button/Button';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer';
import { PowerApplicationFormData } from '../schema';
import { Device } from '../types';

// フィールド名の定数
const FIELD_NAMES = {
  PRODUCT_NAME: 'productName' as const,
  MANUFACTURER: 'manufacturer' as const,
  MODEL: 'model' as const,
  URL: 'url' as const,
  MAX_POWER: 'maxPower' as const,
};

// デバイスフィールドの型を定義
type DeviceField = keyof Device;

// フォームフィールドコンポーネント
interface PowerFormFieldProps {
  name: DeviceField;
  label: string;
  control: Control<PowerApplicationFormData>;
  index: number;
  required?: boolean;
  note?: string;
  getErrorMessage: (name: DeviceField) => string | undefined;
  type?: 'text' | 'number';
}

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

type PowerFormProps = {
  index: number;
  form: UseFormReturn<PowerApplicationFormData>;
  onRemove: (index: number) => void;
};

const PowerForm: FC<PowerFormProps> = ({ index, form, onRemove }) => {
  const { control, formState } = form;

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
            label="機器の名称"
            control={control}
            index={index}
            required
            getErrorMessage={getErrorMessage}
          />

          <PowerFormField
            name={FIELD_NAMES.MANUFACTURER}
            label="機器のメーカー名"
            control={control}
            index={index}
            required
            getErrorMessage={getErrorMessage}
          />

          <PowerFormField
            name={FIELD_NAMES.MODEL}
            label="型番"
            control={control}
            index={index}
            required
            getErrorMessage={getErrorMessage}
          />

          <PowerFormField
            name={FIELD_NAMES.URL}
            label="製品URL"
            control={control}
            index={index}
            required
            note="製品の紹介ページのサイトURLを貼ってください"
            getErrorMessage={getErrorMessage}
          />

          <PowerFormField
            name={FIELD_NAMES.MAX_POWER}
            label="電力量 (W)"
            control={control}
            index={index}
            required
            note="使用機器の電力量の合計が1500W以内になるようにしてください"
            getErrorMessage={getErrorMessage}
            type="number"
          />

          <div className="text-sm">
            <p>電力量が1500W以上の場合はメールを送ってください。</p>
            <p>nutfes.soumu@gmail.com</p>
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
                削除
              </Button>
            </div>
          )}
        </div>
      </div>
    </FormContainer>
  );
};

export default PowerForm;
