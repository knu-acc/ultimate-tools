"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

interface HtmlEncodeToolProps {
  t: (key: string) => string;
}

export function HtmlEncodeTool({ t }: HtmlEncodeToolProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => {
    setOutput(
      input.replace(/[&<>"']/g, (c) => HTML_ENTITIES[c] ?? c)
    );
  };

  const decode = () => {
    try {
      const textarea = document.createElement("textarea");
      textarea.innerHTML = input;
      setOutput(textarea.value);
    } catch {
      setOutput(t("decodeError") || "Ошибка декодирования");
    }
  };

  const encodeAll = () => {
    setOutput(
      input
        .split("")
        .map((c) => {
          const code = c.charCodeAt(0);
          if (code > 127) return `&#${code};`;
          return HTML_ENTITIES[c] ?? c;
        })
        .join("")
    );
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Кодирование и декодирование HTML-сущностей в браузере. «Закодировать» — только &amp; &lt; &gt; &quot; &#39;. «Все символы» — не-ASCII в &#NNN;. Данные не отправляются.
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">Исходный текст</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("placeholder")} className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" rows={5} />
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={encode} className="rounded-xl bg-[var(--accent)] px-4 py-2 text-white hover:opacity-90">{t("encode")}</button>
          <button onClick={decode} className="rounded-xl border border-[var(--border)] px-4 py-2 hover:bg-[var(--border)]/20">{t("decode")}</button>
          <button onClick={encodeAll} className="rounded-xl border border-[var(--border)] px-4 py-2 hover:bg-[var(--border)]/20" title="Все не-ASCII в &#NNN;">{t("encodeAll") || "Все символы → entities"}</button>
        </div>
      </div>
      {output ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--muted)]">Результат</span>
            <CopyButton text={output} label="Копировать" />
          </div>
          <div className="select-all rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm break-all">
            {output}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите текст и нажмите «Закодировать» или «Декодировать».
        </p>
      )}
    </div>
  );
}
