import { FireEquipmentFuel } from '@/api/fireEquipmentApi';
import { z } from 'zod';

export const VALIDATION_MESSAGES = {
  REQUIRED: 'applications.fireEquipment.validation.required',
  QUANTITY: 'applications.fireEquipment.validation.quantity',
  FUEL: 'applications.fireEquipment.validation.fuel',
  REMARK_REQUIRED: 'applications.fireEquipment.validation.remarkRequired',
} as const;

const fireEquipmentFuelArray = Object.values(FireEquipmentFuel).filter(
  (v) => typeof v === 'number'
) as number[];

export const FireEquipmentItemSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    quantity: z.number().min(1, VALIDATION_MESSAGES.QUANTITY),
    fuel: z.number().refine((v) => fireEquipmentFuelArray.includes(v), {
      message: VALIDATION_MESSAGES.FUEL,
    }),
    usage: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
    isTakeaway: z.boolean(),
    remarks: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isTakeaway && (data.remarks ?? '') === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_MESSAGES.REMARK_REQUIRED,
        path: ['remarks'],
      });
    }
  });

export const FireEquipmentFormSchema = z.object({
  items: z.array(FireEquipmentItemSchema).min(1),
});

export type FireEquipmentItemValues = z.infer<typeof FireEquipmentItemSchema>;
export type FireEquipmentFormValues = z.infer<typeof FireEquipmentFormSchema>;
