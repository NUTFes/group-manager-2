import { z } from 'zod';

const singleCookingProcessOrderSchema = z.object({
  id: z.number().optional(),
  foodProductId: z.number(),
  foodProductName: z.string(),
  preOpenKitchen: z.boolean(),
  duringOpenKitchen: z.boolean(),
  tent: z.string().min(1, { message: '調理内容を入力してください' }),
  confirmCookingProcess: z.array(z.string()).refine((val) => val.length === 3, {
    message: 'すべての確認事項にチェックを入れてください',
  }),
});

export const cookingProcessOrderSchema = z.object({
  cookingProcessOrders: z.array(singleCookingProcessOrderSchema),
});

export type CookingProcessOrderSchema = z.infer<
  typeof cookingProcessOrderSchema
>;
