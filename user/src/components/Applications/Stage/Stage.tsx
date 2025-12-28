import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import StageForm from './StageForm';

type StageProps = {
  isDeadline?: boolean | undefined;
  isRegistered: boolean | undefined;
  groupId: number;
};

const Stage: FC<StageProps> = ({ isDeadline, isRegistered, groupId }) => {
  return (
    <AccordionMenu
      title="ステージ申請"
      isEdit={!isDeadline}
      isExist={isRegistered}
      required={true}
    >
      <StageForm isDeadline={isDeadline} groupId={groupId} />
    </AccordionMenu>
  );
};

export default Stage;
