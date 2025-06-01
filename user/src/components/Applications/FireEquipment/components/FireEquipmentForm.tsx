import { FC, useState } from 'react';
import { FireEquipmentFuel } from '@/api/fireEquipmentApi';
import Radio from '@/components/Form/Radio/Radio';
import Selector from '@/components/Form/Selector/Selector';
import TextArea from '@/components/Form/TextArea/TextArea';
import TextBox from '@/components/Form/TextBox/TextBox';
import FormContainer from '@/components/FormContainer';

const FireEquipmentForm: FC = () => {
  const [canTakeHome, setCanTakeHome] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [equipmentName, setEquipmentName] = useState<string>('');
  const [equipmentCount, setEquipmentCount] = useState<number | ''>('');
  const [fuel, setFuel] = useState<number>(1);
  const [usage, setUsage] = useState<string>('');

  return (
    <FormContainer>
      <div className="flex flex-col">
        <div className="flex flex-col gap-10 text-[#484848]">
          <TextBox
            label="火器の名称"
            required
            value={equipmentName}
            onChange={setEquipmentName}
          />
          <TextBox
            label="火器の台数"
            required
            type="number"
            value={String(equipmentCount)}
            note="半角数字のみ"
            onChange={(e) => setEquipmentCount(e ? Number(e) : '')}
          />
          <Selector
            label="燃料"
            required
            options={[
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
            value={fuel}
            onChange={(e) => setFuel(Number(e))}
          />
          <TextArea
            label="使用用途"
            required
            value={usage}
            onChange={setUsage}
          />
          <Radio
            label="火器を毎日テントから持ち帰ることができますか？"
            options={[
              { id: 1, name: 'はい' },
              { id: 2, name: 'いいえ' },
            ]}
            value={canTakeHome}
            onChange={setCanTakeHome}
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
            value={remarks}
            onChange={setRemarks}
          />
        </div>
      </div>
    </FormContainer>
  );
};

export default FireEquipmentForm;
