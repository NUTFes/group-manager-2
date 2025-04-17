// src/components/RentItems/RentItemsForm/schema.ts
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// 物品申請アイテムのスキーマ定義
export const rentItemSchema = z.object({
    itemId: z.string().refine(val => val !== '' && val !== '0', {
        message: '物品を選択してください',
    }),
    count: z.number().min(1, '1つ以上選択してください'),
});

// 物品申請フォーム全体のスキーマ
export const rentItemsFormSchema = z.object({
    hasItems: z.boolean(),
    locationType: z.string().min(1, '会場タイプを選択してください').default('1'),
    items: z.array(rentItemSchema).optional().default([]),
}).refine(
    (data) => {
        // hasItemsがtrueの場合、会場タイプが選択されていることを確認
        if (data.hasItems) {
            return !!data.locationType && data.locationType !== '';
        }
        return true;
    },
    {
        message: '会場タイプを選択してください',
        path: ['locationType'],
    }
).refine(
    (data) => {
        // hasItemsがtrueの場合、少なくとも1つのアイテムがあることを確認
        if (data.hasItems) {
            return !!data.items && data.items.length > 0;
        }
        return true;
    },
    {
        message: '少なくとも1つの物品を追加してください',
        path: ['items'],
    }
).refine(
    (data) => {
        // hasItemsがtrueの場合、すべてのアイテムが有効であることを確認
        if (data.hasItems && data.items && data.items.length > 0) {
            return data.items.every(item =>
                item.itemId && item.itemId !== '' && item.itemId !== '0' &&
                item.count && item.count > 0
            );
        }
        return true;
    },
    {
        message: 'すべての物品情報を正しく入力してください',
        path: ['items'],
    }
);

// React Hook Form用のリゾルバー
export const rentItemsFormResolver = zodResolver(rentItemsFormSchema);

// TypeScript型定義のエクスポート
export type RentItemsFormData = z.infer<typeof rentItemsFormSchema>;