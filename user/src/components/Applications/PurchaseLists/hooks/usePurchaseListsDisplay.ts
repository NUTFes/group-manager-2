type DisplayMode = 'form' | 'summary' | 'deadline-unregistered';

interface UsePurchaseListsDisplayProps {
  hasExisting: boolean;
  isEditing: boolean;
  isDeadline?: boolean;
}

export const usePurchaseListsDisplay = ({
  hasExisting,
  isEditing,
  isDeadline = false,
}: UsePurchaseListsDisplayProps) => {
  const mode: DisplayMode = (() => {
    // 締切期限後で未登録の場合
    if (isDeadline && !hasExisting) {
      return 'deadline-unregistered';
    }

    if (isEditing) {
      return 'form';
    }

    if (hasExisting) {
      return 'summary';
    }

    return 'form';
  })();

  return {
    mode,
  };
};
