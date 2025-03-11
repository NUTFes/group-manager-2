import { useState, useEffect } from 'react';

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

export type FormState = {
  date: string;
  sunnyFirstChoice: string;
  sunnySecondChoice: string;
  rainyFirstChoice: string;
  rainySecondChoice: string;
  prepTime: string;
  performTime: string;
  cleanupTime: string;
  remarks: string;
  groupId: string;
  errors: {
    [key: string]: string;
  };
  isValid: boolean;
};

const DRAFT_STORAGE_KEY = 'stageDraft';

const DEFAULT_FORM_STATE: FormState = {
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
  errors: {},
  isValid: false,
};

export const useStageForm = () => {
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

  // ローカルストレージから下書きの読み込み
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormState(prevState => ({
          ...prevState,
          ...parsedDraft,
          errors: validateForm({ ...prevState, ...parsedDraft }),
          isValid: Object.keys(validateForm({ ...prevState, ...parsedDraft })).length === 0
        }));
      } catch (e) {
        console.error('下書きの解析に失敗しました', e);
      }
    }
  }, []);

  // フォームフィールドの更新
  const updateField = (field: FormField, value: string) => {
    setFormState(prevState => {
      const newState = { ...prevState, [field]: value };
      const errors = validateForm(newState);
      
      return {
        ...newState,
        errors,
        isValid: Object.keys(errors).length === 0
      };
    });
  };

  // バリデーション関数
  const validateForm = (state: Omit<FormState, 'errors' | 'isValid'>) => {
    const errors: { [key: string]: string } = {};
    
    if (!state.date) errors.date = '開催日を選択してください';
    if (!state.sunnyFirstChoice) errors.sunnyFirstChoice = '第1希望を選択してください';
    if (!state.sunnySecondChoice) errors.sunnySecondChoice = '第2希望を選択してください';
    if (!state.rainyFirstChoice) errors.rainyFirstChoice = '第1希望を選択してください';
    if (!state.rainySecondChoice) errors.rainySecondChoice = '第2希望を選択してください';
    
    if (!state.prepTime) {
      errors.prepTime = '準備時間を入力してください';
    } else if (isNaN(Number(state.prepTime)) || Number(state.prepTime) < 0) {
      errors.prepTime = '有効な準備時間を入力してください';
    }
    
    if (!state.performTime) {
      errors.performTime = '本番時間を入力してください';
    } else if (isNaN(Number(state.performTime)) || Number(state.performTime) < 0) {
      errors.performTime = '有効な本番時間を入力してください';
    }
    
    if (!state.cleanupTime) {
      errors.cleanupTime = '片付け時間を入力してください';
    } else if (isNaN(Number(state.cleanupTime)) || Number(state.cleanupTime) < 0) {
      errors.cleanupTime = '有効な片付け時間を入力してください';
    }
    
    const totalTime = Number(state.prepTime) + Number(state.performTime) + Number(state.cleanupTime);
    if (totalTime > 120) {
      errors.totalTime = '準備・本番・片付けの合計時間は120分以内にしてください';
    }
    
    return errors;
  };

  // 下書き保存
  const saveDraft = () => {
    const { errors, isValid, ...draftData } = formState;
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
    return true;
  };

  // 下書き削除
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setFormState(DEFAULT_FORM_STATE);
  };

  return {
    formState,
    updateField,
    saveDraft,
    clearDraft
  };
};
