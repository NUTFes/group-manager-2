import { useEffect, useRef, useState } from 'react';

interface Props {
  hasExisting: boolean;
  isDeadline?: boolean;
  isLoadingAll: boolean;
  isSubmitted: boolean;
}

export const useStageFormViewHooks = ({
  hasExisting,
  isDeadline,
  isLoadingAll,
  isSubmitted,
}: Props) => {
  const [isFormMode, setIsFormMode] = useState<boolean | null>(null);
  const hasInitializedMode = useRef(false);

  // 初期表示のモード切替
  useEffect(() => {
    if (hasInitializedMode.current || isLoadingAll) {
      return;
    }

    setIsFormMode(!(hasExisting || !!isDeadline));
    hasInitializedMode.current = true;
  }, [isLoadingAll, hasExisting, isDeadline]);

  // 送信後は一覧モードへ
  useEffect(() => {
    if (isSubmitted) {
      setIsFormMode(false);
    }
  }, [isSubmitted]);

  const toEdit = () => setIsFormMode(true);
  const toCancel = (resetForm?: () => void) => {
    if (resetForm) resetForm();
    setIsFormMode(false);
  };

  return { isFormMode, toEdit, toCancel };
};
