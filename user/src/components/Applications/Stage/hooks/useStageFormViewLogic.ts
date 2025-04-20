import { useEffect, useState } from 'react';

interface Props {
  hasExisting: boolean;
  isDeadline?: boolean;
  isLoadingAll: boolean;
  isSubmitted: boolean;
}

export const useStageFormViewLogic = ({
  hasExisting,
  isDeadline,
  isLoadingAll,
  isSubmitted,
}: Props) => {
  const [isFormMode, setIsFormMode] = useState(true);

  // 初期表示のモード切替
  useEffect(() => {
    if (!isLoadingAll) {
      setIsFormMode(!(hasExisting || !!isDeadline));
    }
  }, [isLoadingAll, hasExisting, isDeadline]);

  // 送信後は一覧モードへ
  useEffect(() => {
    if (isSubmitted) {
      setIsFormMode(false);
    }
  }, [isSubmitted]);

  const toEdit = () => setIsFormMode(true);
  const toCancel = () => setIsFormMode(false);

  return { isFormMode, toEdit, toCancel };
};
