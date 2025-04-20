import { z } from 'zod';

export const stageOptionSchema = z.object({
  groupId: z.number({ required_error: '入力してください' }).int(),
  ownEquipment: z.boolean({ required_error: '入力してください' }),
  bgm: z.boolean({ required_error: '入力してください' }),
  cameraPermission: z.boolean({ required_error: '入力してください' }),
  loudSound: z.boolean({ required_error: '入力してください' }),
});

export type StageOptionForm = z.infer<typeof stageOptionSchema>;
