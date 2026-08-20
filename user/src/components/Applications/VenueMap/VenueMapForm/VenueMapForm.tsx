import { FC } from 'react';
import { VenueMapResponse } from '@/api/venueMapApi';
import Button from '@/components/Button';
import Checkbox from '@/components/Form/CheckBox';
import FormContainer from '@/components/FormContainer';
import ImagePreview from '@/components/ImagePreview';
import Upload from '@/components/Upload';
import { useVenueMapFormHooks } from './hooks';

type VenueMapFormProps = {
  groupId: number;
  venueMap?: VenueMapResponse | null;
  toEdit?: () => void;
  onSubmitted?: () => void;
};

const VenueMapForm: FC<VenueMapFormProps> = ({
  groupId,
  venueMap,
  toEdit,
  onSubmitted,
}) => {
  const venueMapFormHooks = useVenueMapFormHooks(
    groupId,
    venueMap,
    onSubmitted
  );
  const {
    handleSubmit,
    errors,
    values,
    setValue,
    fileName,
    previewUrl,
    isFetching,
    isMutating,
    handleImageUpload,
    onSubmit,
    isDirty,
    venueMapFormTexts,
  } = venueMapFormHooks;

  const displayPreviewUrl = previewUrl ?? venueMap?.picturePath ?? null;
  const displayPreviewAlt =
    fileName ?? venueMap?.pictureName ?? venueMapFormTexts.fields.picture;

  return (
    <FormContainer>
      {isFetching ? (
        <div>{venueMapFormTexts.general.loading}</div>
      ) : (
        <form
          className="flex w-full flex-col gap-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* 模擬店平面図画像 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-4">
              <div className="text-base font-medium text-font">
                {venueMapFormTexts.fields.picture}
              </div>
              <div className="text-xs font-light text-alert">
                ※{venueMapFormTexts.general.required}
              </div>
            </div>
            <Upload
              title=""
              note={venueMapFormTexts.upload.notes}
              onClick={handleImageUpload}
              idDisable={isMutating}
              error={errors.image?.message as string | undefined}
            />
            {fileName && (
              <div className="mt-2 text-sm text-font">
                {venueMapFormTexts.upload.uploaded(fileName)}
              </div>
            )}
            <ImagePreview
              src={displayPreviewUrl}
              alt={displayPreviewAlt}
              thumbnailClassName="mt-2 h-48 w-full"
            />
          </div>

          {/* 平面図確認事項 */}
          <Checkbox
            label={venueMapFormTexts.fields.checklist}
            options={venueMapFormTexts.checklist.options}
            value={values.checklist || []}
            onChange={(newValues) =>
              setValue('checklist', newValues, { shouldDirty: true })
            }
            error={errors.checklist?.message as string | undefined}
            note={venueMapFormTexts.checklist.note}
            required
          />

          {/* ボタン */}
          <div className="mt-6 flex w-full items-center justify-center gap-4">
            {venueMap && (
              <Button
                size="pc"
                color="main"
                onClick={toEdit}
                type="button"
                variant
              >
                {venueMapFormTexts.buttons.cancel}
              </Button>
            )}
            <Button
              size="pc"
              type="submit"
              color="main"
              isDisable={isMutating || (venueMap ? !isDirty : false)}
            >
              {isMutating
                ? venueMapFormTexts.buttons.submitting
                : venueMap
                  ? venueMapFormTexts.buttons.edit
                  : venueMapFormTexts.buttons.register}
            </Button>
          </div>
        </form>
      )}
    </FormContainer>
  );
};

export default VenueMapForm;
