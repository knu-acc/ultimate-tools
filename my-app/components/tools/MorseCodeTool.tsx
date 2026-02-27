"use client";

import { useState } from "react";

const MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
  H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
  O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
  V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  " ": "/", ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--",
};

const REVERSE = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k])
);

interface MorseCodeToolProps {
  t: (key: string) => string;
}

export function MorseCodeTool({ t }: MorseCodeToolProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const process = () => {
    if (mode === "encode") {
      setResult(
        input
          .toUpperCase()
          .split("")
          .map((c) => MORSE[c] ?? c)
          .join(" ")
      );
    } else {
      setResult(
        input
          .split(" ")
          .map((s) => REVERSE[s] ?? s)
          .join("")
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encode")}
          className={`rounded-xl px-4 py-2 ${mode === "encode" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
        >
          {t("encode")}
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`rounded-xl px-4 py-2 ${mode === "decode" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)]"}`}
        >
          {t("decode")}
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "encode" ? t("textPlaceholder") : t("morsePlaceholder")}
        className="min-h-[100px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        rows={4}
      />
      <button
        onClick={process}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {mode === "encode" ? t("encode") : t("decode")}
      </button>
      {result && (
        <div
          className="cursor-pointer select-all rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono"
          onClick={() => navigator.clipboard.writeText(result)}
        >
          {result}
        </div>
      )}
    </div>
  );
}
