import { z } from 'zod';
import {
  NET_ORDER_SHOP_ID,
  OTHER_SHOP_ID,
  VALIDATION_MESSAGES,
} from './constants';

// 単一の購入品アイテムのスキーマ
export const purchaseItemSchema = z
  .object({
    id: z.number().optional(),
    foodProductId: z
      .number()
      .min(1, { message: VALIDATION_MESSAGES.REQUIRED_FOOD_PRODUCT }),
    shopId: z.number().min(1, { message: VALIDATION_MESSAGES.REQUIRED_SHOP }),
    items: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED_ITEMS }),
    isFresh: z.boolean(),
    purchaseDate: z
      .string()
      .min(1, { message: VALIDATION_MESSAGES.REQUIRED_PURCHASE_DATE })
      .regex(/^\d{4}\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])$/, {
        // YYYY/M/D or YYYY/MM/DD
        message: VALIDATION_MESSAGES.INVALID_DATE_FORMAT,
      }),
    url: z
      .string()
      .url({ message: VALIDATION_MESSAGES.INVALID_URL })
      .optional()
      .or(z.literal('')),
    remarks: z.string().optional().or(z.literal('')),
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
      (!data.remarks || data.remarks.trim() === '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_MESSAGES.REQUIRED_REMARKS_FOR_OTHER,
        path: ['remarks'],
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
