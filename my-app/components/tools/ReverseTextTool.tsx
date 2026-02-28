"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface ReverseTextToolProps {
  t: (key: string) => string;
}

export function ReverseTextTool({ t }: ReverseTextToolProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const handleReverseChars = () => {
    if (!text) return;
    setResult(text.split("").reverse().join(""));
  };

  const handleReverseWords = () => {
    if (!text) return;
    setResult(text.trim().split(/\s+/).reverse().join(" "));
  };

  const handleReverseLines = () => {
    if (!text) return;
    setResult(text.split(/\r?\n/).reverse().join("\n"));
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
          placeholder={t("placeholder")}
          className="input-base min-h-[120px] resize-y"
          rows={4}
        />
      </div>

      <div className="tool-action-bar flex flex-wrap gap-2 justify-center sm:justify-start">
        <button
          onClick={handleReverseChars}
          className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-center text-sm font-medium transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
        >
          {t("byChars") || "По символам"}
        </button>
        <button
          onClick={handleReverseWords}
          className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-center text-sm font-medium transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
        >
          {t("byWords") || "По словам"}
        </button>
        <button
          onClick={handleReverseLines}
          className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-center text-sm font-medium transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
        >
          {t("byLines") || "По строкам"}
        </button>
      </div>

      <div className="tool-output-zone">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="tool-zone-icon">✨</span>
            <span className="text-sm font-medium text-[var(--foreground)]/70">{t("result")}</span>
          </div>
          {result && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setText(result);
                  setResult("");
                }}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--accent)]/10"
              >
                Подставить результат
              </button>
              <CopyButton text={result} label="Скопировать" />
            </div>
          )}
        </div>
        <textarea
          value={result}
          readOnly
          placeholder="Развёрнутый вариант появится здесь"
          className="input-base min-h-[120px] resize-y bg-[var(--muted)]/10"
          rows={4}
        />
      </div>
    </div>
  );
}
