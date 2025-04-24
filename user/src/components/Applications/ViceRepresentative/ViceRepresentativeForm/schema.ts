import { z } from 'zod';

export const vicerepresentativeSchema = z
  .object({
    groupId: z.number(),
    name: z.string().optional(),
    number: z.string().optional(),
    grade: z.number().optional(),
    field: z.number().optional(),
    address: z.string().optional(),
  })
  .superRefine((imputData, ctx) => {
    if (!imputData.name?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['name'],
        message: '名前を入力してください',
      });
    }

    if (!imputData.number?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['number'],
        message: '学籍番号を入力してください',
      });
    } else if (!/^\d{8}$/.test(imputData.number.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['number'],
        message: '学籍番号は半角数字8桁で入力してください',
      });
    }

    if (!imputData.grade || imputData.grade === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['grade'],
        message: '課程・学年を選択してください',
      });
    }

    if (!imputData.field || imputData.field === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['field'],
        message: '学科・専攻を選択してください',
      });
    }

    if (!imputData.address?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['address'],
        message: 'メールアドレスを入力してください',
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(imputData.address.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['address'],
        message: '有効なメールアドレスを入力してください',
      });
    }
  });

export type ViceRepresentativeForm = z.infer<typeof vicerepresentativeSchema>;
