import { FC } from 'react';
import { FireEquipmentFuel } from '@/api/fireEquipmentApi';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio/Radio';
import Selector from '@/components/Form/Selector/Selector';
import TextArea from '@/components/Form/TextArea/TextArea';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer';
import { useFireEquipmentTexts } from '../constant';
import { convertToBoolToString } from './hooks';
import { FireEquipmentFormValues } from './schema';

type FireEquipmentFormProps = {
  values: FireEquipmentFormValues;
  errors: FieldErrors<FireEquipmentFormValues>;
  setValue: UseFormSetValue<FireEquipmentFormValues>;
  isEditing: boolean;
  handleEditCancel?: () => void;
  validate?: () => boolean;
  submitLabel?: string;
};

const FireEquipmentForm: FC<FireEquipmentFormProps> = ({
  values,
  errors,
  setValue,
  isEditing,
  handleEditCancel,
  validate,
  submitLabel,
}) => {
  const fireEquipmentTexts = useFireEquipmentTexts();

  return (
    <FormContainer>
      <div className="flex flex-col">
        <div className="flex flex-col gap-10 text-[#484848]">
          <TextBox
            label={fireEquipmentTexts.fields.name}
            required
            value={values.name}
            onChange={(value) => setValue('name', value)}
            error={errors.name?.message}
          />
          <TextBox
            label={fireEquipmentTexts.fields.quantity}
            required
            type="number"
            value={values.quantity.toString()}
            note={fireEquipmentTexts.notes.quantity}
            onChange={(value) => setValue('quantity', Number(value))}
            error={errors.quantity?.message}
          />
          <Selector
            label={fireEquipmentTexts.fields.fuel}
            required
            options={fireEquipmentTexts.fuelOptions}
            value={values.fuel}
            onChange={(value) =>
              setValue('fuel', Number(value) as FireEquipmentFuel)
            }
            error={errors.fuel?.message}
          />
          <TextArea
            label={fireEquipmentTexts.fields.usage}
            required
            value={values.usage}
            onChange={(value) => setValue('usage', value)}
            error={errors.usage?.message}
          />
          <Radio
            label={fireEquipmentTexts.fields.isTakeaway}
            options={[
              { id: 1, name: fireEquipmentTexts.radio.options.yes },
              { id: 2, name: fireEquipmentTexts.radio.options.no },
            ]}
            value={convertToBoolToString(values.isTakeaway)}
            onChange={(value) => {
              setValue('isTakeaway', value === '1');
            }}
            required
            error={errors.isTakeaway?.message}
          />
          <p className="-mt-10 max-w-[400px] break-words text-xs text-[#484848]">
            {fireEquipmentTexts.notes.takeaway
              .split('\n')
              .map((line, index) => (
                <span key={index}>
                  {line}
                  {index === 0 && <br />}
                </span>
              ))}
          </p>
          <p className="max-w-[400px] break-words text-xs text-[#484848]">
            {fireEquipmentTexts.notes.remark}
          </p>
          <TextArea
            label={fireEquipmentTexts.fields.remark}
            // 「火気を毎日テントから持ち帰ることができますか？」の質問で必須にするかしないか判定する
            required
            requireMessage={fireEquipmentTexts.notes.remarkRequired}
            value={values.remarks || ''}
            onChange={(value) => setValue('remarks', value)}
            error={errors.remarks?.message}
          />
        </div>
        <div className="mt-10 flex w-full items-center justify-center">
          {isEditing && (
            <div className="mr-4">
              <Button
                size="pc"
                color="main"
                variant
                type="button"
                onClick={handleEditCancel}
              >
                {fireEquipmentTexts.buttons.cancel}
              </Button>
            </div>
          )}
          <Button
            size="pc"
            color="main"
            type="submit"
            isDisable={validate && validate()}
          >
            {isEditing
              ? fireEquipmentTexts.buttons.edit
              : (submitLabel ?? fireEquipmentTexts.buttons.register)}
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default FireEquipmentForm;
