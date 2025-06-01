import { RadioOption, ShopOption } from './types';

// 商品の種類
export const FRESH_OPTIONS: RadioOption[] = [
  { id: 1, name: '生鮮品' },
  { id: 2, name: '加工品' },
];

// 購入場所の選択肢
export const SHOP_OPTIONS: ShopOption[] = [
  { id: 0, name: '選択してください' },
  { id: 1, name: 'アピタ長岡店' },
  { id: 2, name: 'イオン長岡店' },
  { id: 3, name: 'ウオロク 北山店' },
  { id: 4, name: 'ウオロク 長岡店' },
  { id: 5, name: 'カトウ食材' },
  { id: 6, name: '業務スーパー 中沢店' },
  { id: 7, name: 'サンマート' },
  { id: 8, name: 'スーパーセンタームサシ' },
  { id: 9, name: 'チャレンジャー 北長岡店' },
  { id: 10, name: 'ドン・キホーテ 長岡インター店' },
  { id: 11, name: 'ナルス 大島店' },
  { id: 12, name: 'なんじゃ村' },
  { id: 13, name: '原信 今朝白店' },
  { id: 14, name: '原信 古正寺店' },
  { id: 15, name: '原信 関原店' },
  { id: 16, name: '原信 寺島店' },
  { id: 17, name: '原信 来迎寺店' },
  { id: 18, name: 'PLANT-5 見附店' },
  { id: 19, name: '三和園茶舗' },
  { id: 20, name: '大和屋 本店' },
  { id: 21, name: 'やまや' },
  { id: 22, name: 'リカードコミュニケーション おぐまや' },
  { id: 23, name: '良食生活館 きたまち店' },
  { id: 24, name: '山ス流通サービス株式会社' },
  { id: 25, name: '菜加' },
  { id: 26, name: 'ひらせい 長岡ニュータウン店' },
  { id: 27, name: '紅屋重正' },
  { id: 28, name: 'ダイレックス喜多町店' },
  { id: 29, name: 'ネット注文' },
];

// ネット注文のショップ名とID
export const NET_ORDER_SHOP_NAME = 'ネット注文';
export const NET_ORDER_SHOP_ID = SHOP_OPTIONS.find(
  (shop) => shop.name === NET_ORDER_SHOP_NAME
)?.id;

// フォームフィールド名
export const FIELD_NAMES = {
  FOOD_PRODUCT_ID: 'foodProductId' as const,
  ITEMS: 'items' as const,
  IS_FRESH: 'isFresh' as const,
  SHOP_ID: 'shopId' as const,
  PURCHASE_DATE: 'purchaseDate' as const,
  URL: 'url' as const,
};

// デフォルトの購入品アイテム
export const DEFAULT_BOUGHT_ITEM = {
  id: undefined,
  foodProductId: 0,
  items: '',
  isFresh: false,
  shopId: 0,
  purchaseDate: '',
  url: '',
} as const;

// バリデーションメッセージの定数
export const VALIDATION_MESSAGES = {
  REQUIRED_FOOD_PRODUCT: '販売品名を選択してください',
  REQUIRED_SHOP: '購入場所を選択してください',
  REQUIRED_ITEMS: '食材・材料を入力してください',
  REQUIRED_PURCHASE_DATE: '購入日を入力してください',
  INVALID_DATE_FORMAT: '日付はYYYY/MM/DD形式で入力してください',
  INVALID_URL: '有効なURLを入力してください',
  REQUIRED_URL_FOR_NET_ORDER: 'ネット注文の場合はURLを入力してください',
  INVALID_NUMBER: '数値を入力してください',
  MIN_ITEMS: '少なくとも1つの購入品を登録してください',
};
