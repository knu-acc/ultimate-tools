"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

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
      <p className="text-sm text-[var(--muted)]">
        Удаление лишних пробелов, пустых строк и пробелов в начале/конце строк. Результат подставляется в поле — можно скопировать.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[200px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        rows={8}
      />
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: "all", desc: "Убрать лишние пробелы" },
          { key: "lines", desc: "Очистить строки" },
          { key: "trim", desc: "Trim каждой строки" },
        ].map(({ key }) => (
          <motion.button
            key={key}
            onClick={() => cleanup(key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
          >
            {t(key)}
          </motion.button>
        ))}
        {text.length > 0 && <CopyButton text={text} label="Скопировать текст" />}
      </div>
      {!text && (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Вставьте текст с лишними пробелами или переносами — нажмите нужный режим очистки, затем скопируйте результат.
        </p>
      )}
    </div>
  );
}
