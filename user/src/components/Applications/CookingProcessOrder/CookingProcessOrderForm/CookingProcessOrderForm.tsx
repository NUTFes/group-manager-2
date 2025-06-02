import { FC } from 'react';
import Selector from '@/components/Form/Selector';
import Button from '../../../Button';
import CheckBox from '../../../Form/CheckBox';
import Radio from '../../../Form/Radio';
import TextArea from '../../../Form/TextArea';
import FormContainer from '../../../FormContainer';
import { useCookingProcessOrderForm } from './hooks';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type CookingProcessOrderFormProps = {};

const CookingProcessOrderForm: FC<CookingProcessOrderFormProps> = ({}) => {
  const {
    handleSubmit,
    setValue,
    errors,
    onSubmit,
    values,
    confirmCookingProcessValues,
    handleConfirmCookingProcessChange,
  } = useCookingProcessOrderForm();

  const option = [
    { id: 1, name: '使用する' },
    { id: 0, name: '使用しない' },
  ];

  const confirmCookingProcess = [
    {
      id: '1',
      name: '衛生管理のため工程をできるだけ詳しく記載しました',
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Selector
          label="販売品名"
          value={'テスト'}
          options={[
            { id: 1, name: 'テスト' },
            { id: 2, name: 'テスト２' },
          ]}
          onChange={() => {}}
        />
        <div className="mb-[4px] flex items-center gap-6">
          <p className="text-base text-font">調理場の仕様有無</p>
          <p className="text-xs text-alert">※必須</p>
        </div>
        <Radio
          label="(営業前)"
          required
          value={values.preOpenKitchen ? '1' : '0'}
          onChange={(val) => setValue('preOpenKitchen', val === '1')}
          options={option}
          error={errors.preOpenKitchen?.message}
        />
        <Radio
          label="(営業中)"
          required
          value={values.duringOpenKitchen ? '1' : '0'}
          onChange={(val) => setValue('duringOpenKitchen', val === '1')}
          options={option}
          error={errors.duringOpenKitchen?.message}
        />
        <TextArea
          label="調理内容"
          value={
            values.tent
              ? values.tent
              : '例）\n1. コーヒー豆を15g測る\n2. 入れる\n3. 温める\n4. 皿に乗せる'
          }
          onChange={(val) => setValue('tent', val)}
          error={errors.tent?.message}
          note="注意書き"
          required
        />
        <CheckBox
          label="調理工程確認事項"
          value={confirmCookingProcessValues}
          onChange={handleConfirmCookingProcessChange}
          options={confirmCookingProcess}
          note="確認事項にチェックを入れてください"
        />
        <Button type="submit" size="pc" color="main" isDisable={false}>
          登録
        </Button>
      </form>
    </FormContainer>
  );
};

export default CookingProcessOrderForm;
