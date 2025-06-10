import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Button from '@/components/Button';
import TextBox from '@/components/Form/TextBox';
import FormContainer from '@/components/FormContainer';

type Props = {
  index: number;
  onDelete: () => void;
};

export const EmployeeForm: FC<Props> = ({ index, onDelete }) => {
  const { control } = useFormContext();

  return (
    <FormContainer>
      <Controller
        control={control}
        name={`employees.${index}.name` as const}
        render={({ field, fieldState }) => (
          <TextBox
            label="従業員名"
            required
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            note="例：技大 花子"
          />
        )}
      />
      <Controller
        control={control}
        name={`employees.${index}.studentId` as const}
        render={({ field, fieldState }) => (
          <TextBox
            label="学籍番号"
            required
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            note="例：12345678"
          />
        )}
      />
      <div className="flex w-full items-center justify-center">
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
      </div>
    </FormContainer>
  );
};

export default EmployeeForm;
