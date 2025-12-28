import { FC } from 'react';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import { PowerFormViewProps } from '../types';
import PowerForm from './PowerForm';

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
          <div className="flex w-full flex-col gap-10">
            {fields.map((field, index) => (
              <div key={field.id} className="w-full">
                <PowerForm
                  index={index}
                  form={formMethods}
                  onRemove={onRemove}
                />
              </div>
            ))}
          </div>
          {/* 電力超過警告 */}
          <div className="mt-6 flex flex-col items-center gap-4">
            {totalPower > 1500 && (
              <div className="mb-4 w-full text-center text-sm text-red-600">
                <p>合計電力が1500Wを超えています（現在: {totalPower}W）</p>
              </div>
            )}
            {/* 操作ボタン */}
            <div className="flex justify-center gap-4">
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
          </div>
        </form>
      )}
    </div>
  );
};
