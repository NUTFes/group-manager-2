import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import StageForm from './StageForm';

type StageProps = {
  isEdit?: boolean;
  isExist?: boolean;
  isDeadline?: boolean;
};

const Stage: FC<StageProps> = ({
  isEdit = false,
  isExist = false,
  isDeadline,
}) => {
  return (
    <AccordionMenu
      title="ステージ申請"
      isEdit={isEdit}
      isExist={isExist}
      required={true}
    >
      <StageForm isDeadline={isDeadline} />
    </AccordionMenu>
  );
};

export default Stage;
