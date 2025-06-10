import { FC } from 'react';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer/FormContainer';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';
import { useFoodProductFormHooks } from './hooks';
import { ProductInput, RegisteredProduct } from './schema';
import { KeyedMutator } from 'swr';
import { ApiResponse } from '@/api/api';

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
  mutateCheckAllRegisteredGroups?: KeyedMutator<ApiResponse<RegistrationStatus>>;
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
    setValue,
    isFetching,
    isMutating,
    handleAlcoholChange,
    handleHasLicenseChange,
    alcoholOptions,
    licenseOptions,
    onSubmit,
    addProduct,
    removeProduct,
    products,
  } = useFoodProductFormHooks(
      groupId,
      foodProducts,
      addFoodProducts,
      setFoodProductsData
  );

  // ビューモード（登録済みデータをカード表示）
  if (isViewMode) {
    if (!foodProducts || foodProducts.length === 0) {
      return (
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-500">販売品が登録されていません</p>
            <Button
                type="button"
                size="pc"
                color="main"
                onClick={toEdit}
                icon="plus"
            >
              販売品を追加
            </Button>
          </div>
      );
    }

    return (
        <div className="flex flex-col gap-6">
          {foodProducts.map((product) => {
            const items: FormItem[] = [
              { label: '販売品名', content: product.name ?? '-' },
              {
                label: '酒類ですか？',
                content: product.isAlcohol ? 'はい' : 'いいえ',
              },
              {
                label: '調理の有無',
                content: product.hasLicense ? '有り' : '無し',
              },
              {
                label: '1日目の販売予定数',
                content: product.day1Quantity || '0',
              },
              {
                label: '2日目の販売予定数',
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

          <div className="mt-6 flex justify-center">
            <Button
                type="button"
                size="pc"
                color="main"
                onClick={toEdit}
                icon="edit"
            >
              修正
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
              <span className="ml-2">処理中...</span>
            </div>
        ) : (
            <form
                className="w-full"
                onSubmit={handleSubmit(async (data) => {
                  try {
                    const success = await onSubmit(data);
                    if (success) {
                      toEdit();
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
                {products.map((product, index) => (
                    <FormContainer key={index}>
                      <div className="flex w-full flex-col items-start justify-center gap-6">
                        <div className="relative w-96">
                          <TextBox
                              label="販売品名"
                              value={product.name || ''}
                              onChange={(value) =>
                                  setValue(`products.${index}.name`, value)
                              }
                              required
                              error={errors.products?.[index]?.name?.message}
                          />
                        </div>
                        <div className="flex flex-col items-start justify-start gap-6">
                          <Radio
                              label="酒類ですか？"
                              name={`alcohol_${index}`}
                              value={product.isAlcohol ? '1' : '0'}
                              onChange={(value) => handleAlcoholChange(index, value)}
                              required
                              note="「はい」を選択すると、自動的に「調理あり」になります。"
                              options={alcoholOptions}
                              error={errors.products?.[index]?.isAlcohol?.message}
                          />
                        </div>
                        <div className="flex flex-col items-start justify-start gap-6">
                          <Radio
                              label="調理の有無"
                              name={`license_${index}`}
                              value={product.hasLicense ? '1' : '0'}
                              onChange={(value) => handleHasLicenseChange(index, value)}
                              required
                              options={licenseOptions}
                              error={errors.products?.[index]?.hasLicense?.message}
                          />
                        </div>
                        <div className="relative w-96">
                          <TextBox
                              label="1日目販売予定数"
                              value={product.day1Quantity || ''}
                              onChange={(value) =>
                                  setValue(`products.${index}.day1Quantity`, value)
                              }
                              required
                              note="半角数字"
                              error={errors.products?.[index]?.day1Quantity?.message}
                              type="number"
                          />
                        </div>
                        <div className="relative w-96">
                          <TextBox
                              label="2日目販売予定数"
                              value={product.day2Quantity || ''}
                              onChange={(value) =>
                                  setValue(`products.${index}.day2Quantity`, value)
                              }
                              required
                              note="半角数字"
                              error={errors.products?.[index]?.day2Quantity?.message}
                              type="number"
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
                                削除
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
                      販売品の追加
                    </Button>
                  </div>
                  <div className="flex w-full items-center justify-center">
                    <Button
                        size="pc"
                        color="main"
                        type="submit"
                        isDisable={isMutating}
                        icon={
                          foodProducts && foodProducts.length > 0 ? 'save' : 'send'
                        }
                    >
                      {foodProducts && foodProducts.length > 0 ? '更新' : '登録'}
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