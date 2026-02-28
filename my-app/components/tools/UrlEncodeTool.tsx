"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface UrlEncodeToolProps {
  t: (key: string) => string;
}

export function UrlEncodeTool({ t }: UrlEncodeToolProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [spaceAsPlus, setSpaceAsPlus] = useState(false);
  const [decodeError, setDecodeError] = useState("");

  const encode = () => {
    const encoded = encodeURIComponent(input);
    setOutput(spaceAsPlus ? encoded.replace(/%20/g, "+") : encoded);
  };

  const decode = () => {
    setDecodeError("");
    try {
      const normalized = spaceAsPlus ? input.replace(/\+/g, " ") : input;
      setOutput(decodeURIComponent(normalized));
    } catch {
      setOutput("");
      setDecodeError(t("invalidUrl") || "Недопустимая строка для декодирования");
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Кодирование и декодирование URL (percent-encoding) в браузере. Для ссылок и query-параметров. Данные не отправляются.
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={spaceAsPlus} onChange={(e) => setSpaceAsPlus(e.target.checked)} className="rounded" />
            {t("spaceAsPlus") || "Пробел как + (form-urlencoded)"}
          </label>
        </div>
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">Строка</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("placeholder")} className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" rows={5} />
        <div className="mt-3 flex gap-2">
          <button onClick={encode} className="rounded-xl bg-[var(--accent)] px-4 py-2 text-white hover:opacity-90">{t("encode")}</button>
          <button onClick={decode} className="rounded-xl border border-[var(--border)] px-4 py-2 hover:bg-[var(--border)]/20">{t("decode")}</button>
        </div>
      </div>
      {decodeError && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-400">{decodeError}</div>}
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
        !decodeError && (
          <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
            Введите строку и нажмите «Закодировать» или «Декодировать».
          </p>
        )
      )}
    </div>
  );
}
