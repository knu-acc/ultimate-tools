"use client";

import { useState, useRef } from "react";

interface ImageCompressToolProps {
  t: (key: string) => string;
}

export function ImageCompressTool({ t }: ImageCompressToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f?.type.startsWith("image/")) return;
    setFile(f);
    setOriginalSize(f.size);
    setResultSize(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
    setResult(null);
  };

  const compress = () => {
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
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Сжатие изображения в JPEG с настраиваемым качеством. Загрузите файл, выберите качество и нажмите «Сжать» — затем скачайте результат.
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="block w-full text-sm"
      />
      {!file && (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Выберите изображение (JPG, PNG и др.) — после загрузки станут доступны ползунок качества и кнопка сжатия.
        </p>
      )}
      {file && (
        <>
          <div>
            <label className="mb-2 block text-sm">{t("quality")}</label>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.1}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm">{Math.round(quality * 100)}%</span>
          </div>
          <button
            onClick={compress}
            className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
          >
            {t("compress")}
          </button>
          {originalSize != null && (
            <p className="text-sm text-[var(--muted)]">{t("original")}: {(originalSize / 1024).toFixed(1)} KB</p>
          )}
          {preview && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-sm text-[var(--muted)]">{t("original")}</div>
                <img src={preview} alt="" className="max-h-48 rounded-xl border object-contain" />
              </div>
              {result && (
                <div>
                  <div className="mb-2 text-sm text-[var(--muted)]">{t("compressed")}{resultSize != null ? ` (${(resultSize / 1024).toFixed(1)} KB)` : ""}</div>
                  <img src={result} alt="" className="max-h-48 rounded-xl border object-contain" />
                  <a
                    href={result}
                    download="compressed.jpg"
                    className="mt-2 inline-block rounded-xl border border-[var(--accent)] px-4 py-2 text-sm"
                  >
                    {t("download")}
                  </a>
                </div>
              )}
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
