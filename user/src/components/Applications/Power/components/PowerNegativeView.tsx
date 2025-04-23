import { FC } from 'react';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import { RadioOption } from '../types';

interface PowerNegativeViewProps {
  radioValue: string;
  onRadioChange: (value: string) => void;
  onNegativeSubmit: () => void;
  isSubmitted: boolean;
  submitError: string | null;
  showRegisterButton: boolean;
  radioOptions: RadioOption[];
}

export const PowerNegativeView: FC<PowerNegativeViewProps> = ({
  radioValue,
  onRadioChange,
  onNegativeSubmit,
  isSubmitted,
  submitError,
  showRegisterButton,
  radioOptions,
}) => {
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

      {/* 申請しない場合の表示 */}
      {!isSubmitted && showRegisterButton ? (
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
      ) : (
        // 登録済みまたは提出完了の場合は完了メッセージを表示
        <div className="text-center">
          <p className="mb-4 text-[#FF6752]">
            電力申請を行わない登録が完了しました
          </p>
        </div>
      )}
    </div>
  );
};
