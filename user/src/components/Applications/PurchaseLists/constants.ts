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
  {
    id: FRESH_TYPE_ID.FRESH,
    labelKey: 'applications.purchaseLists.radio.options.fresh',
  },
  {
    id: FRESH_TYPE_ID.PROCESSED,
    labelKey: 'applications.purchaseLists.radio.options.processed',
  },
];

// ネット注文のショップID
export const NET_ORDER_SHOP_ID = 998;

// その他のショップID
export const OTHER_SHOP_ID = 999;

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
  REQUIRED_FOOD_PRODUCT: 'applications.purchaseLists.validation.foodProduct',
  REQUIRED_SHOP: 'applications.purchaseLists.validation.shop',
  REQUIRED_ITEMS: 'applications.purchaseLists.validation.items',
  REQUIRED_PURCHASE_DATE: 'applications.purchaseLists.validation.purchaseDate',
  INVALID_DATE_FORMAT: 'applications.purchaseLists.validation.invalidDate',
  INVALID_URL: 'applications.purchaseLists.validation.invalidUrl',
  REQUIRED_URL_FOR_NET_ORDER:
    'applications.purchaseLists.validation.urlRequired',
  REQUIRED_REMARKS_FOR_OTHER:
    'applications.purchaseLists.validation.remarkRequired',
  MIN_ITEMS: 'applications.purchaseLists.validation.minItems',
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
