import { FC } from 'react';
import Button from '@/components/Button';
import FormContainer from '@/components/FormContainer';
import { useFormListTexts } from './hooks';
import { FormItem } from './type';

// 可変テーブル用の型
export type TableItem = { [key: string]: string };

type FormListProps = {
  items: FormItem[] | TableItem[];
  onEdit?: () => void;
  isEdit?: boolean;
  onDelete?: () => void;
  isDelete?: boolean;
  tableMode?: boolean;
  headers?: string[];
  keys?: string[];
};

const FormList: FC<FormListProps> = ({
  items,
  onEdit,
  isEdit,
  onDelete,
  isDelete,
  tableMode = false,
  headers = [],
  keys = [],
}) => {
  const formListTexts = useFormListTexts();
  if (tableMode) {
    const tableItems = items as TableItem[];
    return (
      <FormContainer>
        <table className="w-full text-left">
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-8 py-3 text-xs text-font">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableItems.map((item, idx) => (
              <tr key={idx} className="h-12">
                {keys.map((key, kidx) => (
                  <td
                    key={kidx}
                    className="px-8 py-2 text-base font-medium text-font"
                  >
                    {item[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {isEdit && onEdit && (
          <div className="mt-4 flex w-full items-center justify-center gap-4">
            <Button
              size="pc"
              color="main"
              type="button"
              icon="pencil"
              onClick={onEdit}
            >
              {formListTexts.actions.edit}
            </Button>
          </div>
        )}
        {isDelete && onDelete && (
          <div className="mt-4 flex w-full items-center justify-center gap-4">
            <Button
              size="pc"
              color="alert"
              type="button"
              icon="cross"
              variant
              onClick={onDelete}
            >
              {formListTexts.actions.delete}
            </Button>
          </div>
        )}
      </FormContainer>
    );
  }

  // 既存の縦並び表示
  return (
    <FormContainer>
      {items.map((item, index) => (
        <div key={index} className="flex w-auto flex-col md:w-[400px]">
          <div className="flex">
            <div className="text-xs text-font">{(item as FormItem).label}</div>
            {(item as FormItem).isEditable && (
              <span className="ml-6 text-xs text-red-500">
                {formListTexts.messages.nonEditable}
              </span>
            )}
          </div>
          <div className="mt-2 min-h-6 text-base font-medium text-font md:min-h-10">
            {(item as FormItem).content}
          </div>
        </div>
      ))}

      <div className="mt-4 flex w-full items-center justify-center gap-4">
        {isEdit && onEdit && (
          <Button
            size="pc"
            color="main"
            type="button"
            icon="pencil"
            onClick={onEdit}
          >
            {formListTexts.actions.edit}
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
            {formListTexts.actions.delete}
          </Button>
        )}
      </div>
    </FormContainer>
  );
};

export default FormList;
