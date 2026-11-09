import { useMemo } from 'react';
import { FesDate, Stage } from '@/api/stageApi';

export interface StageSelectProps {
  allStages: { id: number; name: string }[];
  selectedId: number;
}

// ステージの選択肢を作成するためのヘルパー関数
export const useStageOptions = (stages: Stage[]) => {
  return useMemo(() => {
    return stages.map((stage) => ({
      id: stage.id,
      name: stage.name,
    }));
  }, [stages]);
};

// 重複を避けてフィルターするヘルパー関数
export const useFilteredStageOptions = ({
  allStages,
  selectedId,
}: StageSelectProps) => {
  return useMemo(() => {
    if (!selectedId) return allStages;
    return allStages.filter(
      (stage) => stage.id !== selectedId || stage.id === 0
    );
  }, [allStages, selectedId]);
};

// 開催日の選択肢を整形するヘルパー関数
export const useDateOptions = (dates: FesDate[]) => {
  return useMemo(() => {
    if (!dates || dates.length === 0) {
      return [];
    }

    return dates.map((d) => {
      return {
        id: d.id,
        name: `${d.daysNum}日目 (${d.date}) ${d.day}`,
      };
    });
  }, [dates]);
};
