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

  const applyResult = () => setText(result.join("\n"));

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <label className="field-label">Список элементов</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder")}
          className="input-base min-h-[150px] resize-y"
          rows={6}
        />
        {lines.length > 0 && <p className="mt-2 text-xs text-[var(--muted)]">Элементов: {lines.length}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="tool-action-bar"><motion.button
          onClick={doShuffle}
          disabled={lines.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full sm:w-auto mt-2"
        >
          {t("shuffle")}
        </motion.button></div>
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
          className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-[var(--foreground)]/70">{t("result")}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={applyResult}
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--accent)]/10"
              >
                Подставить в поле
              </button>
              <CopyButton text={result.join("\n")} />
            </div>
          </div>
          <div className="cursor-pointer select-all rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm space-y-1">
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
