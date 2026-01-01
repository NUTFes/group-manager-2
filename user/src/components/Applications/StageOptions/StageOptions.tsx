import { FC } from 'react';
import { StageOptionResponse } from '@/api/stageOptionApi';
import { useTranslation } from 'next-i18next';
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
  groupId: number;
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
}) => {
  const { t } = useTranslation('common');
  if (isLoading) {
    return <div>{t('general.loading')}</div>;
  }

  if (hasError) {
    return (
      <div className="py-10 text-center text-red-500">
        {t('general.errors.fetch')}
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
  const { t } = useTranslation('common');
  const { formItem, isEditing, toEdit, stageOptions, isLoading, hasError } =
    useStageOptionHooks(groupId);

  return (
    <AccordionMenu
      title={t('applications.stageOptions.title')}
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
      />
    </AccordionMenu>
  );
};

export default StageOptions;
