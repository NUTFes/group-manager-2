import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import RentItemsForm from '@/components/Applications/MultiItemForms/RentItems/RentItemsForm';
import { useRentItemsAccordionHooks } from '@/components/Applications/MultiItemForms/RentItems/hooks';
import { resolveApplicationAccess } from '@/components/Applications/accessControl';

type RentItemsProps = {
  canAdd?: boolean;
  canEdit?: boolean;
  isRegistered: boolean | undefined;
  groupId: number;
  groupCategoryId?: number; // 追加：団体カテゴリID
};

const RentItems: FC<RentItemsProps> = ({
  canAdd,
  canEdit,
  isRegistered,
  groupId,
  groupCategoryId,
}) => {
  const { rentItemsAccordionTexts } = useRentItemsAccordionHooks();
  const { canSubmit } = resolveApplicationAccess({
    isRegistered,
    canAdd,
    canEdit,
  });
  return (
    <AccordionMenu
      title={rentItemsAccordionTexts.title}
      isEdit={canSubmit}
      isExist={isRegistered}
      required={true}
    >
      <RentItemsForm
        groupId={groupId}
        groupCategoryId={groupCategoryId}
        isDeadline={!canSubmit}
        canAdd={!!canAdd}
      />
    </AccordionMenu>
  );
};

export default RentItems;
