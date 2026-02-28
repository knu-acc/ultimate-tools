"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const LIMITS: Record<string, number> = {
  twitter: 280,
  instagram_caption: 2200,
  instagram_bio: 150,
  facebook: 63206,
  linkedin: 3000,
  telegram: 4096,
  sms: 160,
  youtube_title: 100,
  tiktok_caption: 150,
};

interface CharLimitsToolProps {
  t: (key: string) => string;
}

export function CharLimitsTool({ t }: CharLimitsToolProps) {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [customLimit, setCustomLimit] = useState("");
  const limit = platform === "custom" && customLimit ? Math.max(1, parseInt(customLimit, 10) || 280) : (LIMITS[platform] ?? 280);
  const remaining = limit - text.length;
  const progress = Math.min(100, (text.length / limit) * 100);

  return (
    <div className="space-y-6">
<div>
        <label className="field-label">{t("platform")}</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-transparent px-5 py-4 text-base focus:border-[var(--accent)] transition-all"
        >
          {Object.keys(LIMITS).map((p) => (
            <option key={p} value={p}>{p.replace("_", " ")}</option>
          ))}
          <option value="custom">{t("custom") || "Свой лимит"}</option>
        </select>
        {platform === "custom" && (
          <input
            type="number"
            min={1}
            value={customLimit}
            onChange={(e) => setCustomLimit(e.target.value)}
            placeholder="280"
            className="mt-2 w-28 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
          />
        )}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="input-base min-h-[150px]"
        rows={6}
      />
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${progress}%`,
            backgroundColor: remaining < 0 ? "var(--accent)" : "var(--accent)",
          }}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`tabular-nums text-sm ${remaining < 0 ? "text-red-500 dark:text-red-400" : "text-[var(--muted)]"}`}>
          {text.length} / {limit} · {remaining} {t("remaining")}
        </span>
        {text && <CopyButton text={text} label="Копировать текст" />}
      </div>
    </div>
  );
}
