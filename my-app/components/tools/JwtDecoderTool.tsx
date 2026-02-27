"use client";

import { useState } from "react";

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

  const decode = () => {
    setError("");
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      setError(t("invalidJwt"));
      return;
    }
    try {
      setHeader(JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2));
      setPayload(JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2));
    } catch {
      setError(t("invalidJwt"));
    }
  };

  return (
    <div className="space-y-6">
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        className="min-h-[80px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 font-mono text-sm"
        rows={3}
      />
      <button
        onClick={decode}
        className="rounded-xl bg-[var(--accent)] px-6 py-3 font-medium text-white"
      >
        {t("decode")}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {header && (
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm text-[var(--muted)]">Header</div>
            <pre className="overflow-auto rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm">{header}</pre>
          </div>
          <div>
            <div className="mb-2 text-sm text-[var(--muted)]">Payload</div>
            <pre className="overflow-auto rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm">{payload}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
