import { Control, FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { PurchaseItem, PurchaseListsFormData } from './schema';

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

// PurchaseLists コンポーネントの Props
export type PurchaseListsProps = {
  isDeadline?: boolean;
  isRegistered?: boolean | undefined;
  groupId: number;
};

// PurchaseListsForm コンポーネントの Props
export type PurchaseListsFormProps = {
  control: Control<PurchaseListsFormData>;
  fields: FieldArrayWithId<PurchaseListsFormData, 'purchaseLists', 'id'>[];
  append: (item: Partial<PurchaseItem>) => void;
  remove: (index: number) => void;
  onSubmit: () => void; // react-hook-formのhandleSubmitをラップしたものを想定
  onCancel: () => void;
  errors: UseFormReturn<PurchaseListsFormData>['formState']['errors'];
  isValid: boolean;
  foodProductOptions: FoodProductOption[];
};

// モックAPIレスポンス型 (hooks.ts内で使用)
export type MockPurchaseListResponse = PurchaseItem & {
  groupId: number;
};
