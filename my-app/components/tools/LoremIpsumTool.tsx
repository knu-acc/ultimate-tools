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

  const wordCount = result ? result.trim().split(/\s+/).filter(Boolean).length : 0;
  const countPresets =
    mode === "paragraphs"
      ? [1, 3, 5, 10]
      : mode === "sentences"
        ? [1, 3, 5, 10]
        : [5, 10, 25, 50];

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Классический плейсхолдер для макетов. Выберите режим (абзацы, предложения, слова), укажите количество или пресет — нажмите «Сгенерировать».
      </p>
      <div className="result-card">
        <div className="mb-3 flex flex-wrap items-end gap-4">
          <div>
            <label className="field-label">{t("mode")}</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as typeof mode)}
              className="input-base"
            >
              <option value="paragraphs">{t("paragraphs")}</option>
              <option value="sentences">{t("sentences")}</option>
              <option value="words">{t("words")}</option>
            </select>
          </div>
          <div>
            <label className="field-label">{t("count")}</label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Number(e.target.value) || 1)}
                className="input-base"
              />
              {countPresets.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${count === n ? "border-[var(--accent)] bg-[var(--accent)]/20" : "border-[var(--border)] hover:bg-[var(--border)]/20"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} className="rounded" />
            <span className="text-sm text-[var(--muted)]">{t("startWithLorem") || "Начать с Lorem ipsum"}</span>
          </label>
          <motion.button
            type="button"
            onClick={() => setResult(generate())}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full sm:w-auto mt-2"
          >
            Сгенерировать
          </motion.button>
        </div>
      </div>
      <div className="result-card">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-[var(--foreground)]/70">{t("result")}</span>
          <div className="flex items-center gap-3">
            {result && <span className="text-xs text-[var(--muted)]">Слов: {wordCount}</span>}
            {result ? <CopyButton text={result} label="Копировать текст" /> : null}
          </div>
        </div>
        <div className="min-h-[120px] select-all rounded-lg border border-[var(--border)] bg-transparent p-4 text-[var(--foreground)]">
          {result || <span className="text-[var(--muted)]">Нажмите «Сгенерировать», чтобы получить текст</span>}
        </div>
      </div>
    </div>
  );
}
