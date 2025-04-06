import { FC } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import snakecaseKeys from 'snakecase-keys';
import { mutate } from 'swr';
import useSWR from 'swr';
import api from '@/lib/api';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import FormContainer from '@/components/FormContainer';
import { stageOptionSchema } from './schema';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type StageOptionFormProps = {};

const options1 = [
  { id: 1, name: 'あり' },
  { id: 0, name: 'なし' },
];

const options2 = [
  { id: 1, name: 'はい' },
  { id: 0, name: 'いいえ' },
];

// FIX: group_idの取得は団体申請実装時に追加。
// NOTE: Mysqlはbooleanを整数で保存するので整数型で送信している。
type FormData = {
  groupId: number;
  ownEquipment: number;
  bgm: number;
  cameraPermission: number;
  loudSound: number;
};

const StageOptionForm: FC<StageOptionFormProps> = () => {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(stageOptionSchema),
    mode: 'onChange',
    defaultValues: {
      groupId: 3,
    },
  });

  const values = watch();

  const { data } = useSWR(`/stage_common_options/${values.groupId}`);

  // alert以外で通知したい。
  const onSubmit = async (formData: FormData) => {
    try {
      const payload = snakecaseKeys(formData, { deep: true });
      if (data) {
        await api.put('/stage_common_options', payload);
      } else {
        await api.post('/stage_common_options', payload);
      }
      mutate(`/stage_common_options/${formData.groupId}`);
      reset();
      alert('送信しました');
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
        </div>
        <div className="mt-10 flex w-full items-center justify-center">
          <Button size="pc" color="main" type="submit">
            登録
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default StageOptionForm;
