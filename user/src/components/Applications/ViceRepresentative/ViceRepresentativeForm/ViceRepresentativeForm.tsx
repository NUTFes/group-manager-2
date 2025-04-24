import type { FC } from 'react';
import { ViceRepresentativeResponse } from '@/api/viceRepresentativesApi';
import Button from '@/components/Button';
import Selector from '@/components/Form/Selector';
import Radio from '../../../Form/Radio';
import TextBox from '../../../Form/TextBox';
import FormContainer from '../../../FormContainer';
import { viceRepresentativeLabels } from '../../label';
import { useViceRepresentativeFormHook } from './hook';

type ViceRepresentativeFormProps = {
  viceRepresentative?: ViceRepresentativeResponse;
  toEdit?: () => void;
};

const ViceRepresentativeForm: FC<ViceRepresentativeFormProps> = () => {
  const {
    handleSubmit,
    setValue,
    getValues,
    errors,
    reset,
    watch,
    onSubmit,
    option2,
    optiongrade,
    optionfield,
    radioValue1,
    textName,
    textNumber,
    valuegrade,
    valuefield,
    textAddress,
  } = useViceRepresentativeFormHook();

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div>
          <Radio
            label={viceRepresentativeLabels[0]}
            onChange={(value) => setValue('isGroup', Number(value))}
            options={option2}
            required
            value={radioValue1}
            error={errors.isGroup?.message}
          />
          {radioValue1 === '1' && (
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
                value={textNumber}
                onChange={(value) => setValue('number', value)}
                note="例：123456"
                required={true}
                error={errors.number?.message}
              />
              <Selector
                label={viceRepresentativeLabels[3]}
                value={valuegrade}
                onChange={(value) => setValue('grade', Number(value))}
                required={true}
                options={optiongrade}
                error={errors.grade?.message}
              />
              <Selector
                label={viceRepresentativeLabels[4]}
                value={valuefield}
                onChange={(value) => setValue('field', Number(value))}
                required={true}
                options={optionfield}
                error={errors.field?.message}
              />
              <TextBox
                label={viceRepresentativeLabels[5]}
                value={textAddress}
                onChange={(value) => setValue('address', value)}
                note="例：123456@stn.nagaokaut.ac.jp"
                required={true}
                error={errors.address?.message}
              />
            </div>
          )}
        </div>
        <div className="w-full flex justify-center items-center mt-10">
          <Button size="pc" color="main" type="submit">
            登録
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default ViceRepresentativeForm;
