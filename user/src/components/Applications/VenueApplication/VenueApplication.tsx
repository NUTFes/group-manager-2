import { FC } from 'react';
import { Loading } from '@/icons/Icons';
import FormList from '@/components/FormList';
import AccordionMenu from '../../AccordionMenu';
import VenueApplicationForm from './VenueApplicationForm';
import { usePlaceOrdersHooks } from './hooks';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type VenueApplicationProps = {};

const VenueApplication: FC<VenueApplicationProps> = () => {
  return (
    <AccordionMenu title="会場申請" isEdit={false} isExist={false} required>
      <Content />
    </AccordionMenu>
  );
};

const Content: FC = () => {
  const groupId: number = 1; // TODO: ログイン時に取得したgroupIDを使う
  const { placeOrder, isLoading, isEditing, formItem, handleEditClick } =
    usePlaceOrdersHooks(groupId);
  if (isLoading) {
    return <Loading colorClass="black" />;
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
