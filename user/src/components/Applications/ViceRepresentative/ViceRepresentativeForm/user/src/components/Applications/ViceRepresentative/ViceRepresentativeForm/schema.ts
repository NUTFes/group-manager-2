import { z } from 'zod';

export const viceRepresentativeSchema = z.object({
  groupId: z.number(),
  name: z.string().min(1, '名前を入力してください'),
  studentId: z
    .number()
    .int({ message: '整数で入力してください' })
    .gte(10000000, { message: '学籍番号は8桁で入力してください' })
    .lte(99999999, { message: '学籍番号は8桁で入力してください' }),
  gradeId: z.number().gt(0, { message: '課程・学年を選択してください' }),
  departmentId: z.number().gt(0, { message: '学科・専攻を選択してください' }),
  email: z
    .string()
    .min(1, { message: 'メールアドレスを入力してください' })
    .email({ message: '有効なメールアドレスを入力してください' }),
  tel: z.string().regex(/^0\d{9,10}$/, {
    message:
      '電話番号は0から始まる10桁または11桁の半角数字のみで入力してください',
  }),
});

export type ViceRepresentativeForm = z.infer<typeof viceRepresentativeSchema>;
