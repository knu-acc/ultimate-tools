"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CaseConverterToolProps {
  t: (key: string) => string;
}

export function CaseConverterTool({ t }: CaseConverterToolProps) {
  const [text, setText] = useState("");

  const toUpper = () => setText((t) => t.toUpperCase());
  const toLower = () => setText((t) => t.toLowerCase());
  const toTitle = () =>
    setText((t) =>
      t.replace(/\b\w/g, (c) => c.toUpperCase())
    );
  const toSentence = () =>
    setText((t) =>
      t.replace(/(^\w|\.\s+\w)/g, (c) => c.toUpperCase())
    );
  const invertCase = () =>
    setText((t) =>
      t.replace(/[a-zA-Z]/g, (c) =>
        c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
      )
    );

  return (
    <div className="space-y-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[150px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={6}
      />
      <div className="flex flex-wrap gap-2">
        {[
          { fn: toUpper, key: "upper" },
          { fn: toLower, key: "lower" },
          { fn: toTitle, key: "titleCase" },
          { fn: toSentence, key: "sentence" },
          { fn: invertCase, key: "invert" },
        ].map(({ fn, key }) => (
          <motion.button
            key={key}
            onClick={fn}
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
