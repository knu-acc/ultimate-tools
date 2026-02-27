"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";

interface PasswordGeneratorToolProps {
  t: (key: string) => string;
}

const CHARS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export function PasswordGeneratorTool({ t }: PasswordGeneratorToolProps) {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = () => {
    let pool = "";
    if (useLower) pool += CHARS.lower;
    if (useUpper) pool += CHARS.upper;
    if (useDigits) pool += CHARS.digits;
    if (useSymbols) pool += CHARS.symbols;
    if (!pool) pool = CHARS.lower;
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPassword(
      Array.from(arr, (n) => pool[n % pool.length]).join("")
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm">{t("length")}</label>
        <input
          type="range"
          min={6}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
        <span className="ml-2 text-sm">{length}</span>
      </div>
      <div className="flex flex-wrap gap-4">
        {[
          { key: "lower", val: useLower, set: setUseLower },
          { key: "upper", val: useUpper, set: setUseUpper },
          { key: "digits", val: useDigits, set: setUseDigits },
          { key: "symbols", val: useSymbols, set: setUseSymbols },
        ].map(({ key, val, set }) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={val}
              onChange={(e) => set(e.target.checked)}
            />
            {t(key)}
          </label>
        ))}
      </div>
      <motion.button
        onClick={generate}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        <KeyRound className="h-5 w-5" />
        {t("generate")}
      </motion.button>
      {password && (
        <div
          className="cursor-pointer select-all rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono"
          onClick={() => navigator.clipboard.writeText(password)}
        >
          {password}
        </div>
      )}
    </div>
  );
}
