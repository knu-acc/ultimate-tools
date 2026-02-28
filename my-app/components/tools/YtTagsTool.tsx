"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const YT_LIMIT = 500;

interface YtTagsToolProps {
  t: (key: string) => string;
}

export function YtTagsTool({ t }: YtTagsToolProps) {
  const [tags, setTags] = useState("");
  const charCount = tags.replace(/\s/g, "").length;
  const remaining = YT_LIMIT - charCount;

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Теги для YouTube: лимит 500 символов без пробелов. Вводите через запятую — счётчик обновляется автоматически.
      </p>
      <textarea
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={5}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`text-sm tabular-nums ${remaining < 0 ? "text-red-500" : "text-[var(--muted)]"}`}>
          {charCount} / {YT_LIMIT} {t("limit")}
        </span>
        {tags.trim() && <CopyButton text={tags.trim()} label="Копировать теги" />}
      </div>
      {!tags.trim() && (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите теги через запятую — следите за лимитом 500 символов (пробелы не учитываются).
        </p>
      )}
    </div>
  );
}
