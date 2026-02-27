"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

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

  return (
    <div className="space-y-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[200px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        rows={8}
      />
      <motion.div
        layout
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {[
          { key: "chars", value: stats.chars },
          { key: "charsNoSpaces", value: stats.charsNoSpaces },
          { key: "words", value: stats.words },
          { key: "lines", value: stats.lines },
        ].map(({ key, value }) => (
          <div
            key={key}
            className="rounded-xl border border-[var(--border)] p-4 text-center"
          >
            <div className="text-2xl font-bold text-[var(--accent)]">{value}</div>
            <div className="text-sm text-[var(--muted)]">{t(key)}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
