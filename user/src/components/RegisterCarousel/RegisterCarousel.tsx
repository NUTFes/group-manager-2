import { FC, useRef } from 'react';
import { DepartmentList, GradeList } from '@/utils/list';
import Button from '@/components/Button';
import Selector from '@/components/Form/Selector';
import TextBox from '@/components/Form/TextBox';
import Modal from '@/components/Modal';
import { useRegisterCarouselHooks } from './hooks';
import { RegisterFormSchema } from './schema';

type RegisterCarouselProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FormStepProps = {
  step: number;
};

const FormStep: FC<FormStepProps> = ({ step }) => {
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
          <div className="text-center text-xs text-font">メールアドレス</div>
        </div>
        <div className="absolute left-[153px] top-[64px] inline-flex h-[17px] w-[84px] items-center justify-center pb-[3px] pl-[11.58px] pr-[12.42px]">
          <div className="text-center text-xs text-font">代表者情報</div>
        </div>
        <div className="absolute left-[304px] top-[64px] inline-flex h-[17px] w-[84px] items-center justify-center pb-[3px]">
          <div className="text-center text-xs text-font">確認</div>
        </div>
      </div>
    </div>
  );
};

const Carousel: FC<RegisterCarouselProps> = ({ isOpen, onClose }) => {
  // カスタムフックから全ての必要な値と関数を取得
  const {
    stepIndex,
    emblaRef,
    values,
    setValue,
    handleNext,
    handlePrev,
    gradeOptions,
    departmentOptions,
    handleSubmit,
    onRegisterSubmit,
    isRegistering,
    displayError,
    errors,
    trigger,
    validateCurrentStep,
  } = useRegisterCarouselHooks(onClose);

  // フォーム参照の作成
  const formRef = useRef<HTMLFormElement>(null);

  // 登録ボタンのクリックハンドラ
  const handleRegisterClick = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // デフォルトのボタン動作を防止

    // すべてのフィールドのバリデーションを実行
    const hasErrors = await validateCurrentStep();
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

  // フォーム送信ハンドラ
  const handleFormSubmit = (data: RegisterFormSchema) => {
    onRegisterSubmit(data);
  };

  // 次へボタンのクリックハンドラ
  const handleNextClick = async () => {
    // 現在のステップのバリデーションチェック
    const hasErrors = await validateCurrentStep();
    if (hasErrors) {
      return;
    }

    // 問題がなければ次のステップへ
    handleNext();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(handleFormSubmit)} ref={formRef} noValidate>
        <section className="rounded-2xl bg-white px-60 py-10 shadow-md md:px-32 md:py-5">
          <FormStep step={stepIndex} />
          <div
            className="mx-auto max-h-[60vh] w-[450px] overflow-y-auto overflow-x-hidden pt-4"
            ref={emblaRef}
          >
            <div className="flex">
              <div className="min-w-0 flex-none  basis-full p-4">
                <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-baseColor">
                  <TextBox
                    label="メールアドレス"
                    type="email"
                    value={values.mail}
                    note="例：s123456@stn.nagaokaut.ac.jp"
                    required
                    error={errors.mail?.message}
                    onChange={(value: string) => setValue('mail', value)}
                    onBlur={() => trigger('mail')}
                  />
                  <TextBox
                    label="パスワード"
                    type="password"
                    value={values.password}
                    note="英数字8文字以上"
                    required
                    error={errors.password?.message}
                    onChange={(value: string) => setValue('password', value)}
                    onBlur={() => trigger('password')}
                  />
                  <TextBox
                    label="パスワード（確認用）"
                    type="password"
                    value={values.passwordConfirm}
                    note="英数字8文字以上"
                    required
                    error={errors.passwordConfirm?.message}
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
                    label="名前"
                    value={values.name}
                    note="例：長岡　太郎"
                    required
                    error={errors.name?.message}
                    onChange={(value: string) => setValue('name', value)}
                    onBlur={() => trigger('name')}
                  />
                  <TextBox
                    label="電話番号"
                    value={values.tel}
                    note="例：09012345678"
                    required
                    error={errors.tel?.message}
                    onChange={(value: string) => setValue('tel', value)}
                    onBlur={() => trigger('tel')}
                  />
                  <TextBox
                    label="学籍番号"
                    value={values.studentId}
                    note="例：12345678"
                    required
                    error={errors.studentId?.message}
                    onChange={(value: string) => setValue('studentId', value)}
                    onBlur={() => trigger('studentId')}
                  />
                  <Selector
                    label="学年"
                    required
                    onChange={(value: string) =>
                      setValue('gradeId', Number(value))
                    }
                    options={gradeOptions}
                    value={values.gradeId}
                    error={errors.gradeId?.message}
                  />
                  <Selector
                    label="学科"
                    required
                    onChange={(value: string) =>
                      setValue('departmentId', Number(value))
                    }
                    options={departmentOptions}
                    value={values.departmentId}
                    error={errors.departmentId?.message}
                  />
                </div>
              </div>
              <div className="min-w-0 flex-none basis-full p-4">
                <div className="flex flex-col items-center space-y-4 rounded-lg bg-baseColor">
                  <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                    <div className="inline-flex w-full items-center justify-start pr-[81px]">
                      <div className="text-xs font-black text-font">
                        メールアドレス
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
                        パスワード
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
                      <div className="text-xs font-black text-font">名前</div>
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
                        電話番号
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
                        学籍番号
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
                      <div className="text-xs font-black text-font">学年</div>
                    </div>
                    <div className="inline-flex h-[38px] w-[298px] items-center justify-start pr-[68px]">
                      <div className="text-base font-medium text-font">
                        {
                          GradeList.find((grade) => grade.id === values.gradeId)
                            ?.name
                        }
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                    <div className="inline-flex h-[17px] items-center justify-start pr-[81px]">
                      <div className="text-xs font-black text-font">学科</div>
                    </div>
                    <div className="inline-flex h-[65px] w-[298px] items-center justify-start">
                      <div className="text-base font-medium text-font">
                        {
                          DepartmentList.find(
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
              {/* {displayError} */}
              {
                'eraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
              }
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
                isDisable={isRegistering}
              >
                修正
              </Button>
            )}
            {stepIndex === 2 ? (
              <Button
                size="pc"
                color="main"
                type="button"
                onClick={handleRegisterClick}
                isDisable={isRegistering}
              >
                登録
              </Button>
            ) : (
              <Button
                size="pc"
                color="main"
                type="button"
                onClick={handleNextClick}
                isDisable={isRegistering}
              >
                次へ
              </Button>
            )}
          </div>
        </section>
      </form>
    </Modal>
  );
};

export default Carousel;
