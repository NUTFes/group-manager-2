import { FC, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Button from "../Button";

type RegisterCarouselProps = {
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
              step >= 0 ? "bg-[#34a854]" : "bg-[#b2b2b2]"
            }`}
          />
          <div
            className={`w-20 h-2 left-[224px] top-[24px] absolute ${
              step >= 1 ? "bg-[#34a854]" : "bg-[#b2b2b2]"
            }`}
          />
          <div
            className={`w-14 h-14 left-[8px] top-0 absolute rounded-full ${
              step >= 0 ? "bg-[#34a854]" : "bg-[#b2b2b2]"
            }`}
          />
          <div
            className={`w-14 h-14 left-[160px] top-0 absolute rounded-full ${
              step >= 1 ? "bg-[#34a854]" : "bg-[#b2b2b2]"
            }`}
          />
          <div
            className={`w-14 h-14 left-[312px] top-0 absolute rounded-full ${
              step === 2 ? "bg-[#34a854]" : "bg-[#b2b2b2]"
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

const Carousel: FC<RegisterCarouselProps> = ({ onClick }) => {
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

  return (
    <section className="px-60 py-20 bg-white rounded-2xl shadow-md">
      <FormStep step={stepIndex} />
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          <div className="min-w-full flex-shrink-0 p-4">
            <div className="h-64 bg-green-400 rounded-lg flex items-center justify-center">
              Slide 1
            </div>
          </div>
          <div className="min-w-full flex-shrink-0 p-4">
            <div className="h-64 bg-blue-400 rounded-lg flex items-center justify-center">
              Slide 2
            </div>
          </div>
          <div className="min-w-full flex-shrink-0 p-4">
            <div className="h-64 bg-red-400 rounded-lg flex items-center justify-center">
              Slide 3
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
