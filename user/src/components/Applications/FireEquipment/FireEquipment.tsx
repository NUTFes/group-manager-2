import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import FormList from '@/components/FormList';
import { FireEquipmentFormView } from './components';
import { useFireEquipmentHooks } from './hooks';

type FireEquipmentProps = {
  isDeadline?: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
};

const Content: FC<FireEquipmentProps> = ({ groupId, isDeadline }) => {
  const {
    isEditing,
    handleEditClick,
    formItem,
    fireEquipment,
    hasUnregistered,
    noApplicationItems,
  } = useFireEquipmentHooks(groupId);

  // 締め切り後に表示する画面
  if (isDeadline) {
    return <FormList items={formItem} />;
  }
  // 未登録がある場合は、フォームリストを表示
  if (hasUnregistered) {
    return (
      <FormList items={noApplicationItems} isEdit onEdit={handleEditClick} />
    );
  }

  // 未登録の場合は、フォームを表示
  if (!fireEquipment && !hasUnregistered) {
    return <FireEquipmentFormView groupId={groupId} />;
  }

  // 編集モードでない場合は、フォームリストを表示
  if (!isEditing) {
    return <FormList items={formItem} isEdit onEdit={handleEditClick} />; // Display existing fire equipment details
  }

  // 編集モードの場合は、フォームを表示
  return (
    <FireEquipmentFormView
      groupId={groupId}
      fireEquipmentData={fireEquipment}
      handleEditCancel={handleEditClick}
    />
  );
};

const FireEquipment: FC<FireEquipmentProps> = ({
  groupId,
  isDeadline,
  isRegistered,
}) => {
  return (
    <AccordionMenu
      title={'火気使用申請'}
      isEdit={!isDeadline}
      isExist={isRegistered}
      required={true}
    >
      <Content groupId={groupId} isDeadline={isDeadline} />
    </AccordionMenu>
  );
};

export default FireEquipment;
