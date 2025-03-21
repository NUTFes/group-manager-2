import { z } from 'zod';

export const stageOptionSchema = z.object({
  groupId: z.number({ required_error: '入力してください' }).int().default(1),
  ownEquipment: z.number({ required_error: '入力してください' }),
  bgm: z.number({ required_error: '入力してください' }),
  cameraPermission: z.number({ required_error: '入力してください' }),
  loudSound: z.number({ required_error: '入力してください' }),
  //   remarks: z.string().optional(),
});

export type StageOptionForm = z.infer<typeof stageOptionSchema>;
