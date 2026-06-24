import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import RentItemsForm from '@/components/Applications/MultiItemForms/RentItems/RentItemsForm';
import { useRentItemsAccordionHooks } from '@/components/Applications/MultiItemForms/RentItems/hooks';

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
  const { rentItemsAccordionTexts } = useRentItemsAccordionHooks();
  return (
    <AccordionMenu
      title={rentItemsAccordionTexts.title}
      isEdit={!isDeadline}
      isExist={isRegistered}
      required={true}
    >
      <RentItemsForm
        groupId={groupId}
        groupCategoryId={groupCategoryId}
        isDeadline={!!isDeadline}
      />
    </AccordionMenu>
  );
};

export default RentItems;
