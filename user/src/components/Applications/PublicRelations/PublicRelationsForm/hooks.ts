import { useEffect, useState } from 'react';
import {
  usePublicRelationData,
  usePublicRelationMutation,
} from '@/api/publicRelations';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { PublicRelationsFormData, publicRelationsSchema } from './schema';

export const usePublicRelationsFormHooks = (groupId: number) => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
    reset,
  } = useForm<PublicRelationsFormData>({
    mode: 'onSubmit',
    criteriaMode: 'all', // 全フィールド・全ルールを検証
    resolver: zodResolver(publicRelationsSchema),
    defaultValues: {
      prText: '',
      announce: 'no',
    },
  });

  const {
    publicRelation,
    error: fetchError,
    isLoading: isFetching,
    mutate,
  } = usePublicRelationData(groupId || 0);

  const {
    createMutation,
    updatePublicRelation,
    isLoading: isMutating,
  } = usePublicRelationMutation();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const values = watch();

  useEffect(() => {
    if (publicRelation) {
      reset({
        prText: publicRelation.pr_text || '',
        announce: publicRelation.announcement ? 'yes' : 'no',
      });

      if (publicRelation.image_url) {
        const imageName = publicRelation.image_url.split('/').pop();
        if (imageName) {
          setFileName(imageName);
        }
      }
    }
  }, [publicRelation, reset]);

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

        const fileNamePattern =
          /^[^\\/:*?"<>|\r\n]+_[^\\/:*?"<>|\r\n]+\.(png|jpe?g)$/;
        if (!fileNamePattern.test(file.name)) {
          setError('image', {
            type: 'manual',
            message:
              'ファイル名は「参加形式_団体名」で指定してください（拡張子含む）',
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

  // Imgurに画像をアップロードする関数
  const uploadImageToImgur = async (base64Image: string): Promise<string> => {
    const imgurClientId = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID;

    if (!imgurClientId) {
      throw new Error(
        'Imgur Client IDが設定されていません。環境変数を確認してください。'
      );
    }
    const base64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

    try {
      const response = await axios.post(
        'https://api.imgur.com/3/image',
        { image: base64 },
        {
          headers: {
            Authorization: `Client-ID ${imgurClientId}`,
          },
        }
      );

      return response.data.data.link;
    } catch (error) {
      console.error('Imgurアップロードエラー:', error);
      throw new Error('画像のアップロードに失敗しました');
    }
  };

  const onSubmit = async (formData: PublicRelationsFormData) => {
    try {
      let imageUrl = '';

      // 画像が選択されている場合はImgurにアップロード
      if (formData.image) {
        const base64Image = await convertImageToBase64(formData.image);
        imageUrl = await uploadImageToImgur(base64Image);
      }

      // バックエンドに送信するデータを準備
      const dataForApi: Record<string, string> = {
        group_id: groupId.toString(),
        blurb: formData.prText,
        announcement: formData.announce === 'yes' ? 'true' : 'false',
      };

      // 画像URLと画像名を追加
      if (imageUrl) {
        dataForApi.picture_name = formData.image?.name || '';
        dataForApi.picture_path = imageUrl;
      } else if (publicRelation?.image_url) {
        // 既存の画像を維持
        dataForApi.picture_name =
          publicRelation.image_url.split('/').pop() || '';
        dataForApi.picture_path = publicRelation.image_url;
      }

      // APIにデータを送信
      if (publicRelation) {
        await updatePublicRelation(groupId, dataForApi);
      } else {
        await createMutation.trigger({
          body: dataForApi,
        });
      }

      await mutate();
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      alert('送信しました');
    } catch (error) {
      console.error('送信エラー:', error);
      alert('送信に失敗しました。');
    }
  };

  return {
    handleSubmit,
    errors,
    setValue,
    values,
    isSubmitted,
    fileName,
    fetchError,
    isFetching,
    isMutating,
    handleImageUpload,
    handleAnnounceChange,
    announceOptions,
    onSubmit,
  };
};
