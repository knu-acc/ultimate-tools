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
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Декодирование JWT в браузере: вставьте токен и нажмите «Декодировать» — отобразятся Header и Payload в JSON. Подпись не проверяется; данные не отправляются на сервер. Не вставляйте токены на сторонних сайтах.
      </p>
      <div className="result-card">
        <label className="field-label">JWT токен</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="input-base min-h-[80px] font-mono text-sm"
          rows={3}
        />
        <button onClick={decode} className="btn-primary w-full sm:w-auto mt-2">
          {t("decode")}
        </button>
      </div>
      {error && <div className="badge-danger px-4 py-2.5 rounded-xl text-sm">{error}</div>}
      {expInfo && <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">{expInfo}</p>}
      {header && (
        <div className="space-y-4">
          <div className="result-card">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--foreground)]/70">Header</span>
              <CopyButton text={header} label="Копировать Header" />
            </div>
            <pre className="overflow-auto rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-sm">{header}</pre>
          </div>
          <div className="result-card">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--foreground)]/70">Payload</span>
              <CopyButton text={payload} label="Копировать Payload" />
            </div>
            <pre className="overflow-auto rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-sm">{payload}</pre>
          </div>
        </div>
      )}
      {!header && !error && token.trim() && (
        <p className="empty-state">
          Нажмите «Декодировать» — появятся блоки Header и Payload.
        </p>
      )}
    </div>
  );
}
