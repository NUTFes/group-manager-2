import { FC } from 'react';
import { StageOptionResponse } from '@/api/stageOptionApi';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import FormContainer from '@/components/FormContainer';
import { stageOptionLabels } from '../../label';
import { useStageOptionFormHooks } from './hooks';

type StageOptionFormProps = {
  stageOptions?: StageOptionResponse;
  toEdit?: () => void;
  groupId?: number;
};

const StageOptionForm: FC<StageOptionFormProps> = ({
  stageOptions,
  toEdit,
  groupId,
}) => {
  const {
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    createError,
    createIsMutating,
    updateError,
    updateIsMutating,
    options,
    convertToBoolean,
    validateEdit,
    formatRadioValue,
    values,
  } = useStageOptionFormHooks(stageOptions, groupId);

  if (createError || updateError) {
    toast.error('送信に失敗しました。時間を置いて再度お試しください');
  }

  return (
    <FormContainer>
      <form
        onSubmit={handleSubmit(
          async (formData) => {
            const isSuccess = await onSubmit(formData);
            if (isSuccess) {
              toEdit?.();
            }
          },
          (err) => console.table(err)
        )}
        className="w-full"
      >
        <div className="flex flex-col space-y-10">
          <Radio
            label={stageOptionLabels[0]}
            note="選んでください"
            onChange={(value) =>
              setValue('ownEquipment', convertToBoolean(value))
            }
            options={options}
            required
            value={formatRadioValue(values.ownEquipment)}
            error={errors.ownEquipment?.message}
          />
          <Radio
            label={stageOptionLabels[1]}
            note="選んでください"
            onChange={(value) => setValue('bgm', convertToBoolean(value))}
            options={options}
            required
            value={formatRadioValue(values.bgm)}
            error={errors.bgm?.message}
          />
          <Radio
            label={stageOptionLabels[2]}
            note="選んでください"
            onChange={(value) =>
              setValue('cameraPermission', convertToBoolean(value))
            }
            options={options}
            required
            value={formatRadioValue(values.cameraPermission)}
            error={errors.cameraPermission?.message}
          />
          <Radio
            label={stageOptionLabels[3]}
            note="選んでください"
            onChange={(value) => setValue('loudSound', convertToBoolean(value))}
            options={options}
            required
            value={formatRadioValue(values.loudSound)}
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
            isDisable={createIsMutating || updateIsMutating || validateEdit()}
          >
            {stageOptions ? '修正' : '登録'}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default StageOptionForm;
