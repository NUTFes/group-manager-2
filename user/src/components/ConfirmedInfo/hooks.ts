import { useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';

export const useConfirmedInfoTexts = () => {
  const { t } = useTranslation('common');
  return {
    headers: {
      stockPlace: t('confirmedInfo.table.stockPlace'),
      rentalPlace: t('confirmedInfo.table.rentalPlace'),
      num: t('confirmedInfo.table.num'),
    },
    labels: {
      groupName: t('confirmedInfo.labels.groupName'),
      unset: t('confirmedInfo.labels.unset'),
      empty: t('confirmedInfo.labels.empty'),
      shareNotice: t('confirmedInfo.labels.shareNotice'),
    },
    actions: {
      copy: t('confirmedInfo.actions.copy'),
      share: t('confirmedInfo.actions.share'),
    },
    error: {
      title: t('confirmedInfo.error.title'),
      description: t('confirmedInfo.error.description'),
    },
    loading: t('confirmedInfo.loading'),
  };
};

export const useConfirmedInfoActions = () => {
  const { t } = useTranslation('common');
  // 前の共有シートが閉じる前に連打されると navigator.share() が
  // InvalidStateError を投げるため、実行中はrefで即座にブロックする
  const isSharingRef = useRef(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleCopy = async (url: string) => {
    try {
      if (!navigator.clipboard) throw new Error('clipboard unsupported');
      await navigator.clipboard.writeText(url);
      toast.success(t('confirmedInfo.toasts.copySuccess'));
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      toast.error(t('confirmedInfo.toasts.copyFailed'));
    }
  };

  const handleShare = async (url: string, title: string) => {
    if (isSharingRef.current) return;

    if (navigator.share) {
      isSharingRef.current = true;
      setIsSharing(true);
      try {
        await navigator.share({ title, url });
      } catch (error) {
        // ユーザーが共有シートを閉じた場合は AbortError が発生するため、エラー扱いしない
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Share failed:', error);
      } finally {
        isSharingRef.current = false;
        setIsSharing(false);
      }
      return;
    }
    await handleCopy(url);
  };

  return { handleCopy, handleShare, isSharing };
};
