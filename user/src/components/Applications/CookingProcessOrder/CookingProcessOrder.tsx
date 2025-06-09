import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import CookingProcessOrderForm from './CookingProcessOrderForm';

type CookingProcessOrderFormProps = {
  isEdit: boolean;
  isExist: boolean;
};

const CookingProcessOrder: FC<CookingProcessOrderFormProps> = ({
  isEdit,
  isExist,
}) => {
  return (
    <AccordionMenu
      title="調理工程申請"
      note="販売品申請を先に申請してください。"
      isEdit={isEdit}
      isExist={isExist}
      required
    >
      <CookingProcessOrderForm />
    </AccordionMenu>
  );
};

export default CookingProcessOrder;
