"use client";

import { useState } from "react";

interface ReverseTextToolProps {
  t: (key: string) => string;
}

export function ReverseTextTool({ t }: ReverseTextToolProps) {
  const [text, setText] = useState("");
  const reversed = text.split("").reverse().join("");

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={4}
      />
      {reversed && (
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("result")}</label>
          <div className="min-h-[80px] w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)]">
            {reversed}
          </div>
        </div>
      )}
    </div>
  );
}
