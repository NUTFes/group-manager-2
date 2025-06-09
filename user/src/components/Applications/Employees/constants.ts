/**
 * 従業員申請関連の定数定義
 */

// 従業員申請の必要性の値
export const NEED_APPLICATION = {
  YES: 'yes', // 従業員申請が必要
  NO: 'no', // 代表・副代表のみで活動
} as const;

// ラジオボタンの選択値（UIで使用される数値）
export const RADIO_VALUE = {
  YES: '1', // 「はい」を選択した場合の値
  NO: '2', // 「いいえ」を選択した場合の値
} as const;

// 従業員申請の必要性の型定義
export type NeedApplicationValue =
  (typeof NEED_APPLICATION)[keyof typeof NEED_APPLICATION];
