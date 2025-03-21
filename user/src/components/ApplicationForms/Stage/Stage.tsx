import { FC } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import AccordionMenu from '@/components/AccordionMenu';
import {
  getIsOpenAccordionMenuAtom,
  setIsOpenAccordionMenuAtom,
} from '@/components/ApplicationForms/Stage/store';
import StageForm from './StageForm';

type StageProps = {
  isEdit?: boolean;
  isExist?: boolean;
};

const Stage: FC<StageProps> = ({ isEdit = false, isExist = false }) => {
  const isOpen = useAtomValue(getIsOpenAccordionMenuAtom);
  const [, toggleIsOpen] = useAtom(setIsOpenAccordionMenuAtom);

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
      <StageForm isEdit={isEdit} isExist={isExist} />
    </AccordionMenu>
  );
};

export default Stage;