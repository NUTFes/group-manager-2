import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import StageForm from './StageForm';

type StageProps = {
  isDeadline?: boolean | undefined;
  isRegistered: boolean | undefined;
};

const Stage: FC<StageProps> = ({ isDeadline, isRegistered }) => {
  return (
    <AccordionMenu
      title="ステージ申請"
      isEdit={isDeadline}
      isExist={isRegistered}
      required={true}
    >
      <StageForm isDeadline={isDeadline} />
    </AccordionMenu>
  );
};

export default Stage;
