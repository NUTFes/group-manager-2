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

// バリデーションメッセージの定数
export const VALIDATION_MESSAGES = {
  REQUIRED_PRODUCT_NAME: '製品名を入力してください',
  REQUIRED_MANUFACTURER: 'メーカー名を入力してください',
  REQUIRED_MODEL: '型番を入力してください',
  INVALID_URL: '有効なURLを入力してください',
  INVALID_NUMBER: '数値を入力してください',
  MIN_POWER: '1W以上で入力してください',
  MAX_POWER: '1500W以下で入力してください',
  MIN_DEVICES: '少なくとも1つの機器を登録してください',
  TOTAL_POWER_LIMIT: '合計消費電力は1500W以下にしてください',
};
