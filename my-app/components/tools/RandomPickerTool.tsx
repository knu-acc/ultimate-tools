"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

interface RandomPickerToolProps {
  t: (key: string) => string;
}

export function RandomPickerTool({ t }: RandomPickerToolProps) {
  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [pickedMultiple, setPickedMultiple] = useState<string[]>([]);
  const [pickCount, setPickCount] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [displayValue, setDisplayValue] = useState<string | null>(null);

  const items = input
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const pick = () => {
    if (items.length === 0) return;
    const n = Math.min(Math.max(1, pickCount), items.length);
    setSpinning(true);
    setPicked(null);
    setPickedMultiple([]);
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const targetList = shuffled.slice(0, n);
    const target = n === 1 ? targetList[0] ?? null : null;
    setDisplayValue(n === 1 ? (items[Math.floor(Math.random() * items.length)] ?? null) : null);
    let step = 0;
    const maxSteps = 12;
    const interval = setInterval(() => {
      if (n === 1) setDisplayValue(items[Math.floor(Math.random() * items.length)] ?? null);
      step++;
      if (step >= maxSteps) {
        clearInterval(interval);
        if (n === 1) {
          setDisplayValue(target);
          setPicked(target);
        } else {
          setPickedMultiple(targetList);
        }
        setSpinning(false);
      }
    }, 80);
  };

  const clearResult = () => {
    setPicked(null);
    setPickedMultiple([]);
    setDisplayValue(null);
  };
  const hasResult = (picked !== null || pickedMultiple.length > 0) && !spinning;
  const showSingle = spinning ? displayValue : picked;

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <label className="field-label">Варианты для выбора</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          className="input-base min-h-[140px] resize-y"
          rows={5}
        />
        {items.length > 0 && <p className="mt-2 text-xs text-[var(--muted)]">Элементов: {items.length}</p>}
      </div>
      {items.length > 0 && (
        <div className="result-card">
          <span className="field-label">{t("pickCount") || "Сколько выбрать"}</span>
          <div className="flex flex-wrap items-center gap-2">
            {[1, 2, 3, 5].filter((n) => n <= items.length).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPickCount(n)}
                className={`chip ${pickCount === n ? "chip-active" : ""}`}
              >
                {n}
              </button>
            ))}
            <input
              type="number"
              min={1}
              max={Math.max(1, items.length)}
              value={pickCount}
              onChange={(e) => setPickCount(Math.min(items.length, Math.max(1, Number(e.target.value) || 1)))}
              className="w-16 rounded-lg border border-[var(--border)] bg-transparent px-2 py-2 text-center text-sm"
            />
            <span className="text-sm text-[var(--muted)]">из {items.length}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="tool-action-bar"><button
              type="button"
              onClick={pick}
              disabled={spinning}
              className="btn-primary w-full sm:w-auto mt-2"
            >
              {spinning ? "..." : t("pick")}
            </button></div>
            {hasResult && (
              <button type="button" onClick={clearResult} className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--border)]/20">
                Очистить результат
              </button>
            )}
          </div>
        </div>
      )}
      {items.length === 0 && (
        <p className="empty-state">
          Введите варианты выше, затем нажмите «Выбрать».
        </p>
      )}
      <AnimatePresence mode="wait">
        {showSingle !== null && (
          <motion.div
            key={spinning ? "spin" : "result"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border-2 border-[var(--accent)] bg-[var(--accent-muted)]/30 p-6 text-center"
          >
            <span className="field-label">{t("result")}</span>
            <motion.span
              key={displayValue ?? ""}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-[var(--foreground)]"
            >
              {showSingle}
            </motion.span>
            {!spinning && showSingle && (
              <div className="mt-3 flex justify-center">
                <CopyButton text={showSingle} />
              </div>
            )}
          </motion.div>
        )}
        {!spinning && pickedMultiple.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="tool-output-zone"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-[var(--muted)]">{t("result")} ({pickedMultiple.length})</span>
              <CopyButton text={pickedMultiple.join("\n")} label="Копировать" />
            </div>
            <ul className="list-decimal list-inside space-y-1">
              {pickedMultiple.map((item, i) => (
                <li key={i} className="font-medium">{item}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
