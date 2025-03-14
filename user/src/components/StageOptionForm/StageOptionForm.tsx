import { FC } from 'react';
import Radio from '@/components/Form/Radio';
import TextArea from '@/components/Form/TextArea';
import FormContainer from '@/components/FormContainer';

type StageOptionFormProps = {};

const options1 = [
  { id: '1', name: 'あり' },
  { id: '2', name: 'なし' },
];

const options2 = [
  { id: '1', name: 'はい' },
  { id: '2', name: 'いいえ' },
];

const StageOptionForm: FC<StageOptionFormProps> = () => {
  return (
    <FormContainer>
      <div className="flex flex-col space-y-10">
        <Radio
          label="電力を私用する機器を持ち込みますか"
          note="選んでください"
          onChange={() => {}}
          options={options1}
          required
          value=""
        />
        <Radio
          label="スピーカーに繋ぐ機器を持ち込みますか"
          note="選んでください"
          onChange={() => {}}
          options={options1}
          required
          value=""
        />
        <Radio
          label="実行委員が撮影することを許可しますか"
          note="選んでください"
          onChange={() => {}}
          options={options1}
          required
          value=""
        />
        <Radio
          label="大きい音を出しますか"
          note="選んでください"
          onChange={() => {}}
          options={options1}
          required
          value=""
        />
        <TextArea label="備考" onChange={() => {}} value="" />
      </div>
    </FormContainer>
  );
};

export default StageOptionForm;
