import { FC } from 'react';
import { ViceRepresentativeResponse } from '@/api/viceRepresentativesApi';
import { Controller } from 'react-hook-form';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector';
import TextBox from '@/components/Form/TextBox';
import FormContainer from '@/components/FormContainer';
import {
  useViceRepresentativeFormHook,
  useViceRepresentativeFormTexts,
} from './hooks';

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
    control,
    errors,
    onSubmit,
    setIsIndividualById,
    isIndividual,
    isSubmitting,
    validateEdit,
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
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <TextBox
                    label={viceRepresentativeFormTexts.labels[1]}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    note={viceRepresentativeFormTexts.notes.name}
                    required
                    error={errors.name?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="studentId"
                render={({ field }) => (
                  <TextBox
                    label={viceRepresentativeFormTexts.labels[2]}
                    value={field.value ? field.value.toString() : ''}
                    onChange={(value) => field.onChange(Number(value))}
                    onBlur={field.onBlur}
                    note={viceRepresentativeFormTexts.notes.studentId}
                    required
                    error={errors.studentId?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="gradeId"
                render={({ field }) => (
                  <Selector
                    label={viceRepresentativeFormTexts.labels[3]}
                    value={field.value}
                    onChange={(value) => field.onChange(Number(value))}
                    required
                    options={viceRepresentativeFormTexts.gradeOptions}
                    error={errors.gradeId?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="departmentId"
                render={({ field }) => (
                  <Selector
                    label={viceRepresentativeFormTexts.labels[4]}
                    value={field.value}
                    onChange={(value) => field.onChange(Number(value))}
                    required
                    options={viceRepresentativeFormTexts.departmentOptions}
                    error={errors.departmentId?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <TextBox
                    label={viceRepresentativeFormTexts.labels[5]}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    note={viceRepresentativeFormTexts.notes.email}
                    required
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="tel"
                render={({ field }) => (
                  <TextBox
                    label={viceRepresentativeFormTexts.labels[6]}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    note={viceRepresentativeFormTexts.notes.tel}
                    required
                    error={errors.tel?.message}
                  />
                )}
              />
            </div>
          )}
        </div>
        <div className="mt-10 flex w-full items-center justify-center">
          <Button
            size="pc"
            color="main"
            type="submit"
            isDisable={isSubmitting || validateEdit()}
          >
            {viceRepresentative
              ? viceRepresentativeFormTexts.buttons.save
              : viceRepresentativeFormTexts.buttons.register}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default ViceRepresentativeForm;
