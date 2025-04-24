import { useCallback, useState } from 'react';
import { RegisterParams } from '@/types/register/user';
import { DepartmentList, GradeList } from '@/utils/list';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreatePluginType } from 'embla-carousel';
import { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { validateCurrentStepFields } from '@/components/RegisterCarousel/errorNavigation';
import { useAuth } from '@/hooks/useAuth';
import { RegisterFormSchema, RegisterSchema } from './schema';

export const useRegisterCarouselHooks = (onClose?: () => void) => {
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
  const gradeOptions = [{ id: 0, name: '選択してください' }, ...GradeList];
  const departmentOptions = [
    { id: 0, name: '選択してください' },
    ...DepartmentList,
  ];

  // 認証フックから必要な関数と状態を取得 (registerTrigger, registrationError -> register, getAuthActionError etc.)
  const { register: authRegister, isRegistering } = useAuth();
  // このコンポーネント専用のエラー表示状態
  const [displayError, setDisplayError] = useState<string | null>(null);

  const {
    // react-hook-form の register と区別するためリネーム
    register: formRegister,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
    trigger,
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
    mode: 'all',
  });

  const values = watch();

  const [stepIndex, setStepIndex] = useState<number>(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, containScroll: 'trimSnaps' },
    [createSelectPlugin()]
  );

  // 特定のステップに移動する関数
  const goToStep = useCallback(
    (step: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(step);
      setStepIndex(step);
    },
    [emblaApi]
  );

  const handleNext = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollNext()) return;
    if (stepIndex === 2) return;
    emblaApi.scrollNext();
    // selectedScrollSnap の更新が非同期の場合があるため setTimeout
    setTimeout(() => {
      if (emblaApi) {
        setStepIndex(emblaApi.selectedScrollSnap());
      }
    }, 0);
  }, [emblaApi, stepIndex]);

  const handlePrev = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollPrev()) return;
    emblaApi.scrollPrev();
    setStepIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // 現在のステップのフィールドを検証する関数
  const validateCurrentStep = useCallback(async () => {
    // errorNavigation.ts に依存している場合、そちらも修正が必要か確認
    return validateCurrentStepFields(errors, values, stepIndex, trigger);
  }, [errors, values, stepIndex, trigger]);

  // 登録処理 (try...catch を削除し、結果オブジェクトを確認)
  const onRegisterSubmit = async (data: RegisterFormSchema) => {
    setDisplayError(null); // 送信時にエラーをクリア

    // 現在のステップのバリデーション (これは react-hook-form のエラー)
    const hasValidationErrors = await validateCurrentStep();
    if (hasValidationErrors) {
      // バリデーションエラーがある場合、メッセージ表示は各フィールドで行われる想定
      // 必要ならここで全体的なメッセージを setDisplayError で設定
      // setDisplayError("入力内容に誤りがあります。");
      return;
    }

    // RegisterParams型に変換
    const registerData: RegisterParams = {
      name: data.name,
      studentId: data.studentId,
      tel: data.tel,
      mail: data.mail,
      departmentId: Number(data.departmentId),
      gradeId: Number(data.gradeId),
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      userId: 0, // userId はバックエンドで割り振られる想定？
    };

    console.log('登録実行:', registerData);
    // useAuth の register 関数を呼び出す
    const result = await authRegister(registerData);
    console.log('Registration result:', result);

    if (result.success) {
      toast.success('登録が完了しました。');
      if (onClose) onClose();
    } else {
      // API 呼び出し失敗時のエラーメッセージを表示
      const errorMessage =
        result.message || '登録処理中に不明なエラーが発生しました。';
      setDisplayError(errorMessage);
      // エラー内容に基づいて特定のステップに戻るロジックは一旦削除
      // navigateToErrorStep(errorMessage);
    }
  };

  return {
    // formRegister を register として返す
    register: formRegister,
    handleSubmit,
    errors,
    getValues,
    handleNext,
    handlePrev,
    onRegisterSubmit,
    stepIndex,
    emblaRef,
    emblaApi,
    values,
    setValue,
    gradeOptions,
    departmentOptions,
    isRegistering,
    displayError,
    trigger,
    goToStep,
    validateCurrentStep,
    // navigateToErrorStep は一旦返さない
  };
};
