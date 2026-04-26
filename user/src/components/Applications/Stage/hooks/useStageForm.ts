import { useEffect } from 'react';
import { StageOrderResponse } from '@/api/stageApi';
import { StageFormData, stageSchema } from '@/utils/validate/validate';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export type FormField =
  | 'date'
  | 'sunnyFirstChoice'
  | 'sunnySecondChoice'
  | 'rainyFirstChoice'
  | 'rainySecondChoice'
  | 'prepTime'
  | 'performTime'
  | 'cleanupTime';

export const DEFAULT_FORM_STATE: StageFormData = {
  date: '',
  sunnyFirstChoice: '',
  sunnySecondChoice: '',
  rainyFirstChoice: '',
  rainySecondChoice: '',
  prepTime: '',
  performTime: '',
  cleanupTime: '',
};

// 文字列から「分」を削除する関数
export const removeMinutes = (timeStr: string | undefined): string => {
  if (!timeStr) return '';
  return timeStr.replace(/分$/, '');
};

// 文字列に「分」を追加する関数
export const addMinutes = (timeStr: string | undefined): string => {
  if (!timeStr) return '';
  return timeStr.endsWith('分') ? timeStr : `${timeStr}分`;
};

// 既存データからフォーム初期値を作成する関数
export const createInitialValues = (
  sunnyOrder?: StageOrderResponse,
  rainyOrder?: StageOrderResponse
): StageFormData => {
  const values = { ...DEFAULT_FORM_STATE };
  const sourceOrder = sunnyOrder || rainyOrder;
  if (sourceOrder) {
    values.date = sourceOrder.fesDateId.toString();
    values.prepTime = removeMinutes(sourceOrder.prepareTimeInterval);
    values.performTime = removeMinutes(sourceOrder.useTimeInterval);
    values.cleanupTime = removeMinutes(sourceOrder.cleanupTimeInterval);
  }

  if (sunnyOrder) {
    values.sunnyFirstChoice = sunnyOrder.stageFirst.toString();
    values.sunnySecondChoice = sunnyOrder.stageSecond?.toString() || '';
  }

  if (rainyOrder) {
    values.rainyFirstChoice = rainyOrder.stageFirst.toString();
    values.rainySecondChoice = rainyOrder.stageSecond?.toString() || '';
  }

  return values;
};

export const useStageForm = (
  existingSunnyOrder?: StageOrderResponse,
  existingRainyOrder?: StageOrderResponse
) => {
  const initialValues = createInitialValues(
    existingSunnyOrder,
    existingRainyOrder
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
    reset,
    trigger,
    watch,
  } = useForm<StageFormData>({
    resolver: zodResolver(stageSchema),
    mode: 'onChange',
    defaultValues: initialValues,
  });

  // データが変更された場合はリセット
  useEffect(() => {
    if ((existingSunnyOrder || existingRainyOrder) && !isDirty) {
      const values = createInitialValues(
        existingSunnyOrder,
        existingRainyOrder
      );
      reset(values);
    }
  }, [existingSunnyOrder, existingRainyOrder, isDirty, reset]);

  // フォームフィールドの更新
  const updateField = (field: FormField, value: string) => {
    setValue(field, value, { shouldValidate: true });

    if (['prepTime', 'performTime', 'cleanupTime'].includes(field)) {
      setTimeout(() => {
        trigger();
      }, 10);
    }
  };

  // 全フォーム値の監視
  const allValues = watch();

  return {
    register,
    handleSubmit,
    reset,
    formState: {
      ...allValues,
      errors,
      isValid,
    },
    updateField,
    trigger,
  };
};
