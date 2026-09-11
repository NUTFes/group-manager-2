import { z } from 'zod';
import {
  NET_ORDER_SHOP_ID,
  OTHER_SHOP_ID,
  VALIDATION_MESSAGES,
} from './constants';

// 単一の購入品アイテムのスキーマ
export const purchaseItemSchema = z
  .object({
    id: z.number().optional().nullable(),
    foodProductId: z
      .number()
      .min(1, { message: VALIDATION_MESSAGES.REQUIRED_FOOD_PRODUCT }),
    shopId: z.number().min(1, { message: VALIDATION_MESSAGES.REQUIRED_SHOP }),
    items: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED_ITEMS }),
    isFresh: z.boolean(),
    purchaseDate: z
      .string()
      .min(1, { message: VALIDATION_MESSAGES.REQUIRED_PURCHASE_DATE }),
    url: z
      .string()
      .url({ message: VALIDATION_MESSAGES.INVALID_URL })
      .optional()
      .nullable()
      .or(z.literal('')),
    remark: z.string().optional().nullable().or(z.literal('')),
    fesDateId: z.number().default(1),
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

    if (
      data.shopId === OTHER_SHOP_ID &&
      (!data.remark || data.remark.trim() === '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_MESSAGES.REQUIRED_REMARKS_FOR_OTHER,
        path: ['remark'],
      });
    }
  });

// 購入品リスト全体のフォームスキーマ
export const purchaseListsFormSchema = z.object({
  purchaseLists: z
    .array(purchaseItemSchema)
    .min(1, { message: VALIDATION_MESSAGES.MIN_ITEMS }),
});

export type PurchaseItem = z.infer<typeof purchaseItemSchema>;
export type PurchaseListsFormData = z.infer<typeof purchaseListsFormSchema>;
