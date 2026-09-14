"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomSheetModal from "@/components/BottomSheetModal";
import Button from "@/components/Button";
import Header from "@/components/Header";
import { useRentalGroups } from "@/hooks/useRentalApi";
import { useWorkSession } from "@/hooks/useWorkSession";

// 画面②（Figma: 貸出-参加団体選択ページ node-id=5032-6765、
// モーダルは 参加団体選択モーダル node-id=5101-6756）
//
// QRスキャンは F4(#2207) で実装する。ここでは手動選択（F5）を作り、
// スキャン領域はプレースホルダとして置いている。
export default function SelectGroupPage() {
  const router = useRouter();
  const { session, isLoading: isSessionLoading } = useWorkSession();
  const {
    data: groups,
    error,
    isLoading,
  } = useRentalGroups(session?.placeId ?? null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  // 作業場所が決まっていなければ選択画面へ戻す
  useEffect(() => {
    if (!isSessionLoading && !session) router.replace("/select-place");
  }, [isSessionLoading, session, router]);

  const filtered = useMemo(() => {
    const trimmed = keyword.trim();
    if (!trimmed) return groups ?? [];
    return (groups ?? []).filter((group) => group.name.includes(trimmed));
  }, [groups, keyword]);

  if (!session) return null;

  return (
    <>
      <Header
        mode={session.mode}
        placeName={session.placeName}
        onProgressClick={() => router.push("/progress")}
      />

      <main className="flex flex-1 flex-col items-center gap-6 px-6 py-10">
        <div className="flex size-60 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-main bg-card text-center">
          <span className="text-body font-bold text-main">QRスキャン</span>
          <span className="px-4 text-caption text-sub">
            カメラでの読み取りは準備中です（#2207）
          </span>
        </div>

        <div className="flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-caption text-sub">OR</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <Button
          variant="sub"
          fullWidth
          onClick={() => setIsModalOpen(true)}
          icon={<span aria-hidden>🔍</span>}
        >
          手動で参加団体を選択
        </Button>

        {error && (
          <p className="text-caption text-alert">
            団体一覧を取得できませんでした。通信状況を確認してください。
          </p>
        )}
      </main>

      <BottomSheetModal
        open={isModalOpen}
        title="参加団体選択"
        onClose={() => setIsModalOpen(false)}
      >
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="団体名で検索..."
          aria-label="団体名で検索"
          className="mb-2 h-10 w-full rounded-lg border border-line px-3 text-body text-font placeholder:text-sub"
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
                onClick={() => router.push(`/register?groupId=${group.id}`)}
                className="flex w-full items-center justify-between gap-3 py-4 text-left"
              >
                <span className="text-body font-bold text-font">
                  {group.name}
                </span>
                <span aria-hidden className="text-main">
                  ›
                </span>
              </button>
            </li>
          ))}
        </ul>
      </BottomSheetModal>
    </>
  );
}
