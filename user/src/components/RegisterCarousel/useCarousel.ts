import { useCallback, useState } from 'react';
import type { CreatePluginType } from 'embla-carousel';
import { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

/**
 * カルーセル機能を提供するカスタムフック
 *
 * 機能:
 * - ステップ管理（現在のステップ、次のステップ、前のステップ）
 * - カルーセルの制御（スクロール、特定のステップへの移動）
 * - ステップ変更時のイベントハンドリング
 */
export const useCarousel = () => {
  // ① プラグインの型を定義
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  type SelectPlugin = CreatePluginType<Record<string, unknown>, {}>;

  /**
   * カルーセルのステップ変更を監視するプラグイン
   * ステップ変更時にstateを更新し、UIと同期を保つ
   */
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

  /**
   * 指定したステップに直接移動する
   * @param step 移動先のステップ番号
   */
  const goToStep = useCallback(
    (step: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(step);
      // scrollTo の後に select イベントが発火するので setStepIndex は不要
    },
    [emblaApi]
  );

  /**
   * 次のステップに移動する
   * 移動可能な場合のみ実行される
   */
  const handleNext = useCallback(() => {
    if (!emblaApi || !emblaApi.canScrollNext()) return;
    // ステップ数に基づくガードは呼び出し元で行う想定
    emblaApi.scrollNext();
    // select イベントで stepIndex は更新される
  }, [emblaApi]);

  /**
   * 前のステップに移動する
   * 移動可能な場合のみ実行される
   */
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
