import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import { FireEquipmentFormView } from './components';

type FireEquipmentProps = {
  isDeadline?: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
};

const FireEquipment: FC<FireEquipmentProps> = () => {
  return (
    <AccordionMenu
      title={'火器使用申請'}
      isEdit={false}
      isExist={false}
      required={true}
    >
      <FireEquipmentFormView />
    </AccordionMenu>
  );
};

export default FireEquipment;
