// src/components/RentItems/RentItemsForm/schema.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 物品申請フォームのスキーマ定義
export const rentItemSchema = z.object({
  itemId: z.string().refine((val) => val !== '' && val !== '0', {
    message: 'applications.rentItems.validation.selectItem',
  }),
  count: z
    .number()
    .min(1, { message: 'applications.rentItems.validation.minCount' }),
});

// 物品IDの定数
export const ITEM_IDS = {
  // これらのIDは実際のデータベースのIDと一致するように変更する必要があります
  TENT: '7', // テントのID (例)
  PARTITION: '4', // パーテーションのID (例)
  DISPLAY_BOARD: '6', // 掲示板のID (例)
  LONG_TABLE: '2', // 長机のID (例)
  TABLE: '1', // 机のID (例)
  CHAIR: '3', // 椅子のID (例)
};

// 会場タイプの定数
export const LOCATION_TYPES = {
  INDOOR: '1', // 屋内
  OUTDOOR: '2', // 屋外
};

// 物品申請フォーム全体のスキーマ
export const rentItemsFormSchema = z
  .object({
    // 「はい/いいえ」を選ぶ前は未選択(undefined)。選択するまで登録ボタンを
    // 出さないための tri-state (以前は boolean のみで false と未選択を
    // 区別できず、未選択のまま「いいえ」の登録ボタンが出てしまうバグがあった)。
    hasItems: z.boolean().optional(),
    locationType: z
      .string()
      .min(1, { message: 'applications.rentItems.validation.selectLocation' })
      .default('1'),
    items: z.array(rentItemSchema).optional().default([]),
  })
  .refine(
    (data) => {
      // hasItemsがtrueの場合、会場タイプが選択されていることを確認
      if (data.hasItems) {
        return !!data.locationType && data.locationType !== '';
      }
      return true;
    },
    {
      message: 'applications.rentItems.validation.selectLocation',
      path: ['locationType'],
    }
  )
  .refine(
    (data) => {
      // hasItemsがtrueの場合、少なくとも1つのアイテムがあることを確認
      if (data.hasItems) {
        return !!data.items && data.items.length > 0;
      }
      return true;
    },
    {
      message: 'applications.rentItems.validation.addOneItem',
      path: ['items'],
    }
  )
  .refine(
    (data) => {
      // hasItemsがtrueの場合、すべてのアイテムが有効であることを確認
      if (data.hasItems && data.items && data.items.length > 0) {
        return data.items.every(
          (item) =>
            item.itemId &&
            item.itemId !== '' &&
            item.itemId !== '0' &&
            item.count &&
            item.count > 0
        );
      }
      return true;
    },
    {
      message: 'applications.rentItems.validation.fillAllFields',
      path: ['items'],
    }
  )
  .refine(
    (data) => {
      // 重複する物品IDがないことを確認
      if (data.hasItems && data.items && data.items.length > 0) {
        const itemIds = data.items.map((item) => item.itemId);
        return itemIds.length === new Set(itemIds).size;
      }
      return true;
    },
    {
      message: 'applications.rentItems.validation.noDuplicates',
      path: ['items'],
    }
  )
  // テント数の制限: 1個まで
  .refine(
    (data) => {
      if (!data.hasItems || !data.items || data.items.length === 0) return true;

      const tentItem = data.items.find((item) => item.itemId === ITEM_IDS.TENT);
      return !tentItem || tentItem.count <= 1;
    },
    {
      message: 'applications.rentItems.validation.tentLimit',
      path: ['items'],
    }
  )
  // パーテーションと掲示板はどちらか一方のみ
  .refine(
    (data) => {
      if (!data.hasItems || !data.items || data.items.length === 0) return true;

      const hasPartition = data.items.some(
        (item) => item.itemId === ITEM_IDS.PARTITION
      );
      const hasDisplayBoard = data.items.some(
        (item) => item.itemId === ITEM_IDS.DISPLAY_BOARD
      );

      return !(hasPartition && hasDisplayBoard);
    },
    {
      message: 'applications.rentItems.validation.partitionDisplayExclusive',
      path: ['items'],
    }
  )
  // 長机の制限: 1個まで
  .refine(
    (data) => {
      if (!data.hasItems || !data.items || data.items.length === 0) return true;

      const longTableItem = data.items.find(
        (item) => item.itemId === ITEM_IDS.LONG_TABLE
      );
      return !longTableItem || longTableItem.count <= 1;
    },
    {
      message: 'applications.rentItems.validation.longTableLimit',
      path: ['items'],
    }
  )
  // 机の制限: 屋外団体は20個まで、屋内団体は制限なし
  .refine(
    (data) => {
      if (!data.hasItems || !data.items || data.items.length === 0) return true;

      const tableItem = data.items.find(
        (item) => item.itemId === ITEM_IDS.TABLE
      );
      if (!tableItem) return true;

      // 屋内団体 (locationType === '1') は制限なし
      if (data.locationType === '1') return true;

      // 屋外団体 (locationType === '2') は20個まで
      return data.locationType !== '2' || tableItem.count <= 20;
    },
    {
      message: 'applications.rentItems.validation.tableOutdoorLimit',
      path: ['items'],
    }
  )
  // 椅子の制限: 屋外団体は20個まで、屋内団体は制限なし
  .refine(
    (data) => {
      if (!data.hasItems || !data.items || data.items.length === 0) return true;

      const chairItem = data.items.find(
        (item) => item.itemId === ITEM_IDS.CHAIR
      );
      if (!chairItem) return true;

      // 屋内団体 (locationType === '1') は制限なし
      if (data.locationType === '1') return true;

      // 屋外団体 (locationType === '2') は20個まで
      return data.locationType !== '2' || chairItem.count <= 20;
    },
    {
      message: 'applications.rentItems.validation.chairOutdoorLimit',
      path: ['items'],
    }
  );

// React Hook Form用のリゾルバー
export const rentItemsFormResolver = zodResolver(rentItemsFormSchema);

// TypeScript型定義のエクスポート
export type RentItemsFormData = z.infer<typeof rentItemsFormSchema>;
