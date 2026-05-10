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
  status?: string;
};

const CookingProcessOrder: FC<CookingProcessOrderProps> = ({
  isRegistered,
  groupId,
  isDeadline,
  status,
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
    cookingProcessOrderTexts,
  } = useCookingProcessOrder(groupId, isDeadline, isRegistered, status);

  return (
    <AccordionMenu
      title={cookingProcessOrderTexts.title}
      isEdit={!isDeadline}
      isExist={isRegistered}
      isRegistered={isRegistered}
      required
      status={status}
    >
      {isLoading || isEditing === null ? (
        <div>{cookingProcessOrderTexts.general.loading}</div>
      ) : shouldShowWarning ? (
        <p className="text-center text-alert">
          {cookingProcessOrderTexts.warning}
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
                      (status !== 'waiting_resubmission' && isDeadline)
                    }
                    icon={isExist ? 'save' : 'send'}
                  >
                    {isExist
                      ? cookingProcessOrderTexts.buttons.save
                      : cookingProcessOrderTexts.buttons.register}
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
                                label:
                                  cookingProcessOrderTexts.summary.labels
                                    .foodProduct,
                                content: foodProduct.name,
                              },
                              {
                                label:
                                  cookingProcessOrderTexts.summary.labels
                                    .preOpen,
                                content: cookingProcessOrder.preOpenKitchen
                                  ? cookingProcessOrderTexts.summary.status.use
                                  : cookingProcessOrderTexts.summary.status
                                      .notUse,
                              },
                              {
                                label:
                                  cookingProcessOrderTexts.summary.labels
                                    .duringOpen,
                                content: cookingProcessOrder.duringOpenKitchen
                                  ? cookingProcessOrderTexts.summary.status.use
                                  : cookingProcessOrderTexts.summary.status
                                      .notUse,
                              },
                              {
                                label:
                                  cookingProcessOrderTexts.summary.labels
                                    .description,
                                content: cookingProcessOrder.tent || '',
                              },
                            ]
                          : [
                              {
                                label:
                                  cookingProcessOrderTexts.summary.labels
                                    .foodProduct,
                                content: foodProduct.name,
                              },
                              {
                                label: cookingProcessOrderTexts.title,
                                content:
                                  cookingProcessOrderTexts.summary.status
                                    .notRegistered,
                              },
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
                  {cookingProcessOrderTexts.buttons.edit}
                </Button>
              </div>
            )}
            {status === 'waiting_resubmission' && !isEditing && isDeadline && (
              <div className="mt-4 flex w-full items-center justify-center gap-4">
                <Button
                  size="pc"
                  color="main"
                  type="button"
                  icon="pencil"
                  onClick={handleEditClick}
                >
                  {cookingProcessOrderTexts.buttons.edit}
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
