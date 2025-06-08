import { FoodProductOption, RadioOption, ShopOption } from './types';

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
  { id: 30, name: 'その他(詳細を備考欄に記入必須)' },
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
