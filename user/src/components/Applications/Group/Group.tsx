import { FC } from 'react';
import { GroupCategoryResponse, GroupResponse } from '@/api/groupApi';
import FormList from '@/components/FormList';
import { FormItem } from '@/components/FormList/type';
import AccordionMenu from '../../AccordionMenu';
import GroupForm from './GroupForm';
import { useGroupHooks } from './hooks';

type GroupProps = {
  isDeadline?: boolean | undefined;
  isRegistered?: boolean | undefined;
  groupId: number;
  userId: number;
};

type ContentProps = {
  isLoading: boolean;
  hasError: boolean;
  isDeadline: boolean | undefined;
  isEditing: boolean;
  toEdit: () => void;
  groups?: GroupResponse;
  formItem: FormItem[];
  groupCategories?: GroupCategoryResponse[];
  userId: number;
};

// 表示画面を切り替えるコンポーネント
const Content: FC<ContentProps> = ({
  isLoading,
  hasError,
  isDeadline,
  isEditing,
  toEdit,
  groups,
  formItem,
  groupCategories,
  userId,
}) => {
  // データ取得中など，ロード中に表示する画面
  if (isLoading) {
    return <div>Loading...</div>;
  }
  // データ取得に失敗した場合に表示する画面
  if (hasError) {
    return (
      <div className="py-10 text-center text-red-500">
        データの取得に失敗しました。
      </div>
    );
  }
  // 締め切り後に表示する画面
  if (isDeadline) {
    return <FormList items={formItem} />;
  }
  // 申請期間中に編集しようとした場合の画面
  if (isEditing) {
    return (
      <GroupForm
        toEdit={toEdit}
        groups={groups}
        groupCategories={groupCategories}
        userId={userId}
      />
    );
  }
  // 申請期間中の画面
  return <FormList items={formItem} isEdit onEdit={toEdit} />;
};

// export内容（このファイルのメイン部分）
const Group: FC<GroupProps> = ({
  isDeadline,
  isRegistered,
  groupId,
  userId,
}) => {
  const {
    formItem,
    isEditing,
    toEdit,
    groups,
    isLoading,
    hasError,
    groupCategories,
  } = useGroupHooks(groupId);
  return (
    <AccordionMenu
      title="団体申請"
      isEdit={!isDeadline}
      isExist={isRegistered}
      required={true}
    >
      <Content
        isLoading={isLoading}
        hasError={hasError}
        isDeadline={isDeadline}
        isEditing={isEditing}
        toEdit={toEdit}
        groups={groups}
        formItem={formItem}
        groupCategories={groupCategories}
        userId={userId}
      />
    </AccordionMenu>
  );
};

export default Group;
