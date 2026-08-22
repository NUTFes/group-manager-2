import { FC } from 'react';
import { ApiResponse } from '@/api/api';
import { Controller } from 'react-hook-form';
import { KeyedMutator } from 'swr';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import TextBox from '@/components/Form/TextBox';
import FormContainer from '@/components/FormContainer';
import FormList from '@/components/FormList';
import { FormItem } from '@/components/FormList/type';
import { useFoodProductFormHooks } from './hooks';
import { ProductInput, RegisteredProduct } from './schema';

// checkAllRegisteredGroupsの型定義
type RegistrationStatus = {
  group?: boolean;
  subRep?: boolean;
  foodProduct?: boolean;
  rentalItem?: boolean;
  powerOrder?: boolean;
  publicRelation?: boolean;
  placeOrder?: boolean;
  stageOrder?: boolean;
  stageOption?: boolean;
};

type FoodProductFormProps = {
  groupId: number;
  foodProducts?: RegisteredProduct[] | null;
  toEdit: () => void;
  addFoodProducts?: (products: ProductInput[]) => Promise<void>;
  removeFoodProduct?: (id: string) => Promise<void>;
  setFoodProductsData?: (products: ProductInput[]) => Promise<void>;
  isViewMode?: boolean;
  mutateCheckAllRegisteredGroups?: KeyedMutator<
    ApiResponse<RegistrationStatus>
  >;
};

const FoodProductForm: FC<FoodProductFormProps> = ({
  groupId,
  foodProducts,
  toEdit,
  addFoodProducts,
  removeFoodProduct,
  setFoodProductsData,
  isViewMode = false,
  mutateCheckAllRegisteredGroups,
}) => {
  const {
    handleSubmit,
    errors,
    control,
    isFetching,
    isMutating,
    applyAlcoholSideEffect,
    onSubmit,
    addProduct,
    removeProduct,
    validateEdit,
    products,
    foodProductFormTexts,
  } = useFoodProductFormHooks(
    groupId,
    foodProducts,
    addFoodProducts,
    setFoodProductsData
  );
  const alcoholRadioOptions = foodProductFormTexts.form.radio.alcohol.options;
  const cookingRadioOptions = foodProductFormTexts.form.radio.cooking.options;

  // ビューモード（登録済みデータをカード表示）
  if (isViewMode) {
    if (!foodProducts || foodProducts.length === 0) {
      return (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-500">{foodProductFormTexts.view.empty}</p>
          <Button
            type="button"
            size="pc"
            color="main"
            onClick={toEdit}
            icon="plus"
          >
            {foodProductFormTexts.view.addButton}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        {foodProducts.map((product) => {
          const items: FormItem[] = [
            {
              label: foodProductFormTexts.view.summaryLabels.name,
              content: product.name ?? '-',
            },
            {
              label: foodProductFormTexts.view.summaryLabels.alcohol,
              content: product.isAlcohol
                ? foodProductFormTexts.view.radio.alcohol.yes
                : foodProductFormTexts.view.radio.alcohol.no,
            },
            {
              label: foodProductFormTexts.view.summaryLabels.cooking,
              content: product.isCooking
                ? foodProductFormTexts.view.radio.cooking.yes
                : foodProductFormTexts.view.radio.cooking.no,
            },
            {
              label: foodProductFormTexts.view.summaryLabels.day1,
              content: product.day1Quantity || '0',
            },
            {
              label: foodProductFormTexts.view.summaryLabels.day2,
              content: product.day2Quantity || '0',
            },
          ];

          return (
            <div key={product.id} className="mb-4">
              <FormList
                items={items}
                isDelete={!!removeFoodProduct}
                onDelete={
                  removeFoodProduct
                    ? () => removeFoodProduct(product.id)
                    : undefined
                }
              />
            </div>
          );
        })}

        <div className="mt-4 flex w-full items-center justify-center gap-4">
          <Button
            size="pc"
            color="main"
            type="button"
            icon="pencil"
            onClick={toEdit}
          >
            {foodProductFormTexts.buttons.edit}
          </Button>
        </div>
      </div>
    );
  }

  // フォームモード（新規登録・編集フォーム）
  return (
    <div>
      {isFetching || isMutating ? (
        <div className="flex items-center justify-center py-8">
          <div className="size-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <span className="ml-2">
            {foodProductFormTexts.statuses.processing}
          </span>
        </div>
      ) : (
        <form
          className="w-full"
          onSubmit={handleSubmit(async (data) => {
            try {
              const success = await onSubmit(data);
              if (success) {
                // checkAllRegisteredGroupsを更新
                if (mutateCheckAllRegisteredGroups) {
                  await mutateCheckAllRegisteredGroups();
                }
              }
            } catch (error) {
              console.error('Form submission error:', error);
              // エラーは各API関数内でトーストで表示されるため、ここでは特に何もしない
            }
          })}
        >
          <div className="flex w-full flex-col items-start justify-center gap-10">
            {products.map((_, index) => (
              <FormContainer key={index}>
                <div className="flex w-full flex-col items-start justify-center gap-6">
                  <div className="relative w-96">
                    <Controller
                      control={control}
                      name={`products.${index}.name` as const}
                      render={({ field }) => (
                        <TextBox
                          label={foodProductFormTexts.form.fields.name}
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          required
                          error={errors.products?.[index]?.name?.message}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col items-start justify-start gap-6">
                    <Controller
                      control={control}
                      name={`products.${index}.isAlcohol` as const}
                      render={({ field }) => (
                        <Radio
                          label={foodProductFormTexts.form.radio.alcohol.label}
                          name={`alcohol_${index}`}
                          value={field.value ? '1' : '0'}
                          onChange={(value) => {
                            const isAlcohol = parseInt(value) === 1;
                            field.onChange(isAlcohol);
                            applyAlcoholSideEffect(index, isAlcohol);
                          }}
                          required
                          note={foodProductFormTexts.form.radio.alcohol.note}
                          options={alcoholRadioOptions}
                          error={errors.products?.[index]?.isAlcohol?.message}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col items-start justify-start gap-6">
                    <Controller
                      control={control}
                      name={`products.${index}.isCooking` as const}
                      render={({ field }) => (
                        <Radio
                          label={foodProductFormTexts.form.radio.cooking.label}
                          name={`license_${index}`}
                          value={field.value ? '1' : '0'}
                          onChange={(value) =>
                            field.onChange(parseInt(value) === 1)
                          }
                          required
                          options={cookingRadioOptions}
                          error={errors.products?.[index]?.isCooking?.message}
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-96">
                    <Controller
                      control={control}
                      name={`products.${index}.day1Quantity` as const}
                      render={({ field }) => (
                        <TextBox
                          label={foodProductFormTexts.form.fields.day1}
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          required
                          note={foodProductFormTexts.form.notes.quantity}
                          error={
                            errors.products?.[index]?.day1Quantity?.message
                          }
                          type="number"
                        />
                      )}
                    />
                  </div>
                  <div className="relative w-96">
                    <Controller
                      control={control}
                      name={`products.${index}.day2Quantity` as const}
                      render={({ field }) => (
                        <TextBox
                          label={foodProductFormTexts.form.fields.day2}
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          required
                          note={foodProductFormTexts.form.notes.quantity}
                          error={
                            errors.products?.[index]?.day2Quantity?.message
                          }
                          type="number"
                        />
                      )}
                    />
                  </div>
                  {products.length > 1 && (
                    <div className="flex w-full justify-center">
                      <Button
                        size="pc"
                        color="alert"
                        variant
                        type="button"
                        onClick={() => removeProduct(index)}
                        icon="delete"
                      >
                        {foodProductFormTexts.buttons.delete}
                      </Button>
                    </div>
                  )}
                </div>
              </FormContainer>
            ))}
            <div className="mx-auto flex justify-center gap-4">
              <div className="flex w-full justify-center">
                <Button
                  size="pc"
                  color="main"
                  variant
                  type="button"
                  onClick={addProduct}
                  icon="plus"
                >
                  {foodProductFormTexts.buttons.add}
                </Button>
              </div>
              <div className="flex w-full items-center justify-center">
                <Button
                  size="pc"
                  color="main"
                  type="submit"
                  isDisable={isMutating || validateEdit()}
                  icon={
                    foodProducts && foodProducts.length > 0 ? 'save' : 'send'
                  }
                >
                  {foodProducts && foodProducts.length > 0
                    ? foodProductFormTexts.buttons.save
                    : foodProductFormTexts.buttons.register}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default FoodProductForm;
