import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu/AccordionMenu';
import Button from '@/components/Button';
import FormList from '@/components/FormList/FormList';
import PurchaseListsForm from './PurchaseListsForm';
import {
  useFoodProducts,
  usePurchaseListRowUpdater,
  usePurchaseListsForm,
  usePurchaseListsState,
} from './hooks';
import { PurchaseItem } from './schema';

export type PurchaseListsProps = {
  isDeadline: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
};

const PurchaseLists: FC<PurchaseListsProps> = ({
  groupId,
  isDeadline,
  isRegistered: initialIsRegistered,
}) => {
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
    usePurchaseListsForm(groupId, initialFormData, handleFormSuccess);

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
        title="購入品申請"
        required
        isEdit={!isDeadline}
        isExist={initialIsRegistered}
      >
        <div>Loading...</div>
      </AccordionMenu>
    );
  }

  if (hasFoodProductsError) {
    return (
      <AccordionMenu
        title="購入品申請"
        required
        isEdit={!isDeadline}
        isExist={initialIsRegistered}
      >
        <div className="py-10 text-center text-red-500">
          データの取得に失敗しました。
        </div>
      </AccordionMenu>
    );
  }

  // 締め切り後で、かつデータがない（未登録）場合
  if (isDeadline && (!purchaseLists || purchaseLists.length === 0)) {
    return (
      <AccordionMenu title="購入品申請" required isEdit={false} isExist={false}>
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
            <div className="mb-4">
              <svg
                className="mx-auto size-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              申請期限が過ぎています
            </h3>
            <p className="text-sm text-gray-600">
              購入品申請の締切期限が過ぎているため、新規申請はできません。
            </p>
          </div>
        </div>
      </AccordionMenu>
    );
  }

  // 締め切り後で、データがある場合 (表示のみ)
  if (isDeadline && purchaseLists && purchaseLists.length > 0) {
    return (
      <AccordionMenu title="購入品申請" required isEdit={false} isExist={true}>
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
        title="購入品申請"
        required
        isEdit={!isDeadline}
        isExist={initialIsRegistered}
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
      title="購入品申請"
      required
      isEdit={!isDeadline}
      isExist={initialIsRegistered}
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
            修正
          </Button>
        </div>
      )}
    </AccordionMenu>
  );
};

export default PurchaseLists;
