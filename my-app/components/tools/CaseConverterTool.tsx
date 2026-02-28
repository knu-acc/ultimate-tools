"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";

interface CaseConverterToolProps {
  t: (key: string) => string;
}

export function CaseConverterTool({ t }: CaseConverterToolProps) {
  const [text, setText] = useState("");
  const [prevText, setPrevText] = useState("");

  const apply = (fn: (s: string) => string) => {
    setPrevText(text);
    setText(fn(text));
  };

  const toUpper = () => apply((s) => s.toUpperCase());
  const toLower = () => apply((s) => s.toLowerCase());
  const toTitle = () => apply((s) => s.replace(/\b\w/g, (c) => c.toUpperCase()));
  const toSentence = () => apply((s) => s.replace(/(^\w|\.\s+\w)/g, (c) => c.toUpperCase()));
  const invertCase = () =>
    apply((s) =>
      s.replace(/[a-zA-ZА-Яа-яЁё]/g, (c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
    );
  const toCamel = () =>
    apply((s) =>
      s
        .trim()
        .split(/\s+/)
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join("")
    );
  const toKebab = () =>
    apply((s) =>
      s
        .trim()
        .replace(/\s+/g, "-")
        .replace(/([A-ZА-Я])/g, (c) => c.toLowerCase())
        .replace(/[^a-zа-яё0-9-]/gi, "")
    );
  const toSnake = () =>
    apply((s) =>
      s
        .trim()
        .replace(/\s+/g, "_")
        .replace(/([A-ZА-Я])/g, (c) => c.toLowerCase())
        .replace(/[^a-zа-яё0-9_]/gi, "")
    );

  const undo = () => {
    if (prevText) {
      setText(prevText);
      setPrevText("");
    }
  };

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
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Введите текст и нажмите нужную кнопку — текст в поле заменится. Регистр: для заголовков и предложений. Для кода: camelCase, kebab-case, snake_case. Поддерживаются латиница и кириллица.
      </p>

      <div className="result-card">
        <label className="field-label">Исходный текст</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder")}
          className="input-base min-h-[150px] resize-y"
          rows={6}
        />
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 text-sm font-medium text-[var(--muted)]">Регистр</div>
          <div className="flex flex-wrap gap-2">
            {register.map(({ fn, key, hint }) => (
              <motion.button
                key={key}
                onClick={() => fn()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-left text-sm transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
              >
                <span className="font-medium">{t(key)}</span>
                <span className="ml-1 block text-xs text-[var(--muted)]">{hint}</span>
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
                onClick={() => fn()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-left text-sm transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]/10"
              >
                <span className="font-medium">{t(key)}</span>
                <span className="ml-1 block text-xs text-[var(--muted)]">{hint}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        {text.length > 0 && (
          <>
            <span className="text-sm text-[var(--muted)]">{text.length} {t("chars")}</span>
            <div className="flex gap-2">
              {prevText && (
                <button
                  type="button"
                  onClick={undo}
                  className="btn-ghost"
                >
                  Отменить
                </button>
              )}
              <CopyButton text={text} label="Скопировать текст" />
            </div>
          </>
        )}
      </div>

      {!text && (
        <p className="empty-state">
          Введите текст выше и выберите вариант регистра — результат можно скопировать или отменить последнее действие.
        </p>
      )}
    </div>
  );
}
