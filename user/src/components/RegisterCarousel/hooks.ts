import { useCallback, useEffect, useState } from 'react';
import { DepartmentList, GradeList } from '@/utils/list';
import { zodResolver } from '@hookform/resolvers/zod';
import useEmblaCarousel from 'embla-carousel-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { RegisterFormSchema, RegisterSchema } from './schema';

export const useRegisterCarouselHooks = () => {
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
  });

  const values = watch();

  const [stepIndex, setStepIndex] = useState<number>(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    containScroll: 'trimSnaps',
  });

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

  // Embla の select イベントで stepIndex を更新
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setStepIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    // 初期表示も反映
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // todo: 送信処理を実装する
  const onSubmit = () => {
    toast.success('登録が完了しました。');
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
    gradeOptions,
    departmentOptions,
  };
};
