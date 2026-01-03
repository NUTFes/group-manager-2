import { FireEquipmentFuel } from '@/api/fireEquipmentApi';
import { z } from 'zod';

// バリデーションスキーマ
const fireEquipmentFuelArray = Object.values(FireEquipmentFuel).filter(
    (v) => typeof v === 'number'
) as number[];

export const FireEquipmentSchema = z
    .object({
        id: z.number().optional(),
        name: z.string().min(1, '入力してください'),
        quantity: z.number().min(1, '1以上の数字を入力してください'),
        fuel: z.number().refine((value) => fireEquipmentFuelArray.includes(value), {
            message: '燃料を選択してください',
        }),
        usage: z.string().min(1, '入力してください'),
        isTakeaway: z.boolean(),
        remarks: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        // 持ち帰りが「いいえ」の場合、備考欄は必須
        if (!data.isTakeaway && data.remarks == '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: '持ち帰りが「いいえ」の場合、備考欄は必須です',
                path: ['remarks'],
            });
        }
    });

export type FireEquipmentFormValues = z.infer<typeof FireEquipmentSchema>;

export const UnregisteredFireEquipmentSchema = z.object({
    groupId: z.number().min(1, 'グループを選択してください'),
    isRegister: z.boolean().default(true),
});

export type UnregisteredFireEquipmentFormValues = z.infer<
    typeof UnregisteredFireEquipmentSchema
>;