"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const COMBINING = [
  "\u0300", "\u0301", "\u0302", "\u0303", "\u0304", "\u0305", "\u0306",
  "\u0307", "\u0308", "\u0309", "\u030A", "\u030B", "\u030C", "\u030D",
  "\u030E", "\u030F", "\u0310", "\u0311", "\u0312", "\u0313", "\u0314",
  "\u0315", "\u031A", "\u031B", "\u033D", "\u033E", "\u033F", "\u0340",
  "\u0341", "\u0342", "\u0343", "\u0344", "\u0346", "\u0347", "\u0348",
  "\u0349", "\u034A", "\u034B", "\u034C", "\u034D", "\u034E", "\u0350",
  "\u0351", "\u0352", "\u0357", "\u0358", "\u035B", "\u035C", "\u035D",
  "\u035E", "\u035F", "\u0360", "\u0361",
];

function zalgo(text: string, intensity: number): string {
  return text
    .split("")
    .map((c) => {
      if (/\s/.test(c)) return c;
      const count = Math.floor(Math.random() * intensity) + 1;
      const chars = Array.from({ length: count }, () =>
        COMBINING[Math.floor(Math.random() * COMBINING.length)]
      );
      return c + chars.join("");
    })
    .join("");
}

function removeZalgo(str: string): string {
  return str.normalize("NFD").replace(/\p{M}/gu, "");
}

interface ZalgoToolProps {
  t: (key: string) => string;
}

export function ZalgoTool({ t }: ZalgoToolProps) {
  const [text, setText] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [result, setResult] = useState("");

  const handleGenerate = () => {
    if (!text) {
      setResult("");
      return;
    }
    setResult(zalgo(text, intensity));
  };

  const handleRemove = () => {
    if (!text) {
      setResult("");
      return;
    }
    setResult(removeZalgo(text));
  };

  return (
    <div className="space-y-6">
      <div className="tool-input-zone">
        <label className="field-label">Исходный текст</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder") || "Введите текст..."}
          className="input-base h-32 resize-y"
        />

        <div className="mt-4">
          <label className="field-label">
            {t("intensity") || "Интенсивность"} — чем выше, тем больше «шума» на символ
          </label>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[
              { label: "Слабый", value: 2 },
              { label: "Средний", value: 5 },
              { label: "Сильный", value: 10 },
              { label: "Макс", value: 15 },
            ].map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setIntensity(value)}
                className={`chip ${intensity === value ? "chip-active" : ""}`}
              >
                {label} ({value})
              </button>
            ))}
            <input
              type="range"
              min={1}
              max={15}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="h-2 w-full max-w-[180px] accent-[var(--accent)]"
            />
            <span className="tabular-nums text-sm text-[var(--muted)]">{intensity}</span>
          </div>
        </div>
      </div>

      <div className="tool-action-bar">
        <button onClick={handleGenerate} className="action-btn-primary">
          Сгенерировать
        </button>
        <button onClick={handleRemove} className="action-btn-secondary">
          {t("removeZalgo") || "Убрать залго"}
        </button>
      </div>

      <div className="tool-output-zone">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <label className="field-label mb-0">{t("result") || "Результат"}</label>
          <div className="flex gap-2">
            {result && (
              <button
                type="button"
                onClick={() => setText(result)}
                className="action-btn-secondary py-1 px-3 text-sm h-auto"
              >
                Подставить
              </button>
            )}
            {result && <CopyButton text={result} />}
          </div>
        </div>
        <textarea
          value={result}
          readOnly
          className="input-base h-40 resize-y bg-[var(--card-bg)]"
          placeholder="Здесь появится результат..."
        />
      </div>
    </div>
  );
}
