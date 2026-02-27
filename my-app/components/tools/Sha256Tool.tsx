"use client";

import { useState } from "react";
import CryptoJS from "crypto-js";

interface Sha256ToolProps {
  t: (key: string) => string;
}

export function Sha256Tool({ t }: Sha256ToolProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const hash = () => {
    setResult(CryptoJS.SHA256(input).toString());
  };

  return (
    <div className="space-y-6">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[100px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        rows={4}
      />
      <button
        onClick={hash}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {t("hash")}
      </button>
      {result && (
        <div
          className="cursor-pointer select-all rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-sm break-all"
          onClick={() => navigator.clipboard.writeText(result)}
        >
          {result}
        </div>
      )}
    </div>
  );
}
