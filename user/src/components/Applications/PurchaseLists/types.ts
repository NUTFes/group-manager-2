import { Control, FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { PurchaseListsApplicationFormData } from './schema';

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'radio';

export type RadioOption = {
  id: number;
  name: string;
};

export type ShopOption = {
  id: number;
  name: string;
};

export type FoodProductOption = {
  id: number;
  name: string;
};

export type PurchaseLists = {
  id?: number;
  foodProductId: number;
  shopId: number;
  items: string;
  isFresh: boolean;
  purchaseDate: string;
  url?: string;
};

export type PurchaseListsField =
  | 'foodProductId'
  | 'shopId'
  | 'items'
  | 'isFresh'
  | 'purchaseDate'
  | 'url';

export interface PurchaseListsFormFieldProps {
  name: PurchaseListsField;
  label: string;
  control: Control<PurchaseListsApplicationFormData>;
  index: number;
  required?: boolean;
  note?: string;
  getErrorMessage: (name: PurchaseListsField) => string | undefined;
  fieldType: 'text' | 'select' | 'radio' | 'number' | 'date'; // 'date' を追加
  options?: { id: number | string; name: string }[];
  radioOptions?: RadioOption[];
}

export interface PurchaseListsFormProps {
  index: number;
  formMethods: UseFormReturn<PurchaseListsApplicationFormData>;
  onRemove: (index: number) => void;
  foodProductOptions: FoodProductOption[];
}

export interface PurchaseListsFormViewProps {
  formMethods: UseFormReturn<PurchaseListsApplicationFormData>;
  fields: FieldArrayWithId<
    PurchaseListsApplicationFormData,
    'purchaseLists',
    'id'
  >[];
  onRemove: (index: number) => void;
  onAddItem: () => void;
  isValid: boolean;
  onSubmit: (data: PurchaseListsApplicationFormData) => void;
  foodProductOptions: FoodProductOption[];
}

export interface PurchaseListsSummaryViewProps {
  purchaseLists: PurchaseLists[];
  onEdit: () => void;
  onDeleteItem: (id: number) => void;
  isDeadline: boolean;
  foodProductOptions: FoodProductOption[];
}
