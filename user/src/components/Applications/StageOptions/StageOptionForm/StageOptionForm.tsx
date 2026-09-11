import { FC } from 'react';
import { StageOptionResponse } from '@/api/stageOptionApi';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import FormContainer from '@/components/FormContainer';
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
    convertToBoolean,
    validateEdit,
    formatRadioValue,
    values,
    stageOptionFormTexts,
  } = useStageOptionFormHooks(stageOptions, groupId);

  if (createError || updateError) {
    toast.error(stageOptionFormTexts.messages.submitFailed);
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
            label={stageOptionFormTexts.labels[0]}
            note={stageOptionFormTexts.notes.select}
            onChange={(value) =>
              setValue('ownEquipment', convertToBoolean(value))
            }
            options={stageOptionFormTexts.options}
            required
            value={formatRadioValue(values.ownEquipment)}
            error={errors.ownEquipment?.message}
          />
          <Radio
            label={stageOptionFormTexts.labels[1]}
            note={stageOptionFormTexts.notes.select}
            onChange={(value) => setValue('bgm', convertToBoolean(value))}
            options={stageOptionFormTexts.options}
            required
            value={formatRadioValue(values.bgm)}
            error={errors.bgm?.message}
          />
          <Radio
            label={stageOptionFormTexts.labels[2]}
            note={stageOptionFormTexts.notes.select}
            onChange={(value) =>
              setValue('cameraPermission', convertToBoolean(value))
            }
            options={stageOptionFormTexts.options}
            required
            value={formatRadioValue(values.cameraPermission)}
            error={errors.cameraPermission?.message}
          />
          <Radio
            label={stageOptionFormTexts.labels[3]}
            note={stageOptionFormTexts.notes.select}
            onChange={(value) => setValue('loudSound', convertToBoolean(value))}
            options={stageOptionFormTexts.options}
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
                {stageOptionFormTexts.buttons.cancel}
              </Button>
            </div>
          )}
          <Button
            size="pc"
            color="main"
            type="submit"
            isDisable={createIsMutating || updateIsMutating || validateEdit()}
          >
            {stageOptions
              ? stageOptionFormTexts.buttons.edit
              : stageOptionFormTexts.buttons.register}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default StageOptionForm;
