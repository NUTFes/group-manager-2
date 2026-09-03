import { FC, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import Button from '@/components/Button';
import Selector from '@/components/Form/Selector';
import TextBox from '@/components/Form/TextBox';
import Modal from '@/components/Modal';
import { useRegisterCarouselTexts } from './hooks';
// 統合フックの代わりに3つの個別フックをインポート
import { useCarousel } from './useCarousel';
import { useRegisterForm } from './useRegisterForm';
import { useRegistration } from './useRegistration';

type RegisterCarouselProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FormStepTexts = {
  email: string;
  representative: string;
  confirm: string;
};

type FormStepProps = {
  step: number;
  steps: FormStepTexts;
};

const FormStep: FC<FormStepProps> = ({ step, steps }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-[81px] w-[388px]">
        <div className="absolute left-[6px] top-0 h-14 w-[376px]">
          <div
            className={`absolute left-[72px] top-[24px] h-2 w-20 ${
              step >= 1 ? 'bg-main' : 'bg-[#b2b2b2]'
            }`}
          />
          <div
            className={`absolute left-[224px] top-[24px] h-2 w-20 ${
              step >= 2 ? 'bg-main' : 'bg-[#b2b2b2]'
            }`}
          />
          <div
            className={`absolute left-[8px] top-0 size-14 rounded-full ${
              step >= 0 ? 'bg-main' : 'bg-[#b2b2b2]'
            }`}
          />
          <div
            className={`absolute left-[160px] top-0 size-14 rounded-full ${
              step >= 1 ? 'bg-main' : 'bg-[#b2b2b2]'
            }`}
          />
          <div
            className={`absolute left-[312px] top-0 size-14 rounded-full ${
              step === 2 ? 'bg-main' : 'bg-[#b2b2b2]'
            }`}
          />
          <div className="absolute left-[28px] top-[9px] inline-flex h-[38px] w-4 flex-col items-center justify-start pb-[7px]">
            <div className="text-center text-[26px] text-baseColor">1</div>
          </div>
          <div className="absolute left-[180px] top-[9px] inline-flex h-[38px] w-4 flex-col items-center justify-start pb-[7px]">
            <div className="text-center text-[26px] text-baseColor">2</div>
          </div>
          <div className="absolute left-[332px] top-[9px] inline-flex h-[38px] w-4 flex-col items-center justify-start pb-[7px]">
            <div className="text-center text-[26px] text-baseColor">3</div>
          </div>
        </div>
        <div className="absolute left-0 top-[64px] inline-flex h-[17px] w-[84px] items-center justify-center pb-[3px]">
          <div className="text-center text-xs text-font">{steps.email}</div>
        </div>
        <div className="absolute left-[153px] top-[64px] inline-flex h-[17px] w-[84px] items-center justify-center pb-[3px] pl-[11.58px] pr-[12.42px]">
          <div className="text-center text-xs text-font">
            {steps.representative}
          </div>
        </div>
        <div className="absolute left-[304px] top-[64px] inline-flex h-[17px] w-[84px] items-center justify-center pb-[3px]">
          <div className="text-center text-xs text-font">{steps.confirm}</div>
        </div>
      </div>
    </div>
  );
};

const Carousel: FC<RegisterCarouselProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common');
  const registerCarouselTexts = useRegisterCarouselTexts();
  const {
    steps,
    labels,
    notes,
    review,
    buttons,
    options: carouselOptions,
  } = registerCarouselTexts;
  const gradeOptions = carouselOptions.grades;
  const departmentOptions = carouselOptions.departments;
  // カルーセル関連のフック
  const {
    stepIndex,
    emblaRef,
    handleNext: carouselNext,
    handlePrev: carouselPrev,
    goToStep,
  } = useCarousel();

  // フォーム関連のフック
  const {
    formState: { errors },
    values,
    handleSubmit,
    setValue,
    trigger,
    validateCurrentStep,
  } = useRegisterForm();

  // 登録処理関連のフック
  const { handleSignUpSubmit, isLoading, displayError } = useRegistration(
    validateCurrentStep,
    goToStep,
    stepIndex,
    handleSubmit
  );

  // フォーム参照の作成
  const formRef = useRef<HTMLFormElement>(null);

  const getErrorMessage = (message?: string) =>
    message ? t(message) : undefined;

  // 登録ボタンのクリックハンドラ
  const handleRegisterClick = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // デフォルトのボタン動作を防止

    // すべてのフィールドのバリデーションを実行
    const hasErrors = await validateCurrentStep(stepIndex);
    if (hasErrors) {
      return;
    }

    // フォームを明示的に送信
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }
  };

  // 次へボタンのクリックハンドラ
  const handleNextClick = async () => {
    // 現在のステップのバリデーションチェック
    const hasErrors = await validateCurrentStep(stepIndex);
    if (hasErrors) {
      return;
    }

    // 問題がなければ次のステップへ
    if (stepIndex < 2) {
      carouselNext();
    }
  };

  // 戻るボタンのクリックハンドラ
  const handlePrev = () => {
    carouselPrev();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSignUpSubmit} ref={formRef} noValidate>
        <section className="rounded-2xl bg-white px-60 py-10 shadow-md md:px-32 md:py-5">
          <FormStep step={stepIndex} steps={steps} />
          <div
            className="mx-auto max-h-[60vh] w-[450px] overflow-y-auto overflow-x-hidden pt-4"
            ref={emblaRef}
          >
            <div className="flex">
              <div className="min-w-0 flex-none  basis-full p-4">
                <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-baseColor">
                  <TextBox
                    label={labels.email}
                    type="email"
                    value={values.mail}
                    note={notes.email}
                    required
                    error={getErrorMessage(errors.mail?.message)}
                    onChange={(value: string) => setValue('mail', value)}
                    onBlur={() => trigger('mail')}
                  />
                  <TextBox
                    label={labels.password}
                    type="password"
                    value={values.password}
                    note={notes.password}
                    required
                    error={getErrorMessage(errors.password?.message)}
                    onChange={(value: string) => setValue('password', value)}
                    onBlur={() => trigger('password')}
                  />
                  <TextBox
                    label={labels.passwordConfirm}
                    type="password"
                    value={values.passwordConfirm}
                    note={notes.passwordConfirm}
                    required
                    error={getErrorMessage(errors.passwordConfirm?.message)}
                    onChange={(value: string) =>
                      setValue('passwordConfirm', value)
                    }
                    onBlur={() => trigger('passwordConfirm')}
                  />
                </div>
              </div>
              <div className="min-w-0 flex-none basis-full p-4">
                <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-baseColor">
                  <TextBox
                    label={labels.name}
                    value={values.name}
                    note={notes.name}
                    required
                    error={getErrorMessage(errors.name?.message)}
                    onChange={(value: string) => setValue('name', value)}
                    onBlur={() => trigger('name')}
                  />
                  <TextBox
                    label={labels.tel}
                    value={values.tel}
                    note={notes.tel}
                    required
                    error={getErrorMessage(errors.tel?.message)}
                    onChange={(value: string) => setValue('tel', value)}
                    onBlur={() => trigger('tel')}
                  />
                  <TextBox
                    label={labels.studentId}
                    value={values.studentId}
                    note={notes.studentId}
                    required
                    error={getErrorMessage(errors.studentId?.message)}
                    onChange={(value: string) => setValue('studentId', value)}
                    onBlur={() => trigger('studentId')}
                  />
                  <Selector
                    label={labels.grade}
                    required
                    onChange={(value: string) =>
                      setValue('gradeId', Number(value))
                    }
                    options={gradeOptions}
                    value={values.gradeId}
                    error={getErrorMessage(errors.gradeId?.message)}
                  />
                  <Selector
                    label={labels.department}
                    required
                    onChange={(value: string) =>
                      setValue('departmentId', Number(value))
                    }
                    options={departmentOptions}
                    value={values.departmentId}
                    error={getErrorMessage(errors.departmentId?.message)}
                  />
                </div>
              </div>
              <div className="min-w-0 flex-none basis-full p-4">
                <div className="flex flex-col items-center space-y-4 rounded-lg bg-baseColor">
                  <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                    <div className="inline-flex w-full items-center justify-start pr-[81px]">
                      <div className="text-xs font-black text-font">
                        {review.email}
                      </div>
                    </div>
                    <div className="inline-flex h-[38px] w-[298px] items-center justify-start pr-[68px]">
                      <div className="text-base font-medium text-font">
                        {values.mail}
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                    <div className="inline-flex h-[17px] items-center justify-start pr-[81px]">
                      <div className="text-xs font-black text-font">
                        {review.password}
                      </div>
                    </div>
                    <div className="inline-flex h-[38px] w-[298px] items-center justify-start pr-[68px]">
                      <div className="text-base font-medium text-font">
                        {'*'.repeat(values.password.length)}
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                    <div className="inline-flex h-[17px] items-center justify-start pr-[81px]">
                      <div className="text-xs font-black text-font">
                        {review.name}
                      </div>
                    </div>
                    <div className="inline-flex h-[38px] w-[298px] items-center justify-start pr-[68px]">
                      <div className="text-base font-medium text-font">
                        {values.name}
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                    <div className="inline-flex h-[17px] items-center justify-start pr-[81px]">
                      <div className="text-xs font-black text-font">
                        {review.tel}
                      </div>
                    </div>
                    <div className="inline-flex h-[38px] w-[298px] items-center justify-start pr-[68px]">
                      <div className="text-base font-medium text-font">
                        {values.tel}
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                    <div className="inline-flex h-[17px] items-center justify-start pr-[81px]">
                      <div className="text-xs font-black text-font">
                        {review.studentId}
                      </div>
                    </div>
                    <div className="inline-flex h-[38px] w-[298px] items-center justify-start pr-[68px]">
                      <div className="text-base font-medium text-font">
                        {values.studentId}
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                    <div className="inline-flex h-[17px] items-center justify-start pr-[81px]">
                      <div className="text-xs font-black text-font">
                        {review.grade}
                      </div>
                    </div>
                    <div className="inline-flex h-[38px] w-[298px] items-center justify-start pr-[68px]">
                      <div className="text-base font-medium text-font">
                        {
                          gradeOptions.find(
                            (grade) => grade.id === values.gradeId
                          )?.name
                        }
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                    <div className="inline-flex h-[17px] items-center justify-start pr-[81px]">
                      <div className="text-xs font-black text-font">
                        {review.department}
                      </div>
                    </div>
                    <div className="inline-flex h-[65px] w-[298px] items-center justify-start">
                      <div className="text-base font-medium text-font">
                        {
                          departmentOptions.find(
                            (department) =>
                              department.id === values.departmentId
                          )?.name
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* エラーメッセージ表示領域 */}
          {displayError && (
            <div className="mt-4 text-center text-sm text-red-600">
              {displayError}
            </div>
          )}

          <div className="mt-4 flex justify-center gap-4">
            {stepIndex === 0 ? (
              <div />
            ) : (
              <Button
                size="pc"
                color="main"
                onClick={handlePrev}
                type="button"
                variant
                icon="lessThan"
                isDisable={isLoading}
              >
                {buttons.previous}
              </Button>
            )}
            {stepIndex === 2 ? (
              <Button
                size="pc"
                color="main"
                type="button"
                onClick={handleRegisterClick}
                isDisable={isLoading}
              >
                {buttons.submit}
              </Button>
            ) : (
              <Button
                size="pc"
                color="main"
                type="button"
                onClick={handleNextClick}
                isDisable={isLoading}
              >
                {buttons.next}
              </Button>
            )}
          </div>
        </section>
      </form>
    </Modal>
  );
};

export default Carousel;
