"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";

interface RandomNumberToolProps {
  t: (key: string) => string;
}

function getRandomInt(min: number, max: number): number {
  const mn = Math.ceil(min);
  const mx = Math.floor(max);
  return Math.floor(Math.random() * (mx - mn + 1)) + mn;
}

export function RandomNumberTool({ t }: RandomNumberToolProps) {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [result, setResult] = useState<number[] | null>(null);

  const handleGenerate = () => {
    const mn = Math.min(min, max);
    const mx = Math.max(min, max);
    const qty = Math.min(Math.max(1, quantity), 100);
    const nums: number[] = [];
    const range = mx - mn + 1;
    if (qty > range) {
      for (let i = 0; i < qty; i++) {
        nums.push(getRandomInt(mn, mx));
      }
    } else {
      const used = new Set<number>();
      while (nums.length < qty) {
        const n = getRandomInt(mn, mx);
        if (!used.has(n)) {
          used.add(n);
          nums.push(n);
        }
      }
    }
    setResult(nums);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">{t("min")}</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value) || 0)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t("max")}</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value) || 0)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t("quantity")}</label>
          <input
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>
      </div>

      <motion.button
        onClick={handleGenerate}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
      >
        <Shuffle className="h-5 w-5" />
        {t("generate")}
      </motion.button>

      {result !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
        >
          <div className="mb-2 text-sm font-medium text-[var(--muted)]">{t("result")}</div>
          <div className="flex flex-wrap gap-2 font-mono text-lg">
            {result.map((n, i) => (
              <span
                key={i}
                className="rounded-lg bg-[var(--accent)]/20 px-3 py-1 text-[var(--accent)]"
              >
                {n}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
