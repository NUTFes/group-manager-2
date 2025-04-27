import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import RentItemsForm from '@/components/Applications/MultiItemForms/RentItems/RentItemsForm';

type RentItemsProps = {
  isEdit?: boolean;
  isExist?: boolean;
};

const RentItems: FC<RentItemsProps> = ({ isEdit = false, isExist = false }) => {
  return (
    <AccordionMenu
      title="物品申請"
      isEdit={isEdit}
      isExist={isExist}
      required={true}
    >
      <RentItemsForm />
    </AccordionMenu>
  );
};

export default RentItems;
