"use client";

import { useState } from "react";

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
      <textarea
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        rows={5}
      />
      <div className="flex justify-between text-sm">
        <span className={remaining < 0 ? "text-red-500" : "text-[var(--muted)]"}>
          {charCount} / {YT_LIMIT}
        </span>
        <span>{t("limit")}</span>
      </div>
    </div>
  );
}
