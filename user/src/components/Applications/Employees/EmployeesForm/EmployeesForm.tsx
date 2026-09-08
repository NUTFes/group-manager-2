import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Button from '@/components/Button';
import TextBox from '@/components/Form/TextBox';
import FormContainer from '@/components/FormContainer';
import { useEmployeeFormTexts } from './hooks';

type Props = {
  index: number;
  onDelete: () => void;
};

export const EmployeesForm: FC<Props> = ({ index, onDelete }) => {
  const { control } = useFormContext();
  const employeeFormTexts = useEmployeeFormTexts();

  return (
    <FormContainer>
      <Controller
        control={control}
        name={`employees.${index}.name` as const}
        render={({ field, fieldState }) => (
          <TextBox
            label={employeeFormTexts.fields.name.label}
            required
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            note={employeeFormTexts.fields.name.note}
          />
        )}
      />
      <Controller
        control={control}
        name={`employees.${index}.studentId` as const}
        render={({ field, fieldState }) => (
          <TextBox
            label={employeeFormTexts.fields.studentId.label}
            required
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            note={employeeFormTexts.fields.studentId.note}
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
          {employeeFormTexts.buttons.delete}
        </Button>
      </div>
    </FormContainer>
  );
};

export default EmployeesForm;
