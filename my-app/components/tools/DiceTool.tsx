"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

interface DiceToolProps {
  t: (key: string) => string;
}

const DICE_FACES: Record<number, string> = {
  1: "⚀", 2: "⚁", 3: "⚂", 4: "⚃", 5: "⚄", 6: "⚅",
};

const DICE_PRESETS = [
  { label: "2d6", count: 2, sides: 6 },
  { label: "1d20", count: 1, sides: 20 },
  { label: "4d6", count: 4, sides: 6 },
  { label: "1d4", count: 1, sides: 4 },
  { label: "3d6", count: 3, sides: 6 },
  { label: "1d6", count: 1, sides: 6 },
];

export function DiceTool({ t }: DiceToolProps) {
  const [count, setCount] = useState(2);
  const [sides, setSides] = useState(6);
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [displayValues, setDisplayValues] = useState<number[]>([]);

  const roll = () => {
    const final = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    setRolling(true);
    setDisplayValues(Array(count).fill(1));
    let step = 0;
    const steps = 10;
    const iv = setInterval(() => {
      step++;
      setDisplayValues(Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1));
      if (step >= steps) {
        clearInterval(iv);
        setResults(final);
        setDisplayValues(final);
        setRolling(false);
      }
    }, 50);
  };

  const showing = rolling ? displayValues : results;
  const sum = results.length > 0 ? results.reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Виртуальные кубики для настольных игр и решений. Выберите тип (d4–d20) и количество костей. Бросок выполняется в браузере.
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <span className="mb-3 block text-sm font-medium text-[var(--muted)]">Пресеты и настройки</span>
        <div className="flex flex-wrap gap-2 mb-4">
          {DICE_PRESETS.map(({ label, count: c, sides: s }) => (
            <button
              key={label}
              type="button"
              onClick={() => { setCount(c); setSides(s); }}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${count === c && sides === s ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)]" : "border-[var(--border)] hover:bg-[var(--border)]/20"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("count")}</label>
            <input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
              className="w-20 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("sides")}</label>
            <select
              value={sides}
              onChange={(e) => setSides(Number(e.target.value))}
              className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            >
              {[4, 6, 8, 10, 12, 20].map((n) => (
                <option key={n} value={n}>D{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <motion.button
        onClick={roll}
        disabled={rolling}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white disabled:opacity-70"
      >
        {rolling ? "..." : t("roll")}
      </motion.button>
      <AnimatePresence mode="wait">
        {showing.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--muted)]">{t("result")}</span>
              {!rolling && results.length > 0 && (
                <CopyButton text={results.join(", ") + (results.length > 1 ? " (сумма: " + sum + ")" : "")} />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {showing.map((r, i) => (
                <motion.div
                  key={`${rolling}-${i}-${r}`}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: i * 0.04 }}
                  className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-[var(--accent)] bg-[var(--accent)]/10 text-3xl shadow-lg"
                >
                  {sides === 6 ? DICE_FACES[r] ?? r : r}
                </motion.div>
              ))}
              {!rolling && results.length > 1 && (
                <span className="text-lg font-medium text-[var(--muted)]">= {sum}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
