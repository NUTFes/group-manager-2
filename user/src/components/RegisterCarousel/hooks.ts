import { useMemo } from 'react';
import { getDepartmentOptions, getGradeOptions } from '@/utils/list';
import { useTranslation } from 'next-i18next';

export const useRegisterCarouselTexts = () => {
  const { t } = useTranslation('common');

  const gradeOptions = useMemo(() => getGradeOptions(t), [t]);
  const departmentOptions = useMemo(() => getDepartmentOptions(t), [t]);

  return {
    steps: {
      email: t('registerCarousel.steps.email'),
      representative: t('registerCarousel.steps.representative'),
      confirm: t('registerCarousel.steps.confirm'),
    },
    labels: {
      email: t('registerCarousel.labels.email'),
      password: t('registerCarousel.labels.password'),
      passwordConfirm: t('registerCarousel.labels.passwordConfirm'),
      name: t('registerCarousel.labels.name'),
      tel: t('registerCarousel.labels.tel'),
      studentId: t('registerCarousel.labels.studentId'),
      grade: t('registerCarousel.labels.grade'),
      department: t('registerCarousel.labels.department'),
    },
    notes: {
      email: t('registerCarousel.notes.email'),
      password: t('registerCarousel.notes.password'),
      passwordConfirm: t('registerCarousel.notes.passwordConfirm'),
      name: t('registerCarousel.notes.name'),
      tel: t('registerCarousel.notes.tel'),
      studentId: t('registerCarousel.notes.studentId'),
    },
    review: {
      email: t('registerCarousel.review.email'),
      password: t('registerCarousel.review.password'),
      name: t('registerCarousel.review.name'),
      tel: t('registerCarousel.review.tel'),
      studentId: t('registerCarousel.review.studentId'),
      grade: t('registerCarousel.review.grade'),
      department: t('registerCarousel.review.department'),
    },
    buttons: {
      previous: t('registerCarousel.buttons.previous'),
      submit: t('registerCarousel.buttons.submit'),
      next: t('registerCarousel.buttons.next'),
    },
    options: {
      grades: gradeOptions,
      departments: departmentOptions,
    },
  };
};
