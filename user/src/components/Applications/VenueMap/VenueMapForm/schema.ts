import { z } from 'zod';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

export const venueMapSchema = z.object({
  image: z
    .any()
    .refine(
      (files) => {
        if (!files || typeof files === 'string' || files.length === 0)
          return true;
        return files[0].size <= MAX_FILE_SIZE;
      },
      { message: `ファイルサイズは20MBまでです。` }
    )
    .refine(
      (files) => {
        if (!files || typeof files === 'string' || files.length === 0)
          return true;
        return ACCEPTED_IMAGE_TYPES.includes(files[0].type);
      },
      { message: 'ファイル形式はpng、jpegのみです。' }
    )
    .optional(),
  checklist: z
    .string()
    .array()
    .length(5, { message: 'すべての項目を確認してください。' }),
});

export type VenueMapFormData = z.infer<typeof venueMapSchema>;
