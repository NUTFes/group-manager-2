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
      {items?.map((item, index) => (
        <div key={index} className="flex w-auto flex-col md:w-[400px]">
          <div className="flex">
            <div className="text-xs text-font">{item.label}</div>
            {item.isEditable && (
              <span className="ml-6 text-xs text-red-500">※変更できません</span>
            )}
          </div>
          <div className="mt-2 h-6 text-base font-medium text-font md:h-10">
            {item.content}
          </div>
        </div>
      ))}
      {isEdit && (
        <div className="flex w-full items-center justify-center">
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
