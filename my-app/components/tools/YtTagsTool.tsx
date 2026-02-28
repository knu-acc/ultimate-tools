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

  const removeDuplicates = () => {
    const list = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const seen = new Set<string>();
    setTags(list.filter((t) => { const lower = t.toLowerCase(); if (seen.has(lower)) return false; seen.add(lower); return true; }).join(", "));
  };

  const sortTags = () => {
    const list = tags.split(",").map((t) => t.trim()).filter(Boolean);
    setTags([...list].sort((a, b) => a.localeCompare(b)).join(", "));
  };

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Теги для YouTube: лимит 500 символов без пробелов. Вводите через запятую — счётчик обновляется автоматически.
      </p>
      <textarea
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder={t("placeholder")}
        className="input-base min-h-[120px]"
        rows={5}
      />
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={removeDuplicates} className="btn-ghost">{t("removeDuplicates") || "Убрать дубликаты"}</button>
        <button type="button" onClick={sortTags} className="btn-ghost">{t("sort") || "По алфавиту"}</button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`text-sm tabular-nums ${remaining < 0 ? "text-red-500" : "text-[var(--muted)]"}`}>
          {charCount} / {YT_LIMIT} {t("limit")}
        </span>
        {tags.trim() && <CopyButton text={tags.trim()} label="Копировать теги" />}
      </div>
      {!tags.trim() && (
        <p className="empty-state">
          Введите теги через запятую — следите за лимитом 500 символов (пробелы не учитываются).
        </p>
      )}
    </div>
  );
}
