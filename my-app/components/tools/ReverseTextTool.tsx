"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface ReverseTextToolProps {
  t: (key: string) => string;
}

export function ReverseTextTool({ t }: ReverseTextToolProps) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"chars" | "words">("chars");
  const reversed =
    mode === "chars"
      ? text.split("").reverse().join("")
      : text.trim().split(/\s+/).reverse().join(" ");

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Разворот текста посимвольно или по словам. Подходит для эффектов и проверки палиндромов.
      </p>
      <div className="flex gap-2">
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
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        rows={4}
      />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--muted)]">{t("result")}</span>
          {reversed ? <CopyButton text={reversed} label="Скопировать" /> : null}
        </div>
        <div className="min-h-[80px] w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-4 py-3 font-mono text-[var(--foreground)]">
          {reversed || <span className="text-[var(--muted)]">Введите текст — развёрнутый вариант появится здесь</span>}
        </div>
      </div>
    </div>
  );
}
