"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

interface SpaceCleanupToolProps {
  t: (key: string) => string;
}

export function SpaceCleanupTool({ t }: SpaceCleanupToolProps) {
  const [text, setText] = useState("");

  const [beforeLen, setBeforeLen] = useState<number | null>(null);

  const cleanup = (mode: string) => {
    setBeforeLen(text.length);
    let result = text;
    if (mode === "all") result = text.replace(/\s+/g, " ").trim();
    else if (mode === "lines") result = text.replace(/[ \t]+/g, " ").replace(/\n\s*\n/g, "\n\n").trim();
    else if (mode === "trim") result = text.split("\n").map((l) => l.trim()).join("\n");
    else if (mode === "join") result = text.replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").trim();
    else if (mode === "singleBlank") result = text.replace(/(\n\s*){3,}/g, "\n\n").trim();
    else if (mode === "noBreaks") result = text.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
    else if (mode === "noSpaces") result = text.replace(/\s/g, "");
    setText(result);
  };

  const modes: { key: string; label: string; hint: string }[] = [
    { key: "all", label: t("all"), hint: "Все пробелы и переносы — в один пробел, trim по краям." },
    { key: "lines", label: t("lines"), hint: "Пробелы внутри строк — в один; лишние пустые строки — в одну." },
    { key: "trim", label: t("trim"), hint: "Убрать пробелы в начале и конце каждой строки." },
    { key: "join", label: t("join"), hint: "Весь текст в одну строку, лишние пробелы убрать." },
    { key: "singleBlank", label: t("singleBlank"), hint: "Три и более подряд пустых строк — заменить на одну." },
    { key: "noBreaks", label: "Без переносов", hint: "Удалить все переносы строк, оставить пробелы между словами." },
    { key: "noSpaces", label: "Без пробелов", hint: "Удалить все пробелы и переносы." },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Удаление лишних пробелов и переносов. Выберите режим — результат подставится в поле. Показано количество символов до и после.
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">Текст для очистки</label>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setBeforeLen(null);
          }}
          placeholder={t("placeholder")}
          className="min-h-[200px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          rows={8}
        />
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
          <span>Символов: {text.length}</span>
          {beforeLen !== null && (
            <span>
              Было: {beforeLen} → стало: {text.length}
            </span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <span className="text-sm font-medium text-[var(--muted)]">Режим очистки</span>
        <div className="flex flex-wrap gap-2">
          {modes.map(({ key, label, hint }) => (
            <motion.button
              key={key}
              onClick={() => cleanup(key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={hint}
              className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
            >
              {label}
            </motion.button>
          ))}
          {text.length > 0 && <CopyButton text={text} label="Скопировать текст" />}
        </div>
        <p className="text-xs text-[var(--muted)]">
          Наведите на кнопку — подсказка по режиму.
        </p>
      </div>
      {!text && (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Вставьте текст с лишними пробелами или переносами — нажмите нужный режим очистки, затем скопируйте результат.
        </p>
      )}
    </div>
  );
}
