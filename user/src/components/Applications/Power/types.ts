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
  labelKey: string;
};

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
  canAdd?: boolean;
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
  onEdit?: () => void;
  isEdit?: boolean;
  onCancel?: () => void;
  isDeadline?: boolean;
}

export interface PowerSummaryViewProps {
  devices: Device[];
  onEdit: () => void;
  onDeleteDevice: (id: number) => void;
  canEdit: boolean;
}
