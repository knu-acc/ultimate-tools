"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

interface LoremIpsumToolProps {
  t: (key: string) => string;
}

export function LoremIpsumTool({ t }: LoremIpsumToolProps) {
  const [count, setCount] = useState(3);
  const [mode, setMode] = useState<"paragraphs" | "sentences" | "words">("paragraphs");

  const generate = () => {
    const words = LOREM.split(" ");
    const sentences = LOREM.split(". ");
    if (mode === "words") return words.slice(0, count).join(" ");
    if (mode === "sentences") return sentences.slice(0, count).join(". ") + ".";
    return Array(count)
      .fill(null)
      .map(() => LOREM)
      .join("\n\n");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-sm">{t("count")}</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
            className="w-24 rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">{t("mode")}</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
            className="rounded-xl border border-[var(--border)] bg-transparent px-3 py-2"
          >
            <option value="paragraphs">{t("paragraphs")}</option>
            <option value="sentences">{t("sentences")}</option>
            <option value="words">{t("words")}</option>
          </select>
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm text-[var(--muted)]">{t("result")}</div>
        <div
          className="min-h-[120px] cursor-pointer select-all rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
          onClick={() => navigator.clipboard.writeText(generate())}
        >
          {generate()}
        </div>
      </div>
    </div>
  );
}
