import { FC, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import { POWER_LIMIT } from '../constants';
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
  const { t } = useTranslation('common');
  const translatedRadioOptions = useMemo(
    () =>
      radioOptions.map((option) => ({
        id: option.id,
        name: t(option.labelKey),
      })),
    [radioOptions, t]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* ラジオボタン */}
      <Radio
        label={t('applications.power.radio.question')}
        value={radioValue}
        onChange={onRadioChange}
        required
        options={translatedRadioOptions}
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
            {totalPower > POWER_LIMIT && (
              <div className="mb-4 w-full text-center text-sm text-red-600">
                <p>
                  {t('applications.power.form.totalPowerWarning', {
                    limit: POWER_LIMIT,
                    value: totalPower,
                  })}
                </p>
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
                {t('applications.power.form.addDevice')}
              </Button>
              <Button
                type="submit"
                size="pc"
                color="main"
                isDisable={!isValid || totalPower > POWER_LIMIT}
              >
                {t('form.actions.register')}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
