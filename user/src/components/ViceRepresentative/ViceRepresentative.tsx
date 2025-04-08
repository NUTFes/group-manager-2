import { FC } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import AccordionMenu from '@/components/AccordionMenu';
import ViceRepresentativeForm from '@/components/ViceRepresentative/ViceRepresentativeForm';
import {
  getIsOpenAccordionMenuAtom,
  setIsOpenAccordionMenuAtom,
} from './store';

// TODO: pageからのデータはここのpropsでバケツリレーし、isEdit,isExistに入れる。
type ViceRepresentativeFormProps = {};

const ViceRepresentative: FC<ViceRepresentativeFormProps> = () => {
  const isOpen = useAtomValue(getIsOpenAccordionMenuAtom);
  const [, toggleIsOpen] = useAtom(setIsOpenAccordionMenuAtom);

  return (
    <AccordionMenu
      title="副代表申請"
      isEdit={false}
      isExist={false}
      required
      isOpen={isOpen}
      onToggle={toggleIsOpen}
      onSubmit={() => {}}
    >
      <ViceRepresentativeForm />
    </AccordionMenu>
  );
};

export default ViceRepresentative;