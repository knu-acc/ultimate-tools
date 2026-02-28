"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

interface UtmBuilderToolProps {
  t: (key: string) => string;
}

export function UtmBuilderTool({ t }: UtmBuilderToolProps) {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");

  const clearUtm = () => {
    setSource("");
    setMedium("");
    setCampaign("");
    setTerm("");
    setContent("");
  };

  const build = () => {
    const u = new URL(url || "https://example.com");
    if (source) u.searchParams.set("utm_source", source);
    if (medium) u.searchParams.set("utm_medium", medium);
    if (campaign) u.searchParams.set("utm_campaign", campaign);
    if (term) u.searchParams.set("utm_term", term);
    if (content) u.searchParams.set("utm_content", content);
    return u.toString();
  };

  const result = build();

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        Сборка ссылки с UTM-метками для аналитики: источник, канал, кампания, термин, контент. Результат обновляется при вводе.
      </p>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--muted)]">URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={clearUtm} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">{t("clearUtm") || "Очистить UTM"}</button>
        <button type="button" onClick={() => { setSource("google"); setMedium("cpc"); }} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">Google Ads</button>
        <button type="button" onClick={() => { setSource("newsletter"); setMedium("email"); }} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]/20">Email</button>
      </div>
      {[
        { key: "source", val: source, set: setSource },
        { key: "medium", val: medium, set: setMedium },
        { key: "campaign", val: campaign, set: setCampaign },
        { key: "term", val: term, set: setTerm },
        { key: "content", val: content, set: setContent },
      ].map(({ key, val, set }) => (
        <div key={key}>
          <label className="mb-1 block text-sm">utm_{key}</label>
          <input
            type="text"
            value={val}
            onChange={(e) => set(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-2"
          />
        </div>
      ))}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--muted)]">{t("result")}</span>
          <CopyButton text={result} label="Копировать ссылку" />
        </div>
        <div className="select-all break-all rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-sm">
          {result}
        </div>
      </div>
    </div>
  );
}
