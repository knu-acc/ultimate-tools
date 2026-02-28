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
  const [completedSessions, setCompletedSessions] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setIsWork((w) => {
            if (w) setCompletedSessions((n) => n + 1);
            return !w;
          });
          return isWork ? breakMin * 60 : workMin * 60;
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

  const setPreset = (work: number, breakM: number) => {
    if (!running) {
      setWorkMin(work);
      setBreakMin(breakM);
      setSeconds(work * 60);
    }
  };

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const presets = [
    { work: 25, break: 5, label: "25 / 5" },
    { work: 50, break: 10, label: "50 / 10" },
    { work: 15, break: 3, label: "15 / 3" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Метод Помодоро: рабочий интервал и короткий перерыв. Задайте минуты (или выберите пресет), запустите таймер. Таймер работает только при открытой вкладке.
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <span className="mb-3 block text-sm font-medium text-[var(--muted)]">Интервалы (мин)</span>
        <div className="flex flex-wrap gap-2 mb-4">
          {presets.map(({ work, break: b, label }) => (
            <button
              key={label}
              type="button"
              disabled={running}
              onClick={() => setPreset(work, b)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50 ${workMin === work && breakMin === b ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)]" : "border-[var(--border)] hover:bg-[var(--border)]/20"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("work")}</label>
          <input
            type="number"
            min={1}
            max={60}
            value={workMin}
            onChange={(e) => !running && setWorkMin(Number(e.target.value) || 25)}
            disabled={running}
            className="w-20 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:border-[var(--accent)]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--muted)]">{t("break")}</label>
          <input
            type="number"
            min={1}
            max={30}
            value={breakMin}
            onChange={(e) => !running && setBreakMin(Number(e.target.value) || 5)}
            disabled={running}
            className="w-20 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 focus:border-[var(--accent)]"
          />
        </div>
        </div>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 text-center">
        <div className="text-5xl font-mono font-bold text-[var(--accent)]">
          {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </div>
        <div className="mt-2 text-sm text-[var(--muted)]">
          {isWork ? t("workPhase") : t("breakPhase")}
        </div>
        {completedSessions > 0 && (
          <p className="mt-1 text-xs text-[var(--muted)]">{t("completed") || "Завершено помодоро"}: {completedSessions}</p>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setRunning(!running)}
          className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-white hover:opacity-90"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? t("pause") : t("start")}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 hover:bg-[var(--border)]/20"
        >
          <RotateCcw className="h-4 w-4" />
          {t("reset")}
        </button>
      </div>
    </div>
  );
}
