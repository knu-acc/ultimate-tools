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

  const result =
    direction === "ru-en"
      ? transliterate(text, RU_TO_EN)
      : transliterate(text, EN_TO_RU);

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Перевод по правилам ГОСТ: кириллица в латиницу для загранпаспорта и URL или обратно.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setDirection("ru-en")}
          className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${direction === "ru-en" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] hover:bg-[var(--border)]/20"}`}
        >
          {t("ruToEn")}
        </button>
        <button
          onClick={() => setDirection("en-ru")}
          className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${direction === "en-ru" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] hover:bg-[var(--border)]/20"}`}
        >
          {t("enToRu")}
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        rows={5}
      />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--muted)]">{t("result")}</span>
          {result ? <CopyButton text={result} label="Скопировать" /> : null}
        </div>
        <div className="min-h-[80px] rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 font-mono text-[var(--foreground)]">
          {result || (
            <span className="text-[var(--muted)]">Результат транслитерации появится здесь</span>
          )}
        </div>
      </div>
    </div>
  );
}
