"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface JwtDecoderToolProps {
  t: (key: string) => string;
}

function base64UrlDecode(str: string): string {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return "";
  }
}

export function JwtDecoderTool({ t }: JwtDecoderToolProps) {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");

  const [expInfo, setExpInfo] = useState<string | null>(null);

  const decode = () => {
    setError("");
    setExpInfo(null);
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      setError(t("invalidJwt"));
      return;
    }
    try {
      setHeader(JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2));
      const payloadObj = JSON.parse(base64UrlDecode(parts[1]));
      setPayload(JSON.stringify(payloadObj, null, 2));
      if (typeof payloadObj.exp === "number") {
        const d = new Date(payloadObj.exp * 1000);
        const now = Date.now() / 1000;
        setExpInfo(payloadObj.exp < now
          ? `${t("expired") || "Истёк"}: ${d.toLocaleString()}`
          : `${t("expires") || "Истекает"}: ${d.toLocaleString()}`);
      }
    } catch {
      setError(t("invalidJwt"));
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Декодирование JWT в браузере: вставьте токен и нажмите «Декодировать» — отобразятся Header и Payload в JSON. Подпись не проверяется; данные не отправляются на сервер. Не вставляйте токены на сторонних сайтах.
      </p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">JWT токен</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="min-h-[80px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 font-mono text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          rows={3}
        />
        <button onClick={decode} className="mt-3 rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white hover:opacity-90">
          {t("decode")}
        </button>
      </div>
      {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-400">{error}</div>}
      {expInfo && <p className="text-sm text-[var(--muted)]">{expInfo}</p>}
      {header && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--muted)]">Header</span>
              <CopyButton text={header} label="Копировать Header" />
            </div>
            <pre className="overflow-auto rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-sm">{header}</pre>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--muted)]">Payload</span>
              <CopyButton text={payload} label="Копировать Payload" />
            </div>
            <pre className="overflow-auto rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-sm">{payload}</pre>
          </div>
        </div>
      )}
      {!header && !error && token.trim() && (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Нажмите «Декодировать» — появятся блоки Header и Payload.
        </p>
      )}
    </div>
  );
}
