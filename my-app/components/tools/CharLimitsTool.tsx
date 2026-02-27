"use client";

import { useState } from "react";

const LIMITS: Record<string, number> = {
  twitter: 280,
  instagram_caption: 2200,
  instagram_bio: 150,
  facebook: 63206,
  linkedin: 3000,
  telegram: 4096,
  sms: 160,
};

interface CharLimitsToolProps {
  t: (key: string) => string;
}

export function CharLimitsTool({ t }: CharLimitsToolProps) {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const limit = LIMITS[platform] ?? 280;
  const remaining = limit - text.length;

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm">{t("platform")}</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        >
          {Object.keys(LIMITS).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[150px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        rows={6}
      />
      <div className="flex justify-between">
        <span>{text.length} / {limit}</span>
        <span className={remaining < 0 ? "text-red-500" : "text-[var(--muted)]"}>
          {remaining} {t("remaining")}
        </span>
      </div>
    </div>
  );
}
