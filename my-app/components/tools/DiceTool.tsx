"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface DiceToolProps {
  t: (key: string) => string;
}

const DICE_FACES: Record<number, string> = {
  1: "⚀",
  2: "⚁",
  3: "⚂",
  4: "⚃",
  5: "⚄",
  6: "⚅",
};

export function DiceTool({ t }: DiceToolProps) {
  const [count, setCount] = useState(2);
  const [sides, setSides] = useState(6);
  const [results, setResults] = useState<number[]>([]);

  const roll = () => {
    setResults(
      Array.from({ length: count }, () =>
        Math.floor(Math.random() * sides) + 1
      )
    );
  };

  return (
    <div className="space-y-6">
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
              <option key={n} value={n}>
                D{n}
              </option>
            ))}
          </select>
        </div>
      </div>
      <motion.button
        onClick={roll}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {t("roll")}
      </motion.button>
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4"
        >
          {results.map((r, i) => (
            <div
              key={i}
              className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-[var(--accent)] bg-[var(--accent)]/10 text-3xl"
            >
              {sides === 6 ? DICE_FACES[r] ?? r : r}
            </div>
          ))}
          <div className="flex items-center text-lg font-medium">
            = {results.reduce((a, b) => a + b, 0)}
          </div>
        </motion.div>
      )}
    </div>
  );
}
