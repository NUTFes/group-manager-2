import { FC } from 'react';
import { GroupResponse } from '@/api/groupApi';
import { useTranslation } from 'next-i18next';
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
  userId: number;
  mutateGroups: () => void;
  mutateCheckAllRegisteredGroups: () => void;
  mutateGroupByUserId: () => void;
};

const GroupForm: FC<GroupFormProps> = ({
  groups,
  toEdit,
  groupCategories,
  userId,
  mutateGroups,
  mutateCheckAllRegisteredGroups,
  mutateGroupByUserId,
}) => {
  const { t } = useTranslation('common');
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
  } = useGroupFormHooks(
    groups,
    userId,
    mutateGroups,
    mutateCheckAllRegisteredGroups,
    mutateGroupByUserId
  );

  if (createError || updateError) {
    toast.error(t('form.messages.registerFailed'));
  }

  return (
    <FormContainer>
      <form
        onSubmit={handleSubmit(onSubmit, (err) => console.table(err))}
        className="w-full"
      >
        <div className="flex flex-col space-y-10">
          <TextBox
            label={t(groupLabels[0])}
            value={values.name}
            onChange={(value) => setValue('name', value)}
            note={t('applications.group.notes.name')}
            required={true}
            error={errors.name?.message}
          ></TextBox>
          <TextBox
            label={t(groupLabels[1])}
            value={values.projectName}
            onChange={(value) => setValue('projectName', value)}
            note={t('applications.group.notes.projectName')}
            required={true}
            error={errors.projectName?.message}
          ></TextBox>
          <Radio
            label={t(groupLabels[2])}
            value={values.isInternational ? '1' : '0'}
            onChange={(value) => setValue('isInternational', value === '1')}
            required={true}
            note={t('applications.group.notes.international')}
            error={errors.isInternational?.message}
            options={[
              { id: 0, name: t('applications.group.options.international.no') },
              {
                id: 1,
                name: t('applications.group.options.international.yes'),
              },
            ]}
          ></Radio>
          <Radio
            label={t(groupLabels[3])}
            value={values.isExternal ? '1' : '0'}
            onChange={(value) => setValue('isExternal', value === '1')}
            required={true}
            note={t('applications.group.notes.external')}
            error={errors.isExternal?.message}
            options={[
              { id: 0, name: t('applications.group.options.external.no') },
              { id: 1, name: t('applications.group.options.external.yes') },
            ]}
          ></Radio>
          <Selector
            label={t(groupLabels[4])}
            value={values.groupCategoryId}
            onChange={(value) => setValue('groupCategoryId', parseInt(value))}
            required={true}
            note={t('applications.group.notes.groupCategory')}
            error={errors.groupCategoryId?.message}
            options={
              groupCategories?.map((category) => ({
                id: category.id,
                name: category.name,
              })) ?? []
            }
          ></Selector>
          <TextArea
            label={t(groupLabels[5])}
            value={values.activity}
            onChange={(value) => setValue('activity', value)}
            required={true}
            note={t('applications.group.notes.activity')}
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
                {t('form.actions.cancel')}
              </Button>
            </div>
          )}
          <Button
            size="pc"
            color="main"
            type="submit"
            isDisable={createIsMutating || updateIsMutating || validateEdit()}
          >
            {groups ? t('form.actions.edit') : t('form.actions.register')}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default GroupForm;
