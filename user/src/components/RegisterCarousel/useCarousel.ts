import { useCallback, useState } from 'react';
import type { CreatePluginType } from 'embla-carousel';
import { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

export const useCarousel = () => {
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
      // scrollTo の後に select イベントが発火するので setStepIndex は不要
    },
    [emblaApi]
  );

  const handleNext = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollNext()) return;
    // ステップ数に基づくガードは呼び出し元で行う想定
    emblaApi.scrollNext();
    // select イベントで stepIndex は更新される
  }, [emblaApi]);

  const handlePrev = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollPrev()) return;
    emblaApi.scrollPrev();
    // select イベントで stepIndex は更新される
  }, [emblaApi]);

  return {
    stepIndex,
    emblaRef,
    emblaApi,
    goToStep,
    handleNext,
    handlePrev,
  };
};
