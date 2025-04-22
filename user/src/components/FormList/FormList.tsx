import { FC } from 'react';
import Button from '@/components/Button';
import FormContainer from '@/components/FormContainer';
import { FormItem } from './type';

type FormListProps = {
  items: FormItem[];
  onEdit?: () => void;
  isEdit?: boolean;
  onDelete?: () => void;
  isDelete?: boolean;
};

const FormList: FC<FormListProps> = ({
  items,
  onEdit,
  isEdit,
  onDelete,
  isDelete,
}) => {
  return (
    <FormContainer>
      {items.map((item, index) => (
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

      {isDelete && (
        <div className="mt-4 flex w-full items-center justify-center gap-4">
          {isEdit && onEdit && (
            <Button
              size="pc"
              color="main"
              type="button"
              icon="pencil"
              onClick={onEdit}
            >
              修正
            </Button>
          )}
          {isDelete && onDelete && (
            <Button
              size="pc"
              color="alert"
              type="button"
              icon="cross"
              variant
              onClick={onDelete}
            >
              削除
            </Button>
          )}
        </div>
      )}
    </FormContainer>
  );
};

export default FormList;
