import { z } from 'zod';

export const RegisterSchema = z
  .object({
    name: z.string().min(1, '名前は必須です'),
    studentId: z.string().regex(/^\d{8}$/, '8桁の学籍番号を入力してください'),
    tel: z
      .string()
      .regex(/^\d+$/, '電話番号は数字のみで入力してください')
      .min(10, '電話番号が短すぎます'),
    mail: z.string().email('有効なメールアドレスを入力してください'),
    departmentId: z.number().min(1, '学科を選択してください'),
    gradeId: z.number().min(1, '学年を選択してください'),
    password: z
      .string()
      .min(8, '8文字以上で入力してください')
      .regex(/[A-Z]/, '大文字を含めてください')
      .regex(/[a-z]/, '小文字を含めてください')
      .regex(/\d/, '数字を含めてください')
      .regex(/[\W_]/, '記号を含めてください'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'パスワードが一致しません',
    path: ['passwordConfirm'],
  });

export type RegisterFormSchema = z.infer<typeof RegisterSchema>;
