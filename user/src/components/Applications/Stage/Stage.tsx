import { FC } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import AccordionMenu from '@/components/AccordionMenu';
import {
  getIsOpenStageAccordionMenuAtom,
  setIsOpenStageAccordionMenuAtom,
} from '@/components/Applications/Stage/store';
import StageForm from './StageForm';

type StageProps = {
  isEdit?: boolean;
  isExist?: boolean;
};

const Stage: FC<StageProps> = ({ isEdit = false, isExist = false }) => {
  const isOpen = useAtomValue(getIsOpenStageAccordionMenuAtom);
  const [, toggleIsOpen] = useAtom(setIsOpenStageAccordionMenuAtom);

  return (
    <AccordionMenu
      title="ステージ申請"
      isEdit={isEdit}
      isExist={isExist}
      required={true}
      isOpen={isOpen}
      onToggle={toggleIsOpen}
      onSubmit={() => {}}
    >
      <StageForm />
    </AccordionMenu>
  );
};

export default Stage;
