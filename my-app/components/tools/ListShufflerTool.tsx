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
  const [result, setResult] = useState("");

  const lines = text.split("\n").map((s) => s.trim()).filter(Boolean);

  const doShuffle = () => setResult(shuffle(lines).join("\n"));
  const doReverse = () => setResult([...lines].reverse().join("\n"));
  const doSortAZ = () => setResult([...lines].sort((a, b) => a.localeCompare(b)).join("\n"));
  const doSortZA = () => setResult([...lines].sort((a, b) => b.localeCompare(a)).join("\n"));

  return (
    <div className="space-y-6">
      <div className="tool-input-zone">
        <label className="field-label">{t("input") || "Список элементов"}</label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder")}
          className="input-base min-h-[150px] resize-y text"
          rows={6}
        />
        {lines.length > 0 && <p className="mt-2 text-xs text-[var(--muted)]">Элементов: {lines.length}</p>}
      </div>

      <div className="tool-action-bar grid grid-cols-2 md:grid-cols-4 gap-2">
        <motion.button
          onClick={doShuffle}
          disabled={lines.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full"
        >
          {t("shuffle") || "Перемешать"}
        </motion.button>
        <motion.button
          onClick={doSortAZ}
          disabled={lines.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl border border-[var(--border)] px-4 py-2 font-medium hover:bg-[var(--border)]/20 disabled:opacity-50 w-full"
        >
          {t("sort_az") || "Сорт. А-Я"}
        </motion.button>
        <motion.button
          onClick={doSortZA}
          disabled={lines.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl border border-[var(--border)] px-4 py-2 font-medium hover:bg-[var(--border)]/20 disabled:opacity-50 w-full"
        >
          {t("sort_za") || "Сорт. Я-А"}
        </motion.button>
        <motion.button
          onClick={doReverse}
          disabled={lines.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl border border-[var(--border)] px-4 py-2 font-medium hover:bg-[var(--border)]/20 disabled:opacity-50 w-full"
        >
          {t("reverse") || "Обратный порядок"}
        </motion.button>
      </div>

      {result && (
        <div className="tool-output-zone">
          <label className="field-label">{t("result") || "Результат"}</label>
          <textarea
            id="result"
            readOnly
            value={result}
            className="input-base min-h-[150px] resize-y result"
            rows={6}
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-[var(--muted)]">
              {result.split('\n').filter(Boolean).length} {t("lines") || "строк"}
            </span>
            <CopyButton text={result} />
          </div>
        </div>
      )}
    </div>
  );
}
