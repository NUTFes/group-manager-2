import type { FC } from "react";
import Link from "next/link";

export type WorkMode = "rental" | "return";

type HeaderProps = {
  // 作業セッション未確定のときは null（Figma の status=null）
  mode?: WorkMode | null;
  placeName?: string | null;
  // 進捗確認へ遷移する。戻り先を渡せるよう、遷移は呼び出し側に任せる
  onProgressClick?: () => void;
};

const MODE_LABELS: Record<WorkMode, string> = {
  rental: "貸出",
  return: "返却",
};

// Figma: header (node-id=5078-6736)。status=貸出 / 返却 / null の3状態
const Header: FC<HeaderProps> = ({ mode, placeName, onProgressClick }) => (
  <header className="flex h-20 shrink-0 items-center justify-between gap-3 bg-main px-4 text-white">
    <div className="flex min-w-0 items-center gap-3">
      {/* ロゴからトップへ戻れるようにする（トップは作業状況に応じて振り分ける） */}
      <Link
        href="/"
        aria-label="トップへ戻る"
        className="flex size-12 shrink-0 items-center justify-center rounded bg-white text-caption font-bold text-main active:opacity-80"
      >
        logo
      </Link>
      <div className="flex min-w-0 flex-col gap-1">
        {mode && (
          <span className="w-fit rounded-full bg-card-head px-3 text-caption font-bold text-main">
            {MODE_LABELS[mode]}
          </span>
        )}
        {placeName && (
          <span className="truncate text-body font-bold">📍 {placeName}</span>
        )}
      </div>
    </div>
    {onProgressClick && (
      <button
        type="button"
        onClick={onProgressClick}
        className="shrink-0 rounded-lg border border-white px-3 py-1 text-caption font-bold leading-tight active:opacity-80"
      >
        進捗
        <br />
        確認
      </button>
    )}
  </header>
);

export default Header;
