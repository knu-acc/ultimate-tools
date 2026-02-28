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
      <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
        Сборка ссылки с UTM-метками для аналитики: источник, канал, кампания, термин, контент. Результат обновляется при вводе.
      </p>
      <div>
        <label className="field-label">URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="input-base"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={clearUtm} className="btn-ghost">{t("clearUtm") || "Очистить UTM"}</button>
        <button type="button" onClick={() => { setSource("google"); setMedium("cpc"); }} className="btn-ghost">Google Ads</button>
        <button type="button" onClick={() => { setSource("newsletter"); setMedium("email"); }} className="btn-ghost">Email</button>
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
            className="input-base"
          />
        </div>
      ))}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--foreground)]/70">{t("result")}</span>
          <CopyButton text={result} label="Копировать ссылку" />
        </div>
        <div className="select-all break-all rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-sm">
          {result}
        </div>
      </div>
    </div>
  );
}
