import { FC, useState } from 'react';
import { mutate } from 'swr';
import api from '@/lib/api';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import TextArea from '@/components/Form/TextArea';
import FormContainer from '@/components/FormContainer';

type StageOptionFormProps = {};

const options1 = [
  { id: 1, name: 'あり' },
  { id: 0, name: 'なし' },
];

const options2 = [
  { id: 1, name: 'はい' },
  { id: 0, name: 'いいえ' },
];

// TODO: 現状のAPIには備考欄がない。どこかのタイミングで追加。
// group_idの取得もどこかのタイミングで追加。
// NOTE: Mysqlはbooleanを整数で保存するので整数型で送信している。
type FormData = {
  groupId: number;
  ownEquipment: number;
  bgm: number;
  cameraPermission: number;
  loudSound: number;
  //   remarks: string;
};

const StageOptionForm: FC<StageOptionFormProps> = () => {
  const [formData, setFormData] = useState<FormData>({
    groupId: 1,
    ownEquipment: 99,
    bgm: 99,
    cameraPermission: 99,
    loudSound: 99,
    // remarks: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(process.env.NEXT_PUBLIC_API_URL);
      await api.post('/stage_common_options/', formData);
      mutate('/stage_common_options/');
    } catch {
      alert('送信に失敗しました。');
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col space-y-10">
          <Radio
            label="電力を使用する機器を持ち込みますか"
            note="選んでください"
            onChange={(value) =>
              setFormData({ ...formData, ownEquipment: Number(value) })
            }
            options={options1}
            required
            value={formData.ownEquipment.toString()}
          />
          <Radio
            label="スピーカーに繋ぐ機器を持ち込みますか"
            note="選んでください"
            onChange={(value) =>
              setFormData({ ...formData, bgm: Number(value) })
            }
            options={options1}
            required
            value={formData.bgm.toString()}
          />
          <Radio
            label="実行委員が撮影することを許可しますか"
            note="選んでください"
            onChange={(value) =>
              setFormData({ ...formData, cameraPermission: Number(value) })
            }
            options={options2}
            required
            value={formData.cameraPermission.toString()}
          />
          <Radio
            label="大きい音を出しますか"
            note="選んでください"
            onChange={(value) =>
              setFormData({ ...formData, loudSound: Number(value) })
            }
            options={options2}
            required
            value={formData.loudSound.toString()}
          />
          <TextArea
            label="備考"
            onChange={() => {}}
            value=""
            // onChange={(value) => setFormData({ ...formData, remarks: value })}
            // value={formData.remarks}
          />
        </div>
        <div className="w-full flex justify-center items-center">
          <Button size="pc" color="main" type="submit">
            登録
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default StageOptionForm;
