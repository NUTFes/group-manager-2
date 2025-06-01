import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import { FireEquipmentFormView } from './components';

type FireEquipmentProps = {
  isDeadline?: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
};

const Content: FC = () => {
  return <FireEquipmentFormView />;
};

const FireEquipment: FC<FireEquipmentProps> = () => {
  return (
    <AccordionMenu
      title={'火器使用申請'}
      isEdit={true}
      isExist={false}
      required={true}
    >
      <Content />
    </AccordionMenu>
  );
};

export default FireEquipment;
