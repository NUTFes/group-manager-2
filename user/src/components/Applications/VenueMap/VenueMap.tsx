import { FC } from 'react';
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
  onFormSubmitted: () => void;
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
  onFormSubmitted,
}) => {
  if (isLoading) {
    return <div className="py-10 text-center">Loading...</div>;
  }

  if (hasError) {
    return (
      <div className="py-10 text-center text-red-500">
        データの取得に失敗しました。
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
        onSubmitted={onFormSubmitted} // フォーム送信成功時に呼び出される
      />
    );
  }

  // データがあり、編集モードでない場合はFormListを表示 (編集可能)
  return <FormList items={formItems} isEdit onEdit={toEdit} />;
};

const VenueMap: FC<VenueMapProps> = ({ groupId, isDeadline, isRegistered }) => {
  const {
    venueMap,
    isLoading,
    hasError,
    isEditing,
    toEdit,
    formItems, // hooks.ts からは formItems として返される
  } = useVenueMapHooks(groupId);

  // フォーム送信が成功したら表示モードに切り替える
  const handleFormSubmitted = () => {
    if (isEditing) {
      toEdit(); // 表示モードに切り替え
    }
  };

  return (
    <AccordionMenu
      title="模擬店平面図"
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
        onFormSubmitted={handleFormSubmitted}
      />
    </AccordionMenu>
  );
};

export default VenueMap;
