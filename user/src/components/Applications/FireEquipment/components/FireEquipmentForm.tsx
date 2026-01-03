import { FC } from 'react';
import { FireEquipmentFuel } from '@/api/fireEquipmentApi';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio/Radio';
import Selector from '@/components/Form/Selector/Selector';
import TextArea from '@/components/Form/TextArea/TextArea';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer';
import {
  fireEquipmentFormFields,
  FIRE_EQUIPMENT_INSTRUCTIONS,
  FIRE_EQUIPMENT_FUEL_PLACEHOLDER_ID,
} from '../constant';
import { convertToBoolToString } from './hooks';
import { FireEquipmentFormValues } from './schema';

type FireEquipmentFormProps = {
  values: FireEquipmentFormValues;
  errors: FieldErrors<FireEquipmentFormValues>;
  setValue: UseFormSetValue<FireEquipmentFormValues>;
  isEditing: boolean;
  handleEditCancel?: () => void;
  validate?: () => boolean;
};

const FireEquipmentForm: FC<FireEquipmentFormProps> = ({
  values,
  errors,
  setValue,
  isEditing,
  handleEditCancel,
  validate,
}) => {
  return (
    <FormContainer>
      <div className="flex flex-col">
        <div className="flex flex-col gap-10 text-[#484848]">
          <TextBox
            label={fireEquipmentFormFields.NAME}
            required
            value={values.name}
            onChange={(value) => setValue('name', value)}
            error={errors.name?.message}
          />
          <TextBox
            label={fireEquipmentFormFields.QUANTITY}
            required
            type="number"
            value={values.quantity.toString()}
            note="半角数字のみ"
            onChange={(value) => setValue('quantity', Number(value))}
            error={errors.quantity?.message}
          />
          <Selector
            label={fireEquipmentFormFields.FUEL}
            required
            options={[
              {
                id: FIRE_EQUIPMENT_FUEL_PLACEHOLDER_ID,
                name: '選択してください',
                disabled: true,
              },
              {
                id: Number(FireEquipmentFuel.GAS_BOTTLE),
                name: 'カセットガス',
                disabled: false,
              },
              {
                id: Number(FireEquipmentFuel.LP_GAS),
                name: 'LPガス',
                disabled: false,
              },
              {
                id: Number(FireEquipmentFuel.CHARCOAL),
                name: '炭',
                disabled: false,
              },
            ]}
            value={values.fuel}
            onChange={(value) =>
              setValue('fuel', Number(value) as FireEquipmentFuel)
            }
            error={errors.fuel?.message}
          />
          <TextArea
            label={fireEquipmentFormFields.USAGE}
            required
            value={values.usage}
            onChange={(value) => setValue('usage', value)}
            error={errors.usage?.message}
          />
          <Radio
            label={fireEquipmentFormFields.IS_TAKEAWAY}
            options={[
              { id: 1, name: 'はい' },
              { id: 2, name: 'いいえ' },
            ]}
            value={convertToBoolToString(values.isTakeaway)}
            onChange={(value) => {
              setValue('isTakeaway', value === '1');
            }}
            required
            error={errors.isTakeaway?.message}
          />
          <p className="-mt-10 max-w-[400px] break-words text-xs text-[#484848]">
            {FIRE_EQUIPMENT_INSTRUCTIONS.TAKEAWAY_NOTICE.split('\n').map(
                (line, index) => (
                    <span key={index}>
                {line}
                      {index === 0 && <br />}
              </span>
                )
            )}
          </p>
          <p className="max-w-[400px] break-words text-xs text-[#484848]">
            {FIRE_EQUIPMENT_INSTRUCTIONS.REMARK_NOTICE}
          </p>
          <TextArea
            label={fireEquipmentFormFields.REMARK}
            // 「火気を毎日テントから持ち帰ることができますか？」の質問で必須にするかしないか判定する
            required
            requireMessage="いいえを押した場合必須"
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
                キャンセル
              </Button>
            </div>
          )}
          <Button
            size="pc"
            color="main"
            type="submit"
            isDisable={validate && validate()}
          >
            {isEditing ? '修正' : '登録'}
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default FireEquipmentForm;