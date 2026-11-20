import { useTranslation } from 'next-i18next';
import { useFormContext, useWatch } from 'react-hook-form';

export const useCookingProcessOrderForm = (index: number) => {
  const { t } = useTranslation('common');
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const values = useWatch({
    control,
    name: `cookingProcessOrders.${index}`,
  });

  const kitchenUsageOptions = [
    {
      id: 1,
      name: t('applications.cookingProcessOrder.options.kitchenUsage.use'),
    },
    {
      id: 0,
      name: t('applications.cookingProcessOrder.options.kitchenUsage.notUse'),
    },
  ];

  const confirmCookingProcessOptions = (
    t('applications.cookingProcessOrder.checkbox.options', {
      returnObjects: true,
    }) as string[]
  ).map((label, idx) => ({
    id: String(idx + 1),
    name: label,
  }));

  const cookingProcessOrderFormTexts = {
    summaryLabels: {
      foodProduct: t(
        'applications.cookingProcessOrder.summary.labels.foodProduct'
      ),
    },
    fields: {
      kitchenUsage: t('applications.cookingProcessOrder.fields.kitchenUsage'),
      preOpen: t('applications.cookingProcessOrder.fields.preOpen'),
      duringOpen: t('applications.cookingProcessOrder.fields.duringOpen'),
      tent: t('applications.cookingProcessOrder.fields.tent'),
      confirm: t('applications.cookingProcessOrder.fields.confirm'),
    },
    general: {
      required: t('form.required'),
    },
    placeholders: {
      tent: t('applications.cookingProcessOrder.placeholders.tent'),
    },
    options: {
      kitchenUsage: kitchenUsageOptions,
      confirmCookingProcess: confirmCookingProcessOptions,
    },
    notes: {
      confirm: t('applications.cookingProcessOrder.notes.confirm'),
    },
  };

  const getError = (fieldName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldErrors = errors.cookingProcessOrders as any;
    return fieldErrors?.[index]?.[fieldName]?.message as string | undefined;
  };

  return {
    values,
    getError,
    cookingProcessOrderFormTexts,
  };
};
