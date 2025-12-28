import { z } from 'zod';

export const publicRelationsSchema = z.object({
  prText: z
    .string({
      required_error: '入力してください',
    })
    .min(1, { message: '入力してください' })
    // 日本語の文字数チェック
    .refine(
      (text) => !/[\u3040-\u30FF\u4E00-\u9FAF]/.test(text) || text.length <= 50,
      { message: '日本語は50文字以内で入力してください' }
    )
    // 英語の単語数チェック
    .refine(
      (text) =>
        /[\u3040-\u30FF\u4E00-\u9FAF]/.test(text) ||
        text.split(/\s+/).filter(Boolean).length <= 25,
      { message: '英語は25単語以内で入力してください' }
    ),
  announce: z.enum(['yes', 'no'], {
    required_error: '選択してください',
  }),
  image: z
    .instanceof(File, { message: '画像をアップロードしてください' })
    .refine((file) => file.size < 10 * 1024 * 1024, {
      message: 'ファイルサイズは10MB未満にしてください',
    })
    .refine((file) => ['image/png', 'image/jpeg'].includes(file.type), {
      message: 'ファイル形式はpngまたはjpegにしてください',
    })
    .optional(),
});

export type PublicRelationsFormData = z.infer<typeof publicRelationsSchema>;
