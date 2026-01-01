import { FC } from 'react';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation('common');

  return (
    <FormContainer>
      <Controller
        control={control}
        name={`employees.${index}.name` as const}
        render={({ field, fieldState }) => (
          <TextBox
            label={t('applications.employees.form.labels.name')}
            required
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            note={t('applications.employees.form.notes.name')}
          />
        )}
      />
      <Controller
        control={control}
        name={`employees.${index}.studentId` as const}
        render={({ field, fieldState }) => (
          <TextBox
            label={t('applications.employees.form.labels.studentId')}
            required
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            note={t('applications.employees.form.notes.studentId')}
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
          {t('form.actions.delete')}
        </Button>
      </div>
    </FormContainer>
  );
};

export default EmployeeForm;
