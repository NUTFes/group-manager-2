import { FC, useState } from 'react';
import AccordionMenu from '../AccordionMenu';
import GroupApplicationForm from './GroupApplicationForm';

type GroupApplicationProps = {};

const GroupApplication: FC<GroupApplicationProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <AccordionMenu
      title="団体申請"
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      isEdit={true}
      isExist={false}
      required={true}
      onSubmit={() => {}}
    >
      <GroupApplicationForm />
    </AccordionMenu>
  );
};

export default GroupApplication;
