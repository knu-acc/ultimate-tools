"use client";

import { useState } from "react";

interface RandomPickerToolProps {
  t: (key: string) => string;
}

export function RandomPickerTool({ t }: RandomPickerToolProps) {
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  const items = input
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const pick = () => {
    if (items.length === 0) return;
    setPicked(items[Math.floor(Math.random() * items.length)] ?? null);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[140px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={5}
      />
      <button
        type="button"
        onClick={pick}
        disabled={items.length === 0}
        className="rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
      >
        {t("pick")}
      </button>
      {picked !== null && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--accent-muted)] p-4">
          <span className="text-sm text-[var(--muted)]">{t("result")}: </span>
          <span className="font-medium text-[var(--foreground)]">{picked}</span>
        </div>
      )}
    </div>
  );
}
