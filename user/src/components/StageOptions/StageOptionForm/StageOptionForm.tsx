import { FC } from 'react';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import FormContainer from '@/components/FormContainer';
import { useStageOptionHooks } from './hooks';

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

const StageOptionForm: FC<StageOptionFormProps> = () => {
  const {
    handleSubmit,
    errors,
    stageOptions,
    isLoading,
    hasError,
    onSubmit,
    setValue,
    values,
    createError,
    createIsMutating,
    updateError,
    updateIsMutating,
  } = useStageOptionHooks();

  const convertToString = (value?: boolean): string => {
    if (value === true) return '1';
    if (value === false) return '0';
    return '';
  };

  if (isLoading || stageOptions === undefined) {
    return <div className="text-center py-10">読み込み中です...</div>;
  }

  if (hasError) {
    return (
      <div className="text-red-500 text-center py-10">
        データの取得に失敗しました。
      </div>
    );
  }

  if (createError || updateError) {
    alert('送信に失敗しました。時間を追いて再度お試しください');
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
            value={
              values.ownEquipment !== undefined
                ? values.ownEquipment.toString()
                : convertToString(stageOptions?.ownEquipment)
            }
            error={errors.ownEquipment?.message}
          />
          <Radio
            label="スピーカーに繋ぐ機器を持ち込みますか"
            note="選んでください"
            onChange={(value) => setValue('bgm', Number(value))}
            options={options1}
            required
            value={
              values.bgm !== undefined
                ? values.bgm.toString()
                : convertToString(stageOptions?.bgm)
            }
            error={errors.bgm?.message}
          />
          <Radio
            label="実行委員が撮影することを許可しますか"
            note="選んでください"
            onChange={(value) => setValue('cameraPermission', Number(value))}
            options={options2}
            required
            value={
              values.cameraPermission !== undefined
                ? values.cameraPermission.toString()
                : convertToString(stageOptions?.cameraPermission)
            }
            error={errors.cameraPermission?.message}
          />
          <Radio
            label="大きい音を出しますか"
            note="選んでください"
            onChange={(value) => setValue('loudSound', Number(value))}
            options={options2}
            required
            value={
              values.loudSound !== undefined
                ? values.loudSound.toString()
                : convertToString(stageOptions?.loudSound)
            }
            error={errors.loudSound?.message}
          />
        </div>
        <div className="w-full flex justify-center items-center mt-10">
          <Button
            size="pc"
            color="main"
            type="submit"
            isDisable={isLoading || createIsMutating || updateIsMutating}
          >
            登録
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default StageOptionForm;
