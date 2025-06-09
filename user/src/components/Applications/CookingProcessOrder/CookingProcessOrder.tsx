import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import FormList from '@/components/FormList';
import CookingProcessOrderForm from './CookingProcessOrderForm';
import { useCookingProcessOrder } from './hooks';

type CookingProcessOrderProps = {
  isEdit: boolean;
  groupId: number;
};

const CookingProcessOrder: FC<CookingProcessOrderProps> = ({
  isEdit,
  groupId,
}) => {
  const {
    cookingProcessOrder,
    isLoading,
    isExist,
    isEditing,
    handleEditClick,
    mutateCookingProcessOrders,
    formItems,
  } = useCookingProcessOrder(groupId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const onSuccess = () => {
    mutateCookingProcessOrders();
    handleEditClick();
  };

  return (
    <AccordionMenu
      title="調理工程申請"
      note="販売品申請を先に申請してください。"
      isEdit={isEdit}
      isExist={isExist}
      required
    >
      {isEditing ? (
        <CookingProcessOrderForm
          groupId={groupId}
          onSuccess={onSuccess}
          defaultValues={cookingProcessOrder}
        />
      ) : (
        <FormList items={formItems} isEdit={isEdit} onEdit={handleEditClick} />
      )}
    </AccordionMenu>
  );
};

export default CookingProcessOrder;
