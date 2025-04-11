import { FC } from 'react';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import FormContainer from '@/components/FormContainer';
import FormList from '@/components/FormList';
import { stageOptionLabels } from '../../label';
import { useStageOptionHooks } from './hooks';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type StageOptionFormProps = {};

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
    isEditing,
    toEdit,
    formItem,
    options1,
    options2,
    convertToString,
  } = useStageOptionHooks();

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
    alert('送信に失敗しました。時間を置いて再度お試しください');
  }

  if (!isEditing) {
    return <FormList items={formItem} isEdit onEdit={toEdit} />;
  }

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col space-y-10">
          <Radio
            label={stageOptionLabels[0]}
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
            label={stageOptionLabels[1]}
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
            label={stageOptionLabels[2]}
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
            label={stageOptionLabels[3]}
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
