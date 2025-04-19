import { FC, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { RegisterParams } from '@/types/register/user';
import { DepartmentList, GradeList } from '@/utils/list';
import useEmblaCarousel from 'embla-carousel-react';
import { toast } from 'react-toastify';
import Button from '@/components/Button';
import Selector from '@/components/Form/Selector';
import TextBox from '@/components/Form/TextBox';
import Modal from '@/components/Modal';
import { useAuth } from '@/hooks/useAuth';

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
  const gradeOptions = [{ id: 0, name: '選択してください' }, ...GradeList];
  const departmentOptions = [
    { id: 0, name: '選択してください' },
    ...DepartmentList,
  ];
  const [input, setInput] = useState<RegisterParams>({
    name: '',
    studentId: '',
    tel: '',
    mail: '',
    departmentId: 0,
    gradeId: 0,
    password: '',
    passwordConfirm: '',
    userId: 0,
  });
  const [emblaRef, emblaApi] = useEmblaCarousel({
    containScroll: 'trimSnaps',
  });
  const [stepIndex, setStepIndex] = useState(0);
  const router = useRouter();
  const { register } = useAuth();

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
    setTimeout(() => {
      setStepIndex(emblaApi.selectedScrollSnap());
    }, 0);
  }, [emblaApi]);

  // useEffect(() => {
  //   if (!emblaApi) return;
  //   onSelect();
  //   emblaApi.on('select', onSelect);
  //   return () => {
  //     emblaApi.off('select', onSelect);
  //   };
  // }, [emblaApi, onSelect]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await register({
        mail: input.mail,
        password: input.password,
        passwordConfirm: input.passwordConfirm,
        name: input.name,
        studentId: input.studentId.toString(),
        departmentId: Number(input.departmentId),
        gradeId: Number(input.gradeId),
        tel: input.tel,
        userId: input.userId,
      });

      console.log('Registration result:', result);

      if (result.success) {
        toast.success('登録が完了しました。');
        // 登録が成功すると自動的にダッシュボードにリダイレクトされます（useAuth内で処理）
      } else {
        // 登録は成功したが自動ログインに失敗した場合など
        if (result.data) {
          toast.success('登録が完了しました。ログインしてください。');
          onClose();
          router.push('/login?registered=true');
        } else {
          toast.error(
            result.message || '登録に失敗しました。もう一度お試しください。'
          );
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        try {
          // エラーメッセージをJSONとして解析
          const errorData = JSON.parse(error.message);
          if (errorData.errors) {
            // エラーメッセージを整形して表示
            const errorMessages = Object.entries(errorData.errors)
              .map(([field, messages]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.join(', ')}`;
                }
                return `${field}: ${messages}`;
              })
              .join('\n');
            toast.error(errorMessages);
          } else if (errorData.full_messages) {
            // full_messagesがある場合はそれを使用
            toast.error(errorData.full_messages.join('\n'));
          } else {
            toast.error(error.message);
          }
        } catch {
          // JSON解析に失敗した場合は元のエラーメッセージを表示
          toast.error(error.message);
        }
      } else {
        toast.error('登録に失敗しました。もう一度お試しください。');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form method="POST" onSubmit={onSubmit}>
        <section className="rounded-2xl bg-white px-60 py-10 shadow-md md:px-32 md:py-5">
          <FormStep step={stepIndex} />
          <div className="w-[450px] overflow-hidden pt-4" ref={emblaRef}>
            <div className="flex">
              <div className="min-w-0 flex-none basis-full p-4">
                <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-baseColor">
                  <TextBox
                    label="メールアドレス"
                    value={input.mail}
                    note="例：s123456@stn.nagaokaut.ac.jp"
                    required
                    onChange={(value: string) =>
                      setInput((prev) => ({ ...prev, mail: value }))
                    }
                  />
                  <TextBox
                    label="パスワード"
                    value={input.password}
                    note="英数字8文字以上"
                    required
                    onChange={(value) =>
                      setInput((prev) => ({ ...prev, password: value }))
                    }
                  />
                  <TextBox
                    label="パスワード（確認用）"
                    value={input.passwordConfirm}
                    note="英数字8文字以上"
                    required
                    onChange={(value) =>
                      setInput((prev) => ({
                        ...prev,
                        passwordConfirm: value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="min-w-0 flex-none basis-full p-4">
                <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-baseColor">
                  <TextBox
                    label="名前"
                    value={input.name}
                    note="例：長岡　太郎"
                    required
                    onChange={(value) =>
                      setInput((prev) => ({ ...prev, name: value }))
                    }
                  />
                  <TextBox
                    label="学籍番号"
                    value={input.studentId}
                    note="例：12345678"
                    required
                    onChange={(value) =>
                      setInput((prev) => ({ ...prev, studentId: value }))
                    }
                  />
                  <Selector
                    label="学年"
                    required
                    onChange={(value) =>
                      setInput((prev) => ({
                        ...prev,
                        gradeId: Number(value),
                      }))
                    }
                    options={gradeOptions}
                    value={input.gradeId}
                  />
                  <Selector
                    label="学科"
                    required
                    onChange={(value) =>
                      setInput((prev) => ({
                        ...prev,
                        departmentId: Number(value),
                      }))
                    }
                    options={departmentOptions}
                    value={input.departmentId}
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
                        {input.mail}
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
                        {'*'.repeat(input.password.length)}
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                    <div className="inline-flex h-[17px] items-center justify-start pr-[81px]">
                      <div className="text-xs font-black text-font">名前</div>
                    </div>
                    <div className="inline-flex h-[38px] w-[298px] items-center justify-start pr-[68px]">
                      <div className="text-base font-medium text-font">
                        {input.name}
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
                        {input.studentId}
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
                          GradeList.find((grade) => grade.id === input.gradeId)
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
                            (department) => department.id === input.departmentId
                          )?.name
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              >
                修正
              </Button>
            )}
            {stepIndex === 2 ? (
              <Button size="pc" color="main" type="submit">
                登録
              </Button>
            ) : (
              <Button size="pc" color="main" type="button" onClick={handleNext}>
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
