import { FC, useCallback, useState } from 'react';
import { RegisterParams } from '@/types/register/user';
import { DepartmentList, GradeList } from '@/utils/list';
import useEmblaCarousel from 'embla-carousel-react';
import Button from '@/components/Button';
import Selector from '@/components/Form/Selector';
import TextBox from '@/components/Form/TextBox';

type RegisterCarouselProps = {
  isOpen: boolean;
  onSubmit: () => void;
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

const Carousel: FC<RegisterCarouselProps> = ({ isOpen, onSubmit }) => {
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

  if (!isOpen) return <></>;
  return (
    <form method="POST" onSubmit={onSubmit}>
      <section className="space-y-12 rounded-2xl bg-white px-[clamp(10px,10vw,240px)] py-[clamp(5px,5vw,80px)] shadow-md">
        <FormStep step={stepIndex} />
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            <div className="min-w-full shrink-0">
              <div className="flex flex-col items-center justify-center space-y-12 rounded-lg bg-baseColor">
                <TextBox
                  label="メールアドレス"
                  value=""
                  note="例：s123456@stn.nagaokaut.ac.jp"
                  required
                  onChange={(value: string) =>
                    setInput((prev) => ({ ...prev, name: value }))
                  }
                />
                <TextBox
                  label="パスワード"
                  value=""
                  note="英数字8文字以上"
                  required
                  onChange={(value) =>
                    setInput((prev) => ({ ...prev, password: value }))
                  }
                />
                <TextBox
                  label="パスワード（確認用）"
                  value=""
                  note="英数字8文字以上"
                  required
                  onChange={(value) =>
                    setInput((prev) => ({ ...prev, passwordConfirm: value }))
                  }
                />
              </div>
            </div>
            <div className="min-w-full shrink-0 p-4">
              <div className="flex flex-col items-center justify-center space-y-12 rounded-lg bg-baseColor">
                <TextBox
                  label="名前"
                  value=""
                  note="例：長岡　太郎"
                  required
                  onChange={(value) =>
                    setInput((prev) => ({ ...prev, name: value }))
                  }
                />
                <TextBox
                  label="学籍番号"
                  value=""
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
                    setInput((prev) => ({ ...prev, gradeId: Number(value) }))
                  }
                  options={gradeOptions}
                  value=""
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
                  value=""
                />
              </div>
            </div>
            <div className="min-w-full shrink-0 p-4">
              <div className="flex flex-col items-start space-y-12 rounded-lg bg-baseColor">
                <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                  <div className="y-[17px] inline-flex items-center justify-start pb-[3px] pr-[81px]">
                    <div className="text-xs font-black text-font">
                      メールアドレス
                    </div>
                  </div>
                  <div className="inline-flex h-[38px] w-[298px] items-center justify-start pb-[19px] pr-[68px]">
                    <div className="text-base font-medium text-font">
                      {input.mail}
                    </div>
                  </div>
                </div>
                <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                  <div className="inline-flex h-[17px] items-center justify-start pb-[3px] pr-[81px]">
                    <div className="text-xs font-black text-font">
                      パスワード
                    </div>
                  </div>
                  <div className="inline-flex h-[38px] w-[298px] items-center justify-start pb-[19px] pr-[68px]">
                    <div className="text-base font-medium text-font">
                      {'*'.repeat(input.password.length)}
                    </div>
                  </div>
                </div>
                <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                  <div className="inline-flex h-[17px] items-center justify-start pb-[3px] pr-[81px]">
                    <div className="text-xs font-black text-font">名前</div>
                  </div>
                  <div className="inline-flex h-[38px] w-[298px] items-center justify-start pb-[19px] pr-[68px]">
                    <div className="text-base font-medium text-font">
                      {input.name}
                    </div>
                  </div>
                </div>
                <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                  <div className="inline-flex h-[17px] items-center justify-start pb-[3px] pr-[81px]">
                    <div className="text-xs font-black text-font">学籍番号</div>
                  </div>
                  <div className="inline-flex h-[38px] w-[298px] items-center justify-start pb-[19px] pr-[68px]">
                    <div className="text-base font-medium text-font">
                      {input.studentId}
                    </div>
                  </div>
                </div>
                <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                  <div className="inline-flex h-[17px] items-center justify-start pb-[3px] pr-[81px]">
                    <div className="text-xs font-black text-font">学年</div>
                  </div>
                  <div className="inline-flex h-[38px] w-[298px] items-center justify-start pb-[19px] pr-[68px]">
                    <div className="text-base font-medium text-font">
                      {
                        GradeList.find((grade) => grade.id === input.gradeId)
                          ?.name
                      }
                    </div>
                  </div>
                </div>
                <div className="inline-flex h-[63px] w-[298px] flex-col items-start justify-center gap-2">
                  <div className="inline-flex h-[17px] items-center justify-start pb-[3px] pr-[81px]">
                    <div className="text-xs font-black text-font">学科</div>
                  </div>
                  <div className="inline-flex h-[38px] w-[298px] items-center justify-start pb-[19px] pr-[68px]">
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
  );
};

export default Carousel;
