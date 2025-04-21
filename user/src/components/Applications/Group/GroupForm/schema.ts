import { z } from 'zod';

// バリデーションスキーマ
export const groupSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, '入力してください'),
  project_name: z.string().min(1, '入力してください'),
  activity: z.string().min(1, '入力してください'),
  user_id: z.number(),
  group_category_id: z.string().min(1, '選択してください'),
  fes_year_id: z.number(),
  committee: z.number(),
  is_international: z.string().min(1, '選択してください'),
  is_external: z.string().min(1, '選択してください'),
});

export type GroupForm = z.infer<typeof groupSchema>;
