"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface SpaceCleanupToolProps {
  t: (key: string) => string;
}

export function SpaceCleanupTool({ t }: SpaceCleanupToolProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const cleanup = (mode: string) => {
    let res = text;
    if (mode === "all") res = text.replace(/\s+/g, " ").trim();
    else if (mode === "lines") res = text.replace(/[ \t]+/g, " ").replace(/\n\s*\n/g, "\n\n").trim();
    else if (mode === "trim") res = text.split("\n").map((l) => l.trim()).join("\n");
    else if (mode === "join") res = text.replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").trim();
    else if (mode === "singleBlank") res = text.replace(/(\n\s*){3,}/g, "\n\n").trim();
    else if (mode === "noBreaks") res = text.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
    else if (mode === "noSpaces") res = text.replace(/\s/g, "");
    setResult(res);
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
      <div className="tool-input-zone">
        <label className="field-label">Текст для очистки</label>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (result) setResult("");
          }}
          placeholder={t("placeholder") || "Введите текст..."}
          className="input-base min-h-[150px] resize-y"
          rows={6}
        />
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
          <span>Символов: {text.length}</span>
        </div>
      </div>

      <div className="tool-action-bar flex flex-wrap gap-2">
        {modes.map(({ key, label, hint }) => (
          <button
            key={key}
            onClick={() => cleanup(key)}
            title={hint}
            className="btn btn-primary"
          >
            {label}
          </button>
        ))}
      </div>

      {result && (
        <div className="tool-output-zone">
          <label className="field-label">Результат</label>
          <textarea
            value={result}
            readOnly
            className="input-base min-h-[150px] resize-y bg-[var(--muted)]/5"
            rows={6}
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-[var(--muted)]">
              Символов: {result.length} (убрано: {text.length - result.length})
            </span>
            <CopyButton text={result} />
          </div>
        </div>
      )}

      {!result && (
        <p className="empty-state">
          Вставьте текст с лишними пробелами или переносами — нажмите нужный режим очистки, затем скопируйте результат.
        </p>
      )}
    </div>
  );
}
