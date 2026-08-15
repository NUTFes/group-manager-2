// 画面上の日本語ラベルを一箇所に集約する。
// public/locales/ja/common.json の文言と対応しており、文言変更時はここだけを直す。
import type { Page } from '@playwright/test';

/** 各申請セクションのアコーディオン見出し(= AccordionMenu の title)。 */
export const APPLICATION_TITLES = {
  group: '団体申請',
  viceRepresentative: '副代表申請',
  venueApplication: '会場申請',
  rentItems: '物品申請',
  stage: 'ステージ申請',
  stageOptions: 'ステージオプション申請',
  power: '電力申請',
  publicRelations: 'PR文申請',
  venueMap: '模擬店平面図',
  employees: '従業員申請',
  foodProduct: '販売品申請',
  purchaseLists: '購入品申請',
  cookingProcessOrder: '調理工程申請',
  fireEquipment: '火気使用申請',
} as const;

export type ApplicationKey = keyof typeof APPLICATION_TITLES;

/** 申請セクションのアコーディオンを開く。 */
export const openApplication = (page: Page, key: ApplicationKey) =>
  page
    .getByRole('button', { name: new RegExp(APPLICATION_TITLES[key]) })
    .click();

export const BUTTONS = {
  register: '登録',
  save: '保存',
  edit: '修正',
  delete: '削除',
  cancel: 'キャンセル',
} as const;

export const fillPowerForm = async (
  page: Page,
  values: {
    item: string;
    manufacturer: string;
    model: string;
    itemUrl: string;
    power: string;
  }
) => {
  await page.getByLabel('機器の名称').fill(values.item);
  await page.getByLabel('機器のメーカー名').fill(values.manufacturer);
  await page.getByLabel('型番').fill(values.model);
  await page.getByLabel('製品URL').fill(values.itemUrl);
  await page.getByLabel('電力量 (W)').fill(values.power);
};

export const fillFireEquipmentForm = async (
  page: Page,
  values: {
    name: string;
    quantity: string;
    fuelLabel: string;
    usage: string;
    remark: string;
  }
) => {
  await page.getByLabel('火気の名称').fill(values.name);
  await page.getByLabel('火気の台数').fill(values.quantity);
  await page.getByLabel('燃料').selectOption({ label: values.fuelLabel });
  await page.getByLabel('使用用途').fill(values.usage);
  await page.getByLabel('備考').fill(values.remark);
};
