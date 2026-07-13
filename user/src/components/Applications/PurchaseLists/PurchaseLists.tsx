import { FC } from 'react';
import { HealthCenterSubmissionStatus } from '@/api/healthCenterSubmissionStatusApi';
import { MdOutlineAccessTime } from 'react-icons/md';
import AccordionMenu from '@/components/AccordionMenu/AccordionMenu';
import Button from '@/components/Button';
import FormList from '@/components/FormList/FormList';
import PurchaseListsForm from './PurchaseListsForm';
import {
  useFoodProducts,
  usePurchaseListRowUpdater,
  usePurchaseListsForm,
  usePurchaseListsState,
  usePurchaseListsViewTexts,
} from './hooks';
import { PurchaseItem } from './schema';

export type PurchaseListsProps = {
  isDeadline: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
  status?: HealthCenterSubmissionStatus;
};

const PurchaseLists: FC<PurchaseListsProps> = ({
  groupId,
  isDeadline,
  isRegistered: initialIsRegistered,
  status,
}) => {
  const purchaseListsViewTexts = usePurchaseListsViewTexts();
  const title = purchaseListsViewTexts.title;
  const isResubmission = status === 'waiting_resubmission';
  const canEditApplication = !isDeadline || isResubmission;

  const {
    foodProducts,
    foodProductOptions,
    isLoading: isFoodProductsLoading,
    hasError: hasFoodProductsError,
  } = useFoodProducts(groupId);

  const {
    purchaseLists,
    isLoading: isPurchaseListsLoading,
    isEditing,
    toggleEdit,
    handleDeleteItem,
    formItems,
    shopOptions,
    initialFormData,
    handleFormSuccess,
  } = usePurchaseListsState(
    foodProducts,
    foodProductOptions,
    initialIsRegistered
  );

  const { control, fields, append, remove, triggerSubmit, errors, setValue } =
    usePurchaseListsForm(groupId, initialFormData, handleFormSuccess, status);

  const updateRowBySelector = usePurchaseListRowUpdater(
    purchaseLists,
    setValue
  );

  const handleFoodProductChange = (foodProductId: number, index: number) => {
    updateRowBySelector(foodProductId, index);
  };

  if (isFoodProductsLoading || isPurchaseListsLoading) {
    return (
      <AccordionMenu
        title={title}
        required
        isEdit={canEditApplication}
        isExist={initialIsRegistered}
        status={status}
      >
        <div>{purchaseListsViewTexts.loading}</div>
      </AccordionMenu>
    );
  }

  if (hasFoodProductsError) {
    return (
      <AccordionMenu
        title={title}
        required
        isEdit={canEditApplication}
        isExist={initialIsRegistered}
        status={status}
      >
        <div className="py-10 text-center text-red-500">
          {purchaseListsViewTexts.errors.fetch}
        </div>
      </AccordionMenu>
    );
  }

  // 締め切り後で、データがない（未登録）かつ再提出でない場合
  if (
    isDeadline &&
    (!purchaseLists || purchaseLists.length === 0) &&
    status !== 'waiting_resubmission'
  ) {
    return (
      <AccordionMenu
        title={title}
        required
        isEdit={canEditApplication}
        isExist={false}
        status={status}
      >
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
            <div className="mb-4">
              <MdOutlineAccessTime className="mx-auto size-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              {purchaseListsViewTexts.deadline.title}
            </h3>
            <p className="text-sm text-gray-600">
              {purchaseListsViewTexts.deadline.description}
            </p>
          </div>
        </div>
      </AccordionMenu>
    );
  }

  //締め切り後で再提出の場合
  if (isDeadline && purchaseLists && isResubmission) {
    return (
      <AccordionMenu
        title={title}
        required
        isEdit={canEditApplication}
        isExist={true}
        status={status}
      >
        <PurchaseListsForm
          control={control}
          fields={fields}
          append={(item) => append(item as PurchaseItem)}
          remove={remove}
          onSubmit={triggerSubmit}
          errors={errors}
          foodProductOptions={foodProductOptions}
          shopOptions={shopOptions}
          onFoodProductChange={handleFoodProductChange}
        />
      </AccordionMenu>
    );
  }

  // 締め切り後で、データがある場合 (表示のみ)
  if (isDeadline && purchaseLists && purchaseLists.length > 0) {
    return (
      <AccordionMenu
        title={title}
        required
        isEdit={false}
        isExist={true}
        status={status}
      >
        {formItems.map((items, index) => (
          <div key={`purchase-list-${index}`} className="mb-4">
            <FormList items={items} />
          </div>
        ))}
      </AccordionMenu>
    );
  }

  // 編集モードまたは、まだデータがなく未締め切りの場合 (新規作成含む)
  if (isEditing || !purchaseLists || purchaseLists.length === 0) {
    return (
      <AccordionMenu
        title={title}
        required
        isEdit={canEditApplication}
        isExist={initialIsRegistered}
        status={status}
      >
        <PurchaseListsForm
          control={control}
          fields={fields}
          append={(item) => append(item as PurchaseItem)}
          remove={remove}
          onSubmit={triggerSubmit}
          errors={errors}
          foodProductOptions={foodProductOptions}
          shopOptions={shopOptions}
          onFoodProductChange={handleFoodProductChange}
        />
      </AccordionMenu>
    );
  }

  // 表示モード (データあり、未締め切り)
  return (
    <AccordionMenu
      title={title}
      required
      isEdit={canEditApplication}
      isExist={initialIsRegistered}
      status={status}
    >
      {formItems.map((items, index) => {
        const currentItem = purchaseLists?.[index];
        return (
          <div key={`purchase-list-${index}`} className="mb-4">
            <FormList
              items={items}
              onDelete={() => handleDeleteItem(currentItem?.id || 0)}
              isDelete
            />
          </div>
        );
      })}
      {!isDeadline && (
        <div className="mt-4 flex w-full items-center justify-center gap-4">
          <Button
            size="pc"
            color="main"
            type="button"
            icon="pencil"
            onClick={toggleEdit}
          >
            {purchaseListsViewTexts.buttons.edit}
          </Button>
        </div>
      )}
    </AccordionMenu>
  );
};

export default PurchaseLists;
