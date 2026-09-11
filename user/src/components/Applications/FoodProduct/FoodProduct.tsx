import { FC } from 'react';
import {
  HealthCenterSubmissionStatus,
  canEditApplication,
} from '@/api/healthCenterSubmissionStatusApi';
import { MdOutlineAccessTime } from 'react-icons/md';
import AccordionMenu from '@/components/AccordionMenu/AccordionMenu';
import FoodProductForm from '@/components/Applications/FoodProduct/FoodProductForm/FoodProductForm';
import {
  ProductInput,
  RegisteredProduct,
} from '@/components/Applications/FoodProduct/FoodProductForm/schema';
import { useFoodProductHooks } from '@/components/Applications/FoodProduct/hooks';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';

type FoodProductProps = {
  groupId: number;
  isDeadline: boolean | undefined;
  isRegistered: boolean | undefined;
  status?: HealthCenterSubmissionStatus;
};
type ContentProps = {
  isLoading: boolean;
  hasError: boolean;
  isDeadline: boolean | undefined;
  isEditing: boolean | null;
  toEdit: () => void;
  foodProducts: RegisteredProduct[] | null;
  formItem: FormItem[];
  groupId: number;
  isResubmission: boolean;
  addFoodProducts: (products: ProductInput[]) => Promise<void>;
  removeFoodProduct: (id: string) => Promise<void>;
  setFoodProductsData: (products: ProductInput[]) => Promise<void>;
  foodProductViewTexts: ReturnType<
    typeof useFoodProductHooks
  >['foodProductViewTexts'];
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
  foodProductViewTexts,
  isResubmission,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="size-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
        <span className="ml-2">{foodProductViewTexts.loading}</span>
      </div>
    );
  }

  if (isEditing === null) {
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
        {foodProductViewTexts.errors.fetch}
      </div>
    );
  }

  if (isResubmission) {
    return (
      <FoodProductForm
        groupId={groupId}
        toEdit={toEdit}
        foodProducts={foodProducts}
        addFoodProducts={addFoodProducts}
        removeFoodProduct={removeFoodProduct}
        setFoodProductsData={setFoodProductsData}
      />
    );
  }

  // 締め切り後で、かつデータがない（未登録）場合
  if (isDeadline && (!foodProducts || foodProducts.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
          <div className="mb-4">
            <MdOutlineAccessTime className="mx-auto size-12 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            {foodProductViewTexts.deadline.title}
          </h3>
          <p className="text-sm text-gray-600">
            {foodProductViewTexts.deadline.description}
          </p>
        </div>
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
      isViewMode={true}
    />
  );
};

const FoodProduct: FC<FoodProductProps> = ({
  groupId,
  isDeadline,
  isRegistered,
  status,
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
    foodProductViewTexts,
    isResubmission,
  } = useFoodProductHooks(groupId, isRegistered, status);
  const isApplicationEditable = canEditApplication(isDeadline, status);

  return (
    <AccordionMenu
      title={foodProductViewTexts.title}
      isEdit={isApplicationEditable}
      isExist={!!foodProducts && foodProducts.length > 0}
      required
      status={status}
    >
      <Content
        isLoading={isLoading}
        hasError={hasError}
        isDeadline={isDeadline}
        isEditing={isEditing}
        toEdit={toEdit}
        isResubmission={isResubmission}
        foodProducts={foodProducts}
        formItem={formItem}
        groupId={groupId}
        addFoodProducts={addFoodProducts}
        removeFoodProduct={removeFoodProduct}
        setFoodProductsData={setFoodProductsData}
        foodProductViewTexts={foodProductViewTexts}
      />
    </AccordionMenu>
  );
};

export default FoodProduct;
