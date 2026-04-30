import { z } from 'zod';

export const RegisterSchema = z
  .object({
    name: z.string().min(1, 'registerCarousel.errors.nameRequired'),
    studentId: z
      .string()
      .regex(/^\d{8}$/, 'registerCarousel.errors.studentIdInvalid'),
    tel: z
      .string()
      .regex(/^0\d{9,10}$/, 'registerCarousel.errors.telInvalid')
      .min(10, 'registerCarousel.errors.telShort')
      .max(11, 'registerCarousel.errors.telLong'),
    mail: z.string().email('registerCarousel.errors.emailInvalid'),
    departmentId: z
      .number()
      .min(1, 'registerCarousel.errors.departmentInvalid'),
    gradeId: z.number().min(1, 'registerCarousel.errors.gradeInvalid'),
    password: z.string().min(8, 'registerCarousel.errors.passwordShort'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'registerCarousel.errors.passwordConfirmMismatch',
    path: ['passwordConfirm'],
  });

export type RegisterFormSchema = z.infer<typeof RegisterSchema>;
