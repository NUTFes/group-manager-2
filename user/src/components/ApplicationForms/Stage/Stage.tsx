import { FC, useEffect, useState } from 'react';
import {
  StageOrderData,
  useStageFormData,
  useStageOrderSubmission,
} from '@/api/stageApi';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import Selector from '@/components/Form/Selector/Selector';
import TextArea from '@/components/Form/TextArea/TextArea';
import TextBox from '@/components/Form/TextBox/TextBox';
import { useStageForm } from '@/hooks/useStageForm';
import {
  useDateOptions,
  useFilteredStageOptions,
  useStageOptions,
} from './StageForm';

const Stage: FC = () => {
  const { formState, updateField, saveDraft, clearDraft } = useStageForm();
  const [currentGroupId, setCurrentGroupId] = useState<number>(1);
  const [submitError, setSubmitError] = useState<string>('');

  const {
    date,
    sunnyFirstChoice,
    sunnySecondChoice,
    rainyFirstChoice,
    rainySecondChoice,
    prepTime,
    performTime,
    cleanupTime,
    remarks,
    errors,
    isValid,
  } = formState;

  const { fesDateData, sunnyStagesData, rainyStagesData, isLoading, hasError } =
    useStageFormData();

  const { submitStageOrder } = useStageOrderSubmission();

  useEffect(() => {
    const storedGroupId = localStorage.getItem('group_id');
    if (storedGroupId) {
      setCurrentGroupId(parseInt(storedGroupId));
      updateField('groupId', storedGroupId);
    }
  }, []);

  const dateOptions = useDateOptions(fesDateData);

  const sunnyStageOptions = useStageOptions(sunnyStagesData);
  const rainyStageOptions = useStageOptions(rainyStagesData);

  const filteredSunny1 = useFilteredStageOptions({
    allStages: sunnyStageOptions,
    selectedId: sunnySecondChoice,
  });

  const filteredSunny2 = useFilteredStageOptions({
    allStages: sunnyStageOptions,
    selectedId: sunnyFirstChoice,
  });

  const filteredRainy1 = useFilteredStageOptions({
    allStages: rainyStageOptions,
    selectedId: rainySecondChoice,
  });

  const filteredRainy2 = useFilteredStageOptions({
    allStages: rainyStageOptions,
    selectedId: rainyFirstChoice,
  });

  // エラー表示
  const renderError = (error?: string) => {
    return error ? <p className="text-[#FF0000] text-xs">{error}</p> : null;
  };

  // 一時保存処理
  const handleSaveDraft = () => {
    if (saveDraft()) {
      alert('下書きを保存しました');
    }
  };

  // 登録処理
  const handleRegister = async () => {
    if (!isValid) return;
    setSubmitError('');

    try {
      const baseOrderData = {
        group_id: currentGroupId,
        fes_date_id: parseInt(date),
        use_time_interval: performTime,
        prepare_time_interval: prepTime,
        cleanup_time_interval: cleanupTime,
        remarks: remarks,
      };

      const sunnyOrderData: StageOrderData = {
        ...baseOrderData,
        is_sunny: true,
        stage_first: parseInt(sunnyFirstChoice),
        stage_second: parseInt(sunnySecondChoice),
      };

      const rainyOrderData: StageOrderData = {
        ...baseOrderData,
        is_sunny: false,
        stage_first: parseInt(rainyFirstChoice),
        stage_second: parseInt(rainySecondChoice),
      };

      const result = await submitStageOrder(sunnyOrderData, rainyOrderData);

      if (result.success) {
        alert('ステージ希望を登録しました。');
        clearDraft();
      } else {
        setSubmitError(
          '送信中にエラーが発生しました。もう一度お試しください。'
        );
      }
    } catch (error) {
      setSubmitError('予期せぬエラーが発生しました。もう一度お試しください。');
    }
  };

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

      {isLoading && (
        <div className="text-center py-4">
          <p>データを読み込み中です...</p>
        </div>
      )}

      <div>
        <Radio
          label="開催日"
          value={date}
          onChange={(value) => updateField('date', value)}
          required={true}
          options={dateOptions}
        />
        {renderError(errors.date)}
        {!errors.date && (
          <p className="text-[#484848] text-xs">選んでください</p>
        )}
      </div>

      <div>
        <Selector
          label="晴れの場合：第1希望"
          value={sunnyFirstChoice}
          onChange={(value) => updateField('sunnyFirstChoice', value)}
          required={true}
          options={filteredSunny1}
        />
        {renderError(errors.sunnyFirstChoice)}
      </div>

      <div>
        <Selector
          label="晴れの場合：第2希望"
          value={sunnySecondChoice}
          onChange={(value) => updateField('sunnySecondChoice', value)}
          required={true}
          options={filteredSunny2}
        />
        {renderError(errors.sunnySecondChoice)}
      </div>

      <div>
        <Selector
          label="雨の場合：第1希望"
          value={rainyFirstChoice}
          onChange={(value) => updateField('rainyFirstChoice', value)}
          required={true}
          options={filteredRainy1}
        />
        {renderError(errors.rainyFirstChoice)}
      </div>

      <div>
        <Selector
          label="雨の場合：第2希望"
          value={rainySecondChoice}
          onChange={(value) => updateField('rainySecondChoice', value)}
          required={true}
          options={filteredRainy2}
        />
        {renderError(errors.rainySecondChoice)}
      </div>

      <div>
        <TextBox
          label="準備時間(単位：min)"
          value={prepTime}
          onChange={(value) => updateField('prepTime', value)}
          required={true}
          note="ステージ上の準備にかかる時間を分単位で記入してください"
        />
        {renderError(errors.prepTime)}
      </div>

      <div>
        <TextBox
          label="本番時間(単位：min)"
          value={performTime}
          onChange={(value) => updateField('performTime', value)}
          required={true}
          note="準備、本番、片付けの時間が120分以内になるようにしてください"
        />
        {renderError(errors.performTime)}
      </div>

      <div>
        <TextBox
          label="片付け時間(単位：min)"
          value={cleanupTime}
          onChange={(value) => updateField('cleanupTime', value)}
          required={true}
          note="ステージ上の片付けにかかる時間を分単位で記入してください"
        />
        {renderError(errors.cleanupTime)}
        {renderError(errors.totalTime)}
      </div>

      <TextArea
        label="備考"
        value={remarks}
        onChange={(value) => updateField('remarks', value)}
      />

      <div className="flex justify-center gap-4 mt-4">
        <Button
          size="pc"
          color="secondary"
          onClick={handleSaveDraft}
          isDisable={false}
          variant={true}
        >
          一時保存
        </Button>
        <Button
          size="pc"
          color="main"
          onClick={handleRegister}
          isDisable={!isValid}
        >
          登録
        </Button>
      </div>
    </div>
  );
};

export default Stage;
