import { FC } from 'react';
import FormList from '@/components/FormList';
import AccordionMenu from '../../AccordionMenu';
import VenueApplicationForm from './VenueApplicationForm';
import { usePlaceOrdersHooks } from './hooks';

type VenueApplicationProps = {
  isDeadline?: boolean;
  isRegistered?: boolean;
  groupId: number;
};

const VenueApplication: FC<VenueApplicationProps> = ({
  isDeadline,
  isRegistered,
  groupId,
}) => {
  return (
    <AccordionMenu
      title="会場申請"
      isEdit={!isDeadline}
      isExist={isRegistered}
      required
    >
      <Content isDeadline={isDeadline} groupId={groupId} />
    </AccordionMenu>
  );
};

const Content: FC<VenueApplicationProps> = ({ isDeadline, groupId }) => {
  const {
    placeOrder,
    isLoading,
    isEditing,
    formItem,
    handleEditClick,
    mutate,
  } = usePlaceOrdersHooks(groupId);

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
        handleEditClick={handleEditClick}
        mutate={mutate}
      />
    );
  }

  if (formItem.length > 0) {
    return <FormList items={formItem} isEdit onEdit={handleEditClick} />;
  }

  return <VenueApplicationForm groupId={groupId} mutate={mutate} />;
};
export default VenueApplication;
