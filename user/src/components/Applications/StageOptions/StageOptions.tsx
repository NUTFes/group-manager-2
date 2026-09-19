import { FC } from 'react';
import { StageOptionResponse } from '@/api/stageOptionApi';
import AccordionMenu from '@/components/AccordionMenu';
import StageOptionForm from '@/components/Applications/StageOptions/StageOptionForm';
import { useStageOptionHooks } from '@/components/Applications/StageOptions/hooks';
import FormList from '@/components/FormList';
import { FormItem } from '@/components/FormList/type';

type StageOptionsProps = {
  isDeadline?: boolean;
  isRegistered: boolean | undefined;
  groupId: number;
};

type ContentProps = {
  isLoading: boolean;
  hasError: boolean;
  isDeadline: boolean | undefined;
  isEditing: boolean | null;
  toEdit: () => void;
  stageOptions?: StageOptionResponse;
  formItem: FormItem[];
  groupId: number;
  stageOptionTexts: ReturnType<typeof useStageOptionHooks>['stageOptionTexts'];
};

const Content: FC<ContentProps> = ({
  isLoading,
  hasError,
  isDeadline,
  isEditing,
  toEdit,
  stageOptions,
  formItem,
  groupId,
  stageOptionTexts,
}) => {
  if (isLoading) {
    return <div>{stageOptionTexts.general.loading}</div>;
  }

  if (isEditing === null) {
    return <div>Loading...</div>;
  }

  if (hasError) {
    return (
      <div className="py-10 text-center text-red-500">
        {stageOptionTexts.errors.fetch}
      </div>
    );
  }

  if (isDeadline) {
    return <FormList items={formItem} />;
  }

  if (isEditing) {
    return (
      <StageOptionForm
        toEdit={toEdit}
        stageOptions={stageOptions}
        groupId={groupId}
      />
    );
  }

  return <FormList items={formItem} isEdit onEdit={toEdit} />;
};

const StageOptions: FC<StageOptionsProps> = ({
  isDeadline,
  isRegistered,
  groupId,
}) => {
  const {
    formItem,
    isEditing,
    toEdit,
    stageOptions,
    isLoading,
    hasError,
    stageOptionTexts,
  } = useStageOptionHooks(groupId, isRegistered);

  return (
    <AccordionMenu
      title={stageOptionTexts.title}
      isEdit={!isDeadline}
      isExist={isRegistered}
      required
    >
      <Content
        isLoading={isLoading}
        hasError={hasError}
        isDeadline={isDeadline}
        isEditing={isEditing}
        toEdit={toEdit}
        stageOptions={stageOptions}
        formItem={formItem}
        groupId={groupId}
        stageOptionTexts={stageOptionTexts}
      />
    </AccordionMenu>
  );
};

export default StageOptions;
