import { FC } from 'react';
import FormList from '@/components/FormList';
import AccordionMenu from '../../AccordionMenu';
import VenueApplicationForm from './VenueApplicationForm';
import { useVenueApplicationHooks } from './hooks';

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
  const venueApplicationHooks = useVenueApplicationHooks(groupId);

  return (
    <AccordionMenu
      title={venueApplicationHooks.venueApplicationTexts.title}
      isEdit={!isDeadline}
      isExist={isRegistered}
      required
    >
      <Content
        isDeadline={isDeadline}
        groupId={groupId}
        venueApplicationHooks={venueApplicationHooks}
      />
    </AccordionMenu>
  );
};

type ContentProps = {
  isDeadline?: boolean;
  groupId: number;
  venueApplicationHooks: ReturnType<typeof useVenueApplicationHooks>;
};

const Content: FC<ContentProps> = ({
  isDeadline,
  groupId,
  venueApplicationHooks,
}) => {
  const {
    placeOrder,
    isLoading,
    isEditing,
    formItem,
    handleEditClick,
    placeOrderMutate,
    venueApplicationTexts,
  } = venueApplicationHooks;

  if (isLoading) {
    return <div>{venueApplicationTexts.loading}</div>;
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
        placeOrderMutate={placeOrderMutate}
      />
    );
  }

  if (formItem.length > 0) {
    return <FormList items={formItem} isEdit onEdit={handleEditClick} />;
  }

  return (
    <VenueApplicationForm
      groupId={groupId}
      placeOrderMutate={placeOrderMutate}
    />
  );
};
export default VenueApplication;
