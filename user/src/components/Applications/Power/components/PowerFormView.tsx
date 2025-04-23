import { FC } from 'react';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import { PowerApplicationFormData } from '../schema';
import { RadioOption } from '../types';
import PowerForm from './PowerForm';

interface PowerFormViewProps {
  radioValue: string;
  onRadioChange: (value: string) => void;
  formMethods: UseFormReturn<PowerApplicationFormData>;
  fields: FieldArrayWithId<PowerApplicationFormData, 'devices', 'id'>[];
  onRemove: (index: number) => void;
  onAddDevice: () => void;
  totalPower: number;
  isValid: boolean;
  radioOptions: RadioOption[];
  showForm: boolean;
  onSubmit: (data: PowerApplicationFormData) => Promise<void>;
}

export const PowerFormView: FC<PowerFormViewProps> = ({
  radioValue,
  onRadioChange,
  formMethods,
  fields,
  onRemove,
  onAddDevice,
  totalPower,
  isValid,
  radioOptions,
  showForm,
  onSubmit,
}) => {
  const { handleSubmit } = formMethods;

  return (
    <div className="flex flex-col gap-6">
      {/* ラジオボタン */}
      <Radio
        label="電力申請を行いますか？"
        value={radioValue}
        onChange={onRadioChange}
        required
        options={radioOptions}
      />

      {/* 申請する場合のフォーム */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8 flex flex-col gap-10">
            {fields.map((field, index) => (
              <PowerForm
                key={field.id}
                index={index}
                form={formMethods}
                onRemove={onRemove}
              />
            ))}
          </div>

          {/* 電力超過警告 */}
          {totalPower > 1500 && (
            <div className="mb-4 text-center text-red-600">
              合計電力が1500Wを超えています。申請にはメール連絡が必要です。
            </div>
          )}

          {/* 操作ボタン */}
          <div className="mt-6 flex justify-center gap-4">
            <Button
              type="button"
              size="pc"
              color="main"
              icon="plus"
              variant
              onClick={onAddDevice}
            >
              物品の追加
            </Button>

            <Button
              type="submit"
              size="pc"
              color="main"
              isDisable={!isValid || totalPower > 1500}
            >
              登録
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
