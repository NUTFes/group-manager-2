import { FC } from 'react';
import Button from '@/components/Button';
import FormContainer from '@/components/FormContainer';
import { FormItem } from './type';

type FormListProps = {
  items: FormItem[];
  onEdit?: () => void;
  isEdit?: boolean;
};

const FormList: FC<FormListProps> = ({ items, onEdit, isEdit }) => {
  return (
    <FormContainer>
      {items.map((item, index) => (
        <div key={index} className="w-auto md:w-[400px] flex flex-col">
          <div className="flex">
            <div className="text-xs text-font">{item.label}</div>
            {item.isEditable && (
              <span className="text-red-500 ml-6 text-xs">※変更できません</span>
            )}
          </div>
          <div className="h-6 md:h-10 mt-2 text-base text-font font-medium">
            {item.content}
          </div>
        </div>
      ))}
      {isEdit && (
        <div className="w-full flex justify-center items-center">
          <Button
            size="pc"
            color="main"
            type="button"
            icon="pencil"
            onClick={onEdit}
          >
            修正
          </Button>
        </div>
      )}
    </FormContainer>
  );
};

export default FormList;
