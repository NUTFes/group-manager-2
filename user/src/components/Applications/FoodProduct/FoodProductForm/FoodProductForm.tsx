import { FC } from 'react';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer/FormContainer';
import { useFoodProductFormHooks } from './hooks';

type FoodProductFormProps = {
  groupId: number;
  foodProducts?: any[] | null;
  toEdit: () => void;
  addFoodProducts?: (products: any[]) => void;
  removeFoodProduct?: (id: string) => void;
  setFoodProductsData?: (products: any[]) => void;
  isViewMode?: boolean;
};

const FoodProductForm: FC<FoodProductFormProps> = ({
  groupId,
  foodProducts,
  toEdit,
  addFoodProducts,
  removeFoodProduct,
  setFoodProductsData,
  isViewMode = false,
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
          <Button type="button" size="pc" color="main" onClick={toEdit}>
            + 販売品を追加
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        {foodProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  販売品名
                </h3>
                <p className="text-gray-700">{product.name}</p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  酒類ですか？
                </h3>
                <p className="text-gray-700">
                  {product.isAlcohol ? 'はい' : 'いいえ'}
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  調理の有無
                </h3>
                <p className="text-gray-700">
                  {product.hasLicense ? '有り' : '無し'}
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  1日目の販売予定数
                </h3>
                <p className="text-gray-700">{product.day1Quantity}</p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  2日目の販売予定数
                </h3>
                <p className="text-gray-700">{product.day2Quantity}</p>
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  size="pc"
                  color="alert"
                  type="button"
                  variant
                  onClick={() => {
                    if (removeFoodProduct) {
                      removeFoodProduct(product.id);
                    }
                  }}
                >
                  ✕ 削除
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center gap-4 mt-6">
          <Button type="button" size="pc" color="main" onClick={toEdit}>
            ✏ 修正
          </Button>
        </div>
      </div>
    );
  }

  // フォームモード（新規登録・編集フォーム）
  return (
    <div>
      {isFetching || isMutating ? (
        <div>loading...</div>
      ) : (
        <form
          className="w-full"
          onSubmit={handleSubmit(async (data) => {
            const success = await onSubmit(data);
            if (success) {
              toEdit();
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
                      >
                        ✕ 削除
                      </Button>
                    </div>
                  )}
                </div>
              </FormContainer>
            ))}
            <div className="flex justify-center mx-auto gap-4">
              <div className="flex w-full justify-center">
                <Button
                  size="pc"
                  color="main"
                  variant
                  type="button"
                  onClick={addProduct}
                >
                  + 販売品の追加
                </Button>
              </div>
              <div className="flex w-full items-center justify-center">
                <Button
                  size="pc"
                  color="main"
                  type="submit"
                  isDisable={isMutating}
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
