"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { WorkMode } from "@/types/rental";

const STORAGE_KEY = "rental-work-session";

export type WorkSession = {
  mode: WorkMode;
  // すべての場所を対象にする場合は null（貸出場所で絞らない）
  placeId: number | null;
  placeName: string;
};

/** placeId が null のときに画面へ出す名前 */
export const ALL_PLACES_NAME = "すべての場所";

// 他のタブでの変更と、このタブでの保存の両方を購読する
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// useSyncExternalStore はスナップショットの同一性を要求するため、
// パース前の生文字列を返す（パースは useMemo 側で行う）
function getSnapshot(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // プライベートモードや保存拒否設定では読み書きが例外になる
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

function parseSession(raw: string | null): WorkSession | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<WorkSession>;
    if (
      (parsed.mode !== "rental" && parsed.mode !== "return") ||
      (typeof parsed.placeId !== "number" && parsed.placeId !== null) ||
      typeof parsed.placeName !== "string"
    ) {
      return null;
    }
    return {
      mode: parsed.mode,
      placeId: parsed.placeId,
      placeName: parsed.placeName,
    };
  } catch {
    return null;
  }
}

/**
 * 取扱区分と作業場所を端末に保持する。スタッフは同じ場所で一日作業するため、
 * 再訪時に選択し直さなくて済むようにしている（設計書3章①）。
 *
 * localStorage はReactの外にある状態なので useSyncExternalStore で読む。
 * サーバー側スナップショットは null のため、初回描画では「未選択」となり、
 * ハイドレーション後に実際の値へ切り替わる。
 */
export function useWorkSession() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const session = useMemo(() => parseSession(raw), [raw]);
  // サーバー描画とハイドレーション中は false。localStorage を読む前に
  // 「未選択」と判定して選択画面へ飛ばしてしまうのを防ぐ
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const saveSession = useCallback((next: WorkSession) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // 保存できなくても画面は動かす（この端末では次回また選ぶことになる）
    }
    notify();
  }, []);

  const clearSession = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // 同上
    }
    notify();
  }, []);

  return { session, isLoading: !isHydrated, saveSession, clearSession };
}
