import { group } from 'console';
import { z } from 'zod';

export const vicerepresentativeSchema = z.object({
  groupId: z.number(),
  isGroup: z
    .number()
    .refine((val) => val === 0 || val === 1, {
      message: '一人参加かどうかを選択してください',
    }),
  name: z.string().optional(),
  number: z.string().optional(),
  grade: z.number().optional(),
  field: z.number().optional(),
  address: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.isGroup === 1) {
    if (!data.name?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['name'],
        message: '名前を入力してください',
      });
    }

    if (!data.number?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['number'],
        message: '学籍番号を入力してください',
      });
    } else if (!/^\d{8}$/.test(data.number.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['number'],
        message: '学籍番号は半角数字8桁で入力してください',
      });
    }

    if (!data.grade || data.grade === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['grade'],
        message: '課程・学年を選択してください',
      });
    }

    if (!data.field || data.field === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['field'],
        message: '学科・専攻を選択してください',
      });
    }

    if (!data.address?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['address'],
        message: 'メールアドレスを入力してください',
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.address.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['address'],
        message: '有効なメールアドレスを入力してください',
      });
    }
  }
});

export type ViceRepresentativeForm = z.infer<typeof vicerepresentativeSchema>;

// export const vicerepresentativeSchema = z.object({
//     groupId: z
//         .number(),
//     isGroup: z
//         .number()
//         .refine(val => val === 0 ||val ===1,{ message: '選択してください' }),
//     name: z
//         .string()
//         .min(1,{ message: '名前を入力してください' }),
//     number: z
//         .string()
//         .min(1,{ message:'学籍番号を入力してください'})
//         .regex(/^\d{8}$/,{ message:'学籍番号は半角数字8桁で入力してください'}),
//     grade: z
//         .number()
//         .refine((val)=>val !== 0,{message:'課程・学年を選択してください'}),
//     field: z
//         .number()
//         .refine((val)=>val !== 0,{message:'学科・専攻を選択してください'}),
//     address: z
//         .string()
//         .min(1,{message: 'メールアドレスを入力してください'})
//         .email({message:'有効なメールアドレスを入力してください'}),
// });

export type ViceRepresentativeForm = z.infer<typeof vicerepresentativeSchema>;
