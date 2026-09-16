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
  // 非同期の処理を返すと、それが終わるまで次の検知を始めない
  onScan: (rawValue: string) => void | Promise<void>;
  // 読み取り後に一時停止したいときに false にする
  active?: boolean;
};

type Status = "starting" | "scanning" | "denied";

const DETECT_INTERVAL_MS = 400;

function getDetectorConstructor(): BarcodeDetectorConstructor | null {
  const candidate = (
    window as unknown as { BarcodeDetector?: BarcodeDetectorConstructor }
  ).BarcodeDetector;
  return candidate ?? null;
}

// カメラが使えるかはブラウザ由来の値なので、サーバー描画との差を出さないために
// useSyncExternalStore で読む（初回は false → ハイドレーション後に確定）
const subscribeNothing = () => () => {};
const hasCameraOnClient = () => Boolean(navigator.mediaDevices?.getUserMedia);
const hasCameraOnServer = () => false;

/**
 * カメラでQRを読む。
 *
 * BarcodeDetector があるブラウザ（Android Chrome など）はそれを使い、
 * 無い場合（iOS Safari）は qr-scanner（jsQR をWorkerで動かすライブラリ）に
 * フォールバックする。カメラそのものが使えない環境では手動選択に誘導する。
 */
const QrScanner: FC<QrScannerProps> = ({ onScan, active = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onScanRef = useRef(onScan);
  const [status, setStatus] = useState<Status>("starting");

  const hasCamera = useSyncExternalStore(
    subscribeNothing,
    hasCameraOnClient,
    hasCameraOnServer
  );

  // onScan の参照が変わってもカメラを開き直さないよう、refに逃がす
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!active || !hasCamera) return;

    let stopped = false;
    let stream: MediaStream | null = null;
    let timer: number | null = null;
    let fallbackScanner: { destroy: () => void } | null = null;
    const videoElement = videoRef.current;

    // 検知と、その結果の処理が終わるまで次の検知を始めない。
    // 端末が遅く detect() が周期より長引くと、連続するティックの両方が検知に成功し、
    // 呼び出し側のガードが反映される前に onScan が2回走ってしまうため
    let isHandling = false;
    const handleScan = async (run: () => Promise<string | undefined>) => {
      if (isHandling || stopped) return;
      isHandling = true;
      try {
        const value = await run();
        if (value && !stopped) await onScanRef.current(value);
      } catch {
        // フレームが未準備のときなどは次の周期で拾う
      } finally {
        isHandling = false;
      }
    };

    // BarcodeDetector が使える場合はブラウザ内蔵の実装を使う
    const startWithDetector = async (Detector: BarcodeDetectorConstructor) => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          // 背面カメラを優先する
          video: { facingMode: { ideal: "environment" } },
        });
      } catch {
        if (!stopped) setStatus("denied");
        return;
      }

      if (stopped || !videoElement) {
        stream?.getTracks().forEach((track) => track.stop());
        return;
      }

      videoElement.srcObject = stream;
      await videoElement.play().catch(() => {});
      if (stopped) return;
      setStatus("scanning");

      const detector = new Detector({ formats: ["qr_code"] });
      timer = window.setInterval(() => {
        void handleScan(async () => {
          const results = await detector.detect(videoElement);
          return results[0]?.rawValue;
        });
      }, DETECT_INTERVAL_MS);
    };

    // iOS Safari など BarcodeDetector が無い環境用。ライブラリ側が
    // getUserMedia と描画まで面倒を見るため、video要素を渡すだけで済む
    const startWithFallback = async () => {
      if (!videoElement) return;

      const { default: LibQrScanner } = await import("qr-scanner");
      if (stopped) return;

      const scanner = new LibQrScanner(
        videoElement,
        // ライブラリ側も連続で呼んでくるため、検知側と同じガードを通す
        (result) => void handleScan(async () => result.data),
        {
          returnDetailedScanResult: true,
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 3,
        }
      );
      fallbackScanner = scanner;

      try {
        await scanner.start();
        if (stopped) return;
        setStatus("scanning");
      } catch {
        if (!stopped) setStatus("denied");
      }
    };

    const start = async () => {
      const Detector = getDetectorConstructor();
      if (Detector) {
        await startWithDetector(Detector);
        return;
      }
      await startWithFallback();
    };

    void start();

    return () => {
      stopped = true;
      if (timer !== null) window.clearInterval(timer);
      fallbackScanner?.destroy();
      stream?.getTracks().forEach((track) => track.stop());
      if (videoElement) videoElement.srcObject = null;
    };
  }, [active, hasCamera]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-60 overflow-hidden rounded-lg border border-main bg-card">
        <video
          ref={videoRef}
          muted
          playsInline
          className="size-full object-cover"
        />
        {(!hasCamera || status !== "scanning") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
            {!hasCamera ? (
              <span className="text-caption text-sub">
                このブラウザではカメラを使えません。下の「手動で参加団体を選択」をお使いください。
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
      {hasCamera && status === "scanning" && (
        <p className="text-caption text-sub">
          団体のQRコードを枠内に写してください
        </p>
      )}
    </div>
  );
};

export default QrScanner;
