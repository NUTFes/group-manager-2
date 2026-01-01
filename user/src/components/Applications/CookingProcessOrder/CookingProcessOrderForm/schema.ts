import { z } from 'zod';

const VALIDATION_MESSAGES = {
  TENT: 'applications.cookingProcessOrder.validation.tentRequired',
  CONFIRM: 'applications.cookingProcessOrder.validation.confirmAll',
} as const;

const singleCookingProcessOrderSchema = z.object({
  id: z.number().optional(),
  foodProductId: z.number(),
  foodProductName: z.string(),
  preOpenKitchen: z.boolean(),
  duringOpenKitchen: z.boolean(),
  tent: z.string().min(1, { message: VALIDATION_MESSAGES.TENT }),
  confirmCookingProcess: z.array(z.string()).refine((val) => val.length === 3, {
    message: VALIDATION_MESSAGES.CONFIRM,
  }),
});

export const cookingProcessOrderSchema = z.object({
  cookingProcessOrders: z.array(singleCookingProcessOrderSchema),
});

export type CookingProcessOrderSchema = z.infer<
  typeof cookingProcessOrderSchema
>;
