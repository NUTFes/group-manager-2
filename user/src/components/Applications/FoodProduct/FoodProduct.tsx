import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu/AccordionMenu';
import FoodProductForm from '@/components/Applications/FoodProduct/FoodProductForm/FoodProductForm';
import { useFoodProductHooks } from '@/components/Applications/FoodProduct/hooks';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';
import { RegisteredProduct, ProductInput } from '@/components/Applications/FoodProduct/FoodProductForm/schema';

type FoodProductProps = {
  groupId: number;
  isDeadline: boolean | undefined;
  isRegistered: boolean | undefined;
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
  addFoodProducts: (products: ProductInput[]) => void;
  removeFoodProduct: (id: string) => void;
  setFoodProductsData: (products: ProductInput[]) => void;
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
                                   }) => {
  if (isLoading) {
    return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
  } = useFoodProductHooks();

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
        />
      </AccordionMenu>
  );
};

export default FoodProduct;