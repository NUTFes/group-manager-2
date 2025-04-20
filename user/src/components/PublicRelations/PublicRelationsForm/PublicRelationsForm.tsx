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
        <div className="w-full flex flex-col gap-10 justify-center items-start">
          {/* PR文入力 */}
          <div className="w-96 h-44 relative">
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
          <div className="flex flex-col justify-start items-start gap-6">
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
          <div className="w-96 flex flex-col justify-start items-start gap-1">
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
          <div className="w-96 h-16 px-28 flex justify-center items-start gap-4 mt-4">
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
