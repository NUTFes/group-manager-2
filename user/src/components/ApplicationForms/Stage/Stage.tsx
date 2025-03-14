import { FC, useEffect, useState } from 'react';
import {
  StageOrderData,
  useExistingStageOrders,
  useStageFormData,
  useStageOrderSubmission,
} from '@/api/stageApi';
import { StageFormData } from '@/utils/validate/validate';
import { FieldError } from 'react-hook-form';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import Selector from '@/components/Form/Selector/Selector';
import TextBox from '@/components/Form/TextBox/TextBox';
import { useStageForm } from '@/hooks/useStageForm';
import {
  useDateOptions,
  useFilteredStageOptions,
  useStageOptions,
} from './StageForm';

const Stage: FC = () => {
  // TODO: 認証基盤ができたら、グループIDを取得する
  const [currentGroupId] = useState<number | null>(1);
  const [submitError, setSubmitError] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const {
    sunnyOrder,
    rainyOrder,
    isLoading: isLoadingOrders,
    hasExistingOrders,
  } = useExistingStageOrders(currentGroupId);

  const { handleSubmit, formState, updateField } = useStageForm(
    sunnyOrder,
    rainyOrder
  );

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
    isValid,
  } = formState;

  const {
    fesDateData,
    sunnyStagesData,
    rainyStagesData,
    isLoading: isLoadingFormData,
    hasError,
  } = useStageFormData();

  const { submitStageOrder } = useStageOrderSubmission();

  // 既存の申請がある場合は編集モードに設定
  useEffect(() => {
    if (hasExistingOrders) {
      setIsEditing(true);
    }
  }, [hasExistingOrders]);

  const dateOptions = useDateOptions(fesDateData);
  const sunnyStageOptions = useStageOptions(sunnyStagesData);
  const rainyStageOptions = useStageOptions(rainyStagesData);

  const filteredSunny1 = useFilteredStageOptions({
    allStages: sunnyStageOptions,
    selectedId: sunnySecondChoice ? Number(sunnySecondChoice) : 0,
  });

  const filteredSunny2 = useFilteredStageOptions({
    allStages: sunnyStageOptions,
    selectedId: sunnyFirstChoice ? Number(sunnyFirstChoice) : 0,
  });

  const filteredRainy1 = useFilteredStageOptions({
    allStages: rainyStageOptions,
    selectedId: rainySecondChoice ? Number(rainySecondChoice) : 0,
  });

  const filteredRainy2 = useFilteredStageOptions({
    allStages: rainyStageOptions,
    selectedId: rainyFirstChoice ? Number(rainyFirstChoice) : 0,
  });

  // エラー表示
  const renderError = (fieldName: keyof StageFormData | 'totalTime') => {
    const error = errors[fieldName as keyof typeof errors] as
      | FieldError
      | undefined;
    return error ? (
      <p className="text-[#FF0000] text-xs">{error.message}</p>
    ) : null;
  };

  // 登録処理
  const onSubmit = handleSubmit(async (data) => {
    setSubmitError('');

    try {
      if (!currentGroupId) {
        setSubmitError('グループIDが見つかりません');
        return;
      }

      const baseOrderData = {
        group_id: currentGroupId,
        fes_date_id: Number(data.date),
        use_time_interval: data.performTime,
        prepare_time_interval: data.prepTime,
        cleanup_time_interval: data.cleanupTime,
      };

      const sunnyOrderData: StageOrderData = {
        ...baseOrderData,
        is_sunny: true,
        stage_first: Number(data.sunnyFirstChoice),
        stage_second: data.sunnySecondChoice
          ? Number(data.sunnySecondChoice)
          : 0,
      };

      const rainyOrderData: StageOrderData = {
        ...baseOrderData,
        is_sunny: false,
        stage_first: Number(data.rainyFirstChoice),
        stage_second: data.rainySecondChoice
          ? Number(data.rainySecondChoice)
          : 0,
      };

      // 既存の申請データがある場合は更新処理を行う
      const result = await submitStageOrder(
        sunnyOrderData,
        rainyOrderData,
        sunnyOrder,
        rainyOrder
      );

      if (result.success) {
        alert(
          isEditing
            ? 'ステージ希望を更新しました。'
            : 'ステージ希望を登録しました。'
        );
        setIsEditing(true);
      } else {
        setSubmitError(
          '送信中にエラーが発生しました。もう一度お試しください。'
        );
      }
    } catch (error) {
      setSubmitError('予期せぬエラーが発生しました。もう一度お試しください。');
    }
  });

  const isLoadingAll = isLoadingOrders || isLoadingFormData;

  return (
    <div className="w-fit flex flex-col rounded-[20px] gap-10 p-20 text-black bg-white shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.25)]">
      {hasError && (
        <div className="w-fit bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">エラー：</strong>
          <span className="block sm:inline">
            データの取得に失敗しました。ページを再読込してください。
          </span>
        </div>
      )}

      {submitError && (
        <div className="w-fit bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">送信エラー：</strong>
          <span className="block sm:inline">{submitError}</span>
        </div>
      )}

      {isLoadingAll ? (
        <div className="w-[400px] text-center py-4">
          <p>データを読み込み中です...</p>
        </div>
      ) : (
        <form className="w-[400px] flex flex-col gap-10" onSubmit={onSubmit}>
          <div>
            <Radio
              label="開催日"
              value={date}
              onChange={(value: string) => updateField('date', value)}
              required
              options={dateOptions}
            />
            {renderError('date')}
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
            />
            {renderError('sunnyFirstChoice')}
          </div>

          <div>
            <Selector
              label="晴れの場合：第2希望"
              value={sunnySecondChoice}
              onChange={(value) => updateField('sunnySecondChoice', value)}
              required
              options={filteredSunny2}
            />
            {renderError('sunnySecondChoice')}
          </div>

          <div>
            <Selector
              label="雨の場合：第1希望"
              value={rainyFirstChoice}
              onChange={(value) => updateField('rainyFirstChoice', value)}
              required
              options={filteredRainy1}
            />
            {renderError('rainyFirstChoice')}
          </div>

          <div>
            <Selector
              label="雨の場合：第2希望"
              value={rainySecondChoice}
              onChange={(value) => updateField('rainySecondChoice', value)}
              required
              options={filteredRainy2}
            />
            {renderError('rainySecondChoice')}
          </div>

          <div>
            <TextBox
              label="準備時間(単位：min)"
              value={prepTime}
              onChange={(value) => updateField('prepTime', value)}
              required
              note="ステージ上の準備にかかる時間を分単位で記入してください"
            />
            {renderError('prepTime')}
          </div>

          <div>
            <TextBox
              label="本番時間(単位：min)"
              value={performTime}
              onChange={(value) => updateField('performTime', value)}
              required
              note="準備、本番、片付けの時間が120分以内になるようにしてください"
            />
            {renderError('performTime')}
          </div>

          <div>
            <TextBox
              label="片付け時間(単位：min)"
              value={cleanupTime}
              onChange={(value) => updateField('cleanupTime', value)}
              required
              note="ステージ上の片付けにかかる時間を分単位で記入してください"
            />
            {renderError('cleanupTime')}
            {renderError('totalTime')}
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <Button type='submit' size="pc" color="main" isDisable={!isValid}>
              {isEditing ? '更新' : '登録'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Stage;
