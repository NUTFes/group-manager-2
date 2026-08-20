import { FC } from 'react';
import { GroupResponse } from '@/api/groupApi';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector';
import TextArea from '@/components/Form/TextArea';
import TextBox from '@/components/Form/TextBox';
import FormContainer from '@/components/FormContainer';
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
  const {
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    createIsMutating,
    updateIsMutating,
    validateEdit,
    values,
    formatRadioValue,
    groupFormTexts,
  } = useGroupFormHooks(
    groups,
    userId,
    mutateGroups,
    mutateCheckAllRegisteredGroups,
    mutateGroupByUserId
  );

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
          <TextBox
            label={groupFormTexts.fields.name}
            value={values.name}
            onChange={(value) => setValue('name', value)}
            note={groupFormTexts.notes.name}
            required={true}
            error={errors.name?.message}
          ></TextBox>
          <TextBox
            label={groupFormTexts.fields.projectName}
            value={values.projectName}
            onChange={(value) => setValue('projectName', value)}
            note={groupFormTexts.notes.projectName}
            required={true}
            error={errors.projectName?.message}
          ></TextBox>
          <Radio
            label={groupFormTexts.fields.isInternational}
            value={formatRadioValue(values.isInternational)}
            onChange={(value) => setValue('isInternational', value === '1')}
            required={true}
            note={groupFormTexts.notes.international}
            error={errors.isInternational?.message}
            options={groupFormTexts.options.international}
          ></Radio>
          <Radio
            label={groupFormTexts.fields.isExternal}
            value={formatRadioValue(values.isExternal)}
            onChange={(value) => setValue('isExternal', value === '1')}
            required={true}
            note={groupFormTexts.notes.external}
            error={errors.isExternal?.message}
            options={groupFormTexts.options.external}
          ></Radio>
          <Selector
            label={groupFormTexts.fields.groupCategory}
            value={values.groupCategoryId}
            onChange={(value) => setValue('groupCategoryId', parseInt(value))}
            required={true}
            note={groupFormTexts.notes.groupCategory}
            error={errors.groupCategoryId?.message}
            options={
              groupCategories?.map((category) => ({
                id: category.id,
                name: category.name,
              })) ?? []
            }
          ></Selector>
          <TextArea
            label={groupFormTexts.fields.activity}
            value={values.activity}
            onChange={(value) => setValue('activity', value)}
            required={true}
            note={groupFormTexts.notes.activity}
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
                {groupFormTexts.buttons.cancel}
              </Button>
            </div>
          )}
          <Button
            size="pc"
            color="main"
            type="submit"
            isDisable={createIsMutating || updateIsMutating || validateEdit()}
          >
            {groups
              ? groupFormTexts.buttons.save
              : groupFormTexts.buttons.register}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default GroupForm;
