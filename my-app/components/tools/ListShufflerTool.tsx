"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ListShufflerToolProps {
  t: (key: string) => string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ListShufflerTool({ t }: ListShufflerToolProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string[]>([]);

  const doShuffle = () => {
    const list = text.split("\n").filter(Boolean);
    setResult(shuffle(list));
  };

  return (
    <div className="space-y-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[150px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={6}
      />
      <motion.button
        onClick={doShuffle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {t("shuffle")}
      </motion.button>
      {result.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-[var(--muted)]">{t("result")}</div>
          <div className="cursor-pointer select-all rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm">
            {result.join("\n")}
          </div>
        </div>
      )}
    </div>
  );
}
