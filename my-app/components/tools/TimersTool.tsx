"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimersToolProps {
  t: (key: string) => string;
}

export function TimersTool({ t }: TimersToolProps) {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [totalSec, setTotalSec] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setTotalSec((s) => {
        if (s <= 0) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  const start = () => {
    setTotalSec(minutes * 60 + seconds);
    setRunning(true);
  };

  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;

  const presetMins = [1, 5, 10, 15, 30];

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <div className="tool-zone-header"><span className="tool-zone-icon">✏️</span><span>Ввод</span></div>
        <span className="section-label">Пресеты и ввод</span>
        <div className="flex flex-wrap gap-2 mb-4">
          {presetMins.map((mm) => (
            <button
              key={mm}
              type="button"
              disabled={running}
              onClick={() => { setMinutes(mm); setSeconds(0); setTotalSec(mm * 60); }}
              className={`rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50 ${minutes === mm && seconds === 0 ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)]" : "border-[var(--border)] hover:bg-[var(--border)]/20"}`}
            >
              {mm} мин
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="field-label">{t("minutes")}</label>
            <input
              type="number"
              min={0}
              max={99}
              value={minutes}
              onChange={(e) => !running && setMinutes(Number(e.target.value) || 0)}
              disabled={running}
              className="input-base w-20"
            />
          </div>
          <div>
            <label className="field-label">{t("seconds")}</label>
            <input
              type="number"
              min={0}
              max={59}
              value={seconds}
              onChange={(e) => !running && setSeconds(Number(e.target.value) || 0)}
              disabled={running}
              className="input-base w-20"
            />
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 text-center">
        <div className="text-5xl font-mono font-bold text-[var(--accent)]">
          {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => (running ? setRunning(false) : start())}
          className="btn-primary w-full sm:w-auto mt-2"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? t("pause") : t("start")}
        </button>
        <button
          onClick={() => { setRunning(false); setTotalSec(minutes * 60 + seconds); }}
          className="btn-secondary"
        >
          <RotateCcw className="h-4 w-4" />
          {t("reset")}
        </button>
      </div>
      {totalSec === 0 && running === false && (
        <p className="rounded-xl border border-[var(--accent)] bg-[var(--accent-muted)]/30 px-5 py-4 text-base text-center text-sm font-medium text-[var(--accent)]">
          Готово
        </p>
      )}
    </div>
  );
}
