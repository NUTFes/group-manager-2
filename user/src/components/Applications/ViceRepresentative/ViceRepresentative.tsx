import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import ViceRepresentativeForm from '@/components/Applications/ViceRepresentative/ViceRepresentativeForm';

// TODO: pageからのデータはここのpropsでバケツリレーし、isEdit,isExistに入れる。
type ViceRepresentativeFormProps = {};

const ViceRepresentative: FC<ViceRepresentativeFormProps> = () => {
  return (
    <AccordionMenu
      title="副代表申請"
      isEdit={false}
      isExist={false}
      required
      note="一人での参加者の場合のみ、副代表申請は不要です。"
    >
      <ViceRepresentativeForm />
    </AccordionMenu>
  );
};

export default ViceRepresentative;
