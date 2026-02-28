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
      <p className="text-sm text-[var(--muted)]">
        Лимиты символов для соцсетей и мессенджеров. Выберите платформу — счётчик покажет, сколько осталось до лимита.
      </p>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{t("platform")}</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)]"
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
        className="min-h-[150px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={6}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`tabular-nums text-sm ${remaining < 0 ? "text-red-500" : "text-[var(--muted)]"}`}>
          {text.length} / {limit} · {remaining} {t("remaining")}
        </span>
        {text && <CopyButton text={text} label="Копировать текст" />}
      </div>
    </div>
  );
}
