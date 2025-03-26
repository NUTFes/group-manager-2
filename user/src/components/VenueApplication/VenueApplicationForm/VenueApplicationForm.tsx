import { FC } from 'react';
import Button from '@/components/Button';
import Selector from '@/components/Form/Selector';
import TextArea from '@/components/Form/TextArea';
import FormContainer from '@/components/FormContainer';
import { useVenueMapHooks } from './hooks';

type VenueApplicationFormProps = {};

const VenueApplicationForm: FC<VenueApplicationFormProps> = () => {
  const {
    placesLoading,
    isMutating,
    options,
    values,
    errors,
    setValue,
    onSubmit,
    handleSubmit,
    disableOptions,
  } = useVenueMapHooks();
  if (placesLoading || isMutating) {
    return <div>loading...</div>;
  }

  return (
    <FormContainer>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-10"></div>
        <div className="w-full flex flex-col gap-10 justify-center items-center mt-10">
          <Selector
            label="第一希望"
            options={options}
            disableOptions={disableOptions}
            value={values.first}
            onChange={(value) => setValue('first', Number(value))}
            error={errors.first?.message}
          />
          <Selector
            label="第二希望"
            options={options}
            disableOptions={disableOptions}
            value={values.second}
            onChange={(value) => setValue('second', Number(value))}
            error={errors.second?.message}
          />
          <Selector
            label="第三希望"
            options={options}
            disableOptions={disableOptions}
            value={values.third}
            onChange={(value) => setValue('third', Number(value))}
            error={errors.third?.message}
          />
          <TextArea
            label="備考"
            value={values.remark ?? ''}
            onChange={(value) => setValue('remark', value)}
            error={errors.remark?.message}
          />
          <Button size="pc" color="main" type="submit">
            登録
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default VenueApplicationForm;
