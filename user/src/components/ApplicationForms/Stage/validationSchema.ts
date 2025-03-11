import { z } from 'zod';

export const stageSchema = z
  .object({
    date: z.string().min(1, { message: '開催日を選択してください' }),
    sunnyFirstChoice: z
      .string()
      .min(1, { message: '晴れの第1希望を選択してください' }),
    sunnySecondChoice: z
      .string()
      .min(1, { message: '晴れの第2希望を選択してください' }),
    rainyFirstChoice: z
      .string()
      .min(1, { message: '雨の第1希望を選択してください' }),
    rainySecondChoice: z
      .string()
      .min(1, { message: '雨の第2希望を選択してください' }),
    prepTime: z.string().min(1, { message: '準備時間を入力してください' }),
    performTime: z.string().min(1, { message: '本番時間を入力してください' }),
    cleanupTime: z.string().min(1, { message: '片付け時間を入力してください' }),
    remarks: z.string().optional(),
  })
  .refine(
    (data) => {
      const total =
        Number(data.prepTime) +
        Number(data.performTime) +
        Number(data.cleanupTime);
      return total <= 120;
    },
    {
      message: '準備、本番、片付けの合計時間が120分を超えています',
      path: ['totalTime'],
    }
  )
  .refine(
    (data) => {
      return data.sunnyFirstChoice !== data.sunnySecondChoice || data.sunnyFirstChoice === '';
    },
    {
      message: '第1希望と異なるステージを選んでください',
      path: ['sunnySecondChoice'],
    }
  )
  .refine(
    (data) => {
      return data.rainyFirstChoice !== data.rainySecondChoice || data.rainyFirstChoice === '';
    },
    {
      message: '第1希望と異なるステージを選んでください',
      path: ['rainySecondChoice'],
    }
  );

export type StageFormData = z.infer<typeof stageSchema>;
