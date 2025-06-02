import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import { FireEquipmentFormView } from './components';

type FireEquipmentProps = {
  isDeadline?: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
};

const Content: FC<FireEquipmentProps> = ({ groupId }) => {
  return <FireEquipmentFormView groupId={groupId} />;
};

const FireEquipment: FC<FireEquipmentProps> = ({ groupId }) => {
  return (
    <AccordionMenu
      title={'火器使用申請'}
      isEdit={true}
      isExist={false}
      required={true}
    >
      <Content groupId={groupId} />
    </AccordionMenu>
  );
};

export default FireEquipment;
