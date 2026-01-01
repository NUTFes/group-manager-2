import { FC } from 'react';
import { ViceRepresentativeResponse } from '@/api/viceRepresentativesApi';
import { useTranslation } from 'next-i18next';
import AccordionMenu from '@/components/AccordionMenu';
import FormList from '@/components/FormList';
import { FormItem } from '@/components/FormList/type';
import ViceRepresentativeForm from './ViceRepresentativeForm';
import { useViceRepresentativeHook } from './hook';

type ViceRepresentativeProps = {
  isDeadline: boolean;
  isRegistered: boolean | undefined;
  groupId: number;
  mutateCheckAllRegisteredGroups: () => void;
};

type ContentProps = {
  isLoading: boolean;
  hasError: boolean;
  isDeadline: boolean | undefined;
  isEditing: boolean;
  toEdit: () => void;
  viceRepresentative?: ViceRepresentativeResponse;
  formItem: FormItem[];
  groupId: number;
  mutateViceRepresentative: () => void;
  mutateCheckAllRegisteredGroups: () => void;
};

const Content: FC<ContentProps> = ({
  isLoading,
  hasError,
  isDeadline,
  isEditing,
  toEdit,
  viceRepresentative,
  formItem,
  groupId,
  mutateViceRepresentative,
  mutateCheckAllRegisteredGroups,
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
      <ViceRepresentativeForm
        toEdit={toEdit}
        viceRepresentative={viceRepresentative}
        groupId={groupId}
        mutateViceRepresentative={mutateViceRepresentative}
        mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
      />
    );
  }

  return <FormList items={formItem} isEdit onEdit={toEdit} />;
};

const ViceRepresentative: FC<ViceRepresentativeProps> = ({
  isDeadline,
  isRegistered,
  groupId,
  mutateCheckAllRegisteredGroups,
}) => {
  const { t } = useTranslation('common');
  const {
    formItem,
    isEditing,
    toEdit,
    viceRepresentative,
    isLoading,
    hasError,
    mutateViceRepresentative,
  } = useViceRepresentativeHook(groupId);
  return (
    <AccordionMenu
      title={t('applications.viceRepresentative.title')}
      isEdit={!isDeadline}
      isExist={isRegistered}
      required
      note={t('applications.viceRepresentative.note')}
    >
      <Content
        isLoading={isLoading}
        hasError={hasError}
        isDeadline={isDeadline}
        isEditing={isEditing}
        toEdit={toEdit}
        viceRepresentative={viceRepresentative}
        formItem={formItem}
        groupId={groupId}
        mutateViceRepresentative={mutateViceRepresentative}
        mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
      />
    </AccordionMenu>
  );
};
export default ViceRepresentative;
