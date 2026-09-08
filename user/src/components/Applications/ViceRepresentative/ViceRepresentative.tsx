import { FC } from 'react';
import { ViceRepresentativeResponse } from '@/api/viceRepresentativesApi';
import AccordionMenu from '@/components/AccordionMenu';
import FormList from '@/components/FormList';
import { FormItem } from '@/components/FormList/type';
import ViceRepresentativeForm from './ViceRepresentativeForm';
import { useViceRepresentativeHook } from './hooks';

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
  isEditing: boolean | null;
  toEdit: () => void;
  viceRepresentative?: ViceRepresentativeResponse;
  formItem: FormItem[];
  groupId: number;
  mutateViceRepresentative: () => void;
  mutateCheckAllRegisteredGroups: () => void;
  viceRepresentativeTexts: ReturnType<
    typeof useViceRepresentativeHook
  >['viceRepresentativeTexts'];
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
  viceRepresentativeTexts,
}) => {
  if (isLoading) {
    return <div>{viceRepresentativeTexts.general.loading}</div>;
  }

  if (isEditing === null) {
    return <div>{viceRepresentativeTexts.general.loading}</div>;
  }

  if (hasError) {
    return (
      <div className="py-10 text-center text-red-500">
        {viceRepresentativeTexts.errors.fetch}
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
  const {
    formItem,
    isEditing,
    toEdit,
    viceRepresentative,
    isLoading,
    hasError,
    mutateViceRepresentative,
    viceRepresentativeTexts,
  } = useViceRepresentativeHook(groupId, isRegistered);
  return (
    <AccordionMenu
      title={viceRepresentativeTexts.title}
      isEdit={!isDeadline}
      isExist={isRegistered}
      required
      note={viceRepresentativeTexts.note}
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
        viceRepresentativeTexts={viceRepresentativeTexts}
      />
    </AccordionMenu>
  );
};
export default ViceRepresentative;
