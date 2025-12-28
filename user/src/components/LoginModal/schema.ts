import { z } from 'zod';

export const loginModalSchema = z.object({
  email: z
    .string({ required_error: '入力してください' })
    .email('有効なメールアドレスを入力してください'),
  password: z.string({ required_error: '入力してください' }),
});

export type LoginModalSchema = z.infer<typeof loginModalSchema>;
