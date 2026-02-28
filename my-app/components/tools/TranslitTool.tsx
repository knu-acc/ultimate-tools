"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const RU_TO_EN: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

const EN_TO_RU: Record<string, string> = Object.fromEntries(
  Object.entries(RU_TO_EN).map(([k, v]) => [v, k])
);

interface TranslitToolProps {
  t: (key: string) => string;
}

function transliterate(text: string, map: Record<string, string>): string {
  return text
    .split("")
    .map((c) => {
      const lower = c.toLowerCase();
      const mapped = map[lower] ?? map[c];
      return mapped !== undefined ? (c === c.toUpperCase() && mapped ? mapped.toUpperCase() : mapped) : c;
    })
    .join("");
}

export function TranslitTool({ t }: TranslitToolProps) {
  const [text, setText] = useState("");
  const [direction, setDirection] = useState<"ru-en" | "en-ru">("ru-en");
  const [forUrl, setForUrl] = useState(false);

  let result =
    direction === "ru-en"
      ? transliterate(text, RU_TO_EN)
      : transliterate(text, EN_TO_RU);
  if (forUrl && result) {
    result = result.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  const swap = () => {
    setText(result);
    setDirection((d) => (d === "ru-en" ? "en-ru" : "ru-en"));
  };

  return (
    <div className="space-y-6">
      <div className="tool-input-zone">
        <div className="tool-zone-header">
          <span className="tool-zone-icon">✏️</span>
          <span>Ввод</span>
        </div>
        <label className="field-label">Исходный текст</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={direction === "ru-en" ? "Введите русский текст..." : "Введите латиницу..."}
          className="input-base min-h-[120px] resize-y"
          rows={5}
        />
      </div>

      <div className="tool-action-bar">
        <span className="text-sm font-medium text-[var(--foreground)]/70">Направление:</span>
        <button
          onClick={() => setDirection("ru-en")}
          className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${direction === "ru-en" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] hover:bg-[var(--border)]/20"}`}
        >
          {t("ruToEn") || "рус → латиница"}
        </button>
        <button
          onClick={() => setDirection("en-ru")}
          className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${direction === "en-ru" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] hover:bg-[var(--border)]/20"}`}
        >
          {t("enToRu") || "латиница → рус"}
        </button>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={forUrl} onChange={(e) => setForUrl(e.target.checked)} className="rounded" />
          <span className="text-sm text-[var(--muted)]">Для URL (нижний регистр, дефисы)</span>
        </label>
        {result && (
          <button
            type="button"
            onClick={swap}
            className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--accent)]/10"
          >
            {t("swap") || "↔ Подставить результат"}
          </button>
        )}
      </div>

      <div className="tool-output-zone">
        <div className="mb-2 flex items-center justify-between">
          <div className="tool-zone-header">
            <span className="tool-zone-icon">✓</span>
            <span>{t("result")}</span>
          </div>
          {result ? <CopyButton text={result} label="Скопировать" /> : null}
        </div>
        <textarea
          readOnly
          value={result}
          placeholder="Результат появится здесь..."
          className="input-base min-h-[120px] resize-y bg-[var(--background)]"
          rows={5}
        />
      </div>
    </div>
  );
}
