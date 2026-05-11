import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import FormList from '@/components/FormList';
import { FireEquipmentFormView } from './components';
import { useFireEquipmentTexts } from './constant';
import { useFireEquipmentHooks } from './hooks';

type FireEquipmentProps = {
  isDeadline?: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
};

const Content: FC<FireEquipmentProps> = ({ groupId, isDeadline }) => {
  const fireEquipmentTexts = useFireEquipmentTexts();
  const {
    isEditing,
    handleEditClick,
    formItem,
    fireEquipment,
    hasUnregistered,
    noApplicationItems,
    isLoading,
  } = useFireEquipmentHooks(groupId);

  if (isLoading) {
    return (
      <p className="text-sm text-gray-400">{fireEquipmentTexts.loading}</p>
    );
  }

  // 締め切り後
  if (isDeadline) {
    return <FormList items={formItem} />;
  }

  // 火気不使用として登録済み・編集モード：登録フォームを表示
  if (hasUnregistered && isEditing) {
    return (
      <FireEquipmentFormView
        groupId={groupId}
        fireEquipmentData={fireEquipment}
        handleEditCancel={handleEditClick}
        submitLabel={fireEquipmentTexts.buttons.update}
        disableValidate
      />
    );
  }

  // 火気不使用として登録済み
  if (hasUnregistered) {
    return (
      <FormList
        items={noApplicationItems}
        isEdit={!isEditing}
        onEdit={handleEditClick}
      />
    );
  }

  // 未登録の場合は、フォームを表示
  if (!fireEquipment && !hasUnregistered) {
    return <FireEquipmentFormView groupId={groupId} />;
  }

  // 編集モードの場合はフォームを表示
  if (isEditing) {
    return (
      <FireEquipmentFormView
        groupId={groupId}
        fireEquipmentData={fireEquipment}
        handleEditCancel={handleEditClick}
      />
    );
  }

  // 登録済み・非編集モード：詳細と修正ボタンを表示
  return <FormList items={formItem} isEdit onEdit={handleEditClick} />;
};

const FireEquipment: FC<FireEquipmentProps> = ({
  groupId,
  isDeadline,
  isRegistered,
}) => {
  const fireEquipmentTexts = useFireEquipmentTexts();
  return (
    <AccordionMenu
      title={fireEquipmentTexts.title}
      isEdit={!isDeadline}
      isExist={isRegistered}
      required={true}
    >
      <Content groupId={groupId} isDeadline={isDeadline} />
    </AccordionMenu>
  );
};

export default FireEquipment;
