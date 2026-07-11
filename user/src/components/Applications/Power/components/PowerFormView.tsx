import { FC } from 'react';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import { POWER_LIMIT } from '../constants';
import { usePowerFormViewHooks } from '../hooks/usePowerFormViewHooks';
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
  canAdd = false,
}) => {
  const { handleSubmit } = formMethods;
  const { powerFormViewTexts } = usePowerFormViewHooks(radioOptions);

  return (
    <div className="flex flex-col gap-6">
      {/* ラジオボタン */}
      <Radio
        label={powerFormViewTexts.radio.label}
        value={radioValue}
        onChange={onRadioChange}
        required
        options={powerFormViewTexts.radio.options}
      />

      {/* 申請する場合のフォーム */}
      <div style={{ display: showForm ? 'block' : 'none' }}>
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
            {totalPower > POWER_LIMIT && (
              <div className="mb-4 w-full text-center text-sm text-red-600">
                <p>
                  {powerFormViewTexts.warnings.totalPower(
                    POWER_LIMIT,
                    totalPower
                  )}
                </p>
              </div>
            )}
            {/* 操作ボタン */}
            <div className="flex justify-center gap-4">
              {canAdd && (
                <Button
                  type="button"
                  size="pc"
                  color="main"
                  icon="plus"
                  variant
                  onClick={onAddDevice}
                >
                  {powerFormViewTexts.actions.addDevice}
                </Button>
              )}
              <Button
                type="submit"
                size="pc"
                color="main"
                isDisable={!isValid || totalPower > POWER_LIMIT}
              >
                {powerFormViewTexts.actions.register}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
