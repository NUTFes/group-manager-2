import { FC } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import AccordionMenu from '@/components/AccordionMenu';
import RentItemsForm from '@/components/RentItems/RentItemsForm';
import {
  getIsOpenAccordionMenuAtom,
  setIsOpenAccordionMenuAtom,
} from './store';

type RentItemsProps = {
  isEdit?: boolean;
  isExist?: boolean;
};

const RentItems: FC<RentItemsProps> = ({ isEdit = false, isExist = false }) => {
  const isOpen = useAtomValue(getIsOpenAccordionMenuAtom);
  const [, toggleIsOpen] = useAtom(setIsOpenAccordionMenuAtom);

  return (
      <AccordionMenu
          title="物品申請"
          isEdit={isEdit}
          isExist={isExist}
          required={true}
          isOpen={isOpen}
          onToggle={toggleIsOpen}
          onSubmit={() => {}}
      >
        <RentItemsForm />
      </AccordionMenu>
  );
};

export default RentItems;