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
      <div className="tool-input-zone">
        <div className="tool-zone-header">
          <span className="tool-zone-icon">🎲</span>
          <span>{t("settings") || "Настройки броска"}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="field-label">{t("count")}: {count}</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={20}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
              <input
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                className="input-base w-20"
              />
            </div>
            
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-[var(--muted)] w-full block mb-1">
                {t("presets") || "Пресеты"}:
              </span>
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
          </div>

          <div className="space-y-3">
            <label className="field-label">{t("sides")}</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-3 gap-2">
              {[4, 6, 8, 10, 12, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => setSides(n)}
                  className={`py-2 rounded-xl border-2 font-medium transition-colors flex items-center justify-center ${
                    sides === n 
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]" 
                      : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--muted)]"
                  }`}
                >
                  D{n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tool-action-bar">
        <button
          onClick={roll}
          disabled={rolling}
          className="btn-primary"
        >
          {rolling ? "..." : t("roll")}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showing.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="tool-output-zone"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--foreground)]/70">{t("result")}</span>
              {!rolling && results.length > 0 && (
                <CopyButton text={results.join(", ") + (results.length > 1 ? ` (${t("sum") || "Сумма"}: ${sum})` : "")} />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {showing.map((r, i) => (
                <motion.div
                  key={`${rolling}-${i}-${r}`}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: i * 0.04 }}
                  className="stat-card flex h-20 w-20 items-center justify-center text-4xl font-bold shadow-lg"
                >
                  {sides === 6 && DICE_FACES[r] ? DICE_FACES[r] : r}
                </motion.div>
              ))}
              {!rolling && results.length > 1 && (
                <span className="text-2xl font-bold text-[var(--primary)] ml-2">
                  <span className="text-[var(--muted)] text-xl mr-2">=</span>
                  {sum}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
