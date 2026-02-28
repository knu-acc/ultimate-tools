"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

interface CpsTestToolProps {
  t: (key: string) => string;
}

export function CpsTestTool({ t }: CpsTestToolProps) {
  const [clicks, setClicks] = useState(0);
  const [cps, setCps] = useState(0);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [duration, setDuration] = useState(5);
  const [bestCps, setBestCps] = useState(0);
  const startTime = useRef(0);
  const clickTimes = useRef<number[]>([]);

  useEffect(() => {
    if (!running) setTimeLeft(duration);
  }, [duration, running]);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          const recent = clickTimes.current.filter((ts) => ts > Date.now() - 1000);
          const finalCps = recent.length;
          setCps(finalCps);
          setBestCps((b) => Math.max(b, finalCps));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, timeLeft]);

  const handleClick = () => {
    if (!running) {
      setRunning(true);
      setClicks(0);
      setTimeLeft(duration);
      clickTimes.current = [];
      startTime.current = Date.now();
    }
    setClicks((c) => c + 1);
    clickTimes.current.push(Date.now());
    clickTimes.current = clickTimes.current.filter((ts) => ts > Date.now() - 1000);
    setCps(clickTimes.current.length);
  };

  const reset = () => {
    setRunning(false);
    setClicks(0);
    setCps(0);
    setTimeLeft(duration);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        {[5, 10].map((d) => (
          <button key={d} type="button" disabled={running} onClick={() => setDuration(d)} className={`chip ${duration === d ? "chip-active" : ""} disabled:opacity-50`}>{d} сек</button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={reset} className="btn-secondary">{t("reset")}</button>
          {!running && timeLeft === 0 && clicks > 0 && (
            <CopyButton text={`CPS: ${cps}, ${t("clicks")}: ${clicks}`} label="Копировать" />
          )}
        </div>
      </div>

      {/* Timer display */}
      <div className="text-center">
        <div className="text-6xl font-black text-[var(--accent)] tabular-nums">{timeLeft > 0 ? timeLeft : "0"}</div>
        <div className="text-sm text-[var(--muted)] mt-1">{t("secondsLeft")}</div>
        {bestCps > 0 && !running && <p className="mt-1 text-sm font-medium text-[var(--accent)]">🏆 {t("bestCps") || "Лучший CPS"}: {bestCps}</p>}
      </div>

      {/* Dominant click area */}
      <motion.div
        onClick={handleClick}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        className="cursor-pointer select-none rounded-3xl border-3 border-[var(--accent)] bg-gradient-to-b from-[var(--accent)]/10 to-[var(--accent)]/5 min-h-[280px] flex flex-col items-center justify-center text-center transition-all active:bg-[var(--accent)]/20"
      >
        <div className="text-6xl font-black tabular-nums text-[var(--foreground)]">{clicks}</div>
        <div className="text-sm text-[var(--muted)] mt-2">{t("clicks")}</div>
        <div className="mt-4 text-2xl font-bold text-[var(--accent)]">{t("cps")}: {cps}</div>
        {!running && timeLeft === duration && <div className="mt-4 text-sm text-[var(--muted)] animate-pulse">Нажмите, чтобы начать!</div>}
      </motion.div>
    </div>
  );
}
