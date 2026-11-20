"use client";

import { useMemo, useState } from "react";
import type { FC } from "react";
import BottomSheetModal from "@/components/BottomSheetModal";
import type { RentalGroup } from "@/types/rental";

type GroupSelectSheetProps = {
  open: boolean;
  groups: RentalGroup[];
  isLoading?: boolean;
  onClose: () => void;
  onSelect: (group: RentalGroup) => void;
};

// Figma: 参加団体選択モーダル (node-id=5101-6756)
//
// 参加団体選択ページで、QRが読めないときの手動選択に使う。
const GroupSelectSheet: FC<GroupSelectSheetProps> = ({
  open,
  groups,
  isLoading = false,
  onClose,
  onSelect,
}) => {
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    const trimmed = keyword.trim();
    if (!trimmed) return groups;
    return groups.filter((group) => group.name.includes(trimmed));
  }, [groups, keyword]);

  return (
    <BottomSheetModal open={open} title="参加団体選択" onClose={onClose}>
      <input
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="団体名で検索..."
        aria-label="団体名で検索"
        className="mb-2 h-11 w-full rounded-lg border border-line px-3 text-body text-font placeholder:text-sub"
      />

      {isLoading && <p className="py-4 text-body text-sub">読み込み中...</p>}

      {!isLoading && filtered.length === 0 && (
        <p className="py-4 text-body text-sub">
          {keyword
            ? "該当する団体がありません。"
            : "この作業場所に割当がある団体がありません。"}
        </p>
      )}

      <ul className="divide-y divide-line">
        {filtered.map((group) => (
          <li key={group.id}>
            <button
              type="button"
              onClick={() => onSelect(group)}
              className="flex w-full items-center justify-between gap-3 py-4 text-left"
            >
              <span className="min-w-0 truncate text-body font-bold text-font">
                {group.name}
              </span>
              <span aria-hidden className="shrink-0 text-main">
                ›
              </span>
            </button>
          </li>
        ))}
      </ul>
    </BottomSheetModal>
  );
};

export default GroupSelectSheet;
