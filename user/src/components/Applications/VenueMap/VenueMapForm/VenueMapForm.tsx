import { FC, useState } from 'react';
import Image from 'next/image';
import { VenueMapResponse } from '@/api/venueMapApi';
import Button from '@/components/Button/Button';
import Checkbox from '@/components/Form/CheckBox';
import FormContainer from '@/components/FormContainer/FormContainer';
import Modal from '@/components/Modal/Modal';
import Upload from '@/components/Upload/Upload';
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayImageUrl = previewUrl ?? venueMap?.picturePath ?? null;

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
            {displayImageUrl && (
              <div
                className="relative mt-2 h-48 w-full cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <Image
                  src={displayImageUrl}
                  alt={fileName ?? venueMap?.pictureName ?? ''}
                  fill
                  unoptimized={displayImageUrl.startsWith('blob:')}
                  className="rounded object-contain"
                />
              </div>
            )}
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {displayImageUrl && (
          <div
            className="relative h-[80vh] w-[80vw] max-w-[880px]"
            onClick={() => setIsModalOpen(false)}
          >
            <Image
              src={displayImageUrl}
              alt={fileName ?? venueMap?.pictureName ?? ''}
              fill
              unoptimized={displayImageUrl.startsWith('blob:')}
              className="object-contain"
            />
          </div>
        )}
      </Modal>
    </FormContainer>
  );
};

export default VenueMapForm;
