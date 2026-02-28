"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface ReverseTextToolProps {
  t: (key: string) => string;
}

export function ReverseTextTool({ t }: ReverseTextToolProps) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"chars" | "words" | "lines">("chars");
  const reversed =
    mode === "chars"
      ? text.split("").reverse().join("")
      : mode === "words"
        ? text.trim().split(/\s+/).reverse().join(" ")
        : text.split(/\r?\n/).reverse().join("\n");

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Разворот текста: по символам, по словам или по строкам. Удобно для эффектов и проверки палиндромов.
      </p>
      <div className="space-y-2">
        <span className="text-sm font-medium text-[var(--foreground)]/70">Режим:</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("chars")}
            className={`chip ${mode === "chars" ? "chip-active" : ""}`}
          >
            {t("byChars") || "По символам"}
          </button>
          <button
            type="button"
            onClick={() => setMode("words")}
            className={`chip ${mode === "words" ? "chip-active" : ""}`}
          >
            {t("byWords") || "По словам"}
          </button>
          <button
            type="button"
            onClick={() => setMode("lines")}
            className={`chip ${mode === "lines" ? "chip-active" : ""}`}
          >
            {t("byLines") || "По строкам"}
          </button>
        </div>
        <p className="text-xs text-[var(--muted)]">
          {mode === "chars" && "Порядок символов в обратную сторону (например: привет → тевирп)."}
          {mode === "words" && "Порядок слов в обратную сторону (например: один два три → три два один)."}
          {mode === "lines" && "Порядок строк сверху вниз меняется на снизу вверх."}
        </p>
      </div>
      <div className="result-card">
        <label className="field-label">Исходный текст</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder")}
          className="input-base min-h-[120px] resize-y"
          rows={4}
        />
      </div>
      <div className="result-card">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-[var(--foreground)]/70">{t("result")}</span>
          <div className="flex gap-2">
            {reversed && (
              <button
                type="button"
                onClick={() => setText(reversed)}
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--accent)]/10"
              >
                Подставить результат
              </button>
            )}
            {reversed ? <CopyButton text={reversed} label="Скопировать" /> : null}
          </div>
        </div>
        <div className="min-h-[80px] w-full rounded-lg border border-[var(--border)] bg-transparent px-5 py-4 text-base font-mono text-[var(--foreground)]">
          {reversed || <span className="text-[var(--muted)]">Введите текст — развёрнутый вариант появится здесь</span>}
        </div>
      </div>
    </div>
  );
}
