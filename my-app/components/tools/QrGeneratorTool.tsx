"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

interface QrGeneratorToolProps {
  t: (key: string) => string;
}

// Minimal QR-like matrix (placeholder: simple 2D pattern for demo; real QR would use a library)
function simpleQrMatrix(text: string, size: number): boolean[][] {
  const matrix: boolean[][] = [];
  const str = text || " ";
  for (let y = 0; y < size; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) % (str.length * 8);
      const charCode = str.charCodeAt(Math.floor(i / 8) % str.length) ?? 0;
      row.push(((charCode >> (i % 8)) & 1) === 1);
    }
    matrix.push(row);
  }
  return matrix;
}

export function QrGeneratorTool({ t }: QrGeneratorToolProps) {
  const [value, setValue] = useState("");
  const [cellSize, setCellSize] = useState(4);
  const size = 29;
  const matrix = useMemo(() => simpleQrMatrix(value, size), [value]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Визуализация данных в виде QR-подобного паттерна. Введите текст — паттерн обновляется. Для настоящего QR-кода используйте специализированные сервисы или библиотеки.
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[80px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={3}
      />
      {value ? (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--muted)]">{t("size") || "Размер"}</label>
            <select value={cellSize} onChange={(e) => setCellSize(Number(e.target.value))} className="rounded-lg border border-[var(--border)] bg-transparent px-2 py-1">
              {[2, 4, 6, 8].map((n) => (
                <option key={n} value={n}>{n}px</option>
              ))}
            </select>
          </div>
          <div
            className="border border-[var(--border)] p-2"
            style={{ imageRendering: "pixelated" }}
          >
            <svg
              width={size * cellSize}
              height={size * cellSize}
              viewBox={`0 0 ${size} ${size}`}
              className="bg-white dark:bg-[var(--card-bg)]"
            >
              {matrix.map((row, y) =>
                row.map((cell, x) => (
                  <rect
                    key={`${y}-${x}`}
                    x={x}
                    y={y}
                    width={1}
                    height={1}
                    fill={cell ? "#2c2f36" : "#ffffff"}
                  />
                ))
              )}
            </svg>
          </div>
          <p className="text-xs text-[var(--muted)]">{t("hint")}</p>
          <CopyButton text={value} label="Копировать текст" />
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите текст или ссылку — визуальный паттерн появится ниже.
        </p>
      )}
    </div>
  );
}
