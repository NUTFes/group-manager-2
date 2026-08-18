import { z } from 'zod';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

export const VALIDATION_MESSAGES = {
  IMAGE: 'applications.venueMap.validation.imageRequired',
  FILE_SIZE: 'applications.venueMap.validation.fileSize',
  FILE_TYPE: 'applications.venueMap.validation.fileType',
  CHECKLIST: 'applications.venueMap.validation.checklist',
} as const;

// API送信用スキーマ
const venueMapApiSchema = z.object({
  image: z
    .instanceof(File, { message: VALIDATION_MESSAGES.IMAGE })
    .refine((file) => file.size < MAX_FILE_SIZE, {
      message: VALIDATION_MESSAGES.FILE_SIZE,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: VALIDATION_MESSAGES.FILE_TYPE,
    })
    .optional(),
});

// UI用スキーマ
const checkListSchema = z.object({
  checklist: z
    .string()
    .array()
    .length(5, { message: VALIDATION_MESSAGES.CHECKLIST }),
});

// フォーム全体のバリデーションスキーマ
export const venueMapFormSchema = venueMapApiSchema.merge(checkListSchema);

export type VenueMapFormData = z.infer<typeof venueMapFormSchema>;
