import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import AccordionMenu from '@/components/AccordionMenu';
import Button from '@/components/Button';
import FormList from '@/components/FormList';
import CookingProcessOrderForm from './CookingProcessOrderForm';
import { useCookingProcessOrder } from './hooks';

type CookingProcessOrderProps = {
  isEdit: boolean;
  isRegistered: boolean | undefined;
  groupId: number;
  isDeadline: boolean;
};

const CookingProcessOrder: FC<CookingProcessOrderProps> = ({
  isEdit,
  isRegistered,
  groupId,
  isDeadline,
}) => {
  const {
    methods,
    fields,
    isLoading,
    isEditing,
    isExist,
    handleEditClick,
    onSubmit,
    mergedData,
  } = useCookingProcessOrder(groupId, isDeadline);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AccordionMenu
      title="調理工程申請"
      isEdit={isEdit}
      isExist={isExist}
      isRegistered={isRegistered}
      required
    >
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          {isEditing ? (
            <>
              {fields.map((field, index) => (
                <div key={field.id} className="mb-8">
                  <CookingProcessOrderForm
                    index={index}
                    foodProductName={field.foodProductName}
                  />
                </div>
              ))}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  size="pc"
                  color="main"
                  isDisable={
                    !methods.formState.isValid ||
                    methods.formState.isSubmitting ||
                    isDeadline
                  }
                  icon={isExist ? 'save' : 'send'}
                >
                  {isExist ? '更新' : '登録'}
                </Button>
              </div>
            </>
          ) : (
            <>
              {mergedData.map(({ foodProduct, cookingProcessOrder }) => (
                <div key={foodProduct.id} className="mb-8">
                  <FormList
                    items={
                      cookingProcessOrder
                        ? [
                            {
                              label: '販売品名',
                              content: foodProduct.name,
                            },
                            {
                              label: '調理場の仕様有無(営業前)',
                              content: cookingProcessOrder.preOpenKitchen
                                ? '使用する'
                                : '使用しない',
                            },
                            {
                              label: '調理場の仕様有無(営業中)',
                              content: cookingProcessOrder.duringOpenKitchen
                                ? '使用する'
                                : '使用しない',
                            },
                            {
                              label: '調理内容',
                              content: cookingProcessOrder.tent || '',
                            },
                          ]
                        : [
                            {
                              label: '販売品名',
                              content: foodProduct.name,
                            },
                            { label: '調理工程', content: '未登録' },
                          ]
                    }
                  />
                </div>
              ))}
            </>
          )}
          {!isEditing && isExist && !isDeadline && (
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={handleEditClick}
                size="pc"
                color="main"
              >
                修正
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </AccordionMenu>
  );
};

export default CookingProcessOrder;
