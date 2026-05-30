import { FC } from 'react';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import FormList from '@/components/FormList/FormList';
import { usePowerNegativeViewHooks } from '../hooks/usePowerNegativeViewHooks';
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
  const { powerNegativeViewTexts } = usePowerNegativeViewHooks(radioOptions);

  return (
    <div className="flex w-full flex-col gap-6">
      {isEdit && (
        <>
          <Radio
            label={powerNegativeViewTexts.radio.label}
            value={radioValue}
            onChange={onRadioChange}
            required
            options={powerNegativeViewTexts.radio.options}
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
                {powerNegativeViewTexts.actions.cancel}
              </Button>
            </div>
          )}
        </>
      )}

      {!isEdit && (
        <FormList
          items={powerNegativeViewTexts.summary.noApplicationItems}
          onEdit={isDeadline ? undefined : onEdit}
          isEdit={!isDeadline}
        />
      )}

      {isEdit && !isSubmitted && showRegisterButton && (
        <div className="flex flex-col items-center gap-4">
          {submitError && (
            <div className="relative w-full rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <strong className="font-bold">
                {powerNegativeViewTexts.errors.submitTitle}
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
            {powerNegativeViewTexts.actions.register}
          </Button>
        </div>
      )}
    </div>
  );
};
