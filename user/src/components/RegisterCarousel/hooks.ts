import { useCallback, useEffect, useState } from 'react';
import { RegisterParams } from '@/types/register/user';
import { DepartmentList, GradeList } from '@/utils/list';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreatePluginType } from 'embla-carousel';
import { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  determineErrorStep,
  handleRegistrationError,
  validateCurrentStepFields,
} from '@/components/RegisterCarousel/errorNavigation';
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

  // 認証フック
  const { registerTrigger, isRegistering, registrationError } = useAuth();
  const [displayError, setDisplayError] = useState<string | null>(null);

  const {
    register,
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
    mode: 'all', // フィールドを blur（フォーカスアウト）したタイミングで初回バリデーション
    // reValidateMode: 'onChange', // 一度エラーが出たフィールドは change のたびに再バリデーション
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
    setTimeout(() => {
      setStepIndex(emblaApi.selectedScrollSnap());
    }, 0);
  }, [emblaApi, stepIndex]);

  const handlePrev = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollPrev()) return;
    emblaApi.scrollPrev();
    setStepIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // エラーメッセージの監視
  useEffect(() => {
    setDisplayError(registrationError);
  }, [registrationError]);

  // エラーに応じて適切なステップに移動する関数
  const navigateToErrorStep = useCallback(
    (errorMessage: string) => {
      const errorStep = determineErrorStep(errorMessage);
      if (errorStep >= 0) {
        goToStep(errorStep);
      }
    },
    [goToStep]
  );

  // 現在のステップのフィールドを検証する関数
  const validateCurrentStep = useCallback(async () => {
    return validateCurrentStepFields(errors, values, stepIndex, trigger);
  }, [errors, values, stepIndex, trigger]);

  // 登録処理を実装
  const onRegisterSubmit = async (data: RegisterFormSchema) => {
    try {
      setDisplayError(null); // 送信時にエラーをクリア

      // 現在のステップのバリデーションを確認
      const hasErrors = await validateCurrentStep();
      if (hasErrors) {
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
        userId: 0,
      };

      console.log('登録実行:', registerData);
      const result = await registerTrigger(registerData);

      console.log('Registration trigger result:', result);

      if (result?.success) {
        toast.success('登録が完了しました。');
        if (onClose) onClose();
      } else {
        // エラー処理を共通関数で実行
        handleRegistrationError(
          result,
          registrationError,
          setDisplayError,
          goToStep
        );
      }
    } catch (error) {
      console.error('Registration error:', error);

      // エラーメッセージを取得
      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = '登録処理中に予期せぬエラーが発生しました。';
      }

      // エラーメッセージを表示
      setDisplayError(errorMessage);

      // エラーに基づいて適切なステップに移動
      navigateToErrorStep(errorMessage);
    }
  };

  // registrationErrorが変更された時に適切なステップに移動する
  useEffect(() => {
    if (registrationError) {
      navigateToErrorStep(registrationError);
    }
  }, [registrationError, navigateToErrorStep]);

  return {
    register,
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
    navigateToErrorStep,
  };
};
