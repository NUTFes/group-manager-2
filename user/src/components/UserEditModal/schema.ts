import { z } from 'zod';

export const EditUserDetailsSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  studentId: z.string().regex(/^\d{8}$/, '8桁の学籍番号を入力してください'),
  tel: z
    .string()
    .regex(/^0\d{9,10}$/, '有効な電話番号を入力してください（例: 09012345678）')
    .min(10, '電話番号が短すぎます')
    .max(11, '電話番号が長すぎます'),
  mail: z.string().email('有効なメールアドレスを入力してください'),
  departmentId: z.number().min(1, '学科を選択してください'),
  gradeId: z.number().min(1, '学年を選択してください'),
});

export type EditUserDetailsFormSchema = z.infer<typeof EditUserDetailsSchema>;
