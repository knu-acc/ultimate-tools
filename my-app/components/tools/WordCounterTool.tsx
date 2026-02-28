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
    <div className="space-y-5">
      <div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("placeholder")}
            className="input-base-lg min-h-[250px] resize-y"
            rows={10}
          />
          {/* Sticky stats bar at bottom of textarea */}
          <div className="mt-2 flex flex-wrap items-center gap-3 rounded-lg bg-[var(--background)] border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)] tabular-nums">
            <span>{t("words")}: <strong className="text-[var(--foreground)]">{stats.words}</strong></span>
            <span>·</span>
            <span>{t("chars")}: <strong className="text-[var(--foreground)]">{stats.chars}</strong></span>
            <span>·</span>
            <span>{t("lines")}: <strong className="text-[var(--foreground)]">{stats.lines}</strong></span>
            {remaining !== null && (
              <span className={`ml-auto font-medium ${remaining < 0 ? "text-red-500" : "text-[var(--muted)]"}`}>
                {remaining >= 0 ? `Осталось: ${remaining}` : `Превышение: ${-remaining}`}
              </span>
            )}
          </div>
        </div>
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
          {text.length > 0 && (
            <button type="button" onClick={() => setText("")} className="btn-ghost text-sm">
              Очистить
            </button>
          )}
        </div>
      </div>

      <div className="tool-output-zone">
        <div className="tool-zone-header">
          <span className="tool-zone-icon">📊</span>
          <span>Статистика</span>
          {text.length > 0 && <div className="ml-auto"><CopyButton text={report} label="Копировать отчёт" /></div>}
        </div>
        <motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {cards.map(({ key, value, suffix = "" }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="stat-card"
            >
              <div className="stat-value">{value}{suffix}</div>
              <div className="text-sm text-[var(--muted)]">{t(key)}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {!text && (
        <p className="empty-state">
          Поле пусто — введите или вставьте текст, чтобы увидеть подсчёт слов и символов.
        </p>
      )}
    </div>
  );
}
