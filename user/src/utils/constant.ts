import { type Option } from '@/components/Form/Radio/Radio';

export const YES_ID = 1;
export const NO_ID = 2;
export const YES_ID_STRING = '1' as const;
export const NO_ID_STRING = '2' as const;
export const YES_NAME = 'はい';
export const NO_NAME = 'いいえ';

// 登録・未登録の選択肢
export const RADIO_OPTIONS: Option[] = [
  { id: YES_ID, name: YES_NAME },
  { id: NO_ID, name: NO_NAME },
];
