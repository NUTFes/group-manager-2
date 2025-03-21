import { FC } from 'react';
import Button from '@/components/Button';
import FormContainer from '@/components/FormContainer';
import { FormItem } from './type';

type FormListProps = {
  items: FormItem[];
};

const FormList: FC<FormListProps> = ({ items }) => {
  return (
    <FormContainer>
      {items.map((item, index) => (
        <div key={index} className="w-auto md:w-72 flex flex-col">
          <div className="text-xs text-font">{item.label}</div>
          <div className="h-6 md:h-10 mt-2 ml-2 text-base text-font font-medium">
            {item.content}
          </div>
        </div>
      ))}
      <div className="w-full flex justify-center items-center">
        <Button size="pc" color="main" type="button" icon="pencil">
          修正
        </Button>
      </div>
    </FormContainer>
  );
};

export default FormList;
