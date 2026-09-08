import { FC } from 'react';
import { ApiResponse } from '@/api/stageOptionApi';
import { PlaceOrder } from '@/api/venueApplication';
import { Controller } from 'react-hook-form';
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
    errors,
    control,
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
          <Controller
            control={control}
            name="first"
            render={({ field }) => (
              <Selector
                label={venueApplicationFormTexts.fields.firstChoice}
                options={options}
                disableOptions={disableOptions}
                value={field.value}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.first?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="second"
            render={({ field }) => (
              <Selector
                label={venueApplicationFormTexts.fields.secondChoice}
                options={options}
                disableOptions={disableOptions}
                value={field.value}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.second?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="third"
            render={({ field }) => (
              <Selector
                label={venueApplicationFormTexts.fields.thirdChoice}
                options={options}
                disableOptions={disableOptions}
                value={field.value}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.third?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="remark"
            render={({ field }) => (
              <TextArea
                label={venueApplicationFormTexts.fields.remark}
                value={field.value ?? ''}
                onChange={field.onChange}
                error={errors.remark?.message}
              />
            )}
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
                ? venueApplicationFormTexts.actions.save
                : venueApplicationFormTexts.actions.register}
            </Button>
          </div>
        </div>
      </form>
    </FormContainer>
  );
};

export default VenueApplicationForm;
