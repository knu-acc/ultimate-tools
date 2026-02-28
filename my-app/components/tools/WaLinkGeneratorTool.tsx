"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

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
      <p className="text-sm text-[var(--muted)]">
        Ссылка для открытия чата WhatsApp с номером и опциональным предзаполненным сообщением. Номер — только цифры, с кодом страны.
      </p>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">{t("phone")}</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {["+7", "+1", "+44", "+49", "+77", "+998", "+996"].map((code) => (
            <button key={code} type="button" onClick={() => setPhone(code.replace("+", ""))} className="rounded-lg border border-[var(--border)] px-2 py-1 text-sm hover:bg-[var(--border)]/20">{code}</button>
          ))}
        </div>
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
      {cleanPhone ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--muted)]">{t("result")}</span>
            <CopyButton text={link} label="Копировать ссылку" />
          </div>
          <div className="select-all break-all rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-sm">
            {link}
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-[#25D366] px-4 py-2 text-white hover:opacity-90"
          >
            {t("open")}
          </a>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--accent-muted)]/20 px-4 py-3 text-sm text-[var(--muted)]">
          Введите номер телефона (например 79001234567) — ссылка и кнопка «Открыть» появятся ниже.
        </p>
      )}
    </div>
  );
}
