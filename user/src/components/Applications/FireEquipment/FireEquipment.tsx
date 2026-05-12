import { FC } from 'react';
import { HealthCenterSubmissionStatus } from '@/api/healthCenterSubmissionStatusApi';
import AccordionMenu from '@/components/AccordionMenu';
import FormList from '@/components/FormList';
import { FireEquipmentFormView } from './components';
import { useFireEquipmentHooks } from './hooks';

type FireEquipmentProps = {
  isDeadline?: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
  status?: HealthCenterSubmissionStatus;
};

const Content: FC<FireEquipmentProps> = ({ groupId, isDeadline, status }) => {
  const {
    isEditing,
    handleEditClick,
    formItem,
    fireEquipment,
    hasUnregistered,
    noApplicationItems,
    isLoading,
    isResubmission,
  } = useFireEquipmentHooks(groupId, status);

  if (isLoading) {
    return <p className="text-sm text-gray-400">読み込み中...</p>;
  }

  // 締め切り後
  if (isDeadline && !isResubmission) {
    return <FormList items={formItem} />;
  }

  if (isDeadline && isResubmission) {
    return (
      <FireEquipmentFormView
        groupId={groupId}
        fireEquipmentData={fireEquipment}
        handleEditCancel={handleEditClick}
        submitLabel="更新"
        disableValidate // 再提出時は変更検知バリデーションを無効化（スキーマ検証は有効）
        status={status}
      />
    );
  }

  // 火気不使用として登録済み・編集モード：登録フォームを表示
  if (hasUnregistered && isEditing) {
    return (
      <FireEquipmentFormView
        groupId={groupId}
        fireEquipmentData={fireEquipment}
        handleEditCancel={handleEditClick}
        submitLabel="更新"
        disableValidate
        status={status}
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
    return <FireEquipmentFormView groupId={groupId} status={status} />;
  }

  // 編集モードの場合はフォームを表示
  if (isEditing) {
    return (
      <FireEquipmentFormView
        groupId={groupId}
        fireEquipmentData={fireEquipment}
        handleEditCancel={handleEditClick}
        status={status}
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
  status,
}) => {
  return (
    <AccordionMenu
      title={'火気使用申請'}
      isEdit={!isDeadline}
      isExist={isRegistered}
      required={true}
      status={status}
    >
      <Content groupId={groupId} isDeadline={isDeadline} status={status} />
    </AccordionMenu>
  );
};

export default FireEquipment;
