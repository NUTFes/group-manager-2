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
  isEditing: boolean;
  toEdit: () => void;
  stageOptions?: StageOptionResponse;
  formItem: FormItem[];
};

const Content: FC<ContentProps> = ({
  isLoading,
  hasError,
  isDeadline,
  isEditing,
  toEdit,
  stageOptions,
  formItem,
}) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (hasError) {
    return (
      <div className="py-10 text-center text-red-500">
        データの取得に失敗しました。
      </div>
    );
  }

  if (isDeadline) {
    return <FormList items={formItem} />;
  }

  if (isEditing) {
    return <StageOptionForm toEdit={toEdit} stageOptions={stageOptions} />;
  }

  return <FormList items={formItem} isEdit onEdit={toEdit} />;
};

const StageOptions: FC<StageOptionsProps> = ({
  isDeadline,
  isRegistered,
  groupId,
}) => {
  const { formItem, isEditing, toEdit, stageOptions, isLoading, hasError } =
    useStageOptionHooks(groupId);

  return (
    <AccordionMenu
      title="ステージオプション申請"
      isEdit={isDeadline}
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
      />
    </AccordionMenu>
  );
};

export default StageOptions;
