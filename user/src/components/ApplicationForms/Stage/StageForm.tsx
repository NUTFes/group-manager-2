import { useMemo } from 'react';
import { FesDate, Stage } from '@/api/stageApi';

export interface StageSelectProps {
  allStages: { id: string; name: string }[];
  selectedId: string;
}

// ステージの選択肢を作成するためのヘルパー関数
export const useStageOptions = (stages: Stage[]) => {
  return useMemo(() => {
    return stages.map((stage) => ({
      id: stage.id.toString(),
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
      (stage) => stage.id !== selectedId || stage.id === ''
    );
  }, [allStages, selectedId]);
};

// 開催日の選択肢を整形するヘルパー関数
export const useDateOptions = (dates: FesDate[]) => {
  return useMemo(() => {
    if (!dates || dates.length === 0) {
      return [];
    }

    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    return dates.map((d) => {
      const dateObj = new Date(d.date);
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const weekday = weekdays[dateObj.getDay()];
      const formattedDate = `${month}/${day}(${weekday})`;
      const index = dates.findIndex((date) => date.id === d.id);

      return {
        id: d.id.toString(),
        name: `${index + 1}日目 ${formattedDate}`,
      };
    });
  }, [dates]);
};
