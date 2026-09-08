import { FC } from 'react';
import { GroupResponse } from '@/api/groupApi';
import { Controller } from 'react-hook-form';
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
    control,
    errors,
    onSubmit,
    createIsMutating,
    updateIsMutating,
    validateEdit,
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
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextBox
                label={groupFormTexts.fields.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                note={groupFormTexts.notes.name}
                required={true}
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="projectName"
            render={({ field }) => (
              <TextBox
                label={groupFormTexts.fields.projectName}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                note={groupFormTexts.notes.projectName}
                required={true}
                error={errors.projectName?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="isInternational"
            render={({ field }) => (
              <Radio
                label={groupFormTexts.fields.isInternational}
                value={formatRadioValue(field.value)}
                onChange={(value) => field.onChange(value === '1')}
                required={true}
                note={groupFormTexts.notes.international}
                error={errors.isInternational?.message}
                options={groupFormTexts.options.international}
              />
            )}
          />
          <Controller
            control={control}
            name="isExternal"
            render={({ field }) => (
              <Radio
                label={groupFormTexts.fields.isExternal}
                value={formatRadioValue(field.value)}
                onChange={(value) => field.onChange(value === '1')}
                required={true}
                note={groupFormTexts.notes.external}
                error={errors.isExternal?.message}
                options={groupFormTexts.options.external}
              />
            )}
          />
          <Controller
            control={control}
            name="groupCategoryId"
            render={({ field }) => (
              <Selector
                label={groupFormTexts.fields.groupCategory}
                value={field.value}
                onChange={(value) => field.onChange(parseInt(value))}
                required={true}
                note={groupFormTexts.notes.groupCategory}
                error={errors.groupCategoryId?.message}
                options={
                  groupCategories?.map((category) => ({
                    id: category.id,
                    name: category.name,
                  })) ?? []
                }
              />
            )}
          />
          <Controller
            control={control}
            name="activity"
            render={({ field }) => (
              <TextArea
                label={groupFormTexts.fields.activity}
                value={field.value}
                onChange={field.onChange}
                required={true}
                note={groupFormTexts.notes.activity}
                error={errors.activity?.message}
              />
            )}
          />
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
