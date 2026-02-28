"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

interface LoremIpsumToolProps {
  t: (key: string) => string;
}

export function LoremIpsumTool({ t }: LoremIpsumToolProps) {
  const [count, setCount] = useState(3);
  const [mode, setMode] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);

  const generate = useCallback(() => {
    const words = LOREM.split(" ");
    const sentences = LOREM.split(". ");
    if (mode === "words") return words.slice(0, count).join(" ");
    if (mode === "sentences") {
      const s = sentences.slice(0, count).join(". ") + ".";
      return startWithLorem ? s : s.replace(/^Lorem ipsum dolor sit amet,?\s*/i, "");
    }
    const paras = Array(count).fill(null).map(() => LOREM);
    if (startWithLorem) return paras.join("\n\n");
    return paras.map((p, i) => (i === 0 ? p.replace(/^Lorem ipsum dolor sit amet,?\s*/i, "") : p)).join("\n\n");
  }, [count, mode, startWithLorem]);

  const [result, setResult] = useState("");

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Классический плейсхолдер для макетов: задайте количество и единицу (абзацы, предложения, слова), нажмите «Сгенерировать».
      </p>
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("count")}</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
            className="w-24 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:border-[var(--accent)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("mode")}</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
            className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:border-[var(--accent)]"
          >
            <option value="paragraphs">{t("paragraphs")}</option>
            <option value="sentences">{t("sentences")}</option>
            <option value="words">{t("words")}</option>
          </select>
        </div>
        <label className="flex items-center gap-2 self-end">
          <input type="checkbox" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} className="rounded" />
          <span className="text-sm text-[var(--muted)]">{t("startWithLorem") || "Начать с Lorem ipsum"}</span>
        </label>
        <motion.button
          type="button"
          onClick={() => setResult(generate())}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="self-end rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
        >
          Сгенерировать
        </motion.button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--muted)]">{t("result")}</span>
          {result ? <CopyButton text={result} label="Копировать текст" /> : null}
        </div>
        <div className="min-h-[120px] select-all rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-[var(--foreground)]">
          {result || <span className="text-[var(--muted)]">Нажмите «Сгенерировать», чтобы получить текст</span>}
        </div>
      </div>
    </div>
  );
}
