import { RadioOption } from './types';

export const POWER_LIMIT = 1500;

// ラジオボタンの選択肢
export const RADIO_OPTIONS: RadioOption[] = [
  { id: 1, labelKey: 'applications.power.radio.options.yes' },
  { id: 2, labelKey: 'applications.power.radio.options.no' },
];

// デフォルトのデバイス情報
export const DEFAULT_DEVICE = {
  productName: '',
  maxPower: 0,
  manufacturer: '',
  model: '',
  url: '',
};

// フィールド名の定数
export const FIELD_NAMES = {
  PRODUCT_NAME: 'productName' as const,
  MANUFACTURER: 'manufacturer' as const,
  MODEL: 'model' as const,
  URL: 'url' as const,
  MAX_POWER: 'maxPower' as const,
};

// バリデーションメッセージの定数
export const VALIDATION_MESSAGES = {
  REQUIRED_PRODUCT_NAME: 'applications.power.validation.productNameRequired',
  REQUIRED_MANUFACTURER: 'applications.power.validation.manufacturerRequired',
  REQUIRED_MODEL: 'applications.power.validation.modelRequired',
  INVALID_URL: 'applications.power.validation.invalidUrl',
  INVALID_NUMBER: 'applications.power.validation.invalidNumber',
  MIN_POWER: 'applications.power.validation.minPower',
  MAX_POWER: 'applications.power.validation.maxPower',
  MIN_DEVICES: 'applications.power.validation.minDevices',
  TOTAL_POWER_LIMIT: 'applications.power.validation.totalPowerLimit',
};
