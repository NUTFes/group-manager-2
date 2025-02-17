import { FC, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Button from "@/components/Button";
import TextBox from "@/components/Form/TextBox";
import Selector from "@/components/Form/Selector";
import { RegisterParams } from "@/types/register/user";
import { GradeList, DepartmentList } from "@/utils/list";

type RegisterCarouselProps = {
  isOpen: boolean;
  onClick: () => void;
};

type FormStepProps = {
  step: number;
};

const FormStep: FC<FormStepProps> = ({ step }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[388px] h-[81px] relative">
        <div className="w-[376px] h-14 left-[6px] top-0 absolute">
          <div
            className={`w-20 h-2 left-[72px] top-[24px] absolute ${
              step >= 0 ? "bg-main" : "bg-[#b2b2b2]"
            }`}
          />
          <div
            className={`w-20 h-2 left-[224px] top-[24px] absolute ${
              step >= 1 ? "bg-main" : "bg-[#b2b2b2]"
            }`}
          />
          <div
            className={`w-14 h-14 left-[8px] top-0 absolute rounded-full ${
              step >= 0 ? "bg-main" : "bg-[#b2b2b2]"
            }`}
          />
          <div
            className={`w-14 h-14 left-[160px] top-0 absolute rounded-full ${
              step >= 1 ? "bg-main" : "bg-[#b2b2b2]"
            }`}
          />
          <div
            className={`w-14 h-14 left-[312px] top-0 absolute rounded-full ${
              step === 2 ? "bg-main" : "bg-[#b2b2b2]"
            }`}
          />
          <div className="w-4 h-[38px] pb-[7px] left-[28px] top-[9px] absolute flex-col justify-start items-center inline-flex">
            <div className="text-center text-baseColor text-[26px]">1</div>
          </div>
          <div className="w-4 h-[38px] pb-[7px] left-[180px] top-[9px] absolute flex-col justify-start items-center inline-flex">
            <div className="text-center text-baseColor text-[26px]">2</div>
          </div>
          <div className="w-4 h-[38px] pb-[7px] left-[332px] top-[9px] absolute flex-col justify-start items-center inline-flex">
            <div className="text-center text-baseColor text-[26px]">3</div>
          </div>
        </div>
        <div className="w-[84px] h-[17px] pb-[3px] left-0 top-[64px] absolute justify-center items-center inline-flex">
          <div className="text-center text-font text-xs">メールアドレス</div>
        </div>
        <div className="w-[84px] h-[17px] pl-[11.58px] pr-[12.42px] pb-[3px] left-[153px] top-[64px] absolute justify-center items-center inline-flex">
          <div className="text-center text-font text-xs">代表者情報</div>
        </div>
        <div className="w-[84px] h-[17px] pb-[3px] left-[304px] top-[64px] absolute justify-center items-center inline-flex">
          <div className="text-center text-font text-xs">確認</div>
        </div>
      </div>
    </div>
  );
};

const Carousel: FC<RegisterCarouselProps> = ({ isOpen, onClick }) => {
  const gradeOptions = [{ id: 0, name: "選択してください" }, ...GradeList];
  const departmentOptions = [
    { id: 0, name: "選択してください" },
    ...DepartmentList,
  ];
  const [input, setInput] = useState<RegisterParams>({
    name: "",
    studentId: "",
    tel: "",
    mail: "",
    departmentId: 0,
    gradeId: 0,
    password: "",
    passwordConfirm: "",
    userId: 0,
  });
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    containScroll: "trimSnaps",
  });

  const handleNext = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollNext()) return;
    emblaApi.scrollNext();
    setStepIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const handlePrev = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollPrev()) return;
    emblaApi.scrollPrev();
    setStepIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  if (!isOpen) return <></>;
  return (
    <section className="px-60 py-20 bg-white rounded-2xl shadow-md space-y-14">
      <FormStep step={stepIndex} />
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          <div className="min-w-full flex-shrink-0">
            <div className="bg-baseColor rounded-lg flex flex-col justify-center items-center space-y-14">
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
          <div className="min-w-full flex-shrink-0 p-4 ">
            <div className="bg-baseColor rounded-lg flex flex-col justify-center items-center space-y-14">
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
                  setInput((prev) => ({ ...prev, departmentId: Number(value) }))
                }
                options={departmentOptions}
                value=""
              />
            </div>
          </div>
          <div className="min-w-full flex-shrink-0 p-4">
            <div className="bg-baseColor rounded-lg flex flex-col items-start space-y-14">
              <div className="w-[298px] h-[63px] flex-col justify-center items-start gap-2 inline-flex">
                <div className="y-[17px] pr-[81px] pb-[3px] justify-start items-center inline-flex">
                  <div className="text-[#474747] text-xs font-black">
                    メールアドレス
                  </div>
                </div>
                <div className="w-[298px] h-[38px] pr-[68px] pb-[19px] justify-start items-center inline-flex">
                  <div className="text-[#474747] text-base font-medium font-['Noto Sans JP']">
                    {input.mail}
                  </div>
                </div>
              </div>
              <div className="w-[298px] h-[63px] flex-col justify-center items-start gap-2 inline-flex">
                <div className="h-[17px] pr-[81px] pb-[3px] justify-start items-center inline-flex">
                  <div className="text-[#474747] text-xs font-black font-['Noto Sans JP']">
                    パスワード
                  </div>
                </div>
                <div className="w-[298px] h-[38px] pr-[68px] pb-[19px] justify-start items-center inline-flex">
                  <div className="text-[#474747] text-base font-medium font-['Noto Sans JP']">
                    {"*".repeat(input.password.length)}
                  </div>
                </div>
              </div>
              <div className="w-[298px] h-[63px] flex-col justify-center items-start gap-2 inline-flex">
                <div className="h-[17px] pr-[81px] pb-[3px] justify-start items-center inline-flex">
                  <div className="text-font text-xs font-black">名前</div>
                </div>
                <div className="w-[298px] h-[38px] pr-[68px] pb-[19px] justify-start items-center inline-flex">
                  <div className="text-font text-base font-medium">
                    {input.name}
                  </div>
                </div>
              </div>
              <div className="w-[298px] h-[63px] flex-col justify-center items-start gap-2 inline-flex">
                <div className="h-[17px] pr-[81px] pb-[3px] justify-start items-center inline-flex">
                  <div className="text-font text-xs font-black">学籍番号</div>
                </div>
                <div className="w-[298px] h-[38px] pr-[68px] pb-[19px] justify-start items-center inline-flex">
                  <div className="text-font text-base font-medium">
                    {input.studentId}
                  </div>
                </div>
              </div>
              <div className="w-[298px] h-[63px] flex-col justify-center items-start gap-2 inline-flex">
                <div className="h-[17px] pr-[81px] pb-[3px] justify-start items-center inline-flex">
                  <div className="text-font text-xs font-black">学年</div>
                </div>
                <div className="w-[298px] h-[38px] pr-[68px] pb-[19px] justify-start items-center inline-flex">
                  <div className="text-font text-base font-medium">
                    {
                      GradeList.find((grade) => grade.id === input.gradeId)
                        ?.name
                    }
                  </div>
                </div>
              </div>
              <div className="w-[298px] h-[63px] flex-col justify-center items-start gap-2 inline-flex">
                <div className="h-[17px] pr-[81px] pb-[3px] justify-start items-center inline-flex">
                  <div className="text-font text-xs font-black">学科</div>
                </div>
                <div className="w-[298px] h-[38px] pr-[68px] pb-[19px] justify-start items-center inline-flex">
                  <div className="text-font text-base font-medium">
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
      <div className="flex justify-center mt-4 gap-4">
        {stepIndex === 0 ? (
          <div />
        ) : (
          <Button
            size="pc"
            color="main"
            onClick={handlePrev}
            variant
            icon="lessThan"
          >
            修正
          </Button>
        )}
        {stepIndex === 2 ? (
          <Button size="pc" color="main" onClick={onClick}>
            登録
          </Button>
        ) : (
          <Button size="pc" color="main" onClick={handleNext}>
            次へ
          </Button>
        )}
      </div>
    </section>
  );
};

export default Carousel;
