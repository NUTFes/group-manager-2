"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomSheetModal from "@/components/BottomSheetModal";
import Button from "@/components/Button";
import Header from "@/components/Header";
import QrScanner from "@/components/QrScanner";
import { fetchGroupBySecret, useRentalGroups } from "@/hooks/useRentalApi";
import { useWorkSession } from "@/hooks/useWorkSession";
import { parseGroupQr } from "@/lib/qr";

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
  // 読み取り直後は多重に処理しないよう停止させる
  const [isResolving, setIsResolving] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  // 作業場所が決まっていなければ選択画面へ戻す
  useEffect(() => {
    if (!isSessionLoading && !session) router.replace("/select-place");
  }, [isSessionLoading, session, router]);

  const filtered = useMemo(() => {
    const trimmed = keyword.trim();
    if (!trimmed) return groups ?? [];
    return (groups ?? []).filter((group) => group.name.includes(trimmed));
  }, [groups, keyword]);

  // QRは確定画面のURL。group_id と secret を取り出し、APIで照合してから遷移する
  const handleScan = async (rawValue: string) => {
    if (isResolving) return;

    const parsed = parseGroupQr(rawValue);
    if (!parsed) {
      setScanError("このQRコードは団体のものではありません。");
      return;
    }

    setIsResolving(true);
    setScanError(null);
    try {
      const info = await fetchGroupBySecret(parsed.groupId, parsed.secret);
      router.push(`/register?groupId=${info.group.id}`);
    } catch {
      // API側は不一致・不存在を一律404にしている（団体の存在有無を漏らさないため）
      setScanError(
        "団体を特定できませんでした。QRコードが最新か確認するか、手動で選択してください。"
      );
      setIsResolving(false);
    }
  };

  if (!session) return null;

  return (
    <>
      <Header
        mode={session.mode}
        placeName={session.placeName}
        onProgressClick={() => router.push("/progress")}
      />

      <main className="flex flex-1 flex-col items-center gap-6 px-6 py-10">
        <QrScanner onScan={handleScan} active={!isModalOpen && !isResolving} />

        {isResolving && (
          <p className="text-caption text-sub">団体を確認しています...</p>
        )}
        {scanError && <p className="text-caption text-alert">{scanError}</p>}

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
