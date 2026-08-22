import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import CheckBox from '@/components/Form/CheckBox';
import Radio from '@/components/Form/Radio';
import TextArea from '@/components/Form/TextArea';
import FormContainer from '@/components/FormContainer';
import { useCookingProcessOrderForm } from './hooks';

type CookingProcessOrderFormProps = {
  index: number;
  foodProductName: string;
};

const CookingProcessOrderForm: FC<CookingProcessOrderFormProps> = ({
  index,
  foodProductName,
}) => {
  const { control } = useFormContext();
  const { getError, cookingProcessOrderFormTexts } =
    useCookingProcessOrderForm(index);

  // 調理場使用状況の定数
  const KITCHEN_USAGE = {
    USE: 1,
    NOT_USE: 0,
  } as const;

  const option = cookingProcessOrderFormTexts.options.kitchenUsage;
  const confirmCookingProcess =
    cookingProcessOrderFormTexts.options.confirmCookingProcess;

  return (
    <FormContainer>
      <div className="flex flex-col gap-6">
        <div>
          <div className="text-xs font-bold text-font">
            {cookingProcessOrderFormTexts.summaryLabels.foodProduct}
          </div>
          <div className="text-base text-font">{foodProductName}</div>
        </div>
        <div className="mb-[4px] flex items-center gap-6">
          <p className="text-base text-font">
            {cookingProcessOrderFormTexts.fields.kitchenUsage}
          </p>
          <p className="text-xs text-alert">
            ※{cookingProcessOrderFormTexts.general.required}
          </p>
        </div>
        <Controller
          control={control}
          name={`cookingProcessOrders.${index}.preOpenKitchen`}
          render={({ field }) => (
            <Radio
              label={cookingProcessOrderFormTexts.fields.preOpen}
              name={`cookingProcessOrders.${index}.preOpenKitchen`}
              required
              value={
                field.value
                  ? String(KITCHEN_USAGE.USE)
                  : String(KITCHEN_USAGE.NOT_USE)
              }
              onChange={(val) =>
                field.onChange(val === String(KITCHEN_USAGE.USE))
              }
              options={option}
              error={getError('preOpenKitchen')}
            />
          )}
        />
        <Controller
          control={control}
          name={`cookingProcessOrders.${index}.duringOpenKitchen`}
          render={({ field }) => (
            <Radio
              label={cookingProcessOrderFormTexts.fields.duringOpen}
              name={`cookingProcessOrders.${index}.duringOpenKitchen`}
              required
              value={
                field.value
                  ? String(KITCHEN_USAGE.USE)
                  : String(KITCHEN_USAGE.NOT_USE)
              }
              onChange={(val) =>
                field.onChange(val === String(KITCHEN_USAGE.USE))
              }
              options={option}
              error={getError('duringOpenKitchen')}
            />
          )}
        />
        <Controller
          control={control}
          name={`cookingProcessOrders.${index}.tent`}
          render={({ field }) => (
            <TextArea
              label={cookingProcessOrderFormTexts.fields.tent}
              value={field.value || ''}
              placeholder={cookingProcessOrderFormTexts.placeholders.tent}
              onChange={field.onChange}
              error={getError('tent')}
              required
            />
          )}
        />
        <Controller
          control={control}
          name={`cookingProcessOrders.${index}.confirmCookingProcess`}
          render={({ field }) => (
            <CheckBox
              label={cookingProcessOrderFormTexts.fields.confirm}
              value={field.value}
              onChange={field.onChange}
              options={confirmCookingProcess}
              error={getError('confirmCookingProcess')}
              note={cookingProcessOrderFormTexts.notes.confirm}
              required
            />
          )}
        />
      </div>
    </FormContainer>
  );
};

export default CookingProcessOrderForm;
