import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import RentItemsForm from '@/components/Applications/MultiItemForms/RentItems/RentItemsForm';

type RentItemsProps = {
  isDeadline: boolean | undefined;
  isRegistered: boolean | undefined;
  groupId: number;
  groupCategoryId?: number; // 追加：団体カテゴリID
};

const RentItems: FC<RentItemsProps> = ({
  isDeadline,
  isRegistered,
  groupId,
  groupCategoryId,
}) => {
  return (
    <AccordionMenu
      title="物品申請"
      isEdit={!isDeadline}
      isExist={isRegistered}
      required={true}
    >
      <RentItemsForm
        groupId={groupId}
        groupCategoryId={groupCategoryId}
        isDeadline={!isDeadline}
      />
    </AccordionMenu>
  );
};

export default RentItems;
