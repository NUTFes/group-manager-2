import { useEffect, useRef, useState } from 'react';

type ApplyPower = 'yes' | 'no' | 'undecided';

export type PowerDisplayMode = 
  | 'negativeUndecided'  // 未登録の状態：ラジオボタン表示
  | 'negativeRegister'   // 「はい」→「いいえ」変更後：ラジオボタン+登録ボタン表示
  | 'negativeDisplay'    // 「なし」で登録済みの場合：FormListを表示
  | 'summary'            // 「あり」で登録済みの場合：FormListを表示
  | 'form';              // 「はい」選択時または編集中：Formを表示

type UsePowerDisplayInput = {
  applyPower: ApplyPower;
  hasExisting: boolean;
  isEditing: boolean;
};

export const usePowerDisplay = ({
  applyPower,
  hasExisting,
  isEditing,
}: UsePowerDisplayInput) => {
  const [negativeEditMode, setNegativeEditMode] = useState(false);
  const prevApplyPower = useRef<ApplyPower | null>(null);

  useEffect(() => {
    if (applyPower === 'no') {
      if (prevApplyPower.current === 'yes') {
        setNegativeEditMode(true);
      } else {
        setNegativeEditMode(false);
      }
    } else if (applyPower === 'undecided') {
      setNegativeEditMode(true);
    } else {
      setNegativeEditMode(true);
    }
    prevApplyPower.current = applyPower;
  }, [applyPower]);

  let mode: PowerDisplayMode;
  if (applyPower === 'undecided') {
    mode = 'negativeUndecided';
  } else if (applyPower === 'no' && !negativeEditMode) {
    mode = 'negativeDisplay';
  } else if (applyPower === 'no' && negativeEditMode) {
    mode = 'negativeRegister';
  } else if (hasExisting && !isEditing) {
    mode = 'summary';
  } else {
    mode = 'form';
  }

  return { mode, negativeEditMode, setNegativeEditMode };
};
