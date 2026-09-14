import Header from "@/components/Header";

// 作業場所選択ページは F3 (#2206) で実装する。
// ここではデザイントークンとヘッダーが効いていることが分かる最小限の内容にしている。
export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-h1 text-main">GM Rental</h1>
        <p className="text-body text-font">
          物品の貸出・返却を記録するスタッフ向けアプリです。
        </p>
        <p className="text-caption text-sub">
          作業場所の選択画面は準備中です（#2206）。
        </p>
      </main>
    </>
  );
}
