"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

interface RandomNumberToolProps {
  t: (key: string) => string;
}

const MIN_SAFE = -1e6;
const MAX_SAFE = 1e6;
const MAX_QUANTITY = 100;

function getRandomInt(min: number, max: number): number {
  const mn = Math.ceil(min);
  const mx = Math.floor(max);
  return Math.floor(Math.random() * (mx - mn + 1)) + mn;
}

const RANGE_PRESETS = [
  { label: "1–100", min: 1, max: 100 },
  { label: "1–6 (кубик)", min: 1, max: 6 },
  { label: "1–10", min: 1, max: 10 },
  { label: "0–9", min: 0, max: 9 },
  { label: "1–1000", min: 1, max: 1000 },
];

export function RandomNumberTool({ t }: RandomNumberToolProps) {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [exclude, setExclude] = useState("");
  const [uniqueOnly, setUniqueOnly] = useState(true);
  const [result, setResult] = useState<number[] | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const [displayNums, setDisplayNums] = useState<number[]>([]);

  const mn = Math.min(Math.max(MIN_SAFE, min), MAX_SAFE);
  const mx = Math.min(Math.max(MIN_SAFE, max), MAX_SAFE);
  const rangeMin = Math.min(mn, mx);
  const rangeMax = Math.max(mn, mx);
  const qty = Math.min(Math.max(1, quantity), MAX_QUANTITY);

  const excludeSet = useMemo(() => {
    const s = new Set<number>();
    exclude.split(/[\s,;]+/).forEach((part) => {
      const n = Number(part.trim());
      if (!Number.isNaN(n)) s.add(n);
    });
    return s;
  }, [exclude]);

  const pool = useMemo(() => {
    const p: number[] = [];
    for (let i = rangeMin; i <= rangeMax; i++) if (!excludeSet.has(i)) p.push(i);
    return p;
  }, [rangeMin, rangeMax, excludeSet]);

  const handleGenerate = () => {
    if (pool.length === 0) return;
    const nums: number[] = [];
    if (uniqueOnly && qty <= pool.length) {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      for (let i = 0; i < qty; i++) nums.push(shuffled[i]!);
    } else {
      for (let i = 0; i < qty; i++) nums.push(pool[Math.floor(Math.random() * pool.length)] ?? rangeMin);
    }
    setScrolling(true);
    setResult(null);
    setDisplayNums(nums.map(() => pool[0] ?? rangeMin));
    let step = 0;
    const steps = 8;
    const iv = setInterval(() => {
      step++;
      setDisplayNums(nums.map(() => pool[Math.floor(Math.random() * pool.length)] ?? rangeMin));
      if (step >= steps) {
        clearInterval(iv);
        setDisplayNums(nums);
        setResult(nums);
        setScrolling(false);
      }
    }, 60);
  };

  const display = (scrolling ? displayNums : result) ?? [];

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Случайные числа в заданном диапазоне. Генерация выполняется в браузере, данные никуда не отправляются. Можно исключить часть чисел и выбрать «только уникальные».
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <span className="mb-3 block text-sm font-medium text-[var(--muted)]">Диапазон</span>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {RANGE_PRESETS.map(({ label, min: pMin, max: pMax }) => (
            <button
              key={label}
              type="button"
              onClick={() => { setMin(pMin); setMax(pMax); }}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${min === pMin && max === pMax ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)]" : "border-[var(--border)] hover:bg-[var(--border)]/20"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("min")}</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value) ?? 0)}
              min={MIN_SAFE}
              max={MAX_SAFE}
              className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("max")}</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value) ?? 0)}
              min={MIN_SAFE}
              max={MAX_SAFE}
              className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("quantity")} (макс. {MAX_QUANTITY})</label>
            <input
              type="number"
              min={1}
              max={MAX_QUANTITY}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(MAX_QUANTITY, Math.max(1, Number(e.target.value) || 1)))}
              className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
        </div>
        <label className="mt-3 flex items-center gap-2">
          <input type="checkbox" checked={uniqueOnly} onChange={(e) => setUniqueOnly(e.target.checked)} className="rounded" />
          <span className="text-sm text-[var(--muted)]">Только уникальные числа (без повторов)</span>
        </label>
        <div className="mt-3">
          <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("exclude") || "Исключить (через запятую)"}</label>
          <input
            type="text"
            value={exclude}
            onChange={(e) => setExclude(e.target.value)}
            placeholder="5, 10, 15"
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2 focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
      </div>

      <motion.button
        onClick={handleGenerate}
        disabled={scrolling || pool.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-70 disabled:pointer-events-none"
      >
        <Shuffle className="h-5 w-5" />
        {scrolling ? "..." : t("generate")}
      </motion.button>

      {pool.length === 0 && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          Нет доступных чисел: весь диапазон исключён. Уберите значения из поля «Исключить» или измените минимум/максимум.
        </p>
      )}

      {display.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--muted)]">{t("result")}</span>
            <CopyButton text={display.join(", ")} />
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-lg">
            {display.map((n, i) => (
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
