"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

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
  const [exclude, setExclude] = useState("");
  const [result, setResult] = useState<number[] | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const [displayNums, setDisplayNums] = useState<number[]>([]);

  const excludeSet = useMemo(() => {
    const s = new Set<number>();
    exclude.split(/[\s,;]+/).forEach((part) => {
      const n = Number(part.trim());
      if (!Number.isNaN(n)) s.add(n);
    });
    return s;
  }, [exclude]);

  const handleGenerate = () => {
    const mn = Math.min(min, max);
    const mx = Math.max(min, max);
    const qty = Math.min(Math.max(1, quantity), 100);
    const nums: number[] = [];
    const pool: number[] = [];
    for (let i = mn; i <= mx; i++) if (!excludeSet.has(i)) pool.push(i);
    const range = pool.length;
    if (range === 0) return;
    if (qty > range) {
      for (let i = 0; i < qty; i++) nums.push(getRandomInt(mn, mx));
    } else {
      const used = new Set<number>();
      while (nums.length < qty) {
        const n = getRandomInt(mn, mx);
        if (!used.has(n)) { used.add(n); nums.push(n); }
      }
    }
    setScrolling(true);
    setResult(null);
    setDisplayNums(nums.map(() => pool[0] ?? mn));
    let step = 0;
    const steps = 8;
    const iv = setInterval(() => {
      step++;
      setDisplayNums(nums.map(() => pool[Math.floor(Math.random() * pool.length)] ?? mn));
      if (step >= steps) {
        clearInterval(iv);
        setDisplayNums(nums);
        setResult(nums);
        setScrolling(false);
      }
    }, 60);
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
      <div>
        <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("exclude") || "Исключить (через запятую)"}</label>
        <input
          type="text"
          value={exclude}
          onChange={(e) => setExclude(e.target.value)}
          placeholder="5, 10, 15"
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <motion.button
        onClick={handleGenerate}
        disabled={scrolling}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-70"
      >
        <Shuffle className="h-5 w-5" />
        {scrolling ? "..." : t("generate")}
      </motion.button>

      {((scrolling ? displayNums : result) ?? []).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--muted)]">{t("result")}</span>
            <CopyButton text={((scrolling ? displayNums : result) ?? []).join(", ")} />
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-lg">
            {((scrolling ? displayNums : result) ?? []).map((n, i) => (
              <motion.span
                key={`${scrolling}-${i}-${n}`}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="rounded-lg bg-[var(--accent)]/20 px-3 py-1 text-[var(--accent)]"
              >
                {n}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
