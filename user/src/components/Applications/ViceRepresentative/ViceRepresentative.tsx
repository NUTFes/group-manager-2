import { FC } from 'react';
import { ViceRepresentativeResponse } from '@/api/viceRepresentativesApi';
import AccordionMenu from '@/components/AccordionMenu';
import FormList from '@/components/FormList';
import { FormItem } from '@/components/FormList/type';
import ViceRepresentativeForm from './ViceRepresentativeForm/user/src/components/Applications/ViceRepresentative/ViceRepresentativeForm';
import { useViceRepresentativeHook } from './hook';

// TODO: pageからのデータはここのpropsでバケツリレーし、isEdit,isExistに入れる。
type ViceRepresentativeProps = { isDeadline?: boolean };

type ContentProps = {
  isLoading: boolean;
  hasError: boolean;
  isDeadline: boolean | undefined;
  isEditing: boolean;
  toEdit: () => void;
  viceRepresentative?: ViceRepresentativeResponse;
  formItem: FormItem[];
};

const Content: FC<ContentProps> = ({
  isLoading,
  hasError,
  isDeadline,
  isEditing,
  toEdit,
  viceRepresentative,
  formItem,
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
      <ViceRepresentativeForm
        toEdit={toEdit}
        viceRepresentative={viceRepresentative}
      />
    );
  }

  return <FormList items={formItem} isEdit onEdit={toEdit} />;
};

const ViceRepresentative: FC<ViceRepresentativeProps> = ({ isDeadline }) => {
  const {
    formItem,
    isEditing,
    toEdit,
    viceRepresentative,
    isLoading,
    hasError,
  } = useViceRepresentativeHook();
  return (
    <AccordionMenu
      title="副代表申請"
      isEdit={false}
      isExist={false}
      required
      note="一人での参加者の場合のみ、副代表申請は不要です。"
    >
      <Content
        isLoading={isLoading}
        hasError={hasError}
        isDeadline={isDeadline}
        isEditing={isEditing}
        toEdit={toEdit}
        viceRepresentative={viceRepresentative}
        formItem={formItem}
      />
    </AccordionMenu>
  );
};
export default ViceRepresentative;
