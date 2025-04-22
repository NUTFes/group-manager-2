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
  POWER: 1,
} as const;

export type OrderType = (typeof ORDER_TYPES)[keyof typeof ORDER_TYPES];
