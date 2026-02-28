"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

interface CaseConverterToolProps {
  t: (key: string) => string;
}

export function CaseConverterTool({ t }: CaseConverterToolProps) {
  const [text, setText] = useState("");

  const toUpper = () => setText((prev) => prev.toUpperCase());
  const toLower = () => setText((prev) => prev.toLowerCase());
  const toTitle = () =>
    setText((prev) => prev.replace(/\b\w/g, (c) => c.toUpperCase()));
  const toSentence = () =>
    setText((prev) => prev.replace(/(^\w|\.\s+\w)/g, (c) => c.toUpperCase()));
  const invertCase = () =>
    setText((prev) =>
      prev.replace(/[a-zA-ZА-Яа-яЁё]/g, (c) =>
        c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
      )
    );

  const actions = [
    { fn: toUpper, key: "upper" },
    { fn: toLower, key: "lower" },
    { fn: toTitle, key: "titleCase" },
    { fn: toSentence, key: "sentence" },
    { fn: invertCase, key: "invert" },
  ];

  return (
    <div className="space-y-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[150px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        rows={6}
      />
      <p className="text-sm text-[var(--muted)]">
        Нажмите нужный вариант — текст в поле изменится. Поддерживаются латиница и кириллица.
      </p>
      <div className="flex flex-wrap gap-2">
        {actions.map(({ fn, key }) => (
          <motion.button
            key={key}
            onClick={fn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
          >
            {t(key)}
          </motion.button>
        ))}
      </div>
      {text.length > 0 && (
        <div className="flex items-center justify-end">
          <CopyButton text={text} label="Скопировать текст" />
        </div>
      )}
      {!text && (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите текст выше и выберите регистр — результат можно скопировать одним нажатием.
        </p>
      )}
    </div>
  );
}
