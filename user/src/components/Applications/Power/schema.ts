import { z } from 'zod';
import { Device } from './types';

// バリデーションメッセージの定数
const VALIDATION_MESSAGES = {
  REQUIRED_PRODUCT_NAME: '製品名を入力してください',
  REQUIRED_MANUFACTURER: 'メーカー名を入力してください',
  REQUIRED_MODEL: '型番を入力してください',
  INVALID_URL: '有効なURLを入力してください',
  INVALID_NUMBER: '数値を入力してください',
  MIN_POWER: '1W以上で入力してください',
  MAX_POWER: '1500W以下で入力してください',
  MIN_DEVICES: '少なくとも1つの機器を登録してください',
  TOTAL_POWER_LIMIT: '合計消費電力は1500W以下にしてください',
};

// 合計電力を計算する関数
const calculateTotalPower = (devices: Partial<Device>[]) => {
  return devices.reduce((sum, device) => sum + (device.maxPower || 0), 0);
};

export const deviceSchema = z.object({
  id: z.number().optional(),
  productName: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED_PRODUCT_NAME }),
  maxPower: z
    .number({ invalid_type_error: VALIDATION_MESSAGES.INVALID_NUMBER })
    .min(1, { message: VALIDATION_MESSAGES.MIN_POWER })
    .max(1500, { message: VALIDATION_MESSAGES.MAX_POWER }),
  manufacturer: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.REQUIRED_MANUFACTURER }),
  model: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED_MODEL }),
  url: z
    .string()
    .url({ message: VALIDATION_MESSAGES.INVALID_URL })
    .optional()
    .or(z.literal('')),
});

export const powerApplicationSchema = z
  .object({
    devices: z
      .array(deviceSchema)
      .min(1, { message: VALIDATION_MESSAGES.MIN_DEVICES }),
  })
  .refine((data) => calculateTotalPower(data.devices) <= 1500, {
    message: VALIDATION_MESSAGES.TOTAL_POWER_LIMIT,
    path: ['devices'],
  });

export type PowerApplicationFormData = z.infer<typeof powerApplicationSchema>;
