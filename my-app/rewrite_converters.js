const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'components', 'tools');

const formatNumFn = `
function formatNum(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e12) return n.toExponential(3);
  if (Math.abs(n) >= 1000) return n.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
  if (Math.abs(n) >= 1) return n.toLocaleString("ru-RU", { maximumFractionDigits: 4 });
  if (Math.abs(n) >= 0.0001) return n.toLocaleString("ru-RU", { maximumFractionDigits: 6 });
  return n.toExponential(3);
}`;

function generateConverterTool(componentName, propsInterface, units, defaultFrom, defaultUnit) {
  const unitEntries = Object.entries(units).map(([key, label]) => `  ${JSON.stringify(key)}: { factor: UNITS[${JSON.stringify(key)}], label: ${JSON.stringify(label)} },`).join('\n');
  
  return `"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

${propsInterface}

export function ${componentName}({ t }: ${componentName.replace('Tool', 'ToolProps')}) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState(${JSON.stringify(defaultFrom)});

  const v = parseFloat(value);

  const allResults = useMemo(() => {
    if (isNaN(v) || !v) return null;
    const base = v * UNIT_DATA[from].factor;
    return Object.entries(UNIT_DATA)
      .filter(([key]) => key !== from)
      .map(([key, { factor, label }]) => ({
        unit: key,
        label,
        value: base / factor,
      }));
  }, [v, from]);

  const swap = (toUnit: string) => {
    if (allResults) {
      const res = allResults.find((r) => r.unit === toUnit);
      if (res) {
        setValue(String(parseFloat(res.value.toPrecision(8))));
        setFrom(toUnit);
      }
    }
  };

  const copyAll = () => {
    if (!allResults) return "";
    return allResults.map((r) => \`\${formatNum(r.value)} \${r.unit}\`).join("\\n");
  };

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">{t("description")}</p>

      <div className="result-card">
        <span className="section-label">Значение</span>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите число"
              className="input-base text-lg font-semibold"
              autoFocus
            />
          </div>
          <div className="min-w-[160px]">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="input-base"
            >
              {Object.entries(UNIT_DATA).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {allResults && allResults.length > 0 ? (
        <div className="result-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label mb-0">Результаты</span>
            <CopyButton text={copyAll()} label="Копировать всё" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allResults.map(({ unit, label, value: val }) => (
              <button
                key={unit}
                type="button"
                onClick={() => swap(unit)}
                className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition-all hover:border-[var(--accent)] hover:shadow-md"
                title={\`Переключить на \${label}\`}
              >
                <div className="min-w-0">
                  <div className="text-lg font-bold tabular-nums truncate text-[var(--foreground)]">
                    {formatNum(val)}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
                </div>
                <span className="text-xs text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity ml-2">↔</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          Введите число — результаты во всех единицах появятся мгновенно
        </div>
      )}
    </div>
  );
}
${formatNumFn}`;
}

// ======== CONVERTER DEFINITIONS ========

const converters = [
  {
    file: 'LengthConverterTool.tsx',
    component: 'LengthConverterTool',
    interface: `interface LengthConverterToolProps { t: (key: string) => string; }`,
    factorsCode: `const UNITS: Record<string, number> = {
  m: 1, km: 1000, cm: 0.01, mm: 0.001, um: 0.000001, nm: 0.000000001,
  mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254,
};`,
    units: { m: 'Метр (m)', km: 'Километр (km)', cm: 'Сантиметр (cm)', mm: 'Миллиметр (mm)', um: 'Микрометр (μm)', nm: 'Нанометр (nm)', mi: 'Миля (mi)', yd: 'Ярд (yd)', ft: 'Фут (ft)', in: 'Дюйм (in)' },
    defaultFrom: 'm',
  },
  {
    file: 'AreaConverterTool.tsx',
    component: 'AreaConverterTool',
    interface: `interface AreaConverterToolProps { t: (key: string) => string; }`,
    factorsCode: `const UNITS: Record<string, number> = {
  m2: 1, km2: 1000000, cm2: 0.0001, mm2: 0.000001,
  ha: 10000, acre: 4046.86, sqft: 0.092903, sqin: 0.00064516,
};`,
    units: { m2: 'Кв. метр (m²)', km2: 'Кв. километр (km²)', cm2: 'Кв. сантиметр (cm²)', mm2: 'Кв. миллиметр (mm²)', ha: 'Гектар (ha)', acre: 'Акр (acre)', sqft: 'Кв. фут (ft²)', sqin: 'Кв. дюйм (in²)' },
    defaultFrom: 'm2',
  },
  {
    file: 'SpeedConverterTool.tsx',
    component: 'SpeedConverterTool',
    interface: `interface SpeedConverterToolProps { t: (key: string) => string; }`,
    factorsCode: `const UNITS: Record<string, number> = {
  "m/s": 1, "km/h": 1/3.6, "mph": 0.44704, "knots": 0.514444, "ft/s": 0.3048,
};`,
    units: { 'm/s': 'Метр/сек (m/s)', 'km/h': 'Км/час (km/h)', 'mph': 'Миль/час (mph)', 'knots': 'Узлы (knots)', 'ft/s': 'Фут/сек (ft/s)' },
    defaultFrom: 'km/h',
  },
  {
    file: 'DataConverterTool.tsx',
    component: 'DataConverterTool',
    interface: `interface DataConverterToolProps { t: (key: string) => string; }`,
    factorsCode: `const UNITS: Record<string, number> = {
  B: 1, KB: 1024, MB: 1024*1024, GB: 1024*1024*1024,
  TB: 1024*1024*1024*1024, PB: 1024*1024*1024*1024*1024,
};`,
    units: { B: 'Байт (B)', KB: 'Килобайт (KB)', MB: 'Мегабайт (MB)', GB: 'Гигабайт (GB)', TB: 'Терабайт (TB)', PB: 'Петабайт (PB)' },
    defaultFrom: 'MB',
  },
  {
    file: 'TimeConverterTool.tsx',
    component: 'TimeConverterTool',
    interface: `interface TimeConverterToolProps { t: (key: string) => string; }`,
    factorsCode: `const UNITS: Record<string, number> = {
  sec: 1, min: 60, hr: 3600, day: 86400, week: 604800,
};`,
    units: { sec: 'Секунда (s)', min: 'Минута (min)', hr: 'Час (h)', day: 'День (d)', week: 'Неделя (wk)' },
    defaultFrom: 'min',
  },
  {
    file: 'EnergyConverterTool.tsx',
    component: 'EnergyConverterTool',
    interface: `interface EnergyConverterToolProps { t: (key: string) => string; }`,
    factorsCode: `const UNITS: Record<string, number> = {
  J: 1, kJ: 1000, kcal: 4184, kWh: 3600000, Wh: 3600,
};`,
    units: { J: 'Джоуль (J)', kJ: 'Килоджоуль (kJ)', kcal: 'Килокалория (kcal)', kWh: 'Киловатт·час (kWh)', Wh: 'Ватт·час (Wh)' },
    defaultFrom: 'kcal',
  },
  {
    file: 'AngleConverterTool.tsx',
    component: 'AngleConverterTool',
    interface: `interface AngleConverterToolProps { t: (key: string) => string; }`,
    factorsCode: `const UNITS: Record<string, number> = {
  deg: Math.PI / 180, rad: 1, grad: Math.PI / 200,
};`,
    units: { deg: 'Градусы (°)', rad: 'Радианы (rad)', grad: 'Грады (grad)' },
    defaultFrom: 'deg',
  },
];

// Process each converter
let count = 0;
for (const conv of converters) {
  const unitDataEntries = Object.entries(conv.units)
    .map(([key, label]) => `  ${JSON.stringify(key)}: { factor: UNITS[${JSON.stringify(key)}], label: ${JSON.stringify(label)} },`)
    .join('\n');
  
  const content = `"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

${conv.factorsCode}

const UNIT_DATA: Record<string, { factor: number; label: string }> = {
${unitDataEntries}
};

${conv.interface}

export function ${conv.component}({ t }: ${conv.component}Props) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState(${JSON.stringify(conv.defaultFrom)});

  const v = parseFloat(value);

  const allResults = useMemo(() => {
    if (isNaN(v) || !v) return null;
    const base = v * UNIT_DATA[from].factor;
    return Object.entries(UNIT_DATA)
      .filter(([key]) => key !== from)
      .map(([key, { factor, label }]) => ({
        unit: key,
        label,
        value: base / factor,
      }));
  }, [v, from]);

  const swap = (toUnit: string) => {
    if (allResults) {
      const res = allResults.find((r) => r.unit === toUnit);
      if (res) {
        setValue(String(parseFloat(res.value.toPrecision(8))));
        setFrom(toUnit);
      }
    }
  };

  const copyAll = () => {
    if (!allResults) return "";
    return allResults.map((r) => \`\${formatNum(r.value)} \${r.unit}\`).join("\\n");
  };

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">{t("description")}</p>

      <div className="result-card">
        <span className="section-label">Значение</span>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите число"
              className="input-base text-lg font-semibold"
              autoFocus
            />
          </div>
          <div className="min-w-[160px]">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="input-base"
            >
              {Object.entries(UNIT_DATA).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {allResults && allResults.length > 0 ? (
        <div className="result-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label mb-0">Результаты</span>
            <CopyButton text={copyAll()} label="Копировать всё" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allResults.map(({ unit, label, value: val }) => (
              <button
                key={unit}
                type="button"
                onClick={() => swap(unit)}
                className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition-all hover:border-[var(--accent)] hover:shadow-md"
                title={\`Переключить на \${label}\`}
              >
                <div className="min-w-0">
                  <div className="text-lg font-bold tabular-nums truncate text-[var(--foreground)]">
                    {formatNum(val)}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
                </div>
                <span className="text-xs text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity ml-2">↔</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          Введите число — результаты во всех единицах появятся мгновенно
        </div>
      )}
    </div>
  );
}

function formatNum(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e12) return n.toExponential(3);
  if (Math.abs(n) >= 1000) return n.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
  if (Math.abs(n) >= 1) return n.toLocaleString("ru-RU", { maximumFractionDigits: 4 });
  if (Math.abs(n) >= 0.0001) return n.toLocaleString("ru-RU", { maximumFractionDigits: 6 });
  return n.toExponential(3);
}
`;

  fs.writeFileSync(path.join(dir, conv.file), content, 'utf8');
  count++;
}

// ======== FIX PRESSURE CONVERTER (was broken - had weight units) ========
const pressureContent = `"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

const UNITS: Record<string, number> = {
  Pa: 1,
  kPa: 1000,
  MPa: 1000000,
  bar: 100000,
  atm: 101325,
  psi: 6894.76,
  mmHg: 133.322,
  inHg: 3386.39,
};

const UNIT_DATA: Record<string, { factor: number; label: string }> = {
  "Pa": { factor: UNITS["Pa"], label: "Паскаль (Pa)" },
  "kPa": { factor: UNITS["kPa"], label: "Килопаскаль (kPa)" },
  "MPa": { factor: UNITS["MPa"], label: "Мегапаскаль (MPa)" },
  "bar": { factor: UNITS["bar"], label: "Бар (bar)" },
  "atm": { factor: UNITS["atm"], label: "Атмосфера (atm)" },
  "psi": { factor: UNITS["psi"], label: "PSI (psi)" },
  "mmHg": { factor: UNITS["mmHg"], label: "мм рт.ст. (mmHg)" },
  "inHg": { factor: UNITS["inHg"], label: "дюйм рт.ст. (inHg)" },
};

interface PressureConverterToolProps { t: (key: string) => string; }

export function PressureConverterTool({ t }: PressureConverterToolProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("atm");

  const v = parseFloat(value);

  const allResults = useMemo(() => {
    if (isNaN(v) || !v) return null;
    const base = v * UNIT_DATA[from].factor;
    return Object.entries(UNIT_DATA)
      .filter(([key]) => key !== from)
      .map(([key, { factor, label }]) => ({
        unit: key,
        label,
        value: base / factor,
      }));
  }, [v, from]);

  const swap = (toUnit: string) => {
    if (allResults) {
      const res = allResults.find((r) => r.unit === toUnit);
      if (res) {
        setValue(String(parseFloat(res.value.toPrecision(8))));
        setFrom(toUnit);
      }
    }
  };

  const copyAll = () => {
    if (!allResults) return "";
    return allResults.map((r) => \`\${formatNum(r.value)} \${r.unit}\`).join("\\n");
  };

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">{t("description")}</p>

      <div className="result-card">
        <span className="section-label">Значение</span>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите число"
              className="input-base text-lg font-semibold"
              autoFocus
            />
          </div>
          <div className="min-w-[160px]">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="input-base"
            >
              {Object.entries(UNIT_DATA).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {allResults && allResults.length > 0 ? (
        <div className="result-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label mb-0">Результаты</span>
            <CopyButton text={copyAll()} label="Копировать всё" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allResults.map(({ unit, label, value: val }) => (
              <button
                key={unit}
                type="button"
                onClick={() => swap(unit)}
                className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition-all hover:border-[var(--accent)] hover:shadow-md"
                title={\`Переключить на \${label}\`}
              >
                <div className="min-w-0">
                  <div className="text-lg font-bold tabular-nums truncate text-[var(--foreground)]">
                    {formatNum(val)}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
                </div>
                <span className="text-xs text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity ml-2">↔</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          Введите число — результаты во всех единицах давления появятся мгновенно
        </div>
      )}
    </div>
  );
}

function formatNum(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e12) return n.toExponential(3);
  if (Math.abs(n) >= 1000) return n.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
  if (Math.abs(n) >= 1) return n.toLocaleString("ru-RU", { maximumFractionDigits: 4 });
  if (Math.abs(n) >= 0.0001) return n.toLocaleString("ru-RU", { maximumFractionDigits: 6 });
  return n.toExponential(3);
}
`;

fs.writeFileSync(path.join(dir, 'PressureConverterTool.tsx'), pressureContent, 'utf8');
count++;

// ======== FIX TEMPERATURE CONVERTER (special - non-linear) ========
const tempContent = `"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

function toKelvin(val: number, from: string): number {
  if (from === "K") return val;
  if (from === "C") return val + 273.15;
  if (from === "F") return (val - 32) * (5 / 9) + 273.15;
  if (from === "R") return val * (5 / 9);
  return val;
}

function fromKelvin(k: number, to: string): number {
  if (to === "K") return k;
  if (to === "C") return k - 273.15;
  if (to === "F") return (k - 273.15) * (9 / 5) + 32;
  if (to === "R") return k * (9 / 5);
  return k;
}

const TEMP_UNITS: { key: string; label: string; symbol: string }[] = [
  { key: "C", label: "Цельсий (°C)", symbol: "°C" },
  { key: "F", label: "Фаренгейт (°F)", symbol: "°F" },
  { key: "K", label: "Кельвин (K)", symbol: "K" },
  { key: "R", label: "Ранкин (°R)", symbol: "°R" },
];

interface TemperatureConverterToolProps { t: (key: string) => string; }

export function TemperatureConverterTool({ t }: TemperatureConverterToolProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("C");

  const v = parseFloat(value);

  const allResults = useMemo(() => {
    if (isNaN(v)) return null;
    const k = toKelvin(v, from);
    return TEMP_UNITS
      .filter((u) => u.key !== from)
      .map((u) => ({
        unit: u.key,
        label: u.label,
        symbol: u.symbol,
        value: fromKelvin(k, u.key),
      }));
  }, [v, from]);

  const swap = (toUnit: string) => {
    if (allResults) {
      const res = allResults.find((r) => r.unit === toUnit);
      if (res) {
        setValue(String(parseFloat(res.value.toPrecision(6))));
        setFrom(toUnit);
      }
    }
  };

  const copyAll = () => {
    if (!allResults) return "";
    return allResults.map((r) => \`\${r.value.toFixed(2)} \${r.symbol}\`).join("\\n");
  };

  const presets = [
    { label: "0°C (замерзание)", val: "0", unit: "C" },
    { label: "100°C (кипение)", val: "100", unit: "C" },
    { label: "36.6°C (тело)", val: "36.6", unit: "C" },
    { label: "−40° (одинаково)", val: "-40", unit: "C" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">{t("description")}</p>

      <div className="result-card">
        <span className="section-label">Значение</span>
        <div className="flex flex-wrap gap-2 mb-4">
          {presets.map(({ label, val, unit }) => (
            <button
              key={label}
              type="button"
              onClick={() => { setValue(val); setFrom(unit); }}
              className={\`chip \${value === val && from === unit ? "chip-active" : ""}\`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите температуру"
              className="input-base text-lg font-semibold"
              autoFocus
            />
          </div>
          <div className="min-w-[160px]">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="input-base"
            >
              {TEMP_UNITS.map((u) => (
                <option key={u.key} value={u.key}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {allResults && allResults.length > 0 ? (
        <div className="result-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label mb-0">Результаты</span>
            <CopyButton text={copyAll()} label="Копировать всё" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {allResults.map(({ unit, label, symbol, value: val }) => (
              <button
                key={unit}
                type="button"
                onClick={() => swap(unit)}
                className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition-all hover:border-[var(--accent)] hover:shadow-md"
                title={\`Переключить на \${label}\`}
              >
                <div className="min-w-0">
                  <div className="text-lg font-bold tabular-nums truncate text-[var(--foreground)]">
                    {val.toFixed(2)} {symbol}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
                </div>
                <span className="text-xs text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity ml-2">↔</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          Введите температуру — результаты во всех шкалах появятся мгновенно
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(path.join(dir, 'TemperatureConverterTool.tsx'), tempContent, 'utf8');
count++;

// ======== FIX VOLUME CONVERTER ========
const volumeContent = `"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

const UNITS: Record<string, number> = {
  L: 1,
  mL: 0.001,
  m3: 1000,
  gal_us: 3.78541,
  gal_uk: 4.54609,
  cup: 0.236588,
  fl_oz: 0.0295735,
  pt_us: 0.473176,
  qt_us: 0.946353,
  tbsp: 0.0147868,
};

const UNIT_DATA: Record<string, { factor: number; label: string }> = {
  "L":      { factor: UNITS["L"],      label: "Литр (L)" },
  "mL":     { factor: UNITS["mL"],     label: "Миллилитр (mL)" },
  "m3":     { factor: UNITS["m3"],     label: "Куб. метр (m³)" },
  "gal_us": { factor: UNITS["gal_us"], label: "Галлон US (gal)" },
  "gal_uk": { factor: UNITS["gal_uk"], label: "Галлон UK (gal)" },
  "cup":    { factor: UNITS["cup"],    label: "Чашка US (cup)" },
  "fl_oz":  { factor: UNITS["fl_oz"],  label: "Жидк. унция (fl oz)" },
  "pt_us":  { factor: UNITS["pt_us"],  label: "Пинта US (pt)" },
  "qt_us":  { factor: UNITS["qt_us"],  label: "Кварта US (qt)" },
  "tbsp":   { factor: UNITS["tbsp"],   label: "Ст. ложка (tbsp)" },
};

interface VolumeConverterToolProps { t: (key: string) => string; }

export function VolumeConverterTool({ t }: VolumeConverterToolProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("L");

  const v = parseFloat(value);

  const allResults = useMemo(() => {
    if (isNaN(v) || !v) return null;
    const base = v * UNIT_DATA[from].factor;
    return Object.entries(UNIT_DATA)
      .filter(([key]) => key !== from)
      .map(([key, { factor, label }]) => ({
        unit: key,
        label,
        value: base / factor,
      }));
  }, [v, from]);

  const swap = (toUnit: string) => {
    if (allResults) {
      const res = allResults.find((r) => r.unit === toUnit);
      if (res) {
        setValue(String(parseFloat(res.value.toPrecision(8))));
        setFrom(toUnit);
      }
    }
  };

  const copyAll = () => {
    if (!allResults) return "";
    return allResults.map((r) => \`\${formatNum(r.value)} \${r.unit}\`).join("\\n");
  };

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">{t("description")}</p>

      <div className="result-card">
        <span className="section-label">Значение</span>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Введите число"
              className="input-base text-lg font-semibold"
              autoFocus
            />
          </div>
          <div className="min-w-[160px]">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="input-base"
            >
              {Object.entries(UNIT_DATA).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {allResults && allResults.length > 0 ? (
        <div className="result-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-label mb-0">Результаты</span>
            <CopyButton text={copyAll()} label="Копировать всё" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allResults.map(({ unit, label, value: val }) => (
              <button
                key={unit}
                type="button"
                onClick={() => swap(unit)}
                className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition-all hover:border-[var(--accent)] hover:shadow-md"
                title={\`Переключить на \${label}\`}
              >
                <div className="min-w-0">
                  <div className="text-lg font-bold tabular-nums truncate text-[var(--foreground)]">
                    {formatNum(val)}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
                </div>
                <span className="text-xs text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity ml-2">↔</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          Введите число — результаты во всех единицах объёма появятся мгновенно
        </div>
      )}
    </div>
  );
}

function formatNum(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e12) return n.toExponential(3);
  if (Math.abs(n) >= 1000) return n.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
  if (Math.abs(n) >= 1) return n.toLocaleString("ru-RU", { maximumFractionDigits: 4 });
  if (Math.abs(n) >= 0.0001) return n.toLocaleString("ru-RU", { maximumFractionDigits: 6 });
  return n.toExponential(3);
}
`;

fs.writeFileSync(path.join(dir, 'VolumeConverterTool.tsx'), volumeContent, 'utf8');
count++;

console.log(`Rewrote ${count} converter tools with improved UX (show all units, click to swap, no button needed).`);
