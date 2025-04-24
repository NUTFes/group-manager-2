import { z } from 'zod';

// バリデーションスキーマ
export const groupSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, '入力してください'),
  projectName: z.string().min(1, '入力してください'),
  activity: z.string().min(1, '入力してください'),
  userId: z.number(),
  groupCategoryId: z.string().min(1, '選択してください'),
  fesYearId: z.number(),
  committee: z.number(),
  isInternational: z.boolean({ required_error: '選択してください' }),
  isExternal: z.boolean({ required_error: '選択してください' }),
});

export type GroupForm = z.infer<typeof groupSchema>;
