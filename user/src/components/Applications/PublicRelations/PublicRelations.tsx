import { FC } from 'react';
import { PublicRelationResponse } from '@/api/publicRelationsApi';
import AccordionMenu from '@/components/AccordionMenu/AccordionMenu';
import PublicRelationsForm from '@/components/Applications/PublicRelations/PublicRelationsForm/PublicRelationsForm';
import { usePublicRelationsHooks } from '@/components/Applications/PublicRelations/hooks';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';

type PublicRelationsProps = {
  groupId: number;
  isDeadline: boolean;
};

type ContentProps = {
  isLoading: boolean;
  hasError: boolean;
  isDeadline: boolean | undefined;
  isEditing: boolean;
  toEdit: () => void;
  publicRelation?: PublicRelationResponse | null;
  formItem: FormItem[];
  groupId: number;
};

const Content: FC<ContentProps> = ({
  isLoading,
  hasError,
  isDeadline,
  isEditing,
  toEdit,
  publicRelation,
  formItem,
  groupId,
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
      <PublicRelationsForm
        groupId={groupId}
        toEdit={toEdit}
        publicRelation={publicRelation}
      />
    );
  }

  return <FormList items={formItem} isEdit onEdit={toEdit} />;
};

const PublicRelations: FC<PublicRelationsProps> = ({ groupId, isDeadline }) => {
  const { formItem, isEditing, toEdit, publicRelation, isLoading, hasError } =
    usePublicRelationsHooks(groupId);

  return (
    <AccordionMenu title="PR文申請" isEdit={false} isExist={false} required>
      <Content
        isLoading={isLoading}
        hasError={hasError}
        isDeadline={isDeadline}
        isEditing={isEditing}
        toEdit={toEdit}
        publicRelation={publicRelation}
        formItem={formItem}
        groupId={groupId}
      />
    </AccordionMenu>
  );
};

export default PublicRelations;
