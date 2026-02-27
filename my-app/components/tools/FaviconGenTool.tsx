"use client";

import { useState, useRef } from "react";

interface FaviconGenToolProps {
  t: (key: string) => string;
}

export function FaviconGenTool({ t }: FaviconGenToolProps) {
  const [text, setText] = useState("U");
  const [bgColor, setBgColor] = useState("#FF8C00");
  const [fgColor, setFgColor] = useState("#FFFFFF");
  const [size, setSize] = useState(32);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = fgColor;
    ctx.font = `bold ${size * 0.6}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text[0] || "?", size / 2, size / 2);
    return canvas.toDataURL("image/png");
  };

  const dataUrl = generate();

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm">{t("text")}</label>
        <input
          type="text"
          maxLength={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-20 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-center text-2xl"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm">{t("bgColor")}</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="h-10 w-20 cursor-pointer rounded"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm">{t("fgColor")}</label>
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="h-10 w-20 cursor-pointer rounded"
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm">{t("size")}</label>
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        >
          {[16, 32, 48, 64].map((n) => (
            <option key={n} value={n}>{n}×{n}</option>
          ))}
        </select>
      </div>
      {dataUrl && (
        <div className="space-y-2">
          <img src={dataUrl} alt="Favicon" className="rounded-xl border" />
          <a
            href={dataUrl}
            download="favicon.png"
            className="inline-block rounded-xl bg-[var(--accent)] px-4 py-2 text-white"
          >
            {t("download")}
          </a>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
