import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "貸出・返却記録",
    short_name: "貸出記録",
    description: "物品の貸出・返却を記録するスタッフ向けアプリ",
    start_url: "/",
    display: "standalone",
    background_color: "#111827",
    theme_color: "#111827",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
