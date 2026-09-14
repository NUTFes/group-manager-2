"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FC } from "react";

// BarcodeDetector はまだ標準の型定義に無いため最小限だけ宣言する
type DetectedBarcode = { rawValue: string };
type BarcodeDetectorLike = {
  detect: (source: HTMLVideoElement) => Promise<DetectedBarcode[]>;
};
type BarcodeDetectorConstructor = new (options?: {
  formats?: string[];
}) => BarcodeDetectorLike;

type QrScannerProps = {
  onScan: (rawValue: string) => void;
  // 読み取り後に一時停止したいときに false にする
  active?: boolean;
};

const DETECT_INTERVAL_MS = 400;

function getDetectorConstructor(): BarcodeDetectorConstructor | null {
  const candidate = (
    window as unknown as { BarcodeDetector?: BarcodeDetectorConstructor }
  ).BarcodeDetector;
  return candidate ?? null;
}

// 対応状況はブラウザ由来の値なので、サーバー描画との差を出さないために
// useSyncExternalStore で読む（初回は false → ハイドレーション後に確定）
const subscribeNothing = () => () => {};
const isSupportedOnClient = () =>
  Boolean(getDetectorConstructor() && navigator.mediaDevices?.getUserMedia);
const isSupportedOnServer = () => false;

/**
 * カメラでQRを読む。BarcodeDetector があるブラウザ（Android Chrome など）で動作する。
 * 非対応のブラウザ（iOS Safari は未対応）では手動選択に誘導する。
 * 追加ライブラリを入れずに済ませ、PoCの依存を増やさない判断。
 */
const QrScanner: FC<QrScannerProps> = ({ onScan, active = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onScanRef = useRef(onScan);
  const [status, setStatus] = useState<"starting" | "scanning" | "denied">(
    "starting"
  );

  const isSupported = useSyncExternalStore(
    subscribeNothing,
    isSupportedOnClient,
    isSupportedOnServer
  );

  // onScan の参照が変わってもカメラを開き直さないよう、refに逃がす
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!active || !isSupported) return;

    let stopped = false;
    let stream: MediaStream | null = null;
    let timer: number | null = null;
    // cleanup時に参照が変わっている可能性があるため、この時点の要素を掴んでおく
    const videoElement = videoRef.current;

    const start = async () => {
      const Detector = getDetectorConstructor();
      if (!Detector) return;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          // 背面カメラを優先する
          video: { facingMode: { ideal: "environment" } },
        });
      } catch {
        if (!stopped) setStatus("denied");
        return;
      }

      const video = videoElement;
      if (stopped || !video) {
        stream?.getTracks().forEach((track) => track.stop());
        return;
      }

      video.srcObject = stream;
      await video.play().catch(() => {});
      if (stopped) return;
      setStatus("scanning");

      const detector = new Detector({ formats: ["qr_code"] });
      timer = window.setInterval(async () => {
        try {
          const results = await detector.detect(video);
          const value = results[0]?.rawValue;
          if (value) onScanRef.current(value);
        } catch {
          // フレームが未準備のときなどは次の周期で拾う
        }
      }, DETECT_INTERVAL_MS);
    };

    void start();

    return () => {
      stopped = true;
      if (timer !== null) window.clearInterval(timer);
      stream?.getTracks().forEach((track) => track.stop());
      if (videoElement) videoElement.srcObject = null;
    };
  }, [active, isSupported]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-60 overflow-hidden rounded-lg border border-main bg-card">
        <video
          ref={videoRef}
          muted
          playsInline
          className="size-full object-cover"
        />
        {(!isSupported || status !== "scanning") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
            {!isSupported ? (
              <span className="text-caption text-sub">
                このブラウザはQR読み取りに対応していません。下の「手動で参加団体を選択」をお使いください。
              </span>
            ) : status === "denied" ? (
              <span className="text-caption text-alert">
                カメラの使用が許可されていません。端末の設定で許可するか、下の「手動で参加団体を選択」をお使いください。
              </span>
            ) : (
              <span className="text-body text-main">
                カメラを起動しています...
              </span>
            )}
          </div>
        )}
      </div>
      {isSupported && status === "scanning" && (
        <p className="text-caption text-sub">
          団体のQRコードを枠内に写してください
        </p>
      )}
    </div>
  );
};

export default QrScanner;
