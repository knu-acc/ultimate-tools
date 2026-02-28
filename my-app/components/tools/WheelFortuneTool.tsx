"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

interface WheelFortuneToolProps {
  t: (key: string) => string;
}

export function WheelFortuneTool({ t }: WheelFortuneToolProps) {
  const [items, setItems] = useState("Вариант 1\nВариант 2\nВариант 3");
  const [result, setResult] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const list = useMemo(
    () => items.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
    [items]
  );
  const n = list.length;
  const [lastResult, setLastResult] = useState<string | null>(null);
  const segmentAngle = n > 0 ? 360 / n : 0;

  const spin = () => {
    if (list.length === 0) return;
    setSpinning(true);
    setResult(null);
    const winnerIndex = Math.floor(Math.random() * list.length);
    const fullSpins = 4 + Math.random() * 2;
    const finalAngle = 360 * fullSpins + (360 - winnerIndex * segmentAngle - segmentAngle / 2);
    setRotation((r) => r + finalAngle);
    setTimeout(() => {
      const winner = list[winnerIndex] ?? null;
      setResult(winner);
      if (winner) setLastResult(winner);
      setSpinning(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <label className="field-label">Варианты на колесе</label>
        <textarea
          value={items}
          onChange={(e) => setItems(e.target.value)}
          placeholder={t("placeholder")}
          className="input-base min-h-[120px] resize-y"
          rows={5}
        />
        {n > 0 && n < 2 && (
          <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">Добавьте минимум 2 варианта для вращения.</p>
        )}
        {n >= 2 && <p className="mt-2 text-xs text-[var(--muted)]">Вариантов: {n}</p>}
      </div>
      <div className="flex flex-col items-center gap-6">
        {n > 0 && (
          <div className="relative">
            <motion.div
              className="relative w-64 h-64 rounded-full border-4 border-[var(--accent)] shadow-xl overflow-hidden mx-auto"
              style={{ transformOrigin: "center center" }}
              animate={{ rotate: rotation }}
              transition={{ duration: 4, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {list.map((_, i) => {
                  const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
                  const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
                  const r = 50;
                  const x1 = 50 + r * Math.cos(startAngle);
                  const y1 = 50 + r * Math.sin(startAngle);
                  const x2 = 50 + r * Math.cos(endAngle);
                  const y2 = 50 + r * Math.sin(endAngle);
                  const large = segmentAngle > 180 ? 1 : 0;
                  const d = `M 50 50 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
                  const hue = (i * 360) / Math.max(n, 1) % 360;
                  return (
                    <path key={i} d={d} fill={`hsl(${hue}, 60%, 50%)`} stroke="var(--background)" strokeWidth="1" />
                  );
                })}
              </svg>
            </motion.div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-[var(--accent)] z-10 pointer-events-none" aria-hidden />
          </div>
        )}
        <div className="tool-action-bar"><motion.button
          onClick={spin}
          disabled={spinning || list.length < 2}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full sm:w-auto mt-2"
        >
          {spinning ? t("spinning") : t("spin")}
        </motion.button></div>
      </div>
      {result && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-xl border-2 border-[var(--accent)] bg-[var(--accent-muted)]/30 p-6 text-center"
        >
          <p className="mb-1 text-sm font-medium text-[var(--muted)]">{t("result")}</p>
          <p className="text-xl font-bold mb-3">{result}</p>
          <CopyButton text={result} />
        </motion.div>
      )}
      {lastResult && !result && !spinning && (
        <div className="tool-output-zone">
          <p className="text-sm font-medium text-[var(--foreground)]/70">{t("lastResult") || "Предыдущий результат"}: {lastResult}</p>
        </div>
      )}
    </div>
  );
}
