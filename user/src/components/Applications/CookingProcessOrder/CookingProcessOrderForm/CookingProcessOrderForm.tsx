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
  const { values, getError } = useCookingProcessOrderForm(index);

  const option = [
    { id: 1, name: '使用する' },
    { id: 0, name: '使用しない' },
  ];

  const confirmCookingProcess = [
    {
      id: '1',
      name: '衛生管理の工程をできるだけ詳しく記載しました',
    },
    {
      id: '2',
      name: '最終的に加熱して提供するか確認しました',
    },
    {
      id: '3',
      name: 'お酒の調理工程も提出しました',
    },
  ];

  return (
    <FormContainer>
      <div className="flex flex-col gap-6">
        <div>
          <div className="text-xs font-bold text-font">販売品名</div>
          <div className="text-base text-font">{foodProductName}</div>
        </div>
        <div className="mb-[4px] flex items-center gap-6">
          <p className="text-base text-font">調理場の仕様有無</p>
          <p className="text-xs text-alert">※必須</p>
        </div>
        <Radio
          label="(営業前)"
          required
          value={values.preOpenKitchen ? '1' : '0'}
          onChange={(val) => {
            setValue(
              `cookingProcessOrders.${index}.preOpenKitchen`,
              val === '1',
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
          label="(営業中)"
          required
          value={values.duringOpenKitchen ? '1' : '0'}
          onChange={(val) => {
            setValue(
              `cookingProcessOrders.${index}.duringOpenKitchen`,
              val === '1',
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
          label="調理内容"
          value={values.tent || ''}
          placeholder={
            '例）\n1. コーヒー豆を15g測る\n2. 入れる\n3. 温める\n4. 皿に乗せる'
          }
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
          label="調理工程確認事項"
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
          note="確認事項にチェックを入れてください"
          required
        />
      </div>
    </FormContainer>
  );
};

export default CookingProcessOrderForm;
