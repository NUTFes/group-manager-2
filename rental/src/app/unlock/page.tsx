"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Header from "@/components/Header";

// パスワードの入力画面。Cloudflare Access を前段に置けない構成でだけ通る（設計書6章）。
// 正しければ Cookie が発行され、以降は素通しで使える。
export default function UnlockPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (passcode === "" || isSending) return;

    setIsSending(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/rental/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!response.ok) {
        setErrorMessage("パスワードが違います。担当に確認してください。");
        return;
      }
      // 戻り先は受け取らず、必ず最初の画面へ送る（外部URLへ飛ばされる余地を作らない）
      router.replace("/select-place");
    } catch {
      setErrorMessage("通信に失敗しました。電波の状況を確認してください。");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center gap-8 px-6 py-12">
        <div className="flex items-center gap-4">
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

        <form
          className="flex w-full max-w-xs flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="passcode"
              className="text-body font-bold text-font after:ml-1 after:text-alert after:content-['*']"
            >
              パスワード
            </label>
            <input
              id="passcode"
              type="password"
              inputMode="text"
              autoComplete="current-password"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              className="h-11 w-full rounded-lg border border-main bg-white px-3 text-body text-font"
            />
            <p className="text-caption text-sub">
              ※ 実行委員から共有されたパスワードを入れてください
            </p>
          </div>

          {errorMessage && (
            <p className="text-caption text-alert">{errorMessage}</p>
          )}

          <div className="flex justify-center pt-2">
            <Button type="submit" disabled={passcode === "" || isSending}>
              {isSending ? "確認中..." : "次へ"}
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
