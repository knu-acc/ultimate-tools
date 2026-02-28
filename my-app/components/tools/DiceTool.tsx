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
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Виртуальные кубики для настольных игр и решений. Выберите тип (d4–d20) и количество костей. Бросок выполняется в браузере.
      </p>
      <div className="result-card">
        <span className="section-label">Пресеты и настройки</span>
        <div className="flex flex-wrap gap-2 mb-4">
          {DICE_PRESETS.map(({ label, count: c, sides: s }) => (
            <button
              key={label}
              type="button"
              onClick={() => { setCount(c); setSides(s); }}
              className={`chip ${count === c && sides === s ? "chip-active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="field-label">{t("count")}</label>
            <input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
              className="input-base w-20"
            />
          </div>
          <div>
            <label className="field-label">{t("sides")}</label>
            <select
              value={sides}
              onChange={(e) => setSides(Number(e.target.value))}
              className="input-base"
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
        className="btn-primary w-full sm:w-auto mt-2"
      >
        {rolling ? "..." : t("roll")}
      </motion.button>
      <AnimatePresence mode="wait">
        {showing.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="result-card"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--foreground)]/70">{t("result")}</span>
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
