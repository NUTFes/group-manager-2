import { FC } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import api from '@/lib/api';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import TextArea from '@/components/Form/TextArea';
import FormContainer from '@/components/FormContainer';
import { stageOptionSchema } from './schema';

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
  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(stageOptionSchema),
    mode: 'onChange',
    defaultValues: {
      groupId: 1,
    },
  });

  const values = watch();

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/stage_common_options/', data);
      mutate('/stage_common_options/');
      alert('送信しました');
      reset();
    } catch {
      alert('送信に失敗しました。');
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col space-y-10">
          <Radio
            label="電力を使用する機器を持ち込みますか"
            note="選んでください"
            onChange={(value) => setValue('ownEquipment', Number(value))}
            options={options1}
            required
            value={values.ownEquipment?.toString() || ''}
            error={errors.ownEquipment?.message}
          />
          <Radio
            label="スピーカーに繋ぐ機器を持ち込みますか"
            note="選んでください"
            onChange={(value) => setValue('bgm', Number(value))}
            options={options1}
            required
            value={values.bgm?.toString() || ''}
            error={errors.bgm?.message}
          />
          <Radio
            label="実行委員が撮影することを許可しますか"
            note="選んでください"
            onChange={(value) => setValue('cameraPermission', Number(value))}
            options={options2}
            required
            value={values.cameraPermission?.toString() || ''}
            error={errors.cameraPermission?.message}
          />
          <Radio
            label="大きい音を出しますか"
            note="選んでください"
            onChange={(value) => setValue('loudSound', Number(value))}
            options={options2}
            required
            value={values.loudSound?.toString() || ''}
            error={errors.loudSound?.message}
          />
          <TextArea label="備考" onChange={() => {}} value="" />
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
