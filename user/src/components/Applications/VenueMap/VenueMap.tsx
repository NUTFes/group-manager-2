import { FC } from 'react';
import { useTranslation } from 'next-i18next';
import AccordionMenu from '@/components/AccordionMenu/AccordionMenu';
import FormList from '@/components/FormList/FormList';
import VenueMapForm from './VenueMapForm';
import { useVenueMapHooks } from './hooks';

type VenueMapProps = {
  groupId: number;
  isDeadline?: boolean;
  isRegistered?: boolean;
};

// Content コンポーネントの props 型定義を修正
type ContentProps = {
  isLoading: boolean;
  hasError: boolean;
  isDeadline?: boolean;
  isEditing: boolean;
  toEdit: () => void;
  venueMapData: ReturnType<typeof useVenueMapHooks>['venueMap'];
  formItems: ReturnType<typeof useVenueMapHooks>['formItems'];
  groupId: number;
  handleFormSubmitted: () => void;
};

const Content: FC<ContentProps> = ({
  isLoading,
  hasError,
  isDeadline,
  isEditing,
  toEdit,
  venueMapData,
  formItems,
  groupId,
  handleFormSubmitted,
}) => {
  const { t } = useTranslation('common');
  if (isLoading) {
    return <div className="py-10 text-center">{t('general.loading')}</div>;
  }

  if (hasError) {
    return (
      <div className="py-10 text-center text-red-500">
        {t('general.errors.fetch')}
      </div>
    );
  }

  // 締め切り後は常にFormListを表示 (編集不可)
  if (isDeadline) {
    return <FormList items={formItems} />;
  }

  if (isEditing) {
    return (
      <VenueMapForm
        groupId={groupId}
        venueMap={venueMapData}
        toEdit={toEdit} // フォーム側でキャンセル時に使用
        onSubmitted={handleFormSubmitted}
      />
    );
  }

  if (formItems.length > 0) {
    return <FormList items={formItems} isEdit onEdit={toEdit} />;
  }

  return (
    <VenueMapForm
      groupId={groupId}
      venueMap={venueMapData}
      toEdit={toEdit}
      onSubmitted={handleFormSubmitted}
    />
  );
};

const VenueMap: FC<VenueMapProps> = ({ groupId, isDeadline, isRegistered }) => {
  const { t } = useTranslation('common');
  const {
    venueMap,
    isLoading,
    hasError,
    isEditing,
    toEdit,
    formItems,
    handleFormSubmitted,
  } = useVenueMapHooks(groupId);

  return (
    <AccordionMenu
      title={t('applications.venueMap.title')}
      isEdit={!isDeadline} // 締め切り前なら編集アイコン表示
      isExist={isRegistered}
      required // 必須項目であることを示す
    >
      <Content
        isLoading={isLoading}
        hasError={hasError}
        isDeadline={isDeadline}
        isEditing={isEditing}
        toEdit={toEdit}
        venueMapData={venueMap}
        formItems={formItems}
        groupId={groupId}
        handleFormSubmitted={handleFormSubmitted}
      />
    </AccordionMenu>
  );
};

export default VenueMap;
