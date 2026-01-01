import { FC } from 'react';
import { PublicRelationResponse } from '@/api/publicRelationsApi';
import { useTranslation } from 'next-i18next';
import AccordionMenu from '@/components/AccordionMenu/AccordionMenu';
import PublicRelationsForm from '@/components/Applications/PublicRelations/PublicRelationsForm/PublicRelationsForm';
import { usePublicRelationsHooks } from '@/components/Applications/PublicRelations/hooks';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';

type PublicRelationsProps = {
  groupId: number;
  isDeadline: boolean | undefined;
  isRegistered: boolean | undefined;
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
      <PublicRelationsForm
        groupId={groupId}
        toEdit={toEdit}
        publicRelation={publicRelation}
      />
    );
  }

  return <FormList items={formItem} isEdit onEdit={toEdit} />;
};

const PublicRelations: FC<PublicRelationsProps> = ({
  groupId,
  isDeadline,
  isRegistered,
}) => {
  const { t } = useTranslation('common');
  const { formItem, isEditing, toEdit, publicRelation, isLoading, hasError } =
    usePublicRelationsHooks(groupId);

  return (
    <AccordionMenu
      title={t('applications.publicRelations.title')}
      isEdit={!isDeadline}
      isExist={isRegistered}
      required
    >
      <Content
        isLoading={isLoading}
        hasError={!!hasError}
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
