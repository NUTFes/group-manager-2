import { z } from 'zod';

export const cookingProcessOrderSchema = z.object({
  groupId: z.number(),
  foodProductId: z.number(),
  preOpenKitchen: z.boolean(),
  duringOpenKitchen: z.boolean(),
  tent: z.string().nullable().optional(),
});

export type CookingProcessOrderSchema = z.infer<
  typeof cookingProcessOrderSchema
>;
