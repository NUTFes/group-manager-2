import { z } from 'zod';

export const DEFAULT_ID = 1;
// NOTE: その他の選択肢のIDは11としている
const OTHER_OPTION_ID = 11;

export const venueApplicationFormSchema = z
  .object({
    groupId: z
      .number({ required_error: 'form.validation.required' })
      .int()
      .default(1),
    first: z.number({ required_error: 'form.validation.required' }),
    second: z.number({ required_error: 'form.validation.required' }),
    third: z.number({ required_error: 'form.validation.required' }),
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
          message: 'form.validation.duplicateChoice',
          path: [field],
        });
      }

      // その他の選択肢が選択された場合、備考に場所が入力されているかチェック
      if (value === OTHER_OPTION_ID && !data.remark) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'form.validation.remarkRequired',
          path: ['remark'],
        });
      }
    });
  });

export type VenueApplicationType = z.infer<typeof venueApplicationFormSchema>;
