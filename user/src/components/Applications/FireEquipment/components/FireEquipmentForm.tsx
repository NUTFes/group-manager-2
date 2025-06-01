import { FC } from 'react';
import { FireEquipmentFuel } from '@/api/fireEquipmentApi';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';
import Radio from '@/components/Form/Radio/Radio';
import Selector from '@/components/Form/Selector/Selector';
import TextArea from '@/components/Form/TextArea/TextArea';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer';
import { convertToBoolToString } from './hooks';
import { FireEquipmentSchemaForm } from './schema';

type FireEquipmentFormProps = {
  values: FireEquipmentSchemaForm;
  errors: FieldErrors<FireEquipmentSchemaForm>;
  setValue: UseFormSetValue<FireEquipmentSchemaForm>;
};

const FireEquipmentForm: FC<FireEquipmentFormProps> = ({
  values,
  errors,
  setValue,
}) => {
  return (
    <FormContainer>
      <div className="flex flex-col">
        <div className="flex flex-col gap-10 text-[#484848]">
          <TextBox
            label="火器の名称"
            required
            value={values.name}
            onChange={(value) => setValue('name', value)}
            error={errors.name?.message}
          />
          <TextBox
            label="火器の台数"
            required
            type="number"
            value={values.quantity.toString()}
            note="半角数字のみ"
            onChange={(value) => setValue('quantity', Number(value))}
            error={errors.quantity?.message}
          />
          <Selector
            label="燃料"
            required
            options={[
              {
                id: 0,
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
            label="使用用途"
            required
            value={values.usage}
            onChange={(value) => setValue('usage', value)}
            error={errors.usage?.message}
          />
          <Radio
            label="火器を毎日テントから持ち帰ることができますか？"
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
          <p className="max-w-[400px] break-words text-xs text-sub">
            火器は毎日持って帰ることができない場合を除き、基本的に持ち帰ってください。
            <br />
            火器はテント内に残す行為は火事の原因になります。
          </p>
          <p className="max-w-[400px] break-words text-xs text-sub">
            いいえを押した場合は火器の備考欄に理由を記載して下さい。
          </p>
          <TextArea
            label="備考"
            // 「火器を毎日テントから持ち帰ることができますか？」の質問で必須にするかしないか判定する
            required
            requireMessage="いいえを押した場合必須"
            value={values.remarks || ''}
            onChange={(value) => setValue('remarks', value)}
            error={errors.remarks?.message}
          />
        </div>
      </div>
    </FormContainer>
  );
};

export default FireEquipmentForm;
