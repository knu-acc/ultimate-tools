"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { CopyButton } from "@/components/CopyButton";

interface QrGeneratorToolProps {
  t: (key: string) => string;
}

type QrMode = "text" | "url" | "wifi" | "email" | "phone";

export function QrGeneratorTool({ t }: QrGeneratorToolProps) {
  const [mode, setMode] = useState<QrMode>("text");
  const [value, setValue] = useState("");
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiType, setWifiType] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [qrSize, setQrSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [dataUrl, setDataUrl] = useState<string>("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getQrValue = useCallback(() => {
    switch (mode) {
      case "url": return value.startsWith("http") ? value : `https://${value}`;
      case "wifi": return `WIFI:T:${wifiType};S:${wifiSSID};P:${wifiPass};;`;
      case "email": return `mailto:${value}`;
      case "phone": return `tel:${value}`;
      default: return value;
    }
  }, [mode, value, wifiSSID, wifiPass, wifiType]);

  const qrText = getQrValue();
  const hasInput = mode === "wifi" ? wifiSSID.length > 0 : value.length > 0;

  useEffect(() => {
    if (!hasInput) {
      setDataUrl("");
      setError("");
      return;
    }

    const generate = async () => {
      try {
        setError("");
        const canvas = canvasRef.current;
        if (!canvas) return;

        await QRCode.toCanvas(canvas, qrText, {
          width: qrSize,
          margin: 2,
          color: { dark: fgColor, light: bgColor },
          errorCorrectionLevel: errorLevel,
        });

        setDataUrl(canvas.toDataURL("image/png"));
      } catch {
        setError("Не удалось создать QR-код. Проверьте введённые данные.");
        setDataUrl("");
      }
    };

    const timer = setTimeout(generate, 200);
    return () => clearTimeout(timer);
  }, [qrText, fgColor, bgColor, qrSize, errorLevel, hasInput]);

  const downloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  const downloadSvg = async () => {
    if (!hasInput) return;
    try {
      const svg = await QRCode.toString(qrText, {
        type: "svg",
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel,
      });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.svg";
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ }
  };

  const modes: { key: QrMode; label: string; icon: string }[] = [
    { key: "text", label: "Текст", icon: "📝" },
    { key: "url", label: "Ссылка", icon: "🔗" },
    { key: "wifi", label: "Wi-Fi", icon: "📶" },
    { key: "email", label: "Email", icon: "✉️" },
    { key: "phone", label: "Телефон", icon: "📞" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
        Генератор настоящих QR-кодов. Введите текст, ссылку, данные Wi-Fi или контакт — QR-код создаётся мгновенно. Скачайте в PNG или SVG.
      </p>

      {/* Mode selector */}
      <div className="result-card">
        <span className="section-label">Тип QR-кода</span>
        <div className="flex flex-wrap gap-2">
          {modes.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setMode(key); setValue(""); setWifiSSID(""); setWifiPass(""); }}
              className={`chip ${mode === key ? "chip-active" : ""}`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Input based on mode */}
      <div className="result-card">
        <span className="section-label">Данные</span>

        {mode === "wifi" ? (
          <div className="space-y-4">
            <div>
              <label className="field-label">Название сети (SSID)</label>
              <input
                type="text"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
                placeholder="My_WiFi_Network"
                className="input-base"
              />
            </div>
            <div>
              <label className="field-label">Пароль</label>
              <input
                type="text"
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                placeholder="password123"
                className="input-base"
              />
            </div>
            <div>
              <label className="field-label">Шифрование</label>
              <div className="flex gap-2">
                {(["WPA", "WEP", "nopass"] as const).map((wt) => (
                  <button
                    key={wt}
                    type="button"
                    onClick={() => setWifiType(wt)}
                    className={`chip ${wifiType === wt ? "chip-active" : ""}`}
                  >
                    {wt === "nopass" ? "Без пароля" : wt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="field-label">
              {mode === "url" ? "URL (ссылка)" :
               mode === "email" ? "Email адрес" :
               mode === "phone" ? "Номер телефона" : "Текст"}
            </label>
            {mode === "text" ? (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Введите текст для QR-кода..."
                className="input-base min-h-[100px] resize-y"
                rows={3}
              />
            ) : (
              <input
                type={mode === "email" ? "email" : mode === "phone" ? "tel" : "url"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={
                  mode === "url" ? "https://example.com" :
                  mode === "email" ? "user@example.com" :
                  "+7 (999) 123-45-67"
                }
                className="input-base"
              />
            )}
          </div>
        )}
      </div>

      {/* Customization */}
      <div className="result-card">
        <span className="section-label">Настройки</span>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="field-label">Размер</label>
            <select
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
              className="input-base"
            >
              <option value={128}>128×128</option>
              <option value={256}>256×256</option>
              <option value={512}>512×512</option>
              <option value={1024}>1024×1024</option>
            </select>
          </div>
          <div>
            <label className="field-label">Коррекция ошибок</label>
            <select
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value as "L" | "M" | "Q" | "H")}
              className="input-base"
            >
              <option value="L">L — 7%</option>
              <option value="M">M — 15%</option>
              <option value="Q">Q — 25%</option>
              <option value="H">H — 30%</option>
            </select>
          </div>
          <div>
            <label className="field-label">Цвет QR</label>
            <div className="flex items-center gap-2">
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border border-[var(--border)]" />
              <span className="text-sm font-mono text-[var(--muted)]">{fgColor}</span>
            </div>
          </div>
          <div>
            <label className="field-label">Фон</label>
            <div className="flex items-center gap-2">
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border border-[var(--border)]" />
              <span className="text-sm font-mono text-[var(--muted)]">{bgColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Preview */}
      <canvas ref={canvasRef} className="hidden" />

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {dataUrl && hasInput ? (
        <div className="result-card flex flex-col items-center gap-4">
          <div className="rounded-xl border-2 border-[var(--border)] p-4" style={{ backgroundColor: bgColor }}>
            <img src={dataUrl} alt="QR Code" width={qrSize > 400 ? 300 : qrSize} height={qrSize > 400 ? 300 : qrSize} className="mx-auto" />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={downloadPng} className="btn-primary">
              Скачать PNG
            </button>
            <button onClick={downloadSvg} className="btn-secondary">
              Скачать SVG
            </button>
            <CopyButton text={qrText} label="Копировать данные" />
          </div>
          <p className="text-xs text-[var(--muted)] text-center">
            Данные: <code className="font-mono bg-[var(--accent-soft)] px-1.5 py-0.5 rounded">{qrText.slice(0, 80)}{qrText.length > 80 ? "..." : ""}</code>
          </p>
        </div>
      ) : !error && (
        <div className="empty-state">
          {mode === "wifi"
            ? "Введите название Wi-Fi сети — QR-код сгенерируется автоматически"
            : "Введите данные — QR-код появится мгновенно"}
        </div>
      )}
    </div>
  );
}
