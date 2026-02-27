"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface WheelFortuneToolProps {
  t: (key: string) => string;
}

export function WheelFortuneTool({ t }: WheelFortuneToolProps) {
  const [items, setItems] = useState("Вариант 1\nВариант 2\nВариант 3");
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    const list = items.split("\n").filter(Boolean);
    if (list.length === 0) return;
    setSpinning(true);
    setResult(null);
    const duration = 2000 + Math.random() * 1000;
    const endTime = Date.now() + duration;
    const interval = setInterval(() => {
      setResult(list[Math.floor(Math.random() * list.length)] ?? null);
      if (Date.now() >= endTime) {
        clearInterval(interval);
        setSpinning(false);
        setResult(list[Math.floor(Math.random() * list.length)] ?? null);
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      <textarea
        value={items}
        onChange={(e) => setItems(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={5}
      />
      <motion.button
        onClick={spin}
        disabled={spinning}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white disabled:opacity-70"
      >
        {spinning ? t("spinning") : t("spin")}
      </motion.button>
      {result && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-xl border-2 border-[var(--accent)] bg-[var(--accent)]/10 p-6 text-center text-xl font-bold"
        >
          {result}
        </motion.div>
      )}
    </div>
  );
}
