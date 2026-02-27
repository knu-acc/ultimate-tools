"use client";

import { useState } from "react";

interface WaLinkGeneratorToolProps {
  t: (key: string) => string;
}

export function WaLinkGeneratorTool({ t }: WaLinkGeneratorToolProps) {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const cleanPhone = phone.replace(/\D/g, "");
  const link = `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm">{t("phone")}</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="79001234567"
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm">{t("message")}</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("messagePlaceholder")}
          className="min-h-[80px] w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
          rows={3}
        />
      </div>
      {cleanPhone && (
        <div>
          <div className="mb-2 text-sm text-[var(--muted)]">{t("result")}</div>
          <div
            className="cursor-pointer select-all break-all rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm"
            onClick={() => navigator.clipboard.writeText(link)}
          >
            {link}
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block rounded-xl bg-[#25D366] px-4 py-2 text-white"
          >
            {t("open")}
          </a>
        </div>
      )}
    </div>
  );
}
