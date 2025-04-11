// src/components/RentItems/RentItemsForm/schema.ts
import { z } from 'zod';

// 物品申請フォームのスキーマ定義
export const rentItemSchema = z.object({
    itemId: z.string().min(1, '物品を選択してください'),
    count: z.number().min(1, '1つ以上選択してください'),
});

export const rentItemsFormSchema = z.object({
    groupId: z.number({ required_error: 'グループIDが必要です' }).int(),
    hasItems: z.boolean(),
    location: z.string().optional(),
    items: z.array(rentItemSchema).optional(),
}).refine(data => {
    // hasItemsがtrueの場合、他のフィールドが必要
    if (data.hasItems) {
        return !!data.location && !!data.items && data.items.length > 0;
    }
    return true;
}, {
    message: '必須項目を入力してください',
    path: ['hasItems'],
}).refine(data => {
    // hasItemsがtrueの場合、locationが必要
    if (data.hasItems) {
        return !!data.location;
    }
    return true;
}, {
    message: '会場を選択してください',
    path: ['location'],
}).refine(data => {
    // hasItemsがtrueの場合、itemsが必要
    if (data.hasItems) {
        return !!data.items && data.items.length > 0;
    }
    return true;
}, {
    message: '少なくとも1つの物品を追加してください',
    path: ['items'],
});

export type RentItemInput = z.infer<typeof rentItemSchema>;
export type RentItemsFormData = z.infer<typeof rentItemsFormSchema>;