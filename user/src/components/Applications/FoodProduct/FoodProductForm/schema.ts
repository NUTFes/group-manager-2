import { z } from 'zod';

const VALIDATION_MESSAGES = {
  NAME: 'applications.foodProduct.validation.name',
  IS_ALCOHOL: 'applications.foodProduct.validation.isAlcohol',
  IS_COOKING: 'applications.foodProduct.validation.isCooking',
  DAY1: 'applications.foodProduct.validation.day1',
  DAY2: 'applications.foodProduct.validation.day2',
  NUMBER: 'applications.foodProduct.validation.number',
  MIN_VALUE: 'applications.foodProduct.validation.minValue',
  ALCOHOL_REQUIRES_COOKING:
    'applications.foodProduct.validation.alcoholRequiresCooking',
  MIN_PRODUCTS: 'applications.foodProduct.validation.minProducts',
};

// ベースとなる商品スキーマ
const baseProductSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  isAlcohol: z.boolean(),
  isCooking: z.boolean(),
  day1Quantity: z.string(),
  day2Quantity: z.string(),
});

// バリデーション用の商品スキーマ（フォーム送信時）
const productSchema = z
  .object({
    id: z.string().optional(),
    name: z
      .string({
        required_error: VALIDATION_MESSAGES.NAME,
      })
      .min(1, { message: VALIDATION_MESSAGES.NAME }),
    isAlcohol: z.boolean({
      required_error: VALIDATION_MESSAGES.IS_ALCOHOL,
    }),
    isCooking: z.boolean({
      required_error: VALIDATION_MESSAGES.IS_COOKING,
    }),
    day1Quantity: z
      .string({
        required_error: VALIDATION_MESSAGES.DAY1,
      })
      .min(1, { message: VALIDATION_MESSAGES.DAY1 })
      .regex(/^\d+$/, { message: VALIDATION_MESSAGES.NUMBER })
      .refine((val) => parseInt(val) > 0, {
        message: VALIDATION_MESSAGES.MIN_VALUE,
      }),
    day2Quantity: z
      .string({
        required_error: VALIDATION_MESSAGES.DAY2,
      })
      .min(1, { message: VALIDATION_MESSAGES.DAY2 })
      .regex(/^\d+$/, { message: VALIDATION_MESSAGES.NUMBER })
      .refine((val) => parseInt(val) > 0, {
        message: VALIDATION_MESSAGES.MIN_VALUE,
      }),
  })
  .refine(
    (data) => {
      return !(data.isAlcohol && !data.isCooking);
    },
    {
      message: VALIDATION_MESSAGES.ALCOHOL_REQUIRES_COOKING,
      path: ['isCooking'],
    }
  );

// 登録済み商品スキーマ（IDが必須）
export const registeredProductSchema = baseProductSchema.extend({
  id: z.string(),
});

// 入力用商品スキーマ（IDがオプショナル）
export const productInputSchema = baseProductSchema;

// フォームデータスキーマ
export const foodProductSchema = z.object({
  products: z
    .array(productSchema)
    .min(1, { message: VALIDATION_MESSAGES.MIN_PRODUCTS }),
});

// 型の自動生成
export type RegisteredProduct = z.infer<typeof registeredProductSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
export type FoodProductFormData = z.infer<typeof foodProductSchema>;

// 個別の商品型も必要に応じてエクスポート
export type Product = z.infer<typeof productSchema>;
export type BaseProduct = z.infer<typeof baseProductSchema>;
