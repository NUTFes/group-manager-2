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
  submitError: string | null;
  onSubmit: (data: PowerApplicationFormData) => Promise<void>;
  hasExisting?: boolean;
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
  // 締切前、または締切後でも再提出可能なステータスのため編集できる状態か。
  // 以前は `isDeadline` という名前で true が「ロックされていない(編集可能)」を
  // 意味する反転した命名だったため、実態に合わせて改名した。
  isEditable: boolean;
}
