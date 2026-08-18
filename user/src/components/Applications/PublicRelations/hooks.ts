import { usePublicRelationData } from '@/api/publicRelationsApi';
import { useTranslation } from 'next-i18next';
import { publicRelationLabels } from '../label';
import { useEditableSection } from '../shared';

export const usePublicRelationsHooks = (
  groupId: number,
  isRegistered?: boolean
) => {
  const { t } = useTranslation('common');
  const {
    publicRelation,
    error: prError,
    isLoading: prIsLoading,
    mutate: prMutate,
  } = usePublicRelationData(groupId || 0);
  const summaryLabels = publicRelationLabels.map((labelKey) => t(labelKey));
  const publicRelationsTexts = {
    title: t('applications.publicRelations.title'),
    loading: t('general.loading'),
    errors: {
      fetch: t('general.errors.fetch'),
    },
    announce: {
      yes: t('applications.publicRelations.options.announce.yes'),
      no: t('applications.publicRelations.options.announce.no'),
    },
    states: {
      notSet: t('applications.publicRelations.state.notSet'),
      missingText: t('applications.publicRelations.state.missingText'),
    },
    summaryLabels,
  };

  // アナウンスステータスを決定
  // publicRelationsのisAnnouncementRequestedフィールドに基づいて状態を決定
  const getAnnounceStatus = () => {
    if (publicRelation?.isAnnouncementRequested) {
      return publicRelationsTexts.announce.yes;
    } else if (publicRelation) {
      return publicRelationsTexts.announce.no;
    } else {
      return publicRelationsTexts.states.notSet;
    }
  };

  const {
    isEditing,
    toEdit,
    isLoading: isSectionLoading,
  } = useEditableSection({ isLoading: prIsLoading, isRegistered });

  // ローディング状態とエラー状態はpublicRelationのみを参照する
  const isLoading = isSectionLoading;
  const hasError = prError;

  // フォーム送信後にデータを再取得するための関数
  const refetchData = async () => {
    await prMutate();
  };

  return {
    publicRelation,
    isLoading,
    hasError,
    isEditing,
    toEdit,
    getAnnounceStatus,
    mutate: refetchData,
    refetchData,
    publicRelationsTexts,
  };
};
