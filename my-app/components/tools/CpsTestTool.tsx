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
  const startTime = useRef(0);
  const clickTimes = useRef<number[]>([]);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          const elapsed = (Date.now() - startTime.current) / 1000;
          const recent = clickTimes.current.filter((ts) => ts > Date.now() - 1000);
          setCps(recent.length);
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
      setTimeLeft(5);
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
    setTimeLeft(5);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Тест кликов в секунду (CPS): нажмите «Старт» и кликайте по блоку 5 секунд. В конце показывается CPS за последнюю секунду.
      </p>
      <div className="text-center">
        <div className="text-4xl font-bold text-[var(--accent)]">{timeLeft > 0 ? timeLeft : "0"}</div>
        <div className="text-sm text-[var(--muted)]">{t("secondsLeft")}</div>
      </div>
      <motion.div
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer select-none rounded-2xl border-2 border-[var(--accent)] bg-[var(--accent)]/10 p-12 text-center"
      >
        <div className="text-3xl font-bold">{clicks}</div>
        <div className="text-sm text-[var(--muted)]">{t("clicks")}</div>
        <div className="mt-2 text-lg font-medium">{t("cps")}: {cps}</div>
      </motion.div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={reset}
          className="rounded-lg border border-[var(--border)] px-4 py-2"
        >
          {t("reset")}
        </button>
        {!running && timeLeft === 0 && clicks > 0 && (
          <CopyButton
            text={`CPS: ${cps}, ${t("clicks")}: ${clicks}`}
            label="Копировать результат"
          />
        )}
      </div>
    </div>
  );
}
