"use client";

import { useState } from "react";

interface RegexTesterToolProps {
  t: (key: string) => string;
}

export function RegexTesterTool({ t }: RegexTesterToolProps) {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");

  const test = () => {
    setError("");
    setMatches([]);
    try {
      const re = new RegExp(pattern, flags);
      const m = text.match(re);
      setMatches(m ? (Array.isArray(m) ? m : [m[0]]) : []);
    } catch (e) {
      setError(t("invalidRegex"));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm">{t("pattern")}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\d+"
            className="flex-1 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 font-mono"
          />
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g"
            className="w-16 rounded-xl border border-[var(--border)] bg-transparent px-2 py-3 font-mono text-center"
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm">{t("text")}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("textPlaceholder")}
          className="min-h-[100px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          rows={4}
        />
      </div>
      <button
        onClick={test}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {t("test")}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {matches.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] p-4">
          <div className="mb-2 text-sm text-[var(--muted)]">{t("matches")}</div>
          <div className="flex flex-wrap gap-2">
            {matches.map((m, i) => (
              <span
                key={i}
                className="rounded-lg bg-[var(--accent)]/20 px-2 py-1 font-mono"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
