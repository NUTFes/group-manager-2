import { useEffect, useRef, useState } from 'react';

type UseEditableSectionParams = {
  /** 取得系フックの isLoading。 */
  isLoading: boolean;
  /**
   * 登録済みかどうか。
   * 未解決の間は必ず undefined を渡すこと。false に潰すと「未登録」と誤って
   * 確定し、登録済みでも編集フォームで開いてしまう。
   */
  isRegistered: boolean | undefined;
  /**
   * 編集モードを初期化してよいかの追加条件。
   * 判定に必要な別データの解決を待ちたい場合に false を渡す。
   */
  isReady?: boolean;
};

type UseEditableSectionResult = {
  /** null は初期化前。呼び出し側はローディング表示に使う。 */
  isEditing: boolean | null;
  /** 編集モードと一覧表示を切り替える。 */
  toEdit: () => void;
  /**
   * 初回ロード中だけ true。
   * 再取得のたびにローディング表示へ戻さないための判定。
   */
  isLoading: boolean;
};

/**
 * 申請セクションの「初回ロード」と「編集モード」を管理する。
 *
 * 未登録なら編集フォーム、登録済みなら一覧表示で開く、という判定は一度だけ行い、
 * 以降の再取得では維持する（編集中に再取得が走っても勝手に一覧へ戻さないため）。
 */
export const useEditableSection = ({
  isLoading,
  isRegistered,
  isReady = true,
}: UseEditableSectionParams): UseEditableSectionResult => {
  const [isEditing, setIsEditing] = useState<boolean | null>(null);
  const hasInitializedEditing = useRef(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const toEdit = () => {
    setIsEditing((prev) => !prev);
  };

  useEffect(() => {
    if (!isLoading) {
      setHasLoadedOnce(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (
      hasInitializedEditing.current ||
      !isReady ||
      isRegistered === undefined
    ) {
      return;
    }

    setIsEditing(!isRegistered);
    hasInitializedEditing.current = true;
  }, [isRegistered, isReady]);

  return {
    isEditing,
    toEdit,
    isLoading: isLoading && !hasLoadedOnce,
  };
};
