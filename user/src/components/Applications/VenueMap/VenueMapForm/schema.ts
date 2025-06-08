import { z } from 'zod';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

// API送信用スキーマ
const venueMapApiSchema = z.object({
  image: z
    .instanceof(File, { message: '画像をアップロードしてください' })
    .refine((file) => file.size < MAX_FILE_SIZE, {
      message: 'ファイルサイズは20MB未満にしてください',
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'ファイル形式はpngまたはjpegにしてください',
    })
    .optional(),
});

// UI用スキーマ
const checkListSchema = z.object({
  checklist: z
    .string()
    .array()
    .length(5, { message: 'すべての項目を確認してください。' }),
});

// フォーム全体のバリデーションスキーマ
export const venueMapFormSchema = venueMapApiSchema.merge(checkListSchema);

export type VenueMapFormData = z.infer<typeof venueMapFormSchema>;
