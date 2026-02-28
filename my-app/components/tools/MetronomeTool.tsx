"use client";

import { useState, useRef, useEffect } from "react";

interface MetronomeToolProps {
  t: (key: string) => string;
}

export function MetronomeTool({ t }: MetronomeToolProps) {
  const [bpm, setBpm] = useState(60);
  const [running, setRunning] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    const ms = 60000 / bpm;
    intervalRef.current = setInterval(() => {
      const ctx = audioRef.current ?? new AudioContext();
      audioRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1000;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    }, ms);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, bpm]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Метроном с настраиваемым темпом (BPM). Задайте удары в минуту и нажмите «Старт» — звуковой щелчок будет повторяться с заданным интервалом.
      </p>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{t("bpm")}</label>
        <input
          type="range"
          min={40}
          max={240}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-2xl font-bold">{bpm}</span>
      </div>
      <button
        onClick={() => setRunning(!running)}
        className={`rounded-xl px-6 py-3 font-medium ${running ? "bg-red-500 text-white" : "bg-[var(--accent)] text-white"}`}
      >
        {running ? t("stop") : t("start")}
      </button>
    </div>
  );
}
