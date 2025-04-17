import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import StageOptionForm from '@/components/Applications/StageOptions/StageOptionForm';
import { useStageOptionHooks } from '@/components/Applications/StageOptions/hooks';
import FormList from '@/components/FormList';

// TODO: pageからのデータはここのpropsでバケツリレーし、isEdit,isExistに入れる。

type StageOptionsProps = { isDeadline?: boolean };

const StageOptions: FC<StageOptionsProps> = ({ isDeadline }) => {
  const { formItem, isEditing, toEdit, stageOptions, isLoading, hasError } =
    useStageOptionHooks();

  let content: React.ReactNode;

  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (hasError) {
    content = (
      <div className="py-10 text-center text-red-500">
        データの取得に失敗しました。
      </div>
    );
  } else if (isDeadline) {
    content = <FormList items={formItem} />;
  } else if (isEditing) {
    content = <StageOptionForm toEdit={toEdit} stageOptions={stageOptions} />;
  } else {
    content = <FormList items={formItem} isEdit onEdit={toEdit} />;
  }

  return (
    <AccordionMenu
      title="ステージオプション申請"
      isEdit={false}
      isExist={false}
      required
    >
      {content}
    </AccordionMenu>
  );
};

export default StageOptions;
