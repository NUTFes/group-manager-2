import { FC } from 'react';
import { HealthCenterSubmissionStatus } from '@/api/healthCenterSubmissionStatusApi';
import AccordionMenu from '@/components/AccordionMenu';
import RentItemsForm from '@/components/Applications/MultiItemForms/RentItems/RentItemsForm';
import { useRentItemsAccordionHooks } from '@/components/Applications/MultiItemForms/RentItems/hooks';

type RentItemsProps = {
  isDeadline: boolean | undefined;
  isRegistered: boolean | undefined;
  groupId: number;
  groupCategoryId?: number; // 追加：団体カテゴリID
  status?: HealthCenterSubmissionStatus;
};

const RentItems: FC<RentItemsProps> = ({
  isDeadline,
  isRegistered,
  groupId,
  groupCategoryId,
  status,
}) => {
  const isResubmission = status === 'waiting_resubmission';
  const isEditable = !isDeadline || isResubmission;
  const { rentItemsAccordionTexts } = useRentItemsAccordionHooks(
    groupId,
    groupCategoryId,
    status
  );
  return (
    <AccordionMenu
      title={rentItemsAccordionTexts.title}
      isEdit={isEditable}
      isExist={isRegistered}
      required={true}
      status={status}
    >
      <RentItemsForm
        groupId={groupId}
        groupCategoryId={groupCategoryId}
        isEditable={isEditable}
        status={status}
      />
    </AccordionMenu>
  );
};

export default RentItems;
