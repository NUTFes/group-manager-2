import type { FC } from "react";

export type BadgeState = "notStarted" | "inProgress" | "done";

type BadgeProps = {
  state: BadgeState;
};

// Figma: badge (node-id=5117-6757)。未着手 / 進行中 / 完了 の3状態
const STYLES: Record<BadgeState, { label: string; className: string }> = {
  notStarted: { label: "未着手", className: "bg-white text-main border-sub" },
  inProgress: {
    label: "進行中",
    className: "bg-card-head text-main border-card-head",
  },
  done: { label: "完了", className: "bg-main text-white border-main" },
};

const Badge: FC<BadgeProps> = ({ state }) => {
  const { label, className } = STYLES[state];

  return (
    <span
      className={`inline-flex h-[27px] items-center justify-center rounded-full border px-3 text-caption font-bold ${className}`}
    >
      {label}
    </span>
  );
};

export default Badge;
