import { RadioOption } from './types';

// 商品の種類のID定数
export const FRESH_TYPE_ID = {
  FRESH: 1, // 生鮮品
  PROCESSED: 2, // 加工品
} as const;

// 商品の種類のID型定義
export type FreshTypeIdValue =
  (typeof FRESH_TYPE_ID)[keyof typeof FRESH_TYPE_ID];

// フェス日付ID
export const FES_DATE_ID = 1;

// 商品の種類
export const FRESH_OPTIONS: RadioOption[] = [
  { id: FRESH_TYPE_ID.FRESH, name: '生鮮品' },
  { id: FRESH_TYPE_ID.PROCESSED, name: '加工品' },
];

// ネット注文のショップID
export const NET_ORDER_SHOP_ID = 29;

// その他のショップID
export const OTHER_SHOP_ID = 30;

// フォームフィールド名
export const PurchaseItemFieldNames = {
  FOOD_PRODUCT_ID: 'foodProductId',
  ITEMS: 'items',
  IS_FRESH: 'isFresh',
  SHOP_ID: 'shopId',
  PURCHASE_DATE: 'purchaseDate',
  URL: 'url',
  REMARK: 'remark',
} as const;

// デフォルトの購入品アイテム
export const DEFAULT_PURCHASE_ITEM = {
  id: null,
  foodProductId: 0,
  isFresh: true,
  items: '',
  purchaseDate: '',
  shopId: 0,
  url: '',
  remark: '',
  fesDateId: FES_DATE_ID,
};

// バリデーションメッセージ
export const VALIDATION_MESSAGES = {
  REQUIRED_FOOD_PRODUCT: '販売品名を選択してください',
  REQUIRED_SHOP: '購入場所を選択してください',
  REQUIRED_ITEMS: '食材・材料を入力してください',
  REQUIRED_PURCHASE_DATE: '購入日を入力してください',
  INVALID_DATE_FORMAT: '日付を入力してください',
  INVALID_URL: '有効なURLを入力してください',
  REQUIRED_URL_FOR_NET_ORDER: 'ネット注文の場合はURLを入力してください',
  REQUIRED_REMARKS_FOR_OTHER:
    '「その他」の場合は、店名・住所・電話番号・営業時間を記入してください',
  MIN_ITEMS: '少なくとも1つの購入品を登録してください',
};

// 日付フォーマット関連の定数
export const DATE_FORMAT = {
  EXPECTED_PARTS_LENGTH: 3, // YYYY/MM/DD または YYYY-MM-DD の分割後の期待される配列長
  PAD_LENGTH: 2, // 月日の0埋めの桁数
  PAD_CHAR: '0', // 0埋めに使用する文字
  YEAR_INDEX: 0, // 日付配列での年の位置
  MONTH_INDEX: 1, // 日付配列での月の位置
  DAY_INDEX: 2, // 日付配列での日の位置
} as const;
