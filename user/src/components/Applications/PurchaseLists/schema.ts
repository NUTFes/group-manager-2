import { z } from 'zod';
import { NET_ORDER_SHOP_ID, VALIDATION_MESSAGES } from './constants';

export const purchaseListsSchema = z
  .object({
    id: z.number().optional(),
    foodProductId: z
      .number({ invalid_type_error: VALIDATION_MESSAGES.INVALID_NUMBER })
      .min(1, { message: VALIDATION_MESSAGES.REQUIRED_FOOD_PRODUCT }),
    shopId: z
      .number({ invalid_type_error: VALIDATION_MESSAGES.INVALID_NUMBER })
      .min(1, { message: VALIDATION_MESSAGES.REQUIRED_SHOP }),
    items: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED_ITEMS }),
    isFresh: z.boolean(),
    purchaseDate: z
      .string()
      .min(1, { message: VALIDATION_MESSAGES.REQUIRED_PURCHASE_DATE })
      .regex(/^\d{4}\/\d{1,2}\/\d{1,2}$/, {
        message: VALIDATION_MESSAGES.INVALID_DATE_FORMAT,
      }),
    url: z
      .string()
      .url({ message: VALIDATION_MESSAGES.INVALID_URL })
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (
      data.shopId === NET_ORDER_SHOP_ID &&
      (!data.url || data.url.trim() === '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_MESSAGES.REQUIRED_URL_FOR_NET_ORDER,
        path: ['url'],
      });
    }
  });

export const PurchaseListsApplicationSchema = z.object({
  purchaseLists: z
    .array(purchaseListsSchema)
    .min(1, { message: VALIDATION_MESSAGES.MIN_ITEMS }),
});

export type PurchaseListsApplicationFormData = z.infer<
  typeof PurchaseListsApplicationSchema
>;
