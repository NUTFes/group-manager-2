import { FC } from 'react';
import { PlaceOrder } from '@/api/venueApplication';
import Button from '@/components/Button';
import Selector from '@/components/Form/Selector';
import TextArea from '@/components/Form/TextArea';
import FormContainer from '@/components/FormContainer';
import { useVenueMapHooks } from './hooks';

type VenueApplicationFormProps = {
  placeOrder?: PlaceOrder;
  toEdit?: () => void;
};

const VenueApplicationForm: FC<VenueApplicationFormProps> = ({
  placeOrder,
  toEdit,
}) => {
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
  } = useVenueMapHooks(placeOrder);
  if (placesLoading || isMutating) {
    return <div>loading...</div>;
  }

  return (
    <FormContainer>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-10"></div>
        <div className="flex w-full flex-col items-center justify-center gap-10">
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
          <div className="mt-10 flex w-full items-center justify-center">
            {placeOrder && toEdit && (
              <div className="mr-4">
                <Button
                  size="pc"
                  color="main"
                  variant
                  type="button"
                  onClick={toEdit}
                >
                  キャンセル
                </Button>
              </div>
            )}
            <Button size="pc" color="main" type="submit">
              {placeOrder ? '修正' : '登録'}
            </Button>
          </div>
        </div>
      </form>
    </FormContainer>
  );
};

export default VenueApplicationForm;
