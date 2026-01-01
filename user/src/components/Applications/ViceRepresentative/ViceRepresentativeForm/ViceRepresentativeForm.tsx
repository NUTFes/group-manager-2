import { FC, useMemo } from 'react';
import { ViceRepresentativeResponse } from '@/api/viceRepresentativesApi';
import { getDepartmentOptions, getGradeOptions } from '@/utils/list';
import { useTranslation } from 'next-i18next';
import { viceRepresentativeLabels } from '@/components/Applications/label';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector';
import TextBox from '@/components/Form/TextBox';
import FormContainer from '@/components/FormContainer';
import { useViceRepresentativeFormHook } from './hook';

type ViceRepresentativeFormProps = {
  viceRepresentative?: ViceRepresentativeResponse;
  toEdit: () => void;
  groupId: number;
  mutateViceRepresentative?: () => void;
  mutateCheckAllRegisteredGroups?: () => void;
};

const ViceRepresentativeForm: FC<ViceRepresentativeFormProps> = ({
  viceRepresentative,
  toEdit,
  groupId,
  mutateViceRepresentative,
  mutateCheckAllRegisteredGroups,
}) => {
  const { t } = useTranslation('common');
  const gradeOptions = useMemo(() => getGradeOptions(t), [t]);
  const departmentOptions = useMemo(() => getDepartmentOptions(t), [t]);
  const {
    setValue,
    errors,
    onSubmit,
    registerOrNotOption,
    values,
    setIsIndividualById,
    isIndividual,
  } = useViceRepresentativeFormHook(
    viceRepresentative,
    groupId,
    mutateViceRepresentative ?? (() => {}),
    mutateCheckAllRegisteredGroups ?? (() => {})
  );

  return (
    <FormContainer>
      <form onSubmit={onSubmit(toEdit)} className="w-full">
        <div>
          <Radio
            label={t(viceRepresentativeLabels[0])}
            onChange={(value) => setIsIndividualById(Number(value))}
            options={registerOrNotOption}
            required
            value={isIndividual === undefined ? '' : isIndividual ? '1' : '0'}
            error={errors.groupId?.message}
          />
          {isIndividual === false && (
            <div>
              <TextBox
                label={t(viceRepresentativeLabels[1])}
                value={values.name}
                onChange={(value) => setValue('name', value)}
                note={t('applications.viceRepresentative.notes.name')}
                required
                error={errors.name?.message}
              />
              <TextBox
                label={t(viceRepresentativeLabels[2])}
                value={values.studentId ? values.studentId.toString() : ''}
                onChange={(value) => setValue('studentId', Number(value))}
                note={t('applications.viceRepresentative.notes.studentId')}
                required
                error={errors.studentId?.message}
              />
              <Selector
                label={t(viceRepresentativeLabels[3])}
                value={values.gradeId}
                onChange={(value) => setValue('gradeId', Number(value))}
                required
                options={gradeOptions}
                error={errors.gradeId?.message}
              />
              <Selector
                label={t(viceRepresentativeLabels[4])}
                value={values.departmentId}
                onChange={(value) => setValue('departmentId', Number(value))}
                required
                options={departmentOptions}
                error={errors.departmentId?.message}
              />
              <TextBox
                label={t(viceRepresentativeLabels[5])}
                value={values.email}
                onChange={(value) => setValue('email', value)}
                note={t('applications.viceRepresentative.notes.email')}
                required
                error={errors.email?.message}
              />
              <TextBox
                label={t(viceRepresentativeLabels[6])}
                value={values.tel}
                onChange={(value) => setValue('tel', value)}
                note={t('applications.viceRepresentative.notes.tel')}
                required
                error={errors.tel?.message}
              />
            </div>
          )}
        </div>
        <div className="mt-10 flex w-full items-center justify-center">
          <Button size="pc" color="main" type="submit">
            {t('form.actions.register')}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default ViceRepresentativeForm;
