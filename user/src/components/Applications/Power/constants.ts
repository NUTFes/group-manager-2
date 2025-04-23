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
