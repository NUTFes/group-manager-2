import { FoodProductOption, RadioOption } from './types';

// 商品の種類
export const FRESH_OPTIONS: RadioOption[] = [
  { id: 1, name: '生鮮品' },
  { id: 2, name: '加工品' },
];

// 販売品オプション
export const FOOD_PRODUCT_OPTIONS: FoodProductOption[] = [
  { id: 0, name: '選択してください' },
  { id: 1, name: 'からあげ（仮）' },
  { id: 2, name: 'フランクフルト（仮）' },
  { id: 3, name: 'チョコバナナ（仮）' },
  { id: 4, name: 'たこ焼き（仮）' },
  { id: 5, name: 'かき氷（仮）' },
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
  REMARKS: 'remarks',
} as const;

// デフォルトの購入品アイテム
export const DEFAULT_PURCHASE_ITEM = {
  id: undefined,
  foodProductId: 0,
  items: '',
  isFresh: true,
  shopId: 0,
  purchaseDate: '',
  url: '',
  remarks: '',
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
