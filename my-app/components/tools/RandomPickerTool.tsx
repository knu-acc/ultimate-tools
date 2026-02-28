"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

interface RandomPickerToolProps {
  t: (key: string) => string;
}

export function RandomPickerTool({ t }: RandomPickerToolProps) {
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [pickedMultiple, setPickedMultiple] = useState<string[]>([]);
  const [pickCount, setPickCount] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [displayValue, setDisplayValue] = useState<string | null>(null);

  const items = input
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const pick = () => {
    if (items.length === 0) return;
    const n = Math.min(Math.max(1, pickCount), items.length);
    setSpinning(true);
    setPicked(null);
    setPickedMultiple([]);
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const targetList = shuffled.slice(0, n);
    const target = n === 1 ? targetList[0] ?? null : null;
    setDisplayValue(n === 1 ? (items[Math.floor(Math.random() * items.length)] ?? null) : null);
    let step = 0;
    const maxSteps = 12;
    const interval = setInterval(() => {
      if (n === 1) setDisplayValue(items[Math.floor(Math.random() * items.length)] ?? null);
      step++;
      if (step >= maxSteps) {
        clearInterval(interval);
        if (n === 1) {
          setDisplayValue(target);
          setPicked(target);
        } else {
          setPickedMultiple(targetList);
        }
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
      {items.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--muted)]">{t("pickCount") || "Выбрать"}</label>
          <input
            type="number"
            min={1}
            max={Math.max(1, items.length)}
            value={pickCount}
            onChange={(e) => setPickCount(Number(e.target.value) || 1)}
            className="w-16 rounded-lg border border-[var(--border)] bg-transparent px-2 py-1 text-center"
          />
          <span className="text-sm text-[var(--muted)]">из {items.length}</span>
        </div>
      )}
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
        {!spinning && pickedMultiple.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-[var(--muted)]">{t("result")} ({pickedMultiple.length})</span>
              <CopyButton text={pickedMultiple.join("\n")} label="Копировать" />
            </div>
            <ul className="list-decimal list-inside space-y-1">
              {pickedMultiple.map((item, i) => (
                <li key={i} className="font-medium">{item}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
