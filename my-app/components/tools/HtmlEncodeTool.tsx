"use client";

import { useState } from "react";

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
    const textarea = document.createElement("textarea");
    textarea.innerHTML = input;
    setOutput(textarea.value);
  };

  return (
    <div className="space-y-6">
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
      {output && (
        <div
          className="cursor-pointer select-all rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm break-all"
          onClick={() => navigator.clipboard.writeText(output)}
        >
          {output}
        </div>
      )}
    </div>
  );
}
