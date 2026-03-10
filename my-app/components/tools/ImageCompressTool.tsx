"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ImageCompressToolProps {
  t: (key: string) => string;
}

type OutputFormat = "same" | "jpeg" | "webp" | "png";

const PRESETS = [
  { label: "Макс. качество", quality: 0.94, scale: 1 },
  { label: "Для сайта", quality: 0.84, scale: 0.9 },
  { label: "Для соцсетей", quality: 0.76, scale: 0.82 },
  { label: "Минимальный вес", quality: 0.6, scale: 0.72 },
];

const WHITE_BG_THRESHOLD = 244;

function estimateBytes(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.ceil((base64.length * 3) / 4);
}

function safeFileName(filename: string, ext: string) {
  const name = filename.replace(/\.[^.]+$/, "");
  return `${name}_optimized.${ext}`;
}

export function ImageCompressTool({ t }: ImageCompressToolProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [resultExt, setResultExt] = useState("jpg");
  const [quality, setQuality] = useState(0.84);
  const [scale, setScale] = useState(1);
  const [format, setFormat] = useState<OutputFormat>("same");
  const [lossy, setLossy] = useState(true);
  const [removeBg, setRemoveBg] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sizes, setSizes] = useState({ original: 0, compressed: 0 });

  const reduction = useMemo(() => {
    if (!sizes.original || !sizes.compressed) return null;
    return Math.max(0, Math.round((1 - sizes.compressed / sizes.original) * 100));
  }, [sizes]);

  const releasePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const chooseOutput = useCallback(
    (sourceType: string, hasAlpha: boolean): { mime: string; ext: string; qualityArg?: number } => {
      if (format === "jpeg") return { mime: "image/jpeg", ext: "jpg", qualityArg: quality };
      if (format === "webp") return { mime: "image/webp", ext: "webp", qualityArg: quality };
      if (format === "png") return { mime: "image/png", ext: "png" };

      if (hasAlpha) {
        if (lossy) return { mime: "image/webp", ext: "webp", qualityArg: quality };
        return { mime: "image/png", ext: "png" };
      }

      if (sourceType === "image/webp") return { mime: "image/webp", ext: "webp", qualityArg: quality };
      return { mime: "image/jpeg", ext: "jpg", qualityArg: quality };
    },
    [format, lossy, quality],
  );

  const processImage = useCallback(
    async (rawFile: File) => {
      if (!rawFile.type.startsWith("image/")) {
        setError("Нужен файл изображения.");
        return;
      }

      setIsProcessing(true);
      setError(null);
      setFile(rawFile);
      setSizes({ original: rawFile.size, compressed: 0 });

      try {
        releasePreview();
        const url = URL.createObjectURL(rawFile);
        previewUrlRef.current = url;
        setPreview(url);

        const bitmap = await createImageBitmap(rawFile);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const w = Math.max(1, Math.round(bitmap.width * scale));
        const h = Math.max(1, Math.round(bitmap.height * scale));
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          setError("Не удалось инициализировать canvas.");
          return;
        }

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(bitmap, 0, 0, w, h);

        let alphaDetected = false;
        const probe = ctx.getImageData(0, 0, Math.min(w, 128), Math.min(h, 128)).data;
        for (let i = 3; i < probe.length; i += 4) {
          if (probe[i] < 250) {
            alphaDetected = true;
            break;
          }
        }

        if (removeBg) {
          const imageData = ctx.getImageData(0, 0, w, h);
          const px = imageData.data;
          for (let i = 0; i < px.length; i += 4) {
            const r = px[i];
            const g = px[i + 1];
            const b = px[i + 2];
            if (r > WHITE_BG_THRESHOLD && g > WHITE_BG_THRESHOLD && b > WHITE_BG_THRESHOLD) {
              px[i + 3] = 0;
            }
          }
          ctx.putImageData(imageData, 0, 0);
          alphaDetected = true;
        }

        setIsTransparent(alphaDetected);

        const out = chooseOutput(rawFile.type, alphaDetected);
        const dataUrl = canvas.toDataURL(out.mime, out.qualityArg);

        setResult(dataUrl);
        setResultExt(out.ext);
        setSizes((prev) => ({ ...prev, compressed: estimateBytes(dataUrl) }));
      } catch {
        setError("Ошибка обработки изображения.");
      } finally {
        setIsProcessing(false);
      }
    },
    [chooseOutput, removeBg, scale],
  );

  const clearAll = () => {
    releasePreview();
    setFile(null);
    setPreview(null);
    setResult(null);
    setResultExt("jpg");
    setIsTransparent(false);
    setError(null);
    setSizes({ original: 0, compressed: 0 });
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    return () => releasePreview();
  }, []);

  useEffect(() => {
    if (!file) return;
    const timer = setTimeout(() => {
      void processImage(file);
    }, 120);
    return () => clearTimeout(timer);
  }, [file, quality, scale, format, lossy, removeBg, processImage]);

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) await processImage(picked);
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) await processImage(dropped);
  };

  const onPaste = useCallback(
    async (e: ClipboardEvent) => {
      const imageItem = Array.from(e.clipboardData?.items ?? []).find((item) => item.type.startsWith("image/"));
      const pasted = imageItem?.getAsFile();
      if (!pasted) return;
      e.preventDefault();
      await processImage(pasted);
    },
    [processImage],
  );

  useEffect(() => {
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [onPaste]);

  return (
    <div className="space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        className={`rounded-3xl border-2 border-dashed p-6 text-center transition-colors ${
          dragActive ? "border-[var(--accent)] bg-[var(--accent-bg)]" : "border-[var(--border)] bg-[var(--surface)]"
        }`}
      >
        <p className="mb-3 text-sm text-[var(--text-muted)]">Перетащите файл или вставьте из буфера (Ctrl/Cmd+V)</p>
        <div className="flex justify-center gap-2">
          <button className="btn-primary" type="button" onClick={() => inputRef.current?.click()}>
            {t("upload") || "Выбрать файл"}
          </button>
          {file && (
            <button className="btn-secondary" type="button" onClick={clearAll}>
              Очистить
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} className="hidden" />
      </div>

      {file && (
        <div className="result-card space-y-4">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                className="btn-secondary"
                type="button"
                onClick={() => {
                  setQuality(preset.quality);
                  setScale(preset.scale);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              Качество: {Math.round(quality * 100)}%
              <input
                type="range"
                min={0.35}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="text-sm">
              Масштаб: {Math.round(scale * 100)}%
              <input
                type="range"
                min={0.35}
                max={1}
                step={0.05}
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <select className="input-base max-w-72" value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}>
              <option value="same">Авто-формат (сохранять прозрачность)</option>
              <option value="webp">WebP</option>
              <option value="jpeg">JPEG (без прозрачности)</option>
              <option value="png">PNG</option>
            </select>

            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={lossy} onChange={(e) => setLossy(e.target.checked)} />
              Lossy сжатие
            </label>

            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} />
              Удалять белый фон
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {preview && <img src={preview} alt="original" className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />}
            {result && <img src={result} alt="compressed" className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {result && (
              <a className="btn-primary" href={result} download={safeFileName(file.name, resultExt)}>
                {t("download") || "Скачать"}
              </a>
            )}
            <span className="text-sm text-[var(--text-muted)]">
              {isProcessing
                ? "Обработка..."
                : `${Math.round(sizes.original / 1024)}KB → ${Math.round(sizes.compressed / 1024)}KB${
                    reduction != null ? ` (−${reduction}%)` : ""
                  }${isTransparent ? " · Прозрачность сохранена" : ""}`}
            </span>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
