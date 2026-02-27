"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Plus } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div>
          <label className="mb-1 block text-sm">{t("minutes")}</label>
          <input
            type="number"
            min={0}
            max={99}
            value={minutes}
            onChange={(e) => !running && setMinutes(Number(e.target.value) || 0)}
            disabled={running}
            className="w-20 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">{t("seconds")}</label>
          <input
            type="number"
            min={0}
            max={59}
            value={seconds}
            onChange={(e) => !running && setSeconds(Number(e.target.value) || 0)}
            disabled={running}
            className="w-20 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"
          />
        </div>
      </div>
      <div className="text-center">
        <div className="text-5xl font-mono font-bold text-[var(--accent)]">
          {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => (running ? setRunning(false) : start())}
          className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-white"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? t("pause") : t("start")}
        </button>
      </div>
    </div>
  );
}
