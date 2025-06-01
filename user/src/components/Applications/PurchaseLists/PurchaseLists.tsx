import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu/AccordionMenu';
import {
  PurchaseListsDeadlineView,
  PurchaseListsFormView,
  PurchaseListsSummaryView,
} from './components';
import { usePurchaseListsApplication, usePurchaseListsDisplay } from './hooks';

type PurchaseListsProps = {
  isDeadline?: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
};

const PurchaseLists: FC<PurchaseListsProps> = ({
  isDeadline = false,
  isRegistered,
  groupId,
}) => {
  const {
    state,
    hasExisting,
    purchaseLists,
    purchaseListsForm,
    handleFormSubmit,
    handleDeleteItem,
    prepareFormForEditing,
    foodProductOptions,
  } = usePurchaseListsApplication(groupId);

  const { isEditing } = state;
  const { fields, addItem, removeItem, isValid, formMethods } =
    purchaseListsForm;

  const { mode } = usePurchaseListsDisplay({
    hasExisting: hasExisting || false,
    isEditing,
    isDeadline,
  });

  let content;
  switch (mode) {
    case 'summary':
      content = (
        <PurchaseListsSummaryView
          purchaseLists={purchaseLists}
          onEdit={prepareFormForEditing}
          onDeleteItem={handleDeleteItem}
          isDeadline={isDeadline}
          foodProductOptions={foodProductOptions}
        />
      );
      break;
    case 'deadline-unregistered':
      content = <PurchaseListsDeadlineView />;
      break;
    case 'form':
    default:
      content = (
        <PurchaseListsFormView
          formMethods={formMethods}
          fields={fields}
          onRemove={removeItem}
          onAddItem={addItem}
          isValid={isValid}
          onSubmit={handleFormSubmit}
          foodProductOptions={foodProductOptions}
        />
      );
  }

  return (
    <AccordionMenu
      title={'購入品申請'}
      isEdit={!isDeadline}
      isExist={isRegistered === true}
      required={true}
    >
      {content}
    </AccordionMenu>
  );
};

export default PurchaseLists;
