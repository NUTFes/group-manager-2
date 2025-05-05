import { useEffect, useRef, useState } from 'react';

type ApplyPower = 'yes' | 'no' | 'undecided';

export type PowerDisplayMode =
  | 'negativeUndecided' // 未登録の状態：ラジオボタン表示
  | 'negativeRegister' // 「はい」→「いいえ」変更後：ラジオボタン+登録ボタン表示
  | 'negativeDisplay' // 「なし」で登録済みの場合：FormListを表示
  | 'summary' // 「あり」で登録済みの場合：FormListを表示
  | 'form'; // 「はい」選択時または編集中：Formを表示

type UsePowerDisplayInput = {
  applyPower: ApplyPower;
  hasExisting: boolean;
  isEditing: boolean;
  hasUnregistered: boolean;
  isDeadline?: boolean;
};

export const usePowerDisplay = ({
  applyPower,
  hasExisting,
  isEditing,
  hasUnregistered,
  isDeadline,
}: UsePowerDisplayInput) => {
  const [negativeEditMode, setNegativeEditMode] = useState(false);
  const prevApplyPower = useRef<ApplyPower | null>(null);

  useEffect(() => {
    if (applyPower === 'no') {
      if (prevApplyPower.current === 'yes') {
        setNegativeEditMode(true);
      } else if (!hasUnregistered) {
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
  }, [applyPower, hasUnregistered]);

  let mode: PowerDisplayMode;

  // 締切後は編集不可のFormList表示にする
  if (isDeadline) {
    if (applyPower === 'no' && !negativeEditMode) {
      mode = 'negativeDisplay';
    } else if (hasExisting && !isEditing) {
      mode = 'summary';
    } else {
      mode = hasExisting ? 'summary' : 'negativeDisplay';
    }
  } else {
    // 締切前の通常処理
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
  }

  return { mode, negativeEditMode, setNegativeEditMode };
};
