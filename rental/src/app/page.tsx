"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkSession } from "@/hooks/useWorkSession";

// 入口。作業セッションが残っていれば団体選択から再開し、無ければ作業場所選択へ。
// スタッフは同じ場所で一日作業するため、毎回選び直さずに済むようにしている。
export default function Home() {
  const router = useRouter();
  const { session, isLoading } = useWorkSession();

  useEffect(() => {
    if (isLoading) return;
    router.replace(session ? "/select-group" : "/select-place");
  }, [isLoading, session, router]);

  return (
    <main className="flex flex-1 items-center justify-center">
      <p className="text-body text-sub">読み込み中...</p>
    </main>
  );
}
