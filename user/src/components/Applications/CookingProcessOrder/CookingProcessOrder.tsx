import { FC } from 'react';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation('common');
  const {
    methods,
    fields,
    isLoading,
    isEditing,
    isExist,
    handleEditClick,
    onSubmit,
    mergedData,
    shouldShowWarning,
  } = useCookingProcessOrder(groupId, isDeadline);

  if (isLoading) {
    return <div>{t('general.loading')}</div>;
  }

  return (
    <AccordionMenu
      title={t('applications.cookingProcessOrder.title')}
      isEdit={!isDeadline}
      isExist={isRegistered}
      isRegistered={isRegistered}
      required
    >
      {shouldShowWarning ? (
        <p className="text-center text-alert">
          {t('applications.cookingProcessOrder.warning')}
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
                      isDeadline
                    }
                    icon={isExist ? 'save' : 'send'}
                  >
                    {isExist
                      ? t('form.actions.save')
                      : t('form.actions.register')}
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
                                label: t(
                                  'applications.cookingProcessOrder.summary.labels.foodProduct'
                                ),
                                content: foodProduct.name,
                              },
                              {
                                label: t(
                                  'applications.cookingProcessOrder.summary.labels.preOpen'
                                ),
                                content: cookingProcessOrder.preOpenKitchen
                                  ? t(
                                      'applications.cookingProcessOrder.summary.status.use'
                                    )
                                  : t(
                                      'applications.cookingProcessOrder.summary.status.notUse'
                                    ),
                              },
                              {
                                label: t(
                                  'applications.cookingProcessOrder.summary.labels.duringOpen'
                                ),
                                content: cookingProcessOrder.duringOpenKitchen
                                  ? t(
                                      'applications.cookingProcessOrder.summary.status.use'
                                    )
                                  : t(
                                      'applications.cookingProcessOrder.summary.status.notUse'
                                    ),
                              },
                              {
                                label: t(
                                  'applications.cookingProcessOrder.summary.labels.description'
                                ),
                                content: cookingProcessOrder.tent || '',
                              },
                            ]
                          : [
                              {
                                label: t(
                                  'applications.cookingProcessOrder.summary.labels.foodProduct'
                                ),
                                content: foodProduct.name,
                              },
                              {
                                label: t(
                                  'applications.cookingProcessOrder.title'
                                ),
                                content: t(
                                  'applications.cookingProcessOrder.summary.status.notRegistered'
                                ),
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
                  {t('form.actions.edit')}
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
