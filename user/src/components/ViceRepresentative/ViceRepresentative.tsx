import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import ViceRepresentativeForm from '@/components/ViceRepresentative/ViceRepresentativeForm';


// TODO: pageからのデータはここのpropsでバケツリレーし、isEdit,isExistに入れる。
type ViceRepresentativeFormProps = {};

const ViceRepresentative: FC<ViceRepresentativeFormProps> = () => {

  return (
    <AccordionMenu
      title="副代表申請"
      isEdit={false}
      isExist={false}
      required
    >
      <ViceRepresentativeForm />
    </AccordionMenu>
  );
};

export default ViceRepresentative;