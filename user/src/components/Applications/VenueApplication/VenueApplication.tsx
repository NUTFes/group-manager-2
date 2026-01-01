import { FC } from 'react';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation('common');

  return (
    <AccordionMenu
      title={t('applications.venue.title')}
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
    placeOrderMutate,
  } = usePlaceOrdersHooks(groupId);
  const { t } = useTranslation('common');

  if (isLoading) {
    return <div>{t('applications.venue.loading')}</div>;
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
