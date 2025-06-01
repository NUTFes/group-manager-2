import { FC } from 'react';
import Button from '@/components/Button/Button';
import { PurchaseListsFormViewProps } from '../types';
import PurchaseListsForm from './PurchaseListsForm';

export const PurchaseListsFormView: FC<PurchaseListsFormViewProps> = ({
  formMethods,
  fields,
  onRemove,
  onAddItem,
  isValid,
  onSubmit,
  foodProductOptions,
}) => {
  const { handleSubmit } = formMethods;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col gap-10">
          {fields.map((field, index) => (
            <div key={field.id} className="w-full">
              <PurchaseListsForm
                index={index}
                formMethods={formMethods}
                onRemove={onRemove}
                foodProductOptions={foodProductOptions}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              size="pc"
              color="main"
              icon="plus"
              variant
              onClick={onAddItem}
            >
              購入品の追加
            </Button>
            <Button type="submit" size="pc" color="main" isDisable={!isValid}>
              登録
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
