import { FC } from 'react';
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
  const { values, getError, cookingProcessOrderFormTexts } =
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
        <Radio
          label={cookingProcessOrderFormTexts.fields.preOpen}
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
          label={cookingProcessOrderFormTexts.fields.duringOpen}
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
          label={cookingProcessOrderFormTexts.fields.tent}
          value={values.tent || ''}
          placeholder={cookingProcessOrderFormTexts.placeholders.tent}
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
          label={cookingProcessOrderFormTexts.fields.confirm}
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
          note={cookingProcessOrderFormTexts.notes.confirm}
          required
        />
      </div>
    </FormContainer>
  );
};

export default CookingProcessOrderForm;
