import { z } from 'zod';
import { POWER_LIMIT, VALIDATION_MESSAGES } from './constants';
import { Device } from './types';

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
    .max(POWER_LIMIT, { message: VALIDATION_MESSAGES.MAX_POWER }),
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
  .refine((data) => calculateTotalPower(data.devices) <= POWER_LIMIT, {
    message: VALIDATION_MESSAGES.TOTAL_POWER_LIMIT,
    path: ['devices'],
  });

export type PowerApplicationFormData = z.infer<typeof powerApplicationSchema>;
