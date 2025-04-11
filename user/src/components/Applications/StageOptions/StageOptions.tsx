import { FC } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import AccordionMenu from '@/components/AccordionMenu';
import StageOptionForm from '@/components/Applications/StageOptions/StageOptionForm';
import {
  getIsOpenAccordionMenuAtom,
  setIsOpenAccordionMenuAtom,
} from './store';

// TODO: pageからのデータはここのpropsでバケツリレーし、isEdit,isExistに入れる。
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type StageOptionsProps = {};

const StageOptions: FC<StageOptionsProps> = () => {
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
      <StageOptionForm />
    </AccordionMenu>
  );
};

export default StageOptions;
