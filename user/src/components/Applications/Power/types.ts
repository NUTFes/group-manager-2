import { Control, FieldArrayWithId, UseFormReturn } from 'react-hook-form';
import { PowerApplicationFormData } from './schema';

export type Device = {
  id?: number;
  productName: string;
  maxPower: number;
  manufacturer: string;
  model: string;
  url?: string;
};

export type PowerFormData = {
  devices: Device[];
};

export type PowerApplicationOption = 'yes' | 'no' | 'undecided';

export type RadioOption = {
  id: number;
  name: string;
};

export const ORDER_TYPES = {
  RENTAL_ITEM_ORDER: 0,
  POWER_ORDER: 1,
  SUB_REP: 2,
  EMPLOYEE: 3,
  FIRE_EQUIPMENT_ORDER: 4,
} as const;

export type OrderType = (typeof ORDER_TYPES)[keyof typeof ORDER_TYPES];

export type DeviceField = keyof Device;

export interface PowerFormViewProps {
  radioValue: string;
  onRadioChange: (value: string) => void;
  formMethods: UseFormReturn<PowerApplicationFormData>;
  fields: FieldArrayWithId<PowerApplicationFormData, 'devices', 'id'>[];
  onRemove: (index: number) => void;
  onAddDevice: () => void;
  totalPower: number;
  isValid: boolean;
  radioOptions: RadioOption[];
  showForm: boolean;
  onSubmit: (data: PowerApplicationFormData) => Promise<void>;
}

export interface PowerFormProps {
  index: number;
  form: UseFormReturn<PowerApplicationFormData>;
  onRemove: (index: number) => void;
}

export interface PowerFormFieldProps {
  name: DeviceField;
  label: string;
  control: Control<PowerApplicationFormData>;
  index: number;
  required?: boolean;
  note?: string;
  getErrorMessage: (name: DeviceField) => string | undefined;
  type?: 'text' | 'number';
}

export interface PowerNegativeViewProps {
  radioValue: string;
  onRadioChange: (value: string) => void;
  onNegativeSubmit: () => void;
  isSubmitted: boolean;
  submitError: string | null;
  showRegisterButton: boolean;
  radioOptions: RadioOption[];
}

export interface PowerSummaryViewProps {
  devices: Device[];
  onEdit: () => void;
  onDeleteDevice: (id: number) => void;
  isDeadline: boolean;
}
