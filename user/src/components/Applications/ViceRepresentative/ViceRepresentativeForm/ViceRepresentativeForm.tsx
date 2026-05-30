import { FC } from 'react';
import { ViceRepresentativeResponse } from '@/api/viceRepresentativesApi';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector';
import TextBox from '@/components/Form/TextBox';
import FormContainer from '@/components/FormContainer';
import {
  useViceRepresentativeFormHook,
  useViceRepresentativeFormTexts,
} from './hook';

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
  const viceRepresentativeFormTexts = useViceRepresentativeFormTexts();
  const {
    setValue,
    errors,
    onSubmit,
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
            label={viceRepresentativeFormTexts.labels[0]}
            onChange={(value) => setIsIndividualById(Number(value))}
            options={viceRepresentativeFormTexts.radioOptions}
            required
            value={isIndividual === undefined ? '' : isIndividual ? '1' : '0'}
            error={errors.groupId?.message}
          />
          {isIndividual === false && (
            <div>
              <TextBox
                label={viceRepresentativeFormTexts.labels[1]}
                value={values.name}
                onChange={(value) => setValue('name', value)}
                note={viceRepresentativeFormTexts.notes.name}
                required
                error={errors.name?.message}
              />
              <TextBox
                label={viceRepresentativeFormTexts.labels[2]}
                value={values.studentId ? values.studentId.toString() : ''}
                onChange={(value) => setValue('studentId', Number(value))}
                note={viceRepresentativeFormTexts.notes.studentId}
                required
                error={errors.studentId?.message}
              />
              <Selector
                label={viceRepresentativeFormTexts.labels[3]}
                value={values.gradeId}
                onChange={(value) => setValue('gradeId', Number(value))}
                required
                options={viceRepresentativeFormTexts.gradeOptions}
                error={errors.gradeId?.message}
              />
              <Selector
                label={viceRepresentativeFormTexts.labels[4]}
                value={values.departmentId}
                onChange={(value) => setValue('departmentId', Number(value))}
                required
                options={viceRepresentativeFormTexts.departmentOptions}
                error={errors.departmentId?.message}
              />
              <TextBox
                label={viceRepresentativeFormTexts.labels[5]}
                value={values.email}
                onChange={(value) => setValue('email', value)}
                note={viceRepresentativeFormTexts.notes.email}
                required
                error={errors.email?.message}
              />
              <TextBox
                label={viceRepresentativeFormTexts.labels[6]}
                value={values.tel}
                onChange={(value) => setValue('tel', value)}
                note={viceRepresentativeFormTexts.notes.tel}
                required
                error={errors.tel?.message}
              />
            </div>
          )}
        </div>
        <div className="mt-10 flex w-full items-center justify-center">
          <Button size="pc" color="main" type="submit">
            {viceRepresentativeFormTexts.buttons.register}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default ViceRepresentativeForm;
