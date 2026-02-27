"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface SpaceCleanupToolProps {
  t: (key: string) => string;
}

export function SpaceCleanupTool({ t }: SpaceCleanupToolProps) {
  const [text, setText] = useState("");

  const cleanup = (mode: string) => {
    let result = text;
    if (mode === "all") result = text.replace(/\s+/g, " ").trim();
    else if (mode === "lines") result = text.replace(/[ \t]+/g, " ").replace(/\n\s*\n/g, "\n\n").trim();
    else if (mode === "trim") result = text.split("\n").map((l) => l.trim()).join("\n");
    setText(result);
  };

  return (
    <div className="space-y-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[200px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={8}
      />
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", desc: "Убрать лишние пробелы" },
          { key: "lines", desc: "Очистить строки" },
          { key: "trim", desc: "Trim каждой строки" },
        ].map(({ key, desc }) => (
          <motion.button
            key={key}
            onClick={() => cleanup(key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
          >
            {t(key)}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
