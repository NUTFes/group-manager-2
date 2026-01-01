import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';
import CheckBox from '../../../Form/CheckBox';
import Radio from '../../../Form/Radio';
import TextArea from '../../../Form/TextArea';
import FormContainer from '../../../FormContainer';
import { useCookingProcessOrderForm } from './hooks';

type CookingProcessOrderFormProps = {
  index: number;
  foodProductName: string;
};

const CookingProcessOrderForm: FC<CookingProcessOrderFormProps> = ({
  index,
  foodProductName,
}) => {
  const { setValue } = useFormContext();
  const { t } = useTranslation('common');
  const { values, getError } = useCookingProcessOrderForm(index);

  // 調理場使用状況の定数
  const KITCHEN_USAGE = {
    USE: 1,
    NOT_USE: 0,
  } as const;

  const option = [
    {
      id: KITCHEN_USAGE.USE,
      name: t('applications.cookingProcessOrder.options.kitchenUsage.use'),
    },
    {
      id: KITCHEN_USAGE.NOT_USE,
      name: t('applications.cookingProcessOrder.options.kitchenUsage.notUse'),
    },
  ];

  const confirmCookingProcess = (
    t('applications.cookingProcessOrder.checkbox.options', {
      returnObjects: true,
    }) as string[]
  ).map((label, idx) => ({
    id: String(idx + 1),
    name: label,
  }));

  return (
    <FormContainer>
      <div className="flex flex-col gap-6">
        <div>
          <div className="text-xs font-bold text-font">
            {t('applications.cookingProcessOrder.summary.labels.foodProduct')}
          </div>
          <div className="text-base text-font">{foodProductName}</div>
        </div>
        <div className="mb-[4px] flex items-center gap-6">
          <p className="text-base text-font">
            {t('applications.cookingProcessOrder.fields.kitchenUsage')}
          </p>
          <p className="text-xs text-alert">※{t('form.required')}</p>
        </div>
        <Radio
          label={t('applications.cookingProcessOrder.fields.preOpen')}
          name={`cookingProcessOrders.${index}.preOpenKitchen`}
          required
          value={
            values.preOpenKitchen
              ? String(KITCHEN_USAGE.USE)
              : String(KITCHEN_USAGE.NOT_USE)
          }
          onChange={(val) => {
            setValue(
              `cookingProcessOrders.${index}.preOpenKitchen`,
              val === String(KITCHEN_USAGE.USE),
              {
                shouldValidate: true,
                shouldDirty: true,
              }
            );
          }}
          options={option}
          error={getError('preOpenKitchen')}
        />
        <Radio
          label={t('applications.cookingProcessOrder.fields.duringOpen')}
          name={`cookingProcessOrders.${index}.duringOpenKitchen`}
          required
          value={
            values.duringOpenKitchen
              ? String(KITCHEN_USAGE.USE)
              : String(KITCHEN_USAGE.NOT_USE)
          }
          onChange={(val) => {
            setValue(
              `cookingProcessOrders.${index}.duringOpenKitchen`,
              val === String(KITCHEN_USAGE.USE),
              {
                shouldValidate: true,
                shouldDirty: true,
              }
            );
          }}
          options={option}
          error={getError('duringOpenKitchen')}
        />
        <TextArea
          label={t('applications.cookingProcessOrder.fields.tent')}
          value={values.tent || ''}
          placeholder={t('applications.cookingProcessOrder.placeholders.tent')}
          onChange={(val) =>
            setValue(`cookingProcessOrders.${index}.tent`, val, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          error={getError('tent')}
          required
        />
        <CheckBox
          label={t('applications.cookingProcessOrder.fields.confirm')}
          value={values.confirmCookingProcess}
          onChange={(val) => {
            setValue(
              `cookingProcessOrders.${index}.confirmCookingProcess`,
              val,
              {
                shouldValidate: true,
                shouldDirty: true,
              }
            );
          }}
          options={confirmCookingProcess}
          error={getError('confirmCookingProcess')}
          note={t('applications.cookingProcessOrder.notes.confirm')}
          required
        />
      </div>
    </FormContainer>
  );
};

export default CookingProcessOrderForm;
