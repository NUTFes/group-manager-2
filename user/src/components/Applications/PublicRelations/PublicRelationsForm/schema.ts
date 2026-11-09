import { z } from 'zod';

export const publicRelationsSchema = z.object({
  prText: z
    .string({
      required_error: 'form.validation.required',
    })
    .min(1, { message: 'form.validation.required' })
    // 日本語の文字数チェック
    .refine(
      (text) => !/[\u3040-\u30FF\u4E00-\u9FAF]/.test(text) || text.length <= 50,
      { message: 'applications.publicRelations.validation.jpLimit' }
    )
    // 英語の単語数チェック
    .refine(
      (text) =>
        /[\u3040-\u30FF\u4E00-\u9FAF]/.test(text) ||
        text.split(/\s+/).filter(Boolean).length <= 25,
      { message: 'applications.publicRelations.validation.enLimit' }
    ),
  announce: z.enum(['yes', 'no'], {
    required_error: 'form.validation.select',
  }),
  image: z
    .instanceof(File, {
      message: 'applications.publicRelations.validation.imageRequired',
    })
    .refine((file) => file.size < 10 * 1024 * 1024, {
      message: 'applications.publicRelations.validation.sizeLimit',
    })
    .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {
      message: 'applications.publicRelations.validation.format',
    })
    .optional(),
});

export type PublicRelationsFormData = z.infer<typeof publicRelationsSchema>;
