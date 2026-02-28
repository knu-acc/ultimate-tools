"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

interface WordCounterToolProps {
  t: (key: string) => string;
}

export function WordCounterTool({ t }: WordCounterToolProps) {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = text ? text.split(/\n/).length : 0;
    return { chars, charsNoSpaces, words, lines };
  }, [text]);

  const report = `${t("words")}: ${stats.words} · ${t("chars")}: ${stats.chars} · ${t("charsNoSpaces")}: ${stats.charsNoSpaces} · ${t("lines")}: ${stats.lines}`;

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Вставьте или введите текст — счётчик обновляется автоматически. Удобно для лимитов соцсетей и объёма статей.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[200px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        rows={8}
      />
      <motion.div layout className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-[var(--muted)]">Статистика</span>
          {text.length > 0 && <CopyButton text={report} label="Копировать отчёт" />}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { key: "chars", value: stats.chars },
            { key: "charsNoSpaces", value: stats.charsNoSpaces },
            { key: "words", value: stats.words },
            { key: "lines", value: stats.lines },
          ].map(({ key, value }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-center shadow-sm"
            >
              <div className="text-2xl font-bold tabular-nums text-[var(--accent)]">{value}</div>
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
