"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

interface CaseConverterToolProps {
  t: (key: string) => string;
}

export function CaseConverterTool({ t }: CaseConverterToolProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const toUpper = (s: string) => s.toUpperCase();
  const toLower = (s: string) => s.toLowerCase();
  const toTitle = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());
  const toSentence = (s: string) => s.replace(/(^\w|\.\s+\w)/g, (c) => c.toUpperCase());
  const invertCase = (s: string) =>
    s.replace(/[a-zA-ZА-Яа-яЁё]/g, (c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()));
  const toCamel = (s: string) =>
    s
      .trim()
      .split(/\s+/)
      .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
      .join("");
  const toKebab = (s: string) =>
    s
      .trim()
      .replace(/\s+/g, "-")
      .replace(/([A-ZА-Я])/g, (c) => c.toLowerCase())
      .replace(/[^a-zа-яё0-9-]/gi, "");
  const toSnake = (s: string) =>
    s
      .trim()
      .replace(/\s+/g, "_")
      .replace(/([A-ZА-Я])/g, (c) => c.toLowerCase())
      .replace(/[^a-zа-яё0-9_]/gi, "");

  const register = [
    { fn: toUpper, key: "upper", hint: "ВСЕ ЗАГЛАВНЫЕ" },
    { fn: toLower, key: "lower", hint: "все строчные" },
    { fn: toTitle, key: "titleCase", hint: "Заглавная В Каждом Слове" },
    { fn: toSentence, key: "sentence", hint: "Первая буква предложения" },
    { fn: invertCase, key: "invert", hint: "Инвертировать регистр" },
  ];
  const code = [
    { fn: toCamel, key: "camelCase", hint: "camelCase" },
    { fn: toKebab, key: "kebabCase", hint: "kebab-case" },
    { fn: toSnake, key: "snakeCase", hint: "snake_case" },
  ];

  return (
    <div className="space-y-6">
      <div className="tool-input-zone">
        <label className="field-label">Исходный текст</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder")}
          className="input-base min-h-[150px] resize-y"
          rows={6}
        />
      </div>

      <div className="tool-action-bar grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-2 text-sm font-medium text-[var(--muted)]">Регистр</div>
          <div className="flex flex-wrap gap-2">
            {register.map(({ fn, key, hint }) => (
              <motion.button
                key={key}
                onClick={() => setResult(fn(text))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-left text-sm transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
              >
                <div className="font-medium">{t(key)}</div>
                <div className="mt-1 text-xs text-[var(--muted)]">{hint}</div>
              </motion.button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 text-sm font-medium text-[var(--muted)]">Для кода и URL</div>
          <div className="flex flex-wrap gap-2">
            {code.map(({ fn, key, hint }) => (
              <motion.button
                key={key}
                onClick={() => setResult(fn(text))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-left text-sm transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
              >
                <div className="font-medium">{t(key)}</div>
                <div className="mt-1 text-xs text-[var(--muted)]">{hint}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="tool-output-zone">
          <label className="field-label">Результат</label>
          <textarea
            readOnly
            value={result}
            className="input-base min-h-[150px] resize-y"
            rows={6}
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-[var(--muted)]">
              {result.length} {t("chars")}
            </span>
            <CopyButton text={result} />
          </div>
        </div>
      )}

      {!result && !text && (
        <p className="empty-state">
          Введите текст выше и выберите вариант регистра.
        </p>
      )}
    </div>
  );
}
