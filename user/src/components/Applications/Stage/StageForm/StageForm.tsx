import { FC, useEffect, useState } from 'react';
import { StageFormData } from '@/utils/validate/validate';
import { FieldError } from 'react-hook-form';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import Selector from '@/components/Form/Selector/Selector';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';
import { useStageFormLogic } from '../hooks';

type Props = { isDeadline?: boolean };
const StageForm: FC<Props> = ({ isDeadline }) => {
  const {
    formState,
    updateField,
    dateOptions,
    filteredSunny1,
    filteredSunny2,
    filteredRainy1,
    filteredRainy2,
    onSubmit,
    isLoadingAll,
    hasError,
    submitError,
    hasExisting,
    isValid,
    isSubmitted,
    sunnyStageOptions,
    rainyStageOptions,
  } = useStageFormLogic();

  // モード管理
  const [isFormMode, setIsFormMode] = useState(true);

  // 初期表示
  useEffect(() => {
    if (!isLoadingAll) {
      setIsFormMode(!(hasExisting || !!isDeadline));
    }
  }, [isLoadingAll, hasExisting, isDeadline]);

  // 登録後に切り替え
  useEffect(() => {
    if (isSubmitted) {
      setIsFormMode(false);
    }
  }, [isSubmitted]);

  const {
    date,
    sunnyFirstChoice,
    sunnySecondChoice,
    rainyFirstChoice,
    rainySecondChoice,
    prepTime,
    performTime,
    cleanupTime,
    errors,
  } = formState;

  const items: FormItem[] = [
    {
      label: '開催日',
      content: dateOptions.find((o) => o.id === +date)?.name || '',
      isEditable: false,
    },
    {
      label: '晴れの場合：第1希望',
      content:
        sunnyStageOptions.find((o) => o.id === +sunnyFirstChoice)?.name || '',
      isEditable: false,
    },
    {
      label: '晴れの場合：第2希望',
      content:
        sunnyStageOptions.find((o) => o.id === +sunnySecondChoice)?.name || '',
      isEditable: false,
    },
    {
      label: '雨の場合：第1希望',
      content:
        rainyStageOptions.find((o) => o.id === +rainyFirstChoice)?.name || '',
      isEditable: false,
    },
    {
      label: '雨の場合：第2希望',
      content:
        rainyStageOptions.find((o) => o.id === +rainySecondChoice)?.name || '',
      isEditable: false,
    },
    { label: '準備時間', content: `${prepTime}分`, isEditable: false },
    { label: '本番時間', content: `${performTime}分`, isEditable: false },
    { label: '片付け時間', content: `${cleanupTime}分`, isEditable: false },
  ];

  // エラーメッセージを取得する関数
  const getErrorMessage = (fieldName: keyof StageFormData | 'totalTime') => {
    const error = errors[fieldName as keyof typeof errors] as
      | FieldError
      | undefined;
    return error ? error.message : undefined;
  };

  return (
    <>
      {isFormMode ? (
        <FormContainer>
          {hasError && (
            <div className="relative w-[400px] rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <strong className="font-bold">エラー：</strong>
              <span className="block sm:inline">
                データの取得に失敗しました。ページを再読込してください。
              </span>
            </div>
          )}

          {submitError && (
            <div className="relative w-[400px] rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <strong className="font-bold">送信エラー：</strong>
              <span className="block sm:inline">{submitError}</span>
            </div>
          )}

          {isLoadingAll ? (
            <div className="w-[400px] py-4 text-center">
              <p>データを読み込み中です...</p>
            </div>
          ) : (
            <form
              className="flex w-[400px] flex-col gap-10 text-[#484848]"
              onSubmit={onSubmit}
            >
              <div>
                <Radio
                  label="開催日"
                  value={date}
                  onChange={(value: string) => updateField('date', value)}
                  required
                  options={dateOptions}
                  error={getErrorMessage('date')}
                />
                {!errors.date && (
                  <p className="text-xs text-[#484848]">選んでください</p>
                )}
              </div>

              <div>
                <Selector
                  label="晴れの場合：第1希望"
                  value={sunnyFirstChoice}
                  onChange={(value) => updateField('sunnyFirstChoice', value)}
                  required
                  options={filteredSunny1}
                  error={getErrorMessage('sunnyFirstChoice')}
                />
              </div>

              <div>
                <Selector
                  label="晴れの場合：第2希望"
                  value={sunnySecondChoice}
                  onChange={(value) => updateField('sunnySecondChoice', value)}
                  required
                  options={filteredSunny2}
                  error={getErrorMessage('sunnySecondChoice')}
                />
              </div>

              <div>
                <Selector
                  label="雨の場合：第1希望"
                  value={rainyFirstChoice}
                  onChange={(value) => updateField('rainyFirstChoice', value)}
                  required
                  options={filteredRainy1}
                  error={getErrorMessage('rainyFirstChoice')}
                />
              </div>

              <div>
                <Selector
                  label="雨の場合：第2希望"
                  value={rainySecondChoice}
                  onChange={(value) => updateField('rainySecondChoice', value)}
                  required
                  options={filteredRainy2}
                  error={getErrorMessage('rainySecondChoice')}
                />
              </div>

              <div>
                <TextBox
                  label="準備時間(単位：min)"
                  value={prepTime}
                  onChange={(value) => updateField('prepTime', value)}
                  required
                  note="ステージ上の準備にかかる時間を分単位で記入してください"
                  error={getErrorMessage('prepTime')}
                />
              </div>

              <div>
                <TextBox
                  label="本番時間(単位：min)"
                  value={performTime}
                  onChange={(value) => updateField('performTime', value)}
                  required
                  note="準備、本番、片付けの時間が120分以内になるようにしてください"
                  error={getErrorMessage('performTime')}
                />
              </div>

              <div>
                <TextBox
                  label="片付け時間(単位：min)"
                  value={cleanupTime}
                  onChange={(value) => updateField('cleanupTime', value)}
                  required
                  note="ステージ上の片付けにかかる時間を分単位で記入してください"
                  error={getErrorMessage('cleanupTime')}
                />
                {getErrorMessage('totalTime') && (
                  <p className="text-xs text-[#FF0000]">
                    {getErrorMessage('totalTime')}
                  </p>
                )}
              </div>

              <div className="mt-4 flex justify-center gap-4">
                {hasExisting && (
                  <Button
                    type="button"
                    size="pc"
                    color="main"
                    variant
                    onClick={() => setIsFormMode(false)}
                  >
                    キャンセル
                  </Button>
                )}
                <Button
                  type="submit"
                  size="pc"
                  color="main"
                  isDisable={!isValid}
                >
                  {hasExisting ? '修正' : '登録'}
                </Button>
              </div>
            </form>
          )}
        </FormContainer>
      ) : (
        <FormList
          items={items}
          onEdit={() => setIsFormMode(true)}
          isEdit={!isDeadline}
        />
      )}
    </>
  );
};

export default StageForm;
