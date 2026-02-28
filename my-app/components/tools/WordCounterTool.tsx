"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

interface WordCounterToolProps {
  t: (key: string) => string;
}

export function WordCounterTool({ t }: WordCounterToolProps) {
  const [text, setText] = useState("");
  const [limit, setLimit] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = text ? text.split(/\n/).length : 0;
    const paragraphs = text ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const wpm = 200;
    const readingTimeMin = words > 0 ? Math.max(1, Math.ceil(words / wpm)) : 0;
    return { chars, charsNoSpaces, words, lines, paragraphs, readingTimeMin };
  }, [text]);

  const limitNum = limit ? parseInt(limit, 10) : null;
  const remaining = limitNum != null && !isNaN(limitNum) ? limitNum - stats.chars : null;

  const report = `${t("words")}: ${stats.words} · ${t("chars")}: ${stats.chars} · ${t("charsNoSpaces")}: ${stats.charsNoSpaces} · ${t("lines")}: ${stats.lines} · ${t("paragraphs")}: ${stats.paragraphs} · ${t("readingTime")}: ${stats.readingTimeMin} мин`;

  const cards = [
    { key: "chars", value: stats.chars },
    { key: "charsNoSpaces", value: stats.charsNoSpaces },
    { key: "words", value: stats.words },
    { key: "lines", value: stats.lines },
    { key: "paragraphs", value: stats.paragraphs },
    { key: "readingTime", value: stats.readingTimeMin, suffix: " мин" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Вставьте текст — счётчик обновляется автоматически. Задайте лимит символов (например 280) — под полем покажется «осталось» или «превышение».
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">Текст для подсчёта</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder")}
          className="min-h-[200px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          rows={8}
        />
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--muted)]">Лимит символов</label>
            <input
              type="number"
              min={1}
              placeholder="280"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-20 rounded-lg border border-[var(--border)] bg-transparent px-2 py-1 text-sm"
            />
          </div>
          {remaining !== null && (
            <span className={`text-sm font-medium tabular-nums ${remaining < 0 ? "text-red-500" : "text-[var(--muted)]"}`}>
              {remaining >= 0 ? `Осталось: ${remaining}` : `Превышение: ${-remaining}`}
            </span>
          )}
          {text.length > 0 && (
            <button type="button" onClick={() => setText("")} className="text-sm text-[var(--muted)] underline hover:text-[var(--foreground)]">
              Очистить поле
            </button>
          )}
        </div>
      </div>
      <motion.div layout className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-[var(--muted)]">Статистика</span>
          {text.length > 0 && <CopyButton text={report} label="Копировать отчёт" />}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {cards.map(({ key, value, suffix = "" }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-center shadow-sm"
            >
              <div className="text-2xl font-bold tabular-nums text-[var(--accent)]">{value}{suffix}</div>
              <div className="text-sm text-[var(--muted)]">{t(key)}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      {!text && (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Поле пусто — введите или вставьте текст, чтобы увидеть подсчёт слов и символов.
        </p>
      )}
    </div>
  );
}
