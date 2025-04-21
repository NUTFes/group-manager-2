import { z } from 'zod';

export const loginModalSchema = z.object({
  email: z
    .string({ required_error: '入力してください' })
    .email('有効なメールアドレスを入力してください'),
  password: z
    .string({ required_error: '入力してください' })
    .min(8, { message: '8文字以上で入力してください' })
    .regex(/[a-z]/, { message: '小文字を1文字以上含めてください' })
    .regex(/[A-Z]/, { message: '大文字を1文字以上含めてください' })
    .regex(/[0-9]/, { message: '数字を1つ以上含めてください' })
    .regex(/[^a-zA-Z0-9]/, { message: '記号を1つ以上含めてください' }),
});

export type LoginModalSchema = z.infer<typeof loginModalSchema>;
