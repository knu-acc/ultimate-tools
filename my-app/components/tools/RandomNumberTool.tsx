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
  const [allowDecimal, setAllowDecimal] = useState(false);
  const [decimalPlaces, setDecimalPlaces] = useState(2);
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
    if (allowDecimal) return [];
    
    const range = rangeMax - rangeMin;
    if (range > 100000) return []; 

    const p: number[] = [];
    for (let i = rangeMin; i <= rangeMax; i++) if (!excludeSet.has(i)) p.push(i);
    return p;
  }, [rangeMin, rangeMax, excludeSet, allowDecimal]);

  const generateSingleDecimal = () => {
    let num = 0;
    let attempts = 0;
    do {
      num = rangeMin + Math.random() * (rangeMax - rangeMin);
      num = Number(num.toFixed(decimalPlaces));
      attempts++;
    } while (excludeSet.has(num) && attempts < 100);
    return num;
  };

  const handleGenerate = () => {
    if (!allowDecimal && pool.length === 0 && (rangeMax - rangeMin) <= 100000) return;
    
    const nums: number[] = [];
    
    if (allowDecimal) {
      if (uniqueOnly) {
        const used = new Set<number>();
        let attempts = 0;
        while (nums.length < qty && attempts < qty * 100) {
          const n = generateSingleDecimal();
          if (!used.has(n)) {
            used.add(n);
            nums.push(n);
          }
          attempts++;
        }
      } else {
        for (let i = 0; i < qty; i++) {
          nums.push(generateSingleDecimal());
        }
      }
    } else {
      const isLargeRange = (rangeMax - rangeMin) > 100000;
      
      if (isLargeRange) {
         const used = new Set<number>();
         let attempts = 0;
         while (nums.length < qty && attempts < qty * 100) {
            const n = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
            if (!excludeSet.has(n)) {
               if (!uniqueOnly || !used.has(n)) {
                   used.add(n);
                   nums.push(n);
               }
            }
            attempts++;
         }
      } else {
        if (uniqueOnly && qty <= pool.length) {
          const shuffled = [...pool].sort(() => Math.random() - 0.5);
          for (let i = 0; i < qty; i++) nums.push(shuffled[i]!);
        } else {
          for (let i = 0; i < qty; i++) nums.push(pool[Math.floor(Math.random() * pool.length)] ?? rangeMin);
        }
      }
    }

    if (nums.length === 0) return;

    setScrolling(true);
    setResult(null);
    setDisplayNums(nums.map(() => allowDecimal ? generateSingleDecimal() : (pool[0] ?? rangeMin)));
    
    let step = 0;
    const steps = 8;
    const iv = setInterval(() => {
      step++;
      setDisplayNums(nums.map(() => {
        if (allowDecimal) return generateSingleDecimal();
        return pool.length > 0 ? (pool[Math.floor(Math.random() * pool.length)]) : (Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin);
      }));
      if (step >= steps) {
        clearInterval(iv);
        setDisplayNums(nums);
        setResult(nums);
        setScrolling(false);
      }
    }, 60);
  };

  const display = (scrolling ? displayNums : result) ?? [];
  const isExcludedAll = !allowDecimal && pool.length === 0 && (rangeMax - rangeMin) <= 100000;

  return (
    <div className="space-y-6">
      <div className="tool-input-zone">
        <div className="tool-zone-header">
          <span className="tool-zone-icon">✏️</span>
          <span>Ввод</span>
        </div>

        <div className="mb-4">
          <label className="field-label mb-2 block">Диапазон (пресеты)</label>
          <div className="flex flex-wrap items-center gap-2">
            {RANGE_PRESETS.map(({ label, min: pMin, max: pMax }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setMin(pMin);
                  setMax(pMax);
                  setAllowDecimal(false);
                }}
                className={`chip ${
                  min === pMin && max === pMax && !allowDecimal ? "chip-active" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid gap-4 sm:grid-cols-2 ${allowDecimal ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} mb-4`}>
          <div>
            <label className="field-label">{t("min") || "Минимум"}</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value) ?? 0)}
              min={MIN_SAFE}
              max={MAX_SAFE}
              className="input-base"
            />
          </div>
          <div>
            <label className="field-label">{t("max") || "Максимум"}</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value) ?? 0)}
              min={MIN_SAFE}
              max={MAX_SAFE}
              className="input-base"
            />
          </div>
          <div>
            <label className="field-label">
              {t("quantity") || "Количество"} (макс {MAX_QUANTITY})
            </label>
            <input
              type="number"
              min={1}
              max={MAX_QUANTITY}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(
                    MAX_QUANTITY,
                    Math.max(1, Number(e.target.value) || 1)
                  )
                )
              }
              className="input-base"
            />
          </div>
          {allowDecimal && (
             <div>
               <label className="field-label">Знаков после запятой</label>
               <input
                 type="number"
                 min={1}
                 max={10}
                 value={decimalPlaces}
                 onChange={(e) => setDecimalPlaces(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
                 className="input-base"
               />
             </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3 items-end">
          <div className="sm:col-span-2">
            <label className="field-label">{t("exclude") || "Исключить (через запятую)"}</label>
            <input
              type="text"
              value={exclude}
              onChange={(e) => setExclude(e.target.value)}
              placeholder="5, 10, 15"
              className="input-base"
            />
          </div>
          <div className="flex flex-col gap-3 p-3 rounded-lg bg-[var(--background)]/40 border border-[var(--border)]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={uniqueOnly}
                onChange={(e) => setUniqueOnly(e.target.checked)}
                className="rounded accent-[var(--accent)] h-4 w-4"
              />
              <span className="text-sm font-medium text-[var(--foreground)]">
                Уникальные
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowDecimal}
                onChange={(e) => setAllowDecimal(e.target.checked)}
                className="rounded accent-[var(--accent)] h-4 w-4"
              />
              <span className="text-sm font-medium text-[var(--foreground)]">
                Дробные числа
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="tool-action-bar">
        <motion.button
          onClick={handleGenerate}
          disabled={scrolling || isExcludedAll}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full sm:w-auto mt-2"
        >
          <Shuffle className="h-5 w-5" />
          {scrolling ? "..." : t("generate")}
        </motion.button>
      </div>

      {isExcludedAll && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-700 dark:text-amber-400">
          Нет доступных чисел: весь диапазон исключён. Уберите значения из поля «Исключить» или измените минимум/максимум.
        </p>
      )}

      {display.length > 0 && (
        <motion.div
           initial={{ opacity: 0, y: 8 }}
           animate={{ opacity: 1, y: 0 }}
           className="tool-output-zone"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="tool-zone-header mb-0">
               <span className="tool-zone-icon">📋</span>
               <span>{t("result")}</span>
            </div>
            <CopyButton text={display.join(", ")} />
          </div>
          <div className="flex flex-wrap gap-3 font-mono text-3xl">
            {display.map((n, i) => (
              <motion.span
                key={`${scrolling}-${i}-${n}`}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-[var(--accent)]/10 bg-[var(--accent)]/10 px-5 py-3 font-bold text-[var(--accent)] shadow-sm"
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

