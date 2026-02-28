"use client";

import { useState } from "react";
import CryptoJS from "crypto-js";
import { CopyButton } from "@/components/CopyButton";

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
      <p className="text-sm text-[var(--muted)]">
        SHA-256 хеш в одну сторону. Надёжнее MD5, подходит для подписей и проверки целостности данных.
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t("placeholder")}
        className="min-h-[100px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 focus:border-[var(--accent)] focus:outline-none"
        rows={4}
      />
      <button
        onClick={hash}
        className="rounded-lg bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {t("hash")}
      </button>
      {result ? (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={result} label="Копировать хеш" /></div>
          <div className="select-all rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 font-mono text-sm break-all">
            {result}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите текст и нажмите «Хешировать» — SHA-256 хеш появится ниже.
        </p>
      )}
    </div>
  );
}
