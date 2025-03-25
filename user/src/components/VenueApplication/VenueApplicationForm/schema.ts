import { z } from 'zod';

export const venueApplicationFormSchema = z.object({
  groupId: z.number({ required_error: '入力してください' }).int().default(1),
  first: z.number({ required_error: '入力してください' }),
  second: z.number({ required_error: '入力してください' }),
  third: z.number({ required_error: '入力してください' }),
  remark: z.string().optional(),
});

export type VenueApplicationType = z.infer<typeof venueApplicationFormSchema>;
