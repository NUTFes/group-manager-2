import { useState } from 'react';
import {
  StageOrderData,
  useGetStageOrders,
  useMutateStageOrders,
  useStageFormData,
} from '@/api/stageApi';
import { StageFormData } from '@/utils/validate/validate';
import { FieldError } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useStageForm } from './useStageForm';
import {
  useDateOptions,
  useFilteredStageOptions,
  useStageOptions,
} from './useStageHelpers';

export const useStageFormLogic = (groupId: number) => {
  const [currentGroupId] = useState<number>(groupId);
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // ステージ申請の既存データ取得
  const {
    sunnyOrder,
    rainyOrder,
    isLoading: isLoadingOrders,
    hasExisting,
  } = useGetStageOrders(currentGroupId);

  // フォーム状態管理
  const { handleSubmit, formState, updateField, reset } = useStageForm(
    sunnyOrder,
    rainyOrder
  );

  // フォームに必要なマスターデータ取得
  const {
    fesDateData,
    sunnyStagesData,
    rainyStagesData,
    isLoading: isLoadingFormData,
    hasError,
  } = useStageFormData();

  // 申請送信ロジック
  const { submitStageOrder } = useMutateStageOrders();

  // 選択肢の生成
  const dateOptions = useDateOptions(fesDateData);
  const sunnyStageOptions = useStageOptions(sunnyStagesData);
  const rainyStageOptions = useStageOptions(rainyStagesData);

  // 現在のフォーム値の取得
  const {
    sunnyFirstChoice,
    sunnySecondChoice,
    rainyFirstChoice,
    rainySecondChoice,
  } = formState;

  // 選択肢のフィルタリング（重複選択防止）
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

  // 既存のデータにフォームをリセットする関数
  const resetForm = () => {
    if (sunnyOrder || rainyOrder) {
      reset();
    }
  };

  // エラーメッセージ取得関数
  const getErrorMessage = (
    fieldName: keyof StageFormData | 'totalTime'
  ): string | undefined => {
    const error = formState.errors[
      fieldName as keyof typeof formState.errors
    ] as FieldError | undefined;
    return error ? error.message : undefined;
  };

  // フォーム送信処理
  const onSubmit = handleSubmit(async (data) => {
    setSubmitError('');
    setIsSubmitted(false);

    try {
      if (!currentGroupId) {
        setSubmitError('グループIDが見つかりません');
        return;
      }

      // 共通のデータ部分を作成
      const baseOrderData = {
        group_id: currentGroupId,
        fes_date_id: Number(data.date),
        use_time_interval: data.performTime,
        prepare_time_interval: data.prepTime,
        cleanup_time_interval: data.cleanupTime,
      };

      // 晴れの場合のデータ
      const sunnyOrderData: StageOrderData = {
        ...baseOrderData,
        is_sunny: true,
        stage_first: Number(data.sunnyFirstChoice),
        stage_second: data.sunnySecondChoice
          ? Number(data.sunnySecondChoice)
          : 0,
      };

      // 雨の場合のデータ
      const rainyOrderData: StageOrderData = {
        ...baseOrderData,
        is_sunny: false,
        stage_first: Number(data.rainyFirstChoice),
        stage_second: data.rainySecondChoice
          ? Number(data.rainySecondChoice)
          : 0,
      };

      // データ送信
      const result = await submitStageOrder(
        sunnyOrderData,
        rainyOrderData,
        sunnyOrder,
        rainyOrder
      );

      if (result.success) {
        toast.success(
          hasExisting
            ? 'ステージ希望を更新しました。'
            : 'ステージ希望を登録しました。'
        );
        setIsSubmitted(true);
      } else {
        setSubmitError(
          '送信中にエラーが発生しました。もう一度お試しください。'
        );
      }
    } catch {
      setSubmitError('予期せぬエラーが発生しました。もう一度お試しください。');
    }
  });

  const isLoadingAll = isLoadingOrders || isLoadingFormData;
  const isValid = formState.isValid;

  return {
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
    getErrorMessage,
    resetForm,
  };
};
