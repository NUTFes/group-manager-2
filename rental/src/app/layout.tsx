import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import RegisterServiceWorker from "./register-service-worker";

// Figma の指定フォント。見出しに 700、本文に 500、補足に 300 を使う
const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "貸出・返却記録",
  description: "物品の貸出・返却を記録するスタッフ向けアプリ",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "貸出記録",
  },
};

export const viewport: Viewport = {
  themeColor: "#590556",
  // スタッフが片手で操作するため、意図しないズームでレイアウトが崩れないようにする
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={`${notoSansJp.variable} h-full antialiased`}>
      <head>
        {/* crossOrigin="use-credentials" が無いと Access のログインへリダイレクトされインストールできない */}
        <link
          rel="manifest"
          href="/manifest.webmanifest"
          crossOrigin="use-credentials"
        />
      </head>
      <body className="flex min-h-full flex-col bg-white font-sans text-body text-font">
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
