/**
 * グループ関連の定数定義
 */

// グループカテゴリーの種類
export const GROUP_CATEGORY = {
  FOOD_SALES: 1, // 食品販売
  GOODS_SALES: 2, // 物品販売
  STAGE: 3, // ステージ
  EXHIBITION: 4, // 展示・体験
  RESEARCH_LAB: 5, // 研究室
  COMMITTEE: 6, // 実行委員
  OTHER: 7, // その他
} as const;

/**
 * 申請関連の定数定義
 */

// 申請の必要性の値
export const NEED_APPLICATION = {
  YES: 'yes', // 申請が必要
  NO: 'no', // 申請不要
} as const;

// ラジオボタンの選択値（UIで使用される数値）
export const RADIO_VALUE = {
  YES: '1', // 「はい」を選択した場合の値
  NO: '2', // 「いいえ」を選択した場合の値
} as const;

// 申請の必要性の型定義
export type NeedApplicationValue =
  (typeof NEED_APPLICATION)[keyof typeof NEED_APPLICATION];
