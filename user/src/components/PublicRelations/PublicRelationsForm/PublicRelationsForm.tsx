import { FC } from 'react';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import TextArea from '@/components/Form/TextArea/TextArea';
import FormContainer from '@/components/FormContainer/FormContainer';
import Upload from '@/components/Upload/Upload';
import { usePublicRelationsFormHooks } from './hooks';

type PublicRelationsFormProps = {
  groupId: number;
};

const PublicRelationsForm: FC<PublicRelationsFormProps> = ({ groupId }) => {
  const {
    handleSubmit,
    errors,
    values,
    setValue,
    fileName,
    isFetching,
    isMutating,
    handleImageUpload,
    handleAnnounceChange,
    announceOptions,
    onSubmit,
  } = usePublicRelationsFormHooks(groupId);

  if (isFetching || isMutating) {
    return <div>loading...</div>;
  }

  return (
    <FormContainer>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col items-start justify-center gap-10">
          {/* PR文入力 */}
          <div className="relative h-44 w-96">
            <TextArea
              label="PR文(HP,パンフレット,アナウンスに使用)"
              value={values.prText || ''}
              onChange={(value) => setValue('prText', value)}
              required
              note="日本語の場合：0~50文字、英語の場合：0~25words"
              error={errors.prText?.message}
            />
          </div>

          {/* アナウンス選択 */}
          <div className="flex flex-col items-start justify-start gap-6">
            <Radio
              label="アナウンスを行いますか？"
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
              title="PR画像"
              note={[
                '画像名：参加形式_団体名',
                'ファイル形式：png、jpeg',
                'ファイルサイズ：10MB未満',
                '画像、イラストの形：正方形（できれば料理の写真）',
              ]}
              onClick={handleImageUpload}
              idDisable={false}
              error={errors.image?.message}
            />
            {fileName && (
              <p className="mt-2 text-sm text-font">
                アップロード済み: {fileName}
              </p>
            )}
          </div>

          {/* 登録ボタン */}
          <div className="mt-4 flex h-16 w-96 items-start justify-center gap-4 px-28">
            <Button size="pc" color="main" type="submit" isDisable={isMutating}>
              登録
            </Button>
          </div>
        </div>
      </form>
    </FormContainer>
  );
};

export default PublicRelationsForm;
