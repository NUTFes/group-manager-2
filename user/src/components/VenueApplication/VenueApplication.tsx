import { FC } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import AccordionMenu from '../AccordionMenu';
import {
  getIsOpenAccordionMenuAtom,
  setIsOpenAccordionMenuAtom,
} from './store';

type VenueApplicationProps = {};

const VenueApplication: FC<VenueApplicationProps> = () => {
  const isOpen = useAtomValue(getIsOpenAccordionMenuAtom);
  const [, toggleIsOpen] = useAtom(setIsOpenAccordionMenuAtom);

  return (
    <AccordionMenu
      title="ステージオプション申請"
      isEdit={false}
      isExist={false}
      required
      isOpen={isOpen}
      onToggle={toggleIsOpen}
      onSubmit={() => {}}
    >
      aaa
    </AccordionMenu>
  );
};

export default VenueApplication;
