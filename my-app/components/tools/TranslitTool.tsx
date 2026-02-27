"use client";

import { useState } from "react";

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
      <div className="flex gap-2">
        <button
          onClick={() => setDirection("ru-en")}
          className={`rounded-xl px-4 py-2 text-sm ${direction === "ru-en" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
        >
          {t("ruToEn")}
        </button>
        <button
          onClick={() => setDirection("en-ru")}
          className={`rounded-xl px-4 py-2 text-sm ${direction === "en-ru" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
        >
          {t("enToRu")}
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={5}
      />
      <div>
        <div className="mb-2 text-sm text-[var(--muted)]">{t("result")}</div>
        <div className="min-h-[80px] rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono">
          {result || "—"}
        </div>
      </div>
    </div>
  );
}
