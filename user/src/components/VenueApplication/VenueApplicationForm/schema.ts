import { z } from 'zod';

export const DEFAULT_ID = 1;
export const venueApplicationFormSchema = z
  .object({
    groupId: z.number({ required_error: '入力してください' }).int().default(1),
    first: z.number({ required_error: '入力してください' }),
    second: z.number({ required_error: '入力してください' }),
    third: z.number({ required_error: '入力してください' }),
    remark: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const fields = [
      { field: 'first', value: data.first },
      { field: 'second', value: data.second },
      { field: 'third', value: data.third },
    ];
    const freq: Record<number, number> = {};
    fields.forEach(({ value }) => {
      if (value !== DEFAULT_ID) {
        freq[value] = (freq[value] || 0) + 1;
      }
    });
    fields.forEach(({ field, value }) => {
      if (value !== DEFAULT_ID && freq[value] > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '希望が重複しています',
          path: [field],
        });
      }
    });
  });

export type VenueApplicationType = z.infer<typeof venueApplicationFormSchema>;
