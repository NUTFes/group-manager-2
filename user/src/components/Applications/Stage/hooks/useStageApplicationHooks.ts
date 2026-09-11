import { useTranslation } from 'next-i18next';

export const useStageApplicationHooks = () => {
  const { t } = useTranslation('common');

  const stageApplicationTexts = {
    title: t('applications.stage.title'),
  };

  return {
    stageApplicationTexts,
  };
};
