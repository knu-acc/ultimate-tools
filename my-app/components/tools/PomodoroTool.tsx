"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

interface PomodoroToolProps {
  t: (key: string) => string;
}

export function PomodoroTool({ t }: PomodoroToolProps) {
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isWork, setIsWork] = useState(true);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setIsWork((w) => !w);
          return !isWork ? breakMin * 60 : workMin * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running, isWork, workMin, breakMin]);

  const reset = () => {
    setRunning(false);
    setIsWork(true);
    setSeconds(workMin * 60);
  };

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div>
          <label className="mb-1 block text-sm">{t("work")}</label>
          <input
            type="number"
            min={1}
            max={60}
            value={workMin}
            onChange={(e) => !running && setWorkMin(Number(e.target.value) || 25)}
            disabled={running}
            className="w-20 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">{t("break")}</label>
          <input
            type="number"
            min={1}
            max={30}
            value={breakMin}
            onChange={(e) => !running && setBreakMin(Number(e.target.value) || 5)}
            disabled={running}
            className="w-20 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"
          />
        </div>
      </div>
      <div className="text-center">
        <div className="text-5xl font-mono font-bold text-[var(--accent)]">
          {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </div>
        <div className="mt-2 text-sm text-[var(--muted)]">
          {isWork ? t("workPhase") : t("breakPhase")}
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setRunning(!running)}
          className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-white"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? t("pause") : t("start")}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2"
        >
          <RotateCcw className="h-4 w-4" />
          {t("reset")}
        </button>
      </div>
    </div>
  );
}
