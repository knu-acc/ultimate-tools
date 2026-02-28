"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { CopyButton } from "@/components/CopyButton";

interface FaviconGenToolProps {
  t: (key: string) => string;
}

const SIZES = [
  { size: 16, label: "16×16", desc: "Браузер, вкладка" },
  { size: 32, label: "32×32", desc: "Браузер, избранное" },
  { size: 48, label: "48×48", desc: "Windows сайтбар" },
  { size: 180, label: "180×180", desc: "Apple Touch Icon" },
  { size: 192, label: "192×192", desc: "PWA, Android" },
  { size: 512, label: "512×512", desc: "PWA, splash" },
];

export function FaviconGenTool({ t }: FaviconGenToolProps) {
  const [text, setText] = useState("U");
  const [bgColor, setBgColor] = useState("#2563EB");
  const [fgColor, setFgColor] = useState("#FFFFFF");
  const [pngs, setPngs] = useState<{ size: number; dataUrl: string | null }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const letter = text[0] || "?";
    setPngs(
      SIZES.map(({ size }) => {
        canvas.width = size;
        canvas.height = size;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = fgColor;
        ctx.font = `bold ${size * 0.6}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(letter, size / 2, size / 2);
        return { size, dataUrl: canvas.toDataURL("image/png") };
      })
    );
  }, [text, bgColor, fgColor]);

  const svgContent = useMemo(() => {
    const s = 512;
    const letter = text[0] || "?";
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">
  <rect width="${s}" height="${s}" fill="${bgColor}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${fgColor}" font-family="system-ui,sans-serif" font-size="${s * 0.6}" font-weight="bold">${letter}</text>
</svg>`;
  }, [text, bgColor, fgColor]);

  const manifestIcons = useMemo(() => {
    return [
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon", purpose: "any" },
      ...SIZES.filter((x) => x.size >= 192).map(({ size }) => ({
        src: `/icon-${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose: size >= 512 ? "any maskable" : "any",
      })),
    ];
  }, []);

  const manifestJson = useMemo(
    () =>
      JSON.stringify(
        {
          name: "My App",
          icons: manifestIcons,
        },
        null,
        2
      ),
    [manifestIcons]
  );

  const colorPresets = [
    { bg: "#2563EB", fg: "#FFFFFF", label: "Синий" },
    { bg: "#000000", fg: "#FFFFFF", label: "Чёрный" },
    { bg: "#16a34a", fg: "#FFFFFF", label: "Зелёный" },
    { bg: "#dc2626", fg: "#FFFFFF", label: "Красный" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Иконка из одной буквы на цветном фоне. Все размеры для браузера, Apple Touch, PWA и Android генерируются в браузере. Скачайте PNG/SVG или скопируйте код.
      </p>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <span className="mb-3 block text-sm font-medium text-[var(--muted)]">Символ и цвета</span>
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("text")}</label>
            <input type="text" maxLength={1} value={text} onChange={(e) => setText(e.target.value)} className="w-16 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-center text-2xl font-bold focus:border-[var(--accent)]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {colorPresets.map(({ bg, fg, label }) => (
              <button key={label} type="button" onClick={() => { setBgColor(bg); setFgColor(fg); }} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--border)]/20 flex items-center gap-2">
                <span className="w-5 h-5 rounded border border-[var(--border)]" style={{ backgroundColor: bg }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{t("bgColor")}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded-lg border border-[var(--border)]"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">{t("fgColor")}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded-lg border border-[var(--border)]"
            />
            <input
              type="text"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
      </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <div className="mb-3 text-sm font-medium text-[var(--muted)]">Размеры и скачивание</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SIZES.map(({ size, label, desc }) => {
            const dataUrl = pngs.find((p) => p.size === size)?.dataUrl;
            return (
              <div
                key={size}
                className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] p-3"
              >
                {dataUrl && (
                  <img src={dataUrl} alt={label} className="rounded-lg border border-[var(--border)]" width={Math.min(size, 64)} height={Math.min(size, 64)} />
                )}
                <div className="text-center">
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-[var(--muted)]">{desc}</div>
                </div>
                {dataUrl && (
                  <a
                    href={dataUrl}
                    download={`icon-${size}.png`}
                    className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
                  >
                    {t("download")}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <div className="mb-2 text-sm font-medium text-[var(--muted)]">SVG (масштабируемая иконка)</div>
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton text={svgContent} label="Копировать SVG" />
          <a
            href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`}
            download="icon.svg"
            className="rounded-lg border border-[var(--accent)] px-3 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10"
          >
            Скачать SVG
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <div className="mb-2 text-sm font-medium text-[var(--muted)]">Web App Manifest (иконки для PWA и Android)</div>
        <p className="mb-2 text-xs text-[var(--muted)]">
          Вставьте этот фрагмент в manifest.json или скопируйте массив icons.
        </p>
        <div className="flex justify-end"><CopyButton text={manifestJson} label="Копировать JSON" /></div>
        <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-xs">
          {manifestJson}
        </pre>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
