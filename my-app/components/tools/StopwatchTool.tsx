"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

interface StopwatchToolProps {
  t: (key: string) => string;
}

export function StopwatchTool({ t }: StopwatchToolProps) {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const ref = useRef<number | null>(null);
  const startRef = useRef(0);
  const accRef = useRef(0);
  const lastMsRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    const tick = () => {
      ref.current = requestAnimationFrame(tick);
      lastMsRef.current = accRef.current + (performance.now() - startRef.current);
      setMs(lastMsRef.current);
    };
    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
      accRef.current = lastMsRef.current;
    };
  }, [running]);

  const reset = () => {
    setRunning(false);
    setMs(0);
    accRef.current = 0;
    setLaps([]);
  };

  const addLap = () => {
    setLaps((prev) => [...prev, ms]);
  };

  const formatLap = (lapMs: number) => {
    const m = Math.floor(lapMs / 60000);
    const s = Math.floor((lapMs % 60000) / 1000);
    const mil = Math.floor((lapMs % 1000) / 10);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(mil).padStart(2, "0")}`;
  };

  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const mil = Math.floor((ms % 1000) / 10);

  const timeStr = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(mil).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
<div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-6 text-center">
        <div className="text-5xl font-mono font-bold text-[var(--accent)]">
          {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}.{String(mil).padStart(2, "0")}
        </div>
      </div>
      <div className="tool-input-zone">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <CopyButton text={timeStr} label="Копировать время" />
        <button
          onClick={() => setRunning(!running)}
          className="btn-primary w-full sm:w-auto mt-2"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? t("pause") : t("start")}
        </button>
        <button
          onClick={reset}
          className="btn-secondary"
        >
          <RotateCcw className="h-4 w-4" />
          {t("reset")}
        </button>
        <button
          onClick={addLap}
          disabled={!running}
          className="btn-secondary"
        >
          {t("lap") || "Круг"}
        </button>
        </div>
      </div>
      {laps.length > 0 && (
        <div className="tool-output-zone">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--foreground)]/70">{t("laps") || "Круги"}</span>
            <CopyButton text={laps.map((lap, i) => `${i + 1}. ${formatLap(lap)}`).join("\n")} label="Копировать круги" />
          </div>
          <ul className="space-y-1 font-mono text-sm">
            {laps.map((lap, i) => (
              <li key={i}>{i + 1}. {formatLap(lap)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
