"use client";

import { useState, useRef, useEffect } from "react";

interface MetronomeToolProps {
  t: (key: string) => string;
}

const BPM_PRESETS = [40, 52, 60, 72, 80, 96, 108, 120, 132, 144, 168, 184, 200];
const TIME_SIGS = [
  { label: "4/4", beats: 4, accent: [true, false, false, false] },
  { label: "3/4", beats: 3, accent: [true, false, false] },
  { label: "2/4", beats: 2, accent: [true, false] },
  { label: "6/8", beats: 6, accent: [true, false, false, true, false, false] },
];

export function MetronomeTool({ t }: MetronomeToolProps) {
  const [bpm, setBpm] = useState(120);
  const [running, setRunning] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);
  const [timeSig, setTimeSig] = useState(0);
  const audioRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sig = TIME_SIGS[timeSig];
  const ms = 60000 / bpm;
  const beatRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    beatRef.current = 0;
    setBeatIndex(0);
    intervalRef.current = setInterval(() => {
      const current = beatRef.current % sig.beats;
      setBeatIndex(current);
      const ctx = audioRef.current ?? new AudioContext();
      audioRef.current = ctx;
      const isAccent = sig.accent[current];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = isAccent ? 1200 : 800;
      gain.gain.setValueAtTime(isAccent ? 0.25 : 0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
      beatRef.current += 1;
    }, ms);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, bpm, sig.beats, ms]);

  useEffect(() => {
    if (!running) setBeatIndex(0);
  }, [running]);

  return (
    <div className="space-y-6">
<div className="tool-input-zone">
        <div className="mb-3 text-sm font-medium text-[var(--muted)]">{t("bpm")} — темп</div>
        <div className="flex flex-wrap gap-2">
          {BPM_PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setBpm(n)}
              className={`rounded-lg px-3 py-2 text-sm font-medium tabular-nums ${bpm === n ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] hover:bg-[var(--border)]/20"}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4">
          <input
            type="range"
            min={40}
            max={240}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="h-2 flex-1 accent-[var(--accent)]"
          />
          <span className="w-14 text-right text-4xl font-extrabold tracking-tight pt-2 pb-1 tabular-nums">{bpm}</span>
        </div>
      </div>

      <div className="tool-output-zone">
        <div className="mb-2 text-sm font-medium text-[var(--muted)]">Размер такта</div>
        <div className="flex flex-wrap gap-2">
          {TIME_SIGS.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setTimeSig(i)}
              className={`chip ${timeSig === i ? "chip-active" : ""}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {sig.accent.map((accent, i) => (
            <div
              key={i}
              className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold transition-all duration-75 ${running && beatIndex === i ? (accent ? "scale-110 bg-[var(--accent)] text-white shadow-lg" : "scale-105 bg-[var(--accent-muted)] text-[var(--foreground)]") : "bg-[var(--border)]/30 text-[var(--muted)]"}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <button
          onClick={() => setRunning(!running)}
          className={`rounded-xl px-8 py-4 text-lg font-semibold transition-colors ${running ? "bg-red-500 text-white hover:bg-red-600" : "bg-[var(--accent)] text-white hover:opacity-90"}`}
        >
          {running ? t("stop") : t("start")}
        </button>
      </div>
    </div>
  );
}
