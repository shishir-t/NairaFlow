"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

type ScannedPayload = {
  app?: string;
  action?: string;
  phone?: string;
  name?: string;
};

export function QrScanner({
  onScan,
  onClose,
}: {
  onScan: (phone: string, name?: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera access isn't supported on this device. Enter the phone number manually below.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        tick();
      } catch {
        // Camera permission denied, no camera available, etc. — fall back
        // gracefully to the existing manual entry field.
        if (!cancelled) {
          setError("Couldn't access the camera. Enter the phone number manually below.");
        }
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code?.data) {
            const parsed = safeParse(code.data);
            if (parsed?.app === "nairaflow" && parsed.action === "pay" && parsed.phone) {
              onScan(parsed.phone, parsed.name);
              return;
            }
          }
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    }

    start();

    return () => {
      cancelled = true;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-xl border border-nf-border bg-nf-surface/50 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">Scan to pay</h4>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-neutral-400 hover:text-white"
        >
          Cancel
        </button>
      </div>

      {error ? (
        <p className="mt-3 rounded-md border border-nf-gold/30 bg-nf-gold/10 px-3 py-2 text-xs text-nf-gold">
          {error}
        </p>
      ) : (
        <div className="mt-3 overflow-hidden rounded-lg bg-black">
          <video ref={videoRef} className="aspect-square w-full object-cover" muted playsInline />
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <p className="mt-2 text-[11px] text-neutral-500">
        Point the camera at a NairaFlow &ldquo;Get paid via QR&rdquo; code to fill in the recipient automatically.
      </p>
    </div>
  );
}

function safeParse(raw: string): ScannedPayload | null {
  try {
    return JSON.parse(raw) as ScannedPayload;
  } catch {
    return null;
  }
}
