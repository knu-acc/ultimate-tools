"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface JsonFormatterToolProps {
  t: (key: string) => string;
}

export function JsonFormatterTool({ t }: JsonFormatterToolProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const [valid, setValid] = useState<boolean | null>(null);

  const format = () => {
    setError("");
    setValid(null);
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setValid(true);
    } catch (e) {
      setError(t("invalidJson"));
      setValid(false);
      const msg = (e as Error).message;
      const match = msg.match(/position (\d+)/i) || msg.match(/at position (\d+)/i);
      if (match) setError(`${t("invalidJson")} (${t("position") || "позиция"} ${match[1]})`);
    }
  };

  const minify = () => {
    setError("");
    setValid(null);
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setValid(true);
    } catch (e) {
      setError(t("invalidJson"));
      setValid(false);
    }
  };

  const validate = () => {
    setError("");
    setOutput("");
    try {
      JSON.parse(input);
      setValid(true);
      setError("");
    } catch (e) {
      setValid(false);
      const msg = (e as Error).message;
      const match = msg.match(/position (\d+)/i) || msg.match(/at position (\d+)/i);
      setError(match ? `${t("invalidJson")} — ${t("position") || "позиция"} ${match[1]}` : t("invalidJson"));
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setValid(null);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Форматирование, минификация и проверка JSON в браузере. Данные никуда не отправляются. Вставьте JSON и нажмите нужную кнопку.
      </p>
      <div className="result-card">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--foreground)]/70">JSON</label>
          {input ? <button type="button" onClick={clearAll} className="btn-ghost">Очистить</button> : null}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"key": "value"}'
          className="input-base font-mono text-sm min-h-[150px]"
          rows={6}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={format} className="btn-primary w-full sm:w-auto mt-2">
            {t("format")}
          </button>
          <button onClick={minify} className="btn-secondary">
            {t("minify")}
          </button>
          <button onClick={validate} className="btn-secondary">
            {t("validate") || "Проверить"}
          </button>
        </div>
      </div>
      {valid === true && !output && <p className="text-sm text-green-600 dark:text-green-400">{t("validJson") || "JSON корректен."}</p>}
      {error && <div className="badge-danger px-4 py-2.5 rounded-xl text-sm">{error}</div>}
      {output && !error && (
        <div className="result-card">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--foreground)]/70">Результат</span>
            <CopyButton text={output} label="Копировать JSON" />
          </div>
          <textarea readOnly value={output} className="input-base font-mono text-sm min-h-[150px] bg-[var(--background)]" rows={6} />
        </div>
      )}
      {!output && !error && input.trim() && (
        <p className="empty-state">
          Нажмите «Форматировать» или «Минифицировать» для результата.
        </p>
      )}
    </div>
  );
}
