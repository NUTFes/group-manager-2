import { FC } from 'react';
import { PublicRelationResponse } from '@/api/publicRelationsApi';
import AccordionMenu from '@/components/AccordionMenu';
import PublicRelationsForm from '@/components/Applications/PublicRelations/PublicRelationsForm';
import { usePublicRelationsHooks } from '@/components/Applications/PublicRelations/hooks';
import FormList from '@/components/FormList';
import { FormItem } from '@/components/FormList/type';
import ImagePreview from '@/components/ImagePreview';

type PublicRelationsProps = {
  groupId: number;
  isDeadline: boolean | undefined;
  isRegistered: boolean | undefined;
};

type ContentProps = {
  isLoading: boolean;
  hasError: boolean;
  isDeadline: boolean | undefined;
  isEditing: boolean | null;
  toEdit: () => void;
  publicRelation?: PublicRelationResponse | null;
  formItem: FormItem[];
  groupId: number;
  publicRelationsTexts: ReturnType<
    typeof usePublicRelationsHooks
  >['publicRelationsTexts'];
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
  publicRelationsTexts,
}) => {
  if (isLoading) {
    return <div>{publicRelationsTexts.loading}</div>;
  }

  if (isEditing === null) {
    return <div>{publicRelationsTexts.loading}</div>;
  }

  if (hasError) {
    return (
      <div className="py-10 text-center text-red-500">
        {publicRelationsTexts.errors.fetch}
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
  const {
    isEditing,
    toEdit,
    publicRelation,
    isLoading,
    hasError,
    getAnnounceStatus,
    publicRelationsTexts,
  } = usePublicRelationsHooks(groupId, isRegistered);

  const formItem: FormItem[] = [
    {
      label: publicRelationsTexts.summaryLabels[0],
      content: publicRelation?.blurb || publicRelationsTexts.states.missingText,
    },
    {
      label: publicRelationsTexts.summaryLabels[1],
      content: getAnnounceStatus(),
    },
    {
      label: publicRelationsTexts.summaryLabels[2],
      content: (
        <ImagePreview
          src={publicRelation?.picturePath}
          alt={
            publicRelation?.pictureName ?? publicRelationsTexts.summaryLabels[2]
          }
          emptyFallback={publicRelationsTexts.states.notSet}
        />
      ),
    },
  ];

  return (
    <AccordionMenu
      title={publicRelationsTexts.title}
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
        publicRelationsTexts={publicRelationsTexts}
      />
    </AccordionMenu>
  );
};

export default PublicRelations;
