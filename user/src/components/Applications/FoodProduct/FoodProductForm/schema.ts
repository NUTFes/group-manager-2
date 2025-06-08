import { z } from 'zod';

// ベースとなる商品スキーマ
const baseProductSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  isAlcohol: z.boolean(),
  hasLicense: z.boolean(),
  day1Quantity: z.string(),
  day2Quantity: z.string(),
});

// バリデーション用の商品スキーマ（フォーム送信時）
const productSchema = z
  .object({
    id: z.string().optional(),
    name: z
      .string({
        required_error: '販売品名を入力してください',
      })
      .min(1, { message: '販売品名を入力してください' }),
    isAlcohol: z.boolean({
      required_error: '酒類かどうかを選択してください',
    }),
    hasLicense: z.boolean({
      required_error: '調理の有無を選択してください',
    }),
    day1Quantity: z
      .string({
        required_error: '1日目の販売予定数を入力してください',
      })
      .min(1, { message: '1日目の販売予定数を入力してください' })
      .regex(/^\d+$/, { message: '半角数字で入力してください' }),
    day2Quantity: z
      .string({
        required_error: '2日目の販売予定数を入力してください',
      })
      .min(1, { message: '2日目の販売予定数を入力してください' })
      .regex(/^\d+$/, { message: '半角数字で入力してください' }),
  })
  .refine(
    (data) => {
      return !(data.isAlcohol && !data.hasLicense);
    },
    {
      message: '酒類を販売する場合は調理の有無を「有り」にしてください',
      path: ['hasLicense'],
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
    .min(1, { message: '少なくとも1つの販売品を登録してください' }),
});

// 型の自動生成
export type RegisteredProduct = z.infer<typeof registeredProductSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
export type FoodProductFormData = z.infer<typeof foodProductSchema>;

// 個別の商品型も必要に応じてエクスポート
export type Product = z.infer<typeof productSchema>;
export type BaseProduct = z.infer<typeof baseProductSchema>;
