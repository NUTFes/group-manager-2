import type { FC } from 'react';
import { ViceRepresentativeResponse } from '@/api/viceRepresentativesApi';
import { viceRepresentativeLabels } from '@/components/Applications/label';
import Button from '@/components/Button';
import Radio from '@/components/Form/Radio';
import Selector from '@/components/Form/Selector';
import TextBox from '@/components/Form/TextBox';
import FormContainer from '@/components/FormContainer';
import { useViceRepresentativeFormHook } from './hook';

type ViceRepresentativeFormProps = {
  viceRepresentative?: ViceRepresentativeResponse;
  toEdit?: () => void;
  groupId: number;
};

const ViceRepresentativeForm: FC<ViceRepresentativeFormProps> = ({
  viceRepresentative,
  toEdit,
  groupId,
}) => {
  const {
    handleSubmit,
    setValue,
    errors,
    validatedSubmit,
    noValidationSubmit,
    option2,
    optionGrade,
    optionField,
    textName,
    textStudentId,
    valueGradeId,
    valueDepartmentId,
    textEmail,
    textTel,
    setIsIndividualById,
    isIndividual,
  } = useViceRepresentativeFormHook(viceRepresentative, groupId);

  return (
    <FormContainer>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isIndividual) {
            noValidationSubmit(toEdit);
          } else {
            handleSubmit((data) => validatedSubmit(data, toEdit))(e);
          }
        }}
        className="w-full"
      >
        <div>
          <Radio
            label={viceRepresentativeLabels[0]}
            onChange={(value) => setIsIndividualById(Number(value))}
            options={option2}
            required
            value={isIndividual === undefined ? '' : isIndividual ? '1' : '0'}
            error={errors.groupId?.message}
          />
          {isIndividual === false && (
            <div>
              <TextBox
                label={viceRepresentativeLabels[1]}
                value={textName}
                onChange={(value) => setValue('name', value)}
                note="例：長岡　太郎"
                required={true}
                error={errors.name?.message}
              />
              <TextBox
                label={viceRepresentativeLabels[2]}
                value={textStudentId}
                onChange={(value) => setValue('studentId', Number(value))}
                note="例：123456（半角数字のみ）"
                required={true}
                error={errors.studentId?.message}
              />
              <Selector
                label={viceRepresentativeLabels[3]}
                value={valueGradeId}
                onChange={(value) => setValue('gradeId', Number(value))}
                required={true}
                options={optionGrade}
                error={errors.gradeId?.message}
              />
              <Selector
                label={viceRepresentativeLabels[4]}
                value={valueDepartmentId}
                onChange={(value) => setValue('departmentId', Number(value))}
                required={true}
                options={optionField}
                error={errors.departmentId?.message}
              />
              <TextBox
                label={viceRepresentativeLabels[5]}
                value={textEmail}
                onChange={(value) => setValue('email', value)}
                note="例：123456@stn.nagaokaut.ac.jp"
                required={true}
                error={errors.email?.message}
              />
              <TextBox
                label={viceRepresentativeLabels[6]}
                value={textTel}
                onChange={(value) => setValue('tel', value)}
                note="例：09012345678 (ハイフンなし)"
                required={true}
                error={errors.tel?.message}
              />
            </div>
          )}
        </div>
        <div className="mt-10 flex w-full items-center justify-center">
          <Button size="pc" color="main" type="submit">
            登録
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default ViceRepresentativeForm;
