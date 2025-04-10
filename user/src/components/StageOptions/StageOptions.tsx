import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import StageOptionForm from '@/components/StageOptions/StageOptionForm';

// TODO: pageからのデータはここのpropsでバケツリレーし、isEdit,isExistに入れる。
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type StageOptionsProps = {};

const StageOptions: FC<StageOptionsProps> = () => {
  return (
    <AccordionMenu
      title="ステージオプション申請"
      isEdit={false}
      isExist={false}
      required
    >
      <StageOptionForm />
    </AccordionMenu>
  );
};

export default StageOptions;
