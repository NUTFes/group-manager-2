import { z } from 'zod';

// バリデーションスキーマ
export const groupSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'form.validation.required'),
  projectName: z.string().min(1, 'form.validation.required'),
  activity: z.string().min(1, 'form.validation.required'),
  userId: z.number(),
  groupCategoryId: z.number().min(1, { message: 'form.validation.select' }),
  fesYearId: z.number(),
  committee: z.number(),
  isInternational: z.boolean({ required_error: 'form.validation.select' }),
  isExternal: z.boolean({ required_error: 'form.validation.select' }),
});

export type GroupForm = z.infer<typeof groupSchema>;
