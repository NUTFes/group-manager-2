import { useCallback, useState } from 'react';
import { DepartmentList, GradeList } from '@/utils/list';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import type { CreatePluginType } from 'embla-carousel';
import { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { RegisterFormSchema, RegisterSchema } from './schema';

export const useRegisterCarouselHooks = () => {
  // ① プラグインの型を定義
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  type SelectPlugin = CreatePluginType<Record<string, unknown>, {}>;

  // ② プラグイン生成関数
  const createSelectPlugin = (): SelectPlugin => {
    let emblaApiRef: EmblaCarouselType;
    let handler: () => void;

    return {
      name: 'selectPlugin',
      options: {},

      // 初期化時に呼ばれるメソッド
      init: (emblaApi) => {
        emblaApiRef = emblaApi;
        handler = () => {
          // emblaApiRef が最新のスナップ位置を state に反映
          setStepIndex(emblaApiRef.selectedScrollSnap());
        };
        emblaApiRef.on('select', handler);
        // モーダル開閉時など初期同期用
        handler();
      },

      // クリーンアップ
      destroy: () => {
        emblaApiRef.off('select', handler);
      },
    };
  };

  // const router = useRouter();
  const gradeOptions = [{ id: 0, name: '選択してください' }, ...GradeList];
  const departmentOptions = [
    { id: 0, name: '選択してください' },
    ...DepartmentList,
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      studentId: '',
      mail: '',
      password: '',
      passwordConfirm: '',
      gradeId: 0,
      departmentId: 0,
      tel: '',
    },
    mode: 'all', // フィールドを blur（フォーカスアウト）したタイミングで初回バリデーション
    // reValidateMode: 'onChange', // 一度エラーが出たフィールドは change のたびに再バリデーション
  });
  const values = watch();

  const [stepIndex, setStepIndex] = useState<number>(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, containScroll: 'trimSnaps' },
    [createSelectPlugin()]
  );

  const handleNext = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollNext()) return;
    emblaApi.scrollNext();
    setTimeout(() => {
      setStepIndex(emblaApi.selectedScrollSnap());
    }, 0);
  }, [emblaApi]);

  const handlePrev = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollPrev()) return;
    emblaApi.scrollPrev();
    setStepIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // サインアップ処理の実装
  const onSubmit = async (data: RegisterFormSchema) => {
    console.log('onSubmit called with form data:', data);
    console.log('Current values state:', values);

    try {
      // バリデーションチェック
      if (data.password !== data.passwordConfirm) {
        toast.error('パスワードが一致しません');
        return;
      }

      // 外部のRails APIを直接呼び出す
      const RAILS_API_URL = 'http://localhost:3000';

      console.log('Sending API request to:', `${RAILS_API_URL}/api/auth`);

      const response = await axios.post(
        `${RAILS_API_URL}/api/auth`,
        {
          email: data.mail,
          password: data.password,
          password_confirmation: data.passwordConfirm,
          name: data.name,
          role_id: 2, // 適切なrole_idを設定
          // User_detailsテーブル用のデータを追加
          user_details: {
            tel: data.tel,
            grade_id: data.gradeId,
            department_id: data.departmentId,
            student_id: data.studentId,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      console.log('API response:', response);

      // 成功した場合
      toast.success('登録が完了しました');

      // 登録成功後の処理（例：ログインページへリダイレクト）
      // router.push('/');
    } catch (error: any) {
      console.error('サインアップエラー:', error);

      // エラーメッセージの表示
      let errorMessage = 'サインアップに失敗しました';
      if (error.response && error.response.data && error.response.data.errors) {
        // APIからのエラーメッセージがある場合はそれを表示
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errorMessage = errors.join(', ');
        } else if (typeof errors === 'object') {
          errorMessage = Object.values(errors).join(', ');
        }
      }

      toast.error(errorMessage);
    }
  };

  // TextBoxやSelector用の入力ハンドラーを拡張
  const handleInputChange = (name: keyof RegisterFormSchema, value: any) => {
    console.log(`Setting ${name} to:`, value);
    setValue(name, value);
  };

  return {
    register,
    handleSubmit,
    errors,
    getValues,
    handleNext,
    handlePrev,
    onSubmit,
    stepIndex,
    emblaRef,
    emblaApi,
    values,
    setValue,
    handleInputChange,
    gradeOptions,
    departmentOptions,
  };
};
