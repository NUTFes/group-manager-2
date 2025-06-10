import { FC } from 'react';
import { ApiResponse } from '@/api/api';
import { KeyedMutator } from 'swr';
import AccordionMenu from '@/components/AccordionMenu/AccordionMenu';
import FoodProductForm from '@/components/Applications/FoodProduct/FoodProductForm/FoodProductForm';
import {
  ProductInput,
  RegisteredProduct,
} from '@/components/Applications/FoodProduct/FoodProductForm/schema';
import { useFoodProductHooks } from '@/components/Applications/FoodProduct/hooks';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';

// checkAllRegisteredGroupsの型定義
type RegistrationStatus = {
  group?: boolean;
  subRep?: boolean;
  foodProduct?: boolean;
  // 他のフィールド...
};

type FoodProductProps = {
  groupId: number;
  isDeadline: boolean | undefined;
  isRegistered: boolean | undefined;
  mutateCheckAllRegisteredGroups?: KeyedMutator<
    ApiResponse<RegistrationStatus>
  >;
};

type ContentProps = {
  isLoading: boolean;
  hasError: boolean;
  isDeadline: boolean | undefined;
  isEditing: boolean;
  toEdit: () => void;
  foodProducts: RegisteredProduct[] | null;
  formItem: FormItem[];
  groupId: number;
  addFoodProducts: (products: ProductInput[]) => Promise<void>;
  removeFoodProduct: (id: string) => Promise<void>;
  setFoodProductsData: (products: ProductInput[]) => Promise<void>;
  mutateCheckAllRegisteredGroups?: KeyedMutator<
    ApiResponse<RegistrationStatus>
  >;
};

const Content: FC<ContentProps> = ({
  isLoading,
  hasError,
  isDeadline,
  isEditing,
  toEdit,
  foodProducts,
  formItem,
  groupId,
  addFoodProducts,
  removeFoodProduct,
  setFoodProductsData,
  mutateCheckAllRegisteredGroups,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="size-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="py-10 text-center text-red-500">
        データの取得に失敗しました。
      </div>
    );
  }

  if (isDeadline) {
    return <FormList items={formItem} />;
  }

  if (isEditing) {
    return (
      <FoodProductForm
        groupId={groupId}
        toEdit={toEdit}
        foodProducts={foodProducts}
        addFoodProducts={addFoodProducts}
        removeFoodProduct={removeFoodProduct}
        setFoodProductsData={setFoodProductsData}
        mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
      />
    );
  }

  return (
    <FoodProductForm
      groupId={groupId}
      toEdit={toEdit}
      foodProducts={foodProducts}
      addFoodProducts={addFoodProducts}
      removeFoodProduct={removeFoodProduct}
      setFoodProductsData={setFoodProductsData}
      mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
      isViewMode={true}
    />
  );
};

const FoodProduct: FC<FoodProductProps> = ({
  groupId,
  isDeadline,
  isRegistered,
  mutateCheckAllRegisteredGroups,
}) => {
  const {
    formItem,
    isEditing,
    toEdit,
    foodProducts,
    isLoading,
    hasError,
    addFoodProducts,
    removeFoodProduct,
    setFoodProductsData,
  } = useFoodProductHooks(groupId, mutateCheckAllRegisteredGroups);

  return (
    <AccordionMenu
      title="販売品申請"
      isEdit={!isDeadline}
      isExist={isRegistered}
      required
    >
      <Content
        isLoading={isLoading}
        hasError={hasError}
        isDeadline={isDeadline}
        isEditing={isEditing}
        toEdit={toEdit}
        foodProducts={foodProducts}
        formItem={formItem}
        groupId={groupId}
        addFoodProducts={addFoodProducts}
        removeFoodProduct={removeFoodProduct}
        setFoodProductsData={setFoodProductsData}
        mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
      />
    </AccordionMenu>
  );
};

export default FoodProduct;
