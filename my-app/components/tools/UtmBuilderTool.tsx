"use client";

import { useState } from "react";

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
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm">URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3"
        />
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
      <div>
        <div className="mb-2 text-sm text-[var(--muted)]">{t("result")}</div>
        <div
          className="cursor-pointer select-all break-all rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm"
          onClick={() => navigator.clipboard.writeText(result)}
        >
          {result}
        </div>
      </div>
    </div>
  );
}
