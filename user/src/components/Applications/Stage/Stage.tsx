import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import AccordionMenu from '@/components/AccordionMenu';
import StageForm from './StageForm';

type StageProps = {
  isDeadline?: boolean | undefined;
  isRegistered: boolean | undefined;
  groupId: number;
};

const Stage: FC<StageProps> = ({ isDeadline, isRegistered, groupId }) => {
  const { t } = useTranslation('common');

  return (
    <AccordionMenu
      title={t('applications.stage.title')}
      isEdit={!isDeadline}
      isExist={isRegistered}
      required={true}
    >
      <StageForm isDeadline={isDeadline} groupId={groupId} />
    </AccordionMenu>
  );
};

export default Stage;
