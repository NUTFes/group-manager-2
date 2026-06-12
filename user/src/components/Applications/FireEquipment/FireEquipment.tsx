import { FC } from 'react';
import { HealthCenterSubmissionStatus } from '@/api/healthCenterSubmissionStatusApi';
import AccordionMenu from '@/components/AccordionMenu';
import FormList from '@/components/FormList';
import { FireEquipmentFormView } from './components';
import { useFireEquipmentTexts } from './constant';
import { useFireEquipmentHooks } from './hooks';

type FireEquipmentProps = {
  canAdd?: boolean;
  canEdit?: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
  status?: HealthCenterSubmissionStatus;
  isResubmission?: boolean;
};

type ContentProps = ReturnType<typeof useFireEquipmentHooks> & {
  groupId: number;
  canSubmit: boolean;
  status?: HealthCenterSubmissionStatus;
};

const Content: FC<ContentProps> = ({
  groupId,
  canSubmit,
  isEditing,
  handleEditClick,
  formItem,
  fireEquipment,
  hasUnregistered,
  noApplicationItems,
  isLoading,
  isResubmission,
  status,
}) => {
  const fireEquipmentTexts = useFireEquipmentTexts();
  const readOnlyItems = hasUnregistered ? noApplicationItems : formItem;

  if (isLoading) {
    return (
      <p className="text-sm text-gray-400">{fireEquipmentTexts.loading}</p>
    );
  }

  if (isResubmission) {
    return (
      <FireEquipmentFormView
        groupId={groupId}
        fireEquipmentData={fireEquipment}
        handleEditCancel={handleEditClick}
        submitLabel={fireEquipmentTexts.buttons.update}
        disableValidate // 再提出時は変更検知バリデーションを無効化（スキーマ検証は有効）
        status={status}
      />
    );
  }

  // 締め切り後
  if (!canSubmit) {
    return <FormList items={readOnlyItems} />;
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
  canAdd,
  canEdit,
  isRegistered,
  status,
  isResubmission,
}) => {
  const fireEquipmentTexts = useFireEquipmentTexts();
  const fireEquipmentHooks = useFireEquipmentHooks(groupId, status);
  const hasFireEquipmentOrder =
    fireEquipmentHooks.fireEquipment !== undefined ||
    fireEquipmentHooks.hasUnregistered;
  const effectiveCanEdit = isResubmission ? true : canEdit;
  const canSubmit = hasFireEquipmentOrder ? !!effectiveCanEdit : !!canAdd;
  const isExist = fireEquipmentHooks.isLoading
    ? isRegistered
    : hasFireEquipmentOrder;

  return (
    <AccordionMenu
      title={fireEquipmentTexts.title}
      isEdit={canSubmit}
      isExist={isExist}
      required={true}
      status={status}
    >
      <Content
        groupId={groupId}
        canSubmit={canSubmit}
        {...fireEquipmentHooks}
        status={status}
      />
    </AccordionMenu>
  );
};

export default FireEquipment;
