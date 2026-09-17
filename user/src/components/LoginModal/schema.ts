import { z } from 'zod';

export const loginModalSchema = z.object({
  email: z
    .string({ required_error: 'loginModal.validation.required' })
    .email('loginModal.validation.email'),
  password: z.string({ required_error: 'loginModal.validation.required' }),
});

export type LoginModalSchema = z.infer<typeof loginModalSchema>;
