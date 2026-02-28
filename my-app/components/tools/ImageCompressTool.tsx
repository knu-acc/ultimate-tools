"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ImageCompressToolProps {
  t: (key: string) => string;
}

const PRESETS = [
  { label: "Макс. качество", quality: 0.95, desc: "Почти без потерь" },
  { label: "Для сайта", quality: 0.85, desc: "Баланс размер/качество" },
  { label: "Для соцсетей", quality: 0.78, desc: "Оптимально для постов" },
  { label: "Малый размер", quality: 0.6, desc: "Сильное сжатие" },
  { label: "Минимум", quality: 0.4, desc: "Минимальный вес" },
];

export function ImageCompressTool({ t }: ImageCompressToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.85);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f?.type.startsWith("image/")) return;
    setFile(f);
    setOriginalSize(f.size);
    setResultSize(null);
    setDimensions(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      const img = new Image();
      img.onload = () => {
        setDimensions({ w: img.width, h: img.height });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(f);
    setResult(null);
  };

  const compress = useCallback(() => {
    if (!preview || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current!.getContext("2d")!;
      canvasRef.current!.width = img.width;
      canvasRef.current!.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvasRef.current!.toDataURL("image/jpeg", quality);
      setResult(dataUrl);
      const base64Length = dataUrl.split(",")[1]?.length ?? 0;
      setResultSize(Math.ceil((base64Length * 3) / 4));
    };
    img.src = preview;
  }, [preview, quality]);

  useEffect(() => {
    if (preview && canvasRef.current) compress();
  }, [preview, compress]);

  const clearAll = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setOriginalSize(null);
    setResultSize(null);
    setDimensions(null);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Сжатие изображений в браузере. Загрузите файл (JPG, PNG, WebP), выберите качество — результат обновляется автоматически. Файлы никуда не отправляются.
      </p>

      <div className="result-card">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--foreground)]/70">{t("upload") || "Загрузить изображение"}</label>
          {file && <button type="button" onClick={clearAll} className="btn-ghost">Очистить</button>}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="btn-primary w-full sm:w-auto mt-2"
        />
      </div>

      {!file && (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/10 px-6 py-8 text-center text-sm text-[var(--muted)]">
          Выберите файл (JPG, PNG, WebP и др.). После загрузки появятся пресеты качества, ползунок и кнопка «Скачать».
        </div>
      )}

      {file && (
        <>
          <div className="result-card">
            <div className="mb-3 text-sm font-medium text-[var(--muted)]">{t("preset") || "Цель сжатия"}</div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setQuality(p.quality)}
                  className={`rounded-lg px-3 py-2 text-left text-sm ${quality === p.quality ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] hover:bg-[var(--border)]/20"}`}
                >
                  <span className="font-medium">{p.label}</span>
                  <span className="ml-1 opacity-80">({p.desc})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="result-card">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">{t("quality")}</label>
              <span className="text-lg font-bold tabular-nums">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="h-3 w-full accent-[var(--accent)]"
            />
          </div>

          {originalSize != null && (
            <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
              {t("original")}: <strong className="text-[var(--foreground)]">{(originalSize / 1024).toFixed(1)} KB</strong>
              {dimensions && (
                <span className="ml-2">
                  · {dimensions.w}×{dimensions.h} px
                </span>
              )}
            </p>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-medium text-[var(--muted)]">{t("original")}</div>
              <img src={preview!} alt="" className="max-h-56 w-full rounded-xl border border-[var(--border)] object-contain bg-[var(--card-bg)]" />
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-[var(--muted)]">
                {t("compressed")}
                {resultSize != null && (
                  <span className="ml-1 font-bold text-[var(--foreground)]">
                    ({(resultSize / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>
              {result ? (
                <>
                  <img src={result} alt="" className="max-h-56 w-full rounded-xl border border-[var(--border)] object-contain bg-[var(--card-bg)]" />
                  <a
                    href={result}
                    download={file.name.replace(/\.[^.]+$/, "_compressed.jpg")}
                    className="btn-primary w-full sm:w-auto mt-2"
                  >
                    {t("download")}
                  </a>
                </>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--muted)]">
                  Результат обновляется…
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
