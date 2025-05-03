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
};

const ViceRepresentativeForm: FC<ViceRepresentativeFormProps> = ({
  viceRepresentative,
  toEdit,
}) => {
  const {
    handleSubmit,
    setValue,
    errors,
    validatedSubmit,
    noValidationSubmit,
    option2,
    optiongrade,
    optionfield,
    textName,
    textstudentId,
    valuegradeId,
    valuedepartmentId,
    textemail,
    texttel,
    setisInd,
    isIndividual,
  } = useViceRepresentativeFormHook(viceRepresentative);

  return (
    <FormContainer>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const onSuccess = () => {
            toEdit?.();
          };
          if (isIndividual) {
            noValidationSubmit(onSuccess);
          } else {
            handleSubmit((data) => validatedSubmit(data, onSuccess))(e);
          }
        }}
        className="w-full"
      >
        <div>
          <Radio
            label={viceRepresentativeLabels[0]}
            onChange={(value) => setisInd(Number(value))}
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
                value={textstudentId}
                onChange={(value) => setValue('studentId', Number(value))}
                note="例：123456"
                required={true}
                error={errors.studentId?.message}
              />
              <Selector
                label={viceRepresentativeLabels[3]}
                value={valuegradeId}
                onChange={(value) => setValue('gradeId', Number(value))}
                required={true}
                options={optiongrade}
                error={errors.gradeId?.message}
              />
              <Selector
                label={viceRepresentativeLabels[4]}
                value={valuedepartmentId}
                onChange={(value) => setValue('departmentId', Number(value))}
                required={true}
                options={optionfield}
                error={errors.departmentId?.message}
              />
              <TextBox
                label={viceRepresentativeLabels[5]}
                value={textemail}
                onChange={(value) => setValue('email', value)}
                note="例：123456@stn.nagaokaut.ac.jp"
                required={true}
                error={errors.email?.message}
              />
              <TextBox
                label={viceRepresentativeLabels[6]}
                value={texttel}
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
