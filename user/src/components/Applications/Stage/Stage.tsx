import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import StageForm from './StageForm';
import { useStageApplicationHooks } from './hooks';

type StageProps = {
  isDeadline?: boolean | undefined;
  isRegistered: boolean | undefined;
  groupId: number;
};

const Stage: FC<StageProps> = ({ isDeadline, isRegistered, groupId }) => {
  const { stageApplicationTexts } = useStageApplicationHooks();

  return (
    <AccordionMenu
      title={stageApplicationTexts.title}
      isEdit={!isDeadline}
      isExist={isRegistered}
      required={true}
    >
      <StageForm isDeadline={isDeadline} groupId={groupId} />
    </AccordionMenu>
  );
};

export default Stage;
