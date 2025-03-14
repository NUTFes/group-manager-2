import { useEffect } from 'react';
import { stageSchema, StageFormData } from '@/utils/validate/validate';
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
  | 'cleanupTime' 
  | 'remarks'
  | 'groupId';

const DRAFT_STORAGE_KEY = 'stageDraft';

const DEFAULT_FORM_STATE: StageFormData = {
  date: '',
  sunnyFirstChoice: '',
  sunnySecondChoice: '',
  rainyFirstChoice: '',
  rainySecondChoice: '',
  prepTime: '',
  performTime: '',
  cleanupTime: '',
  remarks: '',
  groupId: '',
};

export const useStageForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    getValues,
    reset,
    trigger,
    watch,
  } = useForm<StageFormData>({
    resolver: zodResolver(stageSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_FORM_STATE,
  });

  // ローカルストレージから下書きの読み込み
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        const formValues = { ...DEFAULT_FORM_STATE, ...parsedDraft };
        
        Object.entries(formValues).forEach(([key, value]) => {
          setValue(key as FormField, value as string);
        });
        
        trigger();
      } catch (e) {
        console.error('下書きの解析に失敗しました', e);
      }
    }
  }, [setValue, trigger]);

  // フォームフィールドの更新
  const updateField = (field: FormField, value: string) => {
    setValue(field, value, { shouldValidate: true });
  };

  // 下書き保存
  const saveDraft = () => {
    const currentValues = getValues();
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(currentValues));
    return true;
  };

  // 下書き削除
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    reset(DEFAULT_FORM_STATE);
  };

  // 全フォーム値の監視
  const allValues = watch();

  return {
    register,
    handleSubmit,
    formState: {
      ...allValues,
      errors,
      isValid,
    },
    updateField,
    saveDraft,
    clearDraft,
  };
};
