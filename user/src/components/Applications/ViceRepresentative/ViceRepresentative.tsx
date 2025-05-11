import { FC } from 'react';
import { ViceRepresentativeResponse } from '@/api/viceRepresentativesApi';
import AccordionMenu from '@/components/AccordionMenu';
import FormList from '@/components/FormList';
import { FormItem } from '@/components/FormList/type';
import ViceRepresentativeForm from './ViceRepresentativeForm';
import { useViceRepresentativeHook } from './hook';

type ViceRepresentativeProps = {
  isDeadline: boolean;
  isRegistered: boolean | undefined;
  groupId: number;
  mutateViceRepresentative: () => void;
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
    return (
      <ViceRepresentativeForm
        toEdit={toEdit}
        viceRepresentative={viceRepresentative}
        groupId={groupId}
        mutateViceRepresentative={mutateViceRepresentative}
      />
    );
  }

  return <FormList items={formItem} isEdit onEdit={toEdit} />;
};

const ViceRepresentative: FC<ViceRepresentativeProps> = ({
  isDeadline,
  isRegistered,
  groupId,
  mutateViceRepresentative,
}) => {
  const {
    formItem,
    isEditing,
    toEdit,
    viceRepresentative,
    isLoading,
    hasError,
  } = useViceRepresentativeHook(groupId);
  return (
    <AccordionMenu
      title="副代表申請"
      isEdit={!isDeadline}
      isExist={isRegistered}
      required
      note="一人での参加者の場合のみ、副代表申請は不要です。"
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
      />
    </AccordionMenu>
  );
};
export default ViceRepresentative;
