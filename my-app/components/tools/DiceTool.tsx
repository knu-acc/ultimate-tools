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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => { setCount(2); setSides(6); }} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">2d6</button>
        <button type="button" onClick={() => { setCount(1); setSides(20); }} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">1d20</button>
        <button type="button" onClick={() => { setCount(4); setSides(6); }} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">4d6</button>
      </div>
      <div className="flex gap-6">
        <div>
          <label className="mb-1 block text-sm">{t("count")}</label>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
            className="w-20 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">{t("sides")}</label>
          <select
            value={sides}
            onChange={(e) => setSides(Number(e.target.value))}
            className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"
          >
            {[4, 6, 8, 10, 12, 20].map((n) => (
              <option key={n} value={n}>D{n}</option>
            ))}
          </select>
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
            className="flex flex-wrap gap-4 items-center"
          >
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
            {!rolling && results.length > 0 && (
              <span className="flex items-center gap-2">
                <span className="text-lg font-medium text-[var(--muted)]">= {results.reduce((a, b) => a + b, 0)}</span>
                <CopyButton text={results.join(", ") + " (сумма: " + results.reduce((a, b) => a + b, 0) + ")"} />
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
