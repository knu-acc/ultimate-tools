"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

interface PasswordGeneratorToolProps {
  t: (key: string) => string;
}

const CHARS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

const PASSPHRASE_WORDS = "apple banana cherry grape lemon mango orange peach pear plum berry cloud dawn echo flame river stone tree wind".split(" ");

function getStrength(pwd: string): number {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8) s += 1;
  if (pwd.length >= 12) s += 1;
  if (pwd.length >= 16) s += 1;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) s += 1;
  if (/\d/.test(pwd)) s += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) s += 1;
  return Math.min(5, s);
}

export function PasswordGeneratorTool({ t }: PasswordGeneratorToolProps) {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [passphraseMode, setPassphraseMode] = useState(false);
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState("-");
  const [password, setPassword] = useState("");

  const strength = getStrength(password);
  const strengthLabel = ["", t("weak") || "Слабый", t("fair") || "Средний", t("good") || "Хороший", t("strong") || "Надёжный", t("veryStrong") || "Очень надёжный"][strength];

  const generate = () => {
    if (passphraseMode) {
      const arr = new Uint32Array(wordCount);
      crypto.getRandomValues(arr);
      const words = Array.from(arr, (n) => PASSPHRASE_WORDS[n % PASSPHRASE_WORDS.length]);
      setPassword(words.join(separator));
      return;
    }
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
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={passphraseMode}
          onChange={(e) => setPassphraseMode(e.target.checked)}
        />
        {t("passphraseMode") || "Режим парольной фразы (слова)"}
      </label>
      {passphraseMode ? (
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm text-[var(--muted)]">{t("wordCount") || "Слов"}</label>
            <input
              type="number"
              min={3}
              max={10}
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value) || 3)}
              className="w-20 rounded-lg border border-[var(--border)] px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--muted)]">{t("separator") || "Разделитель"}</label>
            <input
              type="text"
              maxLength={2}
              value={separator}
              onChange={(e) => setSeparator(e.target.value || "-")}
              className="w-16 rounded-lg border border-[var(--border)] px-2 py-1 text-center"
            />
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
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
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-[var(--muted)]">{t("strength") || "Надёжность"}: {strengthLabel}</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-6 rounded-full"
                  style={{ backgroundColor: i <= strength ? (strength <= 2 ? "var(--accent)" : "green") : "var(--border)" }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono relative">
            <div className="pr-20 break-all select-all">{password}</div>
            <div className="absolute top-2 right-2">
              <CopyButton text={password} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
