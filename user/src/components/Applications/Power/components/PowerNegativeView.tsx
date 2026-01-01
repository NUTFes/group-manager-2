import { FC, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';
import { PowerNegativeViewProps } from '../types';

export const PowerNegativeView: FC<PowerNegativeViewProps> = ({
  radioValue,
  onRadioChange,
  onNegativeSubmit,
  isSubmitted,
  submitError,
  showRegisterButton,
  radioOptions,
  onEdit,
  isEdit,
  onCancel,
  isDeadline,
}) => {
  const { t } = useTranslation('common');
  const translatedRadioOptions = useMemo(
    () =>
      radioOptions.map((option) => ({
        id: option.id,
        name: t(option.labelKey),
      })),
    [radioOptions, t]
  );
  const noApplicationItems: FormItem[] = [
    {
      label: t('applications.power.summary.noApplication.label'),
      content: t('applications.power.summary.noApplication.description'),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      {isEdit && (
        <>
          <Radio
            label={t('applications.power.radio.question')}
            value={radioValue}
            onChange={onRadioChange}
            required
            options={translatedRadioOptions}
          />
          {onCancel && (
            <div className="flex justify-center">
              <Button
                type="button"
                size="pc"
                color="main"
                variant
                onClick={onCancel}
              >
                {t('form.actions.cancel')}
              </Button>
            </div>
          )}
        </>
      )}

      {!isEdit && (
        <FormList
          items={noApplicationItems}
          onEdit={isDeadline ? undefined : onEdit}
          isEdit={!isDeadline}
        />
      )}

      {isEdit && !isSubmitted && showRegisterButton && (
        <div className="flex flex-col items-center gap-4">
          {submitError && (
            <div className="relative w-full rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <strong className="font-bold">
                {t('applications.power.errors.submitTitle')}
              </strong>
              <span className="block sm:inline">{submitError}</span>
            </div>
          )}
          <Button
            type="button"
            size="pc"
            color="main"
            onClick={onNegativeSubmit}
          >
            {t('form.actions.register')}
          </Button>
        </div>
      )}
    </div>
  );
};
