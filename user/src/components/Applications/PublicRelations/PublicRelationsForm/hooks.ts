import { useState } from 'react';
import {
  PublicRelationResponse,
  useCreatePublicRelation,
  usePublicRelationData,
  useUpdatePublicRelation,
} from '@/api/publicRelationsApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResolverOptions, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { PublicRelationsFormData, publicRelationsSchema } from './schema';

export const usePublicRelationsFormHooks = (
  groupId: number,
  publicRelationProp?: PublicRelationResponse | null
) => {
  const {
    publicRelation: fetchedPublicRelation,
    error: fetchPrError,
    isLoading: isPrFetching,
    mutate: prMutate,
  } = usePublicRelationData(groupId || 0);

  const publicRelation = publicRelationProp || fetchedPublicRelation;

  // カスタムバリデーションを実装
  const resolver = async (
    values: PublicRelationsFormData,
    context: unknown,
    options: ResolverOptions<PublicRelationsFormData>
  ) => {
    // 基本的なZodバリデーションを実行
    const result = await zodResolver(publicRelationsSchema)(
      values,
      context,
      options
    );

    // エラーオブジェクトを型安全に扱うためにキャスト
    const errors = result.errors as Record<
      string,
      { type: string; message: string }
    >;

    // 既存データを編集する場合は、画像が必須ではない
    if (publicRelation) {
      // 画像フィールドにエラーがあるか確認
      if (
        errors.image &&
        typeof errors.image === 'object' &&
        errors.image.type === 'custom' &&
        errors.image.message === '画像をアップロードしてください'
      ) {
        // 画像のエラーを削除
        delete errors.image;
      }
    } else {
      // 新規作成の場合は画像が必須
      if (!values.image) {
        errors.image = {
          type: 'custom',
          message: '画像をアップロードしてください',
        };
      }
    }

    return {
      values: result.values,
      errors: errors,
    };
  };

  // StageOptionsFormのパターンに合わせて、データが存在する場合のデフォルト値を設定
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm<PublicRelationsFormData>({
    mode: 'onSubmit',
    criteriaMode: 'all', // 全フィールド・全ルールを検証
    resolver: resolver,
    defaultValues: {
      prText: publicRelation?.blurb || '',
      announce: getDefaultAnnounceValue(),
    },
  });

  // アナウンス状態に基づいてデフォルト値を設定
  function getDefaultAnnounceValue() {
    // PublicRelationのisAnnouncementRequestedフィールドを使用
    if (publicRelation?.isAnnouncementRequested) {
      return 'yes';
    } else {
      return 'no'; // デフォルトは「いいえ」
    }
  }

  // PublicRelation API フック
  const {
    trigger: createPr,
    error: createPrError,
    isMutating: createPrIsMutating,
  } = useCreatePublicRelation();

  const updatePrId = publicRelation?.id || 0;
  const {
    trigger: updatePr,
    error: updatePrError,
    isMutating: updatePrIsMutating,
  } = useUpdatePublicRelation(updatePrId);

  // ファイル名はフォームの画像かAPIデータから取得する
  const [fileName, setFileName] = useState<string | null>(
    publicRelation?.pictureName || null
  );

  const values = watch();

  // 変更がある場合のみ送信ボタンを有効化する
  const validateEdit = () => {
    if (!publicRelation) return false;

    const hasTextChanged = values.prText !== publicRelation.blurb;
    // アナウンス選択の変更をチェック
    const isAnnounceRequested = publicRelation.isAnnouncementRequested || false;
    const hasAnnounceChanged =
      (values.announce === 'yes') !== isAnnounceRequested;
    const hasImageChanged = !!values.image;

    return !(hasTextChanged || hasAnnounceChanged || hasImageChanged);
  };

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const isSquare = img.width === img.height;
        if (!isSquare) {
          setError('image', {
            type: 'manual',
            message: '画像は正方形にしてください',
          });
          return resolve(false);
        }

        resolve(true);
      };
      img.onerror = () => {
        setError('image', {
          type: 'manual',
          message: '画像の読み込みに失敗しました',
        });
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg';
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];

        const isValid = await validateImage(file);
        if (isValid) {
          setValue('image', file);
          setFileName(file.name);
        }
      }
    };
    input.click();
  };

  const announceOptions = [
    { id: 1, name: 'はい' },
    { id: 0, name: 'いいえ' },
  ];

  const handleAnnounceChange = (value: string) => {
    setValue('announce', parseInt(value) === 1 ? 'yes' : 'no');
  };

  // 画像をbase64に変換する関数
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsDataURL(file);
    });
  };

  // Imgurに画像をアップロードする関数（Fetch API版）
  const uploadImageToImgur = async (base64Image: string): Promise<string> => {
    const imgurClientId = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID;

    if (!imgurClientId) {
      throw new Error(
        'Imgur Client IDが設定されていません。環境変数を確認してください。'
      );
    }
    const base64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

    try {
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${imgurClientId}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });

      if (!response.ok) {
        throw new Error(`エラー: ${response.status}`);
      }

      const data = await response.json();
      return data.data.link;
    } catch (error) {
      console.error('Imgurアップロードエラー:', error);
      throw new Error('画像のアップロードに失敗しました');
    }
  };

  // エラー処理を直接行う（useEffectではなく）
  if (createPrError || updatePrError) {
    toast.error('送信に失敗しました。時間を置いて再度お試しください');
  }

  // 更新されたonSubmit実装
  const onSubmit = async (formData: PublicRelationsFormData) => {
    try {
      let imageUrl = '';

      // 画像が選択されている場合はImgurにアップロード
      if (formData.image) {
        const base64Image = await convertImageToBase64(formData.image);
        imageUrl = await uploadImageToImgur(base64Image);
      }

      // PublicRelationデータを送信
      // バックエンドに送信するデータを準備
      const prQueryData = {
        groupId: Number(groupId),
        blurb: formData.prText,
        pictureName: '',
        picturePath: '',
        isAnnouncementRequested: formData.announce === 'yes', // アナウンス選択値を保存
      };

      // 画像URLと画像名を追加
      if (formData.image && imageUrl) {
        // 新しい画像がアップロードされた場合
        prQueryData.pictureName = formData.image.name || '';
        prQueryData.picturePath = imageUrl;
      } else if (publicRelation) {
        // 新しい画像がアップロードされていない場合は既存の画像を維持
        const imagePath = publicRelation.picturePath;
        const imageName = publicRelation.pictureName;

        if (imagePath && imageName) {
          prQueryData.pictureName = imageName;
          prQueryData.picturePath = imagePath;
        }
      }

      // PR関連APIにデータを送信
      if (publicRelation) {
        // 既存データの更新 (PUT)
        await updatePr({ query: prQueryData });
      } else {
        // 新規作成 (POST)
        await createPr({ query: prQueryData });
      }

      // データ更新後、mutateで最新データを取得
      await prMutate();
      mutate(`check_all_registered/${groupId}`);

      toast.success('送信しました');
      return true; // 送信成功を返す
    } catch (error) {
      console.error('送信エラー:', error);
      toast.error('送信に失敗しました。時間を置いて再度お試しください');
      return false; // 送信失敗を返す
    }
  };

  return {
    handleSubmit,
    errors,
    setValue,
    values,
    fileName,
    fetchError: fetchPrError,
    isFetching: isPrFetching,
    isMutating: createPrIsMutating || updatePrIsMutating,
    handleImageUpload,
    handleAnnounceChange,
    announceOptions,
    onSubmit,
    createError: createPrError,
    updateError: updatePrError,
    validateEdit,
  };
};
