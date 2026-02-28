"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RandomPickerToolProps {
  t: (key: string) => string;
}

export function RandomPickerTool({ t }: RandomPickerToolProps) {
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [displayValue, setDisplayValue] = useState<string | null>(null);

  const items = input
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const pick = () => {
    if (items.length === 0) return;
    setSpinning(true);
    setPicked(null);
    setDisplayValue(items[Math.floor(Math.random() * items.length)] ?? null);
    const target = items[Math.floor(Math.random() * items.length)] ?? null;
    let step = 0;
    const maxSteps = 12;
    const interval = setInterval(() => {
      setDisplayValue(items[Math.floor(Math.random() * items.length)] ?? null);
      step++;
      if (step >= maxSteps) {
        clearInterval(interval);
        setDisplayValue(target);
        setPicked(target);
        setSpinning(false);
      }
    }, 80);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[140px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={5}
      />
      {items.length === 0 && (
        <p className="text-sm text-[var(--muted)]">Введите варианты (каждый с новой строки или через запятую) и нажмите «Выбрать».</p>
      )}
      <button
        type="button"
        onClick={pick}
        disabled={items.length === 0 || spinning}
        className="rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
      >
        {spinning ? "..." : t("pick")}
      </button>
      <AnimatePresence mode="wait">
        {(spinning ? displayValue : picked) !== null && (
          <motion.div
            key={spinning ? "spin" : "result"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border-2 border-[var(--accent)] bg-[var(--accent-muted)] p-6 text-center"
          >
            <span className="text-sm text-[var(--muted)] block mb-1">{t("result")}</span>
            <motion.span
              key={displayValue ?? ""}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-[var(--foreground)]"
            >
              {spinning ? displayValue : picked}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
