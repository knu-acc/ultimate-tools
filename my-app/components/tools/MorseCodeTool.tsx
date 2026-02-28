"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

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
  const [live, setLive] = useState(false);

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
          .split(/[\s/]+/)
          .map((s) => REVERSE[s] ?? s)
          .join("")
      );
    }
  };

  const liveResult =
    live && input
      ? mode === "encode"
        ? input.toUpperCase().split("").map((c) => MORSE[c] ?? c).join(" ")
        : input.split(/[\s/]+/).map((s) => REVERSE[s] ?? s).join("")
      : result;

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Код Морзе: латиница и цифры в точки/тире и обратно. Выберите «Закодировать» или «Декодировать», введите текст и нажмите кнопку.
      </p>
      <div className="flex flex-wrap gap-2">
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
        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <input type="checkbox" checked={live} onChange={(e) => setLive(e.target.checked)} />
          {t("liveUpdate") || "Обновлять при вводе"}
        </label>
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
      {(liveResult || result) ? (
        <div className="space-y-2">
          <div className="flex justify-end"><CopyButton text={liveResult || result} label="Копировать" /></div>
          <div className="select-all rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 font-mono">
            {liveResult || result}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите текст или код Морзе (буквы через пробел) и нажмите кнопку — результат появится ниже.
        </p>
      )}
    </div>
  );
}
