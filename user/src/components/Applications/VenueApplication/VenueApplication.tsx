import { FC } from 'react';
import FormList from '@/components/FormList';
import AccordionMenu from '../../AccordionMenu';
import VenueApplicationForm from './VenueApplicationForm';
import { usePlaceOrdersHooks } from './hooks';

type VenueApplicationProps = { isDeadline?: boolean };

const VenueApplication: FC<VenueApplicationProps> = ({ isDeadline }) => {
  return (
    <AccordionMenu title="会場申請" isEdit={false} isExist={false} required>
      <Content isDeadline={isDeadline} />
    </AccordionMenu>
  );
};

const Content: FC<VenueApplicationProps> = ({ isDeadline }) => {
  const groupId: number = 1; // TODO: ログイン時に取得したgroupIDを使う
  const { placeOrder, isLoading, isEditing, formItem, handleEditClick } =
    usePlaceOrdersHooks(groupId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isDeadline) {
    return <FormList items={formItem} />;
  }

  if (isEditing) {
    return (
      <VenueApplicationForm
        groupId={groupId}
        placeOrder={placeOrder}
        toEdit={handleEditClick}
      />
    );
  }

  if (formItem.length > 0) {
    return <FormList items={formItem} isEdit onEdit={handleEditClick} />;
  }

  return <VenueApplicationForm groupId={groupId} />;
};
export default VenueApplication;
