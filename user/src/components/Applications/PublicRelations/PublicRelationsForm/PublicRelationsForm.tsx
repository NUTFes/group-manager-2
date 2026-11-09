import { FC } from 'react';
import { PublicRelationResponse } from '@/api/publicRelationsApi';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import TextArea from '@/components/Form/TextArea/TextArea';
import FormContainer from '@/components/FormContainer/FormContainer';
import ImagePreview from '@/components/ImagePreview';
import Upload from '@/components/Upload/Upload';
import { usePublicRelationsFormHooks } from './hooks';

type PublicRelationsFormProps = {
  groupId: number;
  publicRelation?: PublicRelationResponse | null;
  toEdit: () => void; // Make toEdit required
};

const PublicRelationsForm: FC<PublicRelationsFormProps> = ({
  groupId,
  publicRelation,
  toEdit,
}) => {
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
    handleAnnounceChange,
    announceOptions,
    onSubmit,
    validateEdit,
    publicRelationsFormTexts,
  } = usePublicRelationsFormHooks(groupId, publicRelation);
  const displayPreviewUrl = previewUrl ?? publicRelation?.picturePath ?? null;
  const displayPreviewAlt =
    fileName ??
    publicRelation?.pictureName ??
    publicRelationsFormTexts.fields.image;

  return (
    <FormContainer>
      {isFetching || isMutating ? (
        <div>{publicRelationsFormTexts.general.loading}</div>
      ) : (
        <form
          className="w-full"
          onSubmit={handleSubmit(async (data) => {
            const success = await onSubmit(data);
            if (success) {
              // 成功したら toEdit を呼び出す
              toEdit();
            }
          })}
        >
          <div className="flex w-full flex-col items-start justify-center gap-10">
            {/* PR文入力 */}
            <div className="relative h-44 w-96">
              <TextArea
                label={publicRelationsFormTexts.fields.text}
                value={values.prText || ''}
                onChange={(value) => setValue('prText', value)}
                required
                note={publicRelationsFormTexts.notes.text}
                error={errors.prText?.message}
              />
            </div>

            {/* アナウンス選択 */}
            <div className="flex flex-col items-start justify-start gap-6">
              <Radio
                label={publicRelationsFormTexts.fields.announce}
                value={
                  values.announce === 'yes'
                    ? '1'
                    : values.announce === 'no'
                      ? '0'
                      : ''
                }
                onChange={handleAnnounceChange}
                required
                options={announceOptions}
                error={errors.announce?.message}
              />
            </div>

            {/* PR画像アップロード */}
            <div className="flex w-96 flex-col items-start justify-start gap-1">
              <Upload
                title={publicRelationsFormTexts.fields.image}
                note={publicRelationsFormTexts.upload.notes}
                onClick={handleImageUpload}
                idDisable={false}
                error={errors.image?.message}
              />
              {fileName && (
                <div className="mt-2 text-sm text-font">
                  <p>{publicRelationsFormTexts.upload.status(fileName)}</p>
                  {publicRelation && (
                    <p className="mt-1 text-gray-500">
                      {publicRelationsFormTexts.notes.existingImage}
                    </p>
                  )}
                </div>
              )}
              <ImagePreview
                src={displayPreviewUrl}
                alt={displayPreviewAlt}
                thumbnailClassName="mt-2 h-48 w-full"
              />
            </div>

            {/* ボタン */}
            <div className="mt-10 flex w-full items-center justify-center">
              {publicRelation && (
                <div className="mr-4">
                  <Button
                    size="pc"
                    color="main"
                    variant
                    type="button"
                    onClick={toEdit}
                  >
                    {publicRelationsFormTexts.buttons.cancel}
                  </Button>
                </div>
              )}
              <Button
                size="pc"
                color="main"
                type="submit"
                isDisable={isMutating || validateEdit()}
              >
                {publicRelation
                  ? publicRelationsFormTexts.buttons.edit
                  : publicRelationsFormTexts.buttons.register}
              </Button>
            </div>
          </div>
        </form>
      )}
    </FormContainer>
  );
};

export default PublicRelationsForm;
