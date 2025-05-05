import { FC } from 'react';
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
  const noApplicationItems: FormItem[] = [
    {
      label: '電力申請は不要（登録済み）',
      content: '電力が必要な機器は使用しません。',
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      {isEdit && (
        <>
          <Radio
            label="電力申請を行いますか？"
            value={radioValue}
            onChange={onRadioChange}
            required
            options={radioOptions}
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
                キャンセル
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
              <strong className="font-bold">エラー：</strong>
              <span className="block sm:inline">{submitError}</span>
            </div>
          )}
          <Button
            type="button"
            size="pc"
            color="main"
            onClick={onNegativeSubmit}
          >
            登録
          </Button>
        </div>
      )}
    </div>
  );
};
