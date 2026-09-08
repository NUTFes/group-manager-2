import { FC } from 'react';
import { StageOptionResponse } from '@/api/stageOptionApi';
import { Controller } from 'react-hook-form';
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
    control,
    errors,
    onSubmit,
    createIsMutating,
    updateIsMutating,
    convertToBoolean,
    validateEdit,
    formatRadioValue,
    stageOptionFormTexts,
  } = useStageOptionFormHooks(stageOptions, groupId);

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
          <Controller
            control={control}
            name="ownEquipment"
            render={({ field }) => (
              <Radio
                label={stageOptionFormTexts.labels[0]}
                note={stageOptionFormTexts.notes.select}
                onChange={(value) => field.onChange(convertToBoolean(value))}
                options={stageOptionFormTexts.options}
                required
                value={formatRadioValue(field.value)}
                error={errors.ownEquipment?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="bgm"
            render={({ field }) => (
              <Radio
                label={stageOptionFormTexts.labels[1]}
                note={stageOptionFormTexts.notes.select}
                onChange={(value) => field.onChange(convertToBoolean(value))}
                options={stageOptionFormTexts.options}
                required
                value={formatRadioValue(field.value)}
                error={errors.bgm?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="cameraPermission"
            render={({ field }) => (
              <Radio
                label={stageOptionFormTexts.labels[2]}
                note={stageOptionFormTexts.notes.select}
                onChange={(value) => field.onChange(convertToBoolean(value))}
                options={stageOptionFormTexts.options}
                required
                value={formatRadioValue(field.value)}
                error={errors.cameraPermission?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="loudSound"
            render={({ field }) => (
              <Radio
                label={stageOptionFormTexts.labels[3]}
                note={stageOptionFormTexts.notes.select}
                onChange={(value) => field.onChange(convertToBoolean(value))}
                options={stageOptionFormTexts.options}
                required
                value={formatRadioValue(field.value)}
                error={errors.loudSound?.message}
              />
            )}
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
              ? stageOptionFormTexts.buttons.save
              : stageOptionFormTexts.buttons.register}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default StageOptionForm;
