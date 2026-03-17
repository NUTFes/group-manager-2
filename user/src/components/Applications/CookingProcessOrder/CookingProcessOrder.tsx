import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import AccordionMenu from '@/components/AccordionMenu';
import Button from '@/components/Button';
import FormList from '@/components/FormList';
import CookingProcessOrderForm from './CookingProcessOrderForm';
import { useCookingProcessOrder } from './hooks';

type CookingProcessOrderProps = {
  isRegistered: boolean | undefined;
  groupId: number;
  isDeadline: boolean;
};

const CookingProcessOrder: FC<CookingProcessOrderProps> = ({
  isRegistered,
  groupId,
  isDeadline,
}) => {
  const {
    methods,
    fields,
    isLoading,
    isMutating,
    isEditing,
    isExist,
    handleEditClick,
    onSubmit,
    mergedData,
    shouldShowWarning,
  } = useCookingProcessOrder(groupId, isDeadline, isRegistered);

  return (
    <AccordionMenu
      title="調理工程申請"
      isEdit={!isDeadline}
      isExist={isRegistered}
      isRegistered={isRegistered}
      required
    >
      {isLoading || isEditing === null ? (
        <div>Loading...</div>
      ) : shouldShowWarning ? (
        <p className="text-center text-alert">
          販売品申請を先に申請してください
        </p>
      ) : (
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
                      isMutating ||
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
                                label: '調理場の使用有無(営業前)',
                                content: cookingProcessOrder.preOpenKitchen
                                  ? '使用する'
                                  : '使用しない',
                              },
                              {
                                label: '調理場の使用有無(営業中)',
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
              <div className="mt-4 flex w-full items-center justify-center gap-4">
                <Button
                  size="pc"
                  color="main"
                  type="button"
                  icon="pencil"
                  onClick={handleEditClick}
                >
                  修正
                </Button>
              </div>
            )}
          </form>
        </FormProvider>
      )}
    </AccordionMenu>
  );
};

export default CookingProcessOrder;
