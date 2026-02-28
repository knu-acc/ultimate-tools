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
      <p className="text-sm text-[var(--muted)]">
        Разворот текста: по символам, по словам или по строкам. Удобно для эффектов и проверки палиндромов.
      </p>
      <div className="space-y-2">
        <span className="text-sm font-medium text-[var(--muted)]">Режим:</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("chars")}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${mode === "chars" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] hover:bg-[var(--border)]/20"}`}
          >
            {t("byChars") || "По символам"}
          </button>
          <button
            type="button"
            onClick={() => setMode("words")}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${mode === "words" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] hover:bg-[var(--border)]/20"}`}
          >
            {t("byWords") || "По словам"}
          </button>
          <button
            type="button"
            onClick={() => setMode("lines")}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${mode === "lines" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] hover:bg-[var(--border)]/20"}`}
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
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">Исходный текст</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder")}
          className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          rows={4}
        />
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-[var(--muted)]">{t("result")}</span>
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
        <div className="min-h-[80px] w-full rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 font-mono text-[var(--foreground)]">
          {reversed || <span className="text-[var(--muted)]">Введите текст — развёрнутый вариант появится здесь</span>}
        </div>
      </div>
    </div>
  );
}
