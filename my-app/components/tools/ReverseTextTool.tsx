"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface ReverseTextToolProps {
  t: (key: string) => string;
}

export function ReverseTextTool({ t }: ReverseTextToolProps) {
  const [text, setText] = useState("");
  const reversed = text.split("").reverse().join("");

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Разворот текста посимвольно: подходит для эффектов и проверки палиндромов.
      </p>
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
