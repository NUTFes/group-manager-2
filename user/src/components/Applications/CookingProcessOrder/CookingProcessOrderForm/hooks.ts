import { useFormContext, useWatch } from 'react-hook-form';

export const useCookingProcessOrderForm = (index: number) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const values = useWatch({
    control,
    name: `cookingProcessOrders.${index}`,
  });

  const getError = (fieldName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldErrors = errors.cookingProcessOrders as any;
    return fieldErrors?.[index]?.[fieldName]?.message as string | undefined;
  };

  return {
    values,
    getError,
  };
};
