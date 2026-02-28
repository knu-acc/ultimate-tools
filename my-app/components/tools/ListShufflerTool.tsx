"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

interface ListShufflerToolProps {
  t: (key: string) => string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ListShufflerTool({ t }: ListShufflerToolProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string[]>([]);

  const lines = text.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);

  const doShuffle = () => setResult(shuffle(lines));
  const doReverse = () => setResult([...lines].reverse());

  return (
    <div className="space-y-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[150px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={6}
      />
      <p className="text-xs text-[var(--muted)]">Элементы — по одному на строку или через запятую/точку с запятой.</p>
      <div className="flex flex-wrap gap-2">
        <motion.button
          onClick={doShuffle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
        >
          {t("shuffle")}
        </motion.button>
        <motion.button
          onClick={doReverse}
          disabled={lines.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl border border-[var(--border)] px-6 py-3 font-medium hover:bg-[var(--border)]/20 disabled:opacity-50"
        >
          {t("reverse") || "Обратный порядок"}
        </motion.button>
      </div>
      {result.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">{t("result")}</span>
            <CopyButton text={result.join("\n")} />
          </div>
          <div className="cursor-pointer select-all rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm space-y-1">
            {result.map((line, i) => (
              <motion.div
                key={`${i}-${line}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {line}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
