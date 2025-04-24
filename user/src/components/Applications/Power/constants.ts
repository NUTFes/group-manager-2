import { RadioOption } from './types';

// ラジオボタンの選択肢
export const RADIO_OPTIONS: RadioOption[] = [
  { id: 1, name: 'はい' },
  { id: 2, name: 'いいえ' },
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
