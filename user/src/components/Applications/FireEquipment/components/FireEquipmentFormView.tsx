import { FC } from 'react';
import Button from '@/components/Button/Button';
import Radio from '@/components/Form/Radio/Radio';
import FireEquipmentForm from './FireEquipmentForm';

export const FireEquipmentFormView: FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <Radio
        label="火器申請を使用しますか？"
        value={'1'}
        onChange={() => {}}
        required
        options={[
          { id: 1, name: 'はい' },
          { id: 2, name: 'いいえ' },
        ]}
      />

      <form>
        <div className="flex w-full flex-col gap-10">
          <FireEquipmentForm />
        </div>
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex justify-center gap-4">
            <Button type="submit" size="pc" color="main">
              登録
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
