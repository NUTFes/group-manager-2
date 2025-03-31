import { FC } from 'react';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import FormContainer from '@/components/FormContainer';
import { useStageOptionHooks } from './hooks';

type StageOptionFormProps = {};

const options1 = [
  { id: 1, name: 'あり' },
  { id: 0, name: 'なし' },
];

const options2 = [
  { id: 1, name: 'はい' },
  { id: 0, name: 'いいえ' },
];

const StageOptionForm: FC<StageOptionFormProps> = () => {
  const {
    handleSubmit,
    errors,
    isMutating,
    stageOptions,
    isLoading,
    hasError,
    onSubmit,
    setValue,
    values,
  } = useStageOptionHooks();

  if (isLoading || isMutating) {
    return;
  }

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
            value={values.ownEquipment?.toString() || ``}
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
        <div className="w-full flex justify-center items-center mt-10">
          <Button
            size="pc"
            color="main"
            type="submit"
            isDisable={isLoading || isMutating}
          >
            登録
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default StageOptionForm;
