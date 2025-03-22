import { FC } from 'react';
import { FieldError } from 'react-hook-form';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import Selector from '@/components/Form/Selector/Selector';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer';
import { StageFormData } from '@/utils/validate/validate';
import { useStageFormLogic } from '../hooks';

const StageForm: FC = () => {
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
  } = useStageFormLogic();

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

  // エラーメッセージを取得する関数
  const getErrorMessage = (fieldName: keyof StageFormData | 'totalTime') => {
    const error = errors[fieldName as keyof typeof errors] as
      | FieldError
      | undefined;
    return error ? error.message : undefined;
  };

  return (
    <FormContainer>
      {hasError && (
        <div className="w-[400px] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">エラー：</strong>
          <span className="block sm:inline">
            データの取得に失敗しました。ページを再読込してください。
          </span>
        </div>
      )}

      {submitError && (
        <div className="w-[400px] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">送信エラー：</strong>
          <span className="block sm:inline">{submitError}</span>
        </div>
      )}

      {isLoadingAll ? (
        <div className="w-[400px] text-center py-4">
          <p>データを読み込み中です...</p>
        </div>
      ) : (
        <form
          className="w-[400px] flex flex-col gap-10 text-[#484848]"
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
              <p className="text-[#484848] text-xs">選んでください</p>
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
              <p className="text-[#FF0000] text-xs">{getErrorMessage('totalTime')}</p>
            )}
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <Button type="submit" size="pc" color="main" isDisable={!isValid}>
              {hasExisting ? '更新' : '登録'}
            </Button>
          </div>
        </form>
      )}
    </FormContainer>
  );
};

export default StageForm;