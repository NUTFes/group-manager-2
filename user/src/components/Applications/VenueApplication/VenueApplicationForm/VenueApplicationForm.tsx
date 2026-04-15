import { FC } from 'react';
import { ApiResponse } from '@/api/stageOptionApi';
import { PlaceOrder } from '@/api/venueApplication';
import { KeyedMutator } from 'swr';
import Button from '@/components/Button';
import Selector from '@/components/Form/Selector';
import TextArea from '@/components/Form/TextArea';
import FormContainer from '@/components/FormContainer';
import { useVenueApplicationFormHooks } from './hooks';

type VenueApplicationFormProps = {
  groupId: number;
  placeOrder?: PlaceOrder;
  handleEditClick?: () => void;
  placeOrderMutate: KeyedMutator<ApiResponse<PlaceOrder>>;
};

const VenueApplicationForm: FC<VenueApplicationFormProps> = ({
  groupId,
  placeOrder,
  handleEditClick,
  placeOrderMutate,
}) => {
  const {
    placesLoading,
    isLoading,
    options,
    values,
    errors,
    setValue,
    onSubmit,
    handleSubmit,
    disableOptions,
    validateEdit,
    venueApplicationFormTexts,
  } = useVenueApplicationFormHooks(
    groupId,
    placeOrderMutate,
    placeOrder,
    handleEditClick
  );
  if (placesLoading || isLoading) {
    return <div>{venueApplicationFormTexts.loading}</div>;
  }

  return (
    <FormContainer>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-10"></div>
        <div className="flex w-full flex-col items-center justify-center gap-10">
          <Selector
            label={venueApplicationFormTexts.fields.firstChoice}
            options={options}
            disableOptions={disableOptions}
            value={values.first}
            onChange={(value) => setValue('first', Number(value))}
            error={errors.first?.message}
          />
          <Selector
            label={venueApplicationFormTexts.fields.secondChoice}
            options={options}
            disableOptions={disableOptions}
            value={values.second}
            onChange={(value) => setValue('second', Number(value))}
            error={errors.second?.message}
          />
          <Selector
            label={venueApplicationFormTexts.fields.thirdChoice}
            options={options}
            disableOptions={disableOptions}
            value={values.third}
            onChange={(value) => setValue('third', Number(value))}
            error={errors.third?.message}
          />
          <TextArea
            label={venueApplicationFormTexts.fields.remark}
            value={values.remark ?? ''}
            onChange={(value) => setValue('remark', value)}
            error={errors.remark?.message}
          />
          <div className="mt-10 flex w-full items-center justify-center">
            {placeOrder && handleEditClick && (
              <div className="mr-4">
                <Button
                  size="pc"
                  color="main"
                  variant
                  type="button"
                  onClick={handleEditClick}
                >
                  {venueApplicationFormTexts.actions.cancel}
                </Button>
              </div>
            )}
            <Button
              size="pc"
              color="main"
              type="submit"
              isDisable={validateEdit()}
            >
              {placeOrder
                ? venueApplicationFormTexts.actions.edit
                : venueApplicationFormTexts.actions.register}
            </Button>
          </div>
        </div>
      </form>
    </FormContainer>
  );
};

export default VenueApplicationForm;
