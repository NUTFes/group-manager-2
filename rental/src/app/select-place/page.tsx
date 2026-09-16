"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Selector from "@/components/Selector";
import { useRentalPlaces } from "@/hooks/useRentalApi";
import { ALL_PLACES_NAME, useWorkSession } from "@/hooks/useWorkSession";
import type { WorkMode } from "@/types/rental";

// 貸出場所で絞らずに作業する場合の選択値。倉庫をまたいで対応する係や、
// 例外対応をまとめて行う場合に使う
const ALL_PLACES_VALUE = "all";

// 画面①（Figma: 作業場所選択ページ node-id=5024-6657）
export default function SelectPlacePage() {
  const router = useRouter();
  const { session, saveSession } = useWorkSession();
  const { data: places, error, isLoading } = useRentalPlaces();

  // 未入力のうちは保存済みセッションを既定値として見せる。
  // effect で setState すると描画が連鎖するため、派生値として扱う。
  const [modeInput, setModeInput] = useState<string | null>(null);
  const [placeInput, setPlaceInput] = useState<string | null>(null);
  const mode = modeInput ?? session?.mode ?? "";
  const savedPlaceValue = session
    ? (session.placeId?.toString() ?? ALL_PLACES_VALUE)
    : "";
  const placeId = placeInput ?? savedPlaceValue;

  const canStart = mode !== "" && placeId !== "";

  const handleStart = () => {
    if (mode !== "rental" && mode !== "return") return;

    if (placeId === ALL_PLACES_VALUE) {
      saveSession({
        mode: mode as WorkMode,
        placeId: null,
        placeName: ALL_PLACES_NAME,
      });
      router.push("/select-group");
      return;
    }

    const place = places?.find((candidate) => String(candidate.id) === placeId);
    if (!place) return;

    saveSession({
      mode: mode as WorkMode,
      placeId: place.id,
      placeName: place.name,
    });
    router.push("/select-group");
  };

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center gap-8 px-6 py-12">
        <div className="flex items-center gap-4">
          {/* 白抜きを含むシンボルマークなので、ヘッダーと同じく主色の地に乗せる */}
          <span className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-main p-2">
            <Image
              src="/symbol-mark.svg"
              alt=""
              width={132}
              height={120}
              unoptimized
              className="size-full object-contain"
            />
          </span>
          <h1 className="text-h1 text-font">GM Rental</h1>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-4">
          <Selector
            label="取扱区分を選択"
            required
            value={mode}
            onChange={setModeInput}
            placeholder="選択してください"
            options={[
              { value: "rental", label: "貸出" },
              { value: "return", label: "返却" },
            ]}
          />

          <Selector
            label="作業場所を選択"
            required
            value={placeId}
            onChange={setPlaceInput}
            placeholder={isLoading ? "読み込み中..." : "選択してください"}
            disabled={isLoading || !!error}
            options={[
              { value: ALL_PLACES_VALUE, label: ALL_PLACES_NAME },
              ...(places ?? []).map((place) => ({
                value: String(place.id),
                label: place.name,
              })),
            ]}
          />

          {error && (
            <p className="text-caption text-alert">
              作業場所を取得できませんでした。通信状況を確認してください。
            </p>
          )}
          {!error && !isLoading && (places?.length ?? 0) === 0 && (
            <p className="text-caption text-alert">
              貸出場所が設定された割当がありません。管理画面で物品割り当ての貸出場所を設定するか、「
              {ALL_PLACES_NAME}」を選んでください。
            </p>
          )}

          <div className="flex justify-center pt-2">
            <Button onClick={handleStart} disabled={!canStart}>
              作業開始
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
