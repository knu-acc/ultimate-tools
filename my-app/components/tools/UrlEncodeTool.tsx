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
  const encode = () => {
    const encoded = encodeURIComponent(input);
    setOutput(spaceAsPlus ? encoded.replace(/%20/g, "+") : encoded);
  };
  const decode = () => {
    try {
      const normalized = spaceAsPlus ? input.replace(/\+/g, " ") : input;
      setOutput(decodeURIComponent(normalized));
    } catch {
      setOutput(t("invalidUrl"));
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Кодирование и декодирование URL (percent-encoding). Для ссылок и query-параметров.
      </p>
      <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
        <input type="checkbox" checked={spaceAsPlus} onChange={(e) => setSpaceAsPlus(e.target.checked)} />
        {t("spaceAsPlus") || "Пробел как + (form-urlencoded)"}
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[120px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        rows={5}
      />
      <div className="flex gap-2">
        <button
          onClick={encode}
          className="rounded-xl bg-[var(--accent)] px-4 py-2 text-white"
        >
          {t("encode")}
        </button>
        <button
          onClick={decode}
          className="rounded-xl border border-[var(--border)] px-4 py-2"
        >
          {t("decode")}
        </button>
      </div>
      {output ? (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={output} label="Копировать" /></div>
          <div className="select-all rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 font-mono text-sm break-all">
            {output}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите строку и нажмите «Закодировать» или «Декодировать» — результат появится здесь.
        </p>
      )}
    </div>
  );
}
