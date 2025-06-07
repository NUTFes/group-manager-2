import { z } from 'zod';

const productSchema = z.object({
    id: z.string().optional(),
    name: z
        .string({
            required_error: '販売品名を入力してください',
        })
        .min(1, { message: '販売品名を入力してください' }),
    isAlcohol: z.boolean({
        required_error: '酒類かどうかを選択してください',
    }),
    hasLicense: z.boolean({
        required_error: '調理の有無を選択してください',
    }),
    day1Quantity: z
        .string({
            required_error: '1日目の販売予定数を入力してください',
        })
        .min(1, { message: '1日目の販売予定数を入力してください' })
        .regex(/^\d+$/, { message: '半角数字で入力してください' }),
    day2Quantity: z
        .string({
            required_error: '2日目の販売予定数を入力してください',
        })
        .min(1, { message: '2日目の販売予定数を入力してください' })
        .regex(/^\d+$/, { message: '半角数字で入力してください' }),
}).refine((data) => {
    return !(data.isAlcohol && !data.hasLicense);
    
}, {
    message: '酒類を販売する場合は調理の有無を「有り」にしてください',
    path: ['hasLicense'],
});

export const foodProductSchema = z.object({
    products: z
        .array(productSchema)
        .min(1, { message: '少なくとも1つの販売品を登録してください' }),
});

export type FoodProductFormData = z.infer<typeof foodProductSchema>;