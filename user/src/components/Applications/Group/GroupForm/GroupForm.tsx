import { FC } from 'react';
import { GroupResponse } from '@/api/groupApi';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector';
import TextArea from '@/components/Form/TextArea';
import TextBox from '@/components/Form/TextBox';
import FormContainer from '@/components/FormContainer';
import { groupLabels } from '../../label';
import { useGroupFormHooks } from './hooks';

type GroupFormProps = {
  groups?: GroupResponse;
  toEdit?: () => void;
  groupCategories?: { id: number; name: string }[];
};

const GroupForm: FC<GroupFormProps> = ({ groups, toEdit, groupCategories }) => {
  const {
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    createError,
    createIsMutating,
    updateError,
    updateIsMutating,
    validateEdit,
    values,
  } = useGroupFormHooks(groups);

  if (createError || updateError) {
    toast.error('送信に失敗しました。時間を置いて再度お試しください');
  }

  return (
    <FormContainer>
      <form
        onSubmit={handleSubmit(onSubmit, (err) => console.table(err))}
        className="w-full"
      >
        <div className="flex flex-col space-y-10">
          <TextBox
            label={groupLabels[0]}
            value={values.name}
            onChange={(value) => setValue('name', value)}
            note={'例：技大祭実行委員会'}
            required={true}
            error={errors.name?.message}
          ></TextBox>
          <TextBox
            label={groupLabels[1]}
            value={values.project_name}
            onChange={(value) => setValue('project_name', value)}
            note={'例：ギダイジャー'}
            required={true}
            error={errors.project_name?.message}
          ></TextBox>
          <Radio
            label={groupLabels[2]}
            value={values.is_international}
            onChange={(value) => setValue('is_international', value)}
            required={true}
            note={'注意書き'}
            error={errors.is_international?.message}
            options={[
              { id: 0, name: 'いいえ、国際団体（留学生団体）ではありません。' },
              { id: 1, name: 'はい、国際団体（留学生団体）です。' },
            ]}
          ></Radio>
          <Radio
            label={groupLabels[3]}
            value={values.is_external}
            onChange={(value) => setValue('is_external', value)}
            required={true}
            note={'注意書き'}
            error={errors.is_external?.message}
            options={[
              { id: 0, name: 'いいえ、学内の団体です。' },
              { id: 1, name: 'はい、学外の団体です。' },
            ]}
          ></Radio>
          <Selector
            label={groupLabels[4]}
            value={values.group_category_id}
            onChange={(value) => setValue('group_category_id', value)}
            required={true}
            note={'注意書き'}
            error={errors.group_category_id?.message}
            options={
              groupCategories?.map((category) => ({
                id: category.id,
                name: category.name,
              })) ?? []
            }
          ></Selector>
          <TextArea
            label={groupLabels[5]}
            value={values.activity}
            onChange={(value) => setValue('activity', value)}
            required={true}
            note={'〇〇の販売、〇〇のパフォーマンスなど'}
            error={errors.activity?.message}
          ></TextArea>
        </div>
        <div className="mt-10 flex w-full items-center justify-center">
          {groups && (
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
            {groups ? '修正' : '登録'}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default GroupForm;
