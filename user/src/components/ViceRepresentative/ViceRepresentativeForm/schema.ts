import { z } from 'zod';

export const vicerepresentativeSchema = z.object({
    isGroup: z
        .number()
        .refine(val => val === 0 ||val ===1,{ message: '選択してください' }),
    name: z
        .string()
        .min(1,{ message: '名前を入力してください' }),
    number: z
        .string()
        .min(1,{ message:'学籍番号を入力してください'})
        .regex(/^\d{8}$/,{ message:'学籍番号は半角数字8桁で入力してください'}),
    grade: z
        .number()
        .refine((val)=>val !== 0,{message:'課程・学年を選択してください'}),
    field: z
        .number()
        .refine((val)=>val !== 0,{message:'学科・専攻を選択してください'}),
    address: z
        .string()
        .min(1,{message: 'メールアドレスを入力してください'})
        .email({message:'有効なメールアドレスを入力してください'}),
});

export type ViceRepresentativeForm = z.infer<typeof vicerepresentativeSchema>;
