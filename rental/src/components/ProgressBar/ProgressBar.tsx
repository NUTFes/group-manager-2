import type { FC } from "react";

type ProgressBarProps = {
  // 0〜100 の百分率。分母が0のときは0として扱う
  percentage: number;
};

// Figma: 進捗確認ページの進捗バー (node-id=5046-849)
const ProgressBar: FC<ProgressBarProps> = ({ percentage }) => {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));

  return (
    <div
      className="h-3 w-full overflow-hidden rounded-full bg-card-head"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-main transition-[width]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

export default ProgressBar;
