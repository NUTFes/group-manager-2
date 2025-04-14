import { FC } from 'react';
import { toast } from 'react-toastify';
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
    options,
    convertToString,
    userPageSettingIsLoading,
    userPageSettingHasError,
    userPageSettings,
    validateEdit,
  } = useStageOptionHooks();

  if (isLoading || stageOptions === undefined || userPageSettingIsLoading) {
    return <div className="py-10 text-center">読み込み中です...</div>;
  }

  if (hasError || userPageSettingHasError) {
    return (
      <div className="py-10 text-center text-red-500">
        データの取得に失敗しました。
      </div>
    );
  }

  if (createError || updateError) {
    toast.error('送信に失敗しました。時間を置いて再度お試しください');
  }

  // Fix: accordionから取ってきてpropsで渡した方がapi叩かれる回数が一度で良くなる。
  // useUserPageSettingsを使って、userPageSettingsの値を取得する。trueなら編集可能
  if (userPageSettings?.is_edit_stage_common_option) {
    if (!isEditing) {
      return <FormList items={formItem} isEdit onEdit={toEdit} />;
    }
  } else {
    return <FormList items={formItem} />;
  }

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col space-y-10">
          <Radio
            label={stageOptionLabels[0]}
            note="選んでください"
            onChange={(value) => setValue('ownEquipment', Number(value))}
            options={options}
            required
            value={
              values.ownEquipment === undefined
                ? stageOptions?.ownEquipment != null
                  ? convertToString(stageOptions.ownEquipment)
                  : ''
                : values.ownEquipment.toString()
            }
            error={errors.ownEquipment?.message}
          />
          <Radio
            label={stageOptionLabels[1]}
            note="選んでください"
            onChange={(value) => setValue('bgm', Number(value))}
            options={options}
            required
            value={
              values.bgm === undefined
                ? stageOptions?.bgm != null
                  ? convertToString(stageOptions.bgm)
                  : ''
                : values.bgm.toString()
            }
            error={errors.bgm?.message}
          />
          <Radio
            label={stageOptionLabels[2]}
            note="選んでください"
            onChange={(value) => setValue('cameraPermission', Number(value))}
            options={options}
            required
            value={
              values.cameraPermission === undefined
                ? stageOptions?.cameraPermission != null
                  ? convertToString(stageOptions.cameraPermission)
                  : ''
                : values.cameraPermission.toString()
            }
            error={errors.cameraPermission?.message}
          />
          <Radio
            label={stageOptionLabels[3]}
            note="選んでください"
            onChange={(value) => setValue('loudSound', Number(value))}
            options={options}
            required
            value={
              values.loudSound === undefined
                ? stageOptions?.loudSound != null
                  ? convertToString(stageOptions.loudSound)
                  : ''
                : values.loudSound.toString()
            }
            error={errors.loudSound?.message}
          />
        </div>
        <div className="mt-10 flex w-full items-center justify-center">
          {stageOptions && (
            <div className="mr-4">
              <Button
                size="pc"
                color="main"
                variant
                type="button"
                onClick={toEdit}
              >
                キャンセル
              </Button>
            </div>
          )}
          <Button
            size="pc"
            color="main"
            type="submit"
            isDisable={
              isLoading ||
              createIsMutating ||
              updateIsMutating ||
              validateEdit()
            }
          >
            登録
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default StageOptionForm;
