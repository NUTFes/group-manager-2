import { FC, useState } from 'react';
import AccordionMenu from '@/components/AccordionMenu/AccordionMenu';
import PublicRelationsForm from '@/components/PublicRelations/PublicRelationsForm/PublicRelationsForm';

type PublicRelationsProps = {
  groupId: number;
};

const PublicRelations: FC<PublicRelationsProps> = ({ groupId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AccordionMenu
      title="PR文申請"
      isEdit={true}
      isExist={false}
      required
      isOpen={isOpen}
      onToggle={handleToggle}
      onSubmit={() => {}}
    >
      <PublicRelationsForm groupId={groupId} />
    </AccordionMenu>
  );
};

export default PublicRelations;
