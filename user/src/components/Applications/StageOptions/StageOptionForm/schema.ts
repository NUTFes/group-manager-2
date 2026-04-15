import { z } from 'zod';

export const stageOptionSchema = z.object({
  groupId: z.number({ required_error: 'form.validation.required' }).int(),
  ownEquipment: z.boolean({ required_error: 'form.validation.required' }),
  bgm: z.boolean({ required_error: 'form.validation.required' }),
  cameraPermission: z.boolean({ required_error: 'form.validation.required' }),
  loudSound: z.boolean({ required_error: 'form.validation.required' }),
});

export type StageOptionForm = z.infer<typeof stageOptionSchema>;
