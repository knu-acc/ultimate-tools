"use client";

import { RandomNumberTool } from "./RandomNumberTool";
import { WordCounterTool } from "./WordCounterTool";
import { CaseConverterTool } from "./CaseConverterTool";
import { TranslitTool } from "./TranslitTool";
import { FontsSocialTool } from "./FontsSocialTool";
import { SpaceCleanupTool } from "./SpaceCleanupTool";
import { ZalgoTool } from "./ZalgoTool";
import { LoremIpsumTool } from "./LoremIpsumTool";
import { PasswordGeneratorTool } from "./PasswordGeneratorTool";
import { UuidTool } from "./UuidTool";
import { DiceTool } from "./DiceTool";
import { WheelFortuneTool } from "./WheelFortuneTool";
import { ListShufflerTool } from "./ListShufflerTool";
import { PomodoroTool } from "./PomodoroTool";
import { StopwatchTool } from "./StopwatchTool";
import { WorldTimeTool } from "./WorldTimeTool";
import { TimersTool } from "./TimersTool";
import { UnixConverterTool } from "./UnixConverterTool";
import { PercentCalcTool } from "./PercentCalcTool";
import { BmiTool } from "./BmiTool";
import { LoanCalcTool } from "./LoanCalcTool";
import { VatCalcTool } from "./VatCalcTool";
import { NumberSystemsTool } from "./NumberSystemsTool";
import { ColorPickerTool } from "./ColorPickerTool";
import { CssGradientsTool } from "./CssGradientsTool";
import { Base64Tool } from "./Base64Tool";
import { ImageCompressTool } from "./ImageCompressTool";
import { FaviconGenTool } from "./FaviconGenTool";
import { JsonFormatterTool } from "./JsonFormatterTool";
import { JwtDecoderTool } from "./JwtDecoderTool";
import { HtmlEncodeTool } from "./HtmlEncodeTool";
import { UrlEncodeTool } from "./UrlEncodeTool";
import { RegexTesterTool } from "./RegexTesterTool";
import { UtmBuilderTool } from "./UtmBuilderTool";
import { YtTagsTool } from "./YtTagsTool";
import { CharLimitsTool } from "./CharLimitsTool";
import { WaLinkGeneratorTool } from "./WaLinkGeneratorTool";
import { WeightConverterTool } from "./WeightConverterTool";
import { LengthConverterTool } from "./LengthConverterTool";
import { CurrencyConverterTool } from "./CurrencyConverterTool";
import { RomanNumeralsTool } from "./RomanNumeralsTool";
import { Md5Tool } from "./Md5Tool";
import { Sha256Tool } from "./Sha256Tool";
import { AesEncryptTool } from "./AesEncryptTool";
import { MorseCodeTool } from "./MorseCodeTool";
import { CpsTestTool } from "./CpsTestTool";
import { MetronomeTool } from "./MetronomeTool";
import { NotepadTool } from "./NotepadTool";
import { ReverseTextTool } from "./ReverseTextTool";
import { RandomPickerTool } from "./RandomPickerTool";
import { CountdownTool } from "./CountdownTool";
import { TipCalculatorTool } from "./TipCalculatorTool";
import { QrGeneratorTool } from "./QrGeneratorTool";
import { DiffCheckerTool } from "./DiffCheckerTool";
import { VolumeConverterTool } from "./VolumeConverterTool";
const TOOL_COMPONENTS: Record<string, React.ComponentType<{ t: (k: string) => string }>> = {
  "random-number": RandomNumberTool,
  "word-counter": WordCounterTool,
  "case-converter": CaseConverterTool,
  translit: TranslitTool,
  "fonts-social": FontsSocialTool,
  "space-cleanup": SpaceCleanupTool,
  zalgo: ZalgoTool,
  "lorem-ipsum": LoremIpsumTool,
  "reverse-text": ReverseTextTool,
  "password-generator": PasswordGeneratorTool,
  "random-picker": RandomPickerTool,
  uuid: UuidTool,
  dice: DiceTool,
  "wheel-fortune": WheelFortuneTool,
  "list-shuffler": ListShufflerTool,
  pomodoro: PomodoroTool,
  stopwatch: StopwatchTool,
  countdown: CountdownTool,
  "world-time": WorldTimeTool,
  timers: TimersTool,
  "unix-converter": UnixConverterTool,
  "percent-calc": PercentCalcTool,
  bmi: BmiTool,
  "loan-calc": LoanCalcTool,
  "vat-calc": VatCalcTool,
  "tip-calculator": TipCalculatorTool,
  "number-systems": NumberSystemsTool,
  "color-picker": ColorPickerTool,
  "css-gradients": CssGradientsTool,
  base64: Base64Tool,
  "qr-generator": QrGeneratorTool,
  "image-compress": ImageCompressTool,
  "favicon-gen": FaviconGenTool,
  "json-formatter": JsonFormatterTool,
  "jwt-decoder": JwtDecoderTool,
  "diff-checker": DiffCheckerTool,
  "html-encode": HtmlEncodeTool,
  "url-encode": UrlEncodeTool,
  "regex-tester": RegexTesterTool,
  "utm-builder": UtmBuilderTool,
  "yt-tags": YtTagsTool,
  "char-limits": CharLimitsTool,
  "wa-link-generator": WaLinkGeneratorTool,
  "weight-converter": WeightConverterTool,
  "length-converter": LengthConverterTool,
  "volume-converter": VolumeConverterTool,
  "currency-converter": CurrencyConverterTool,
  "roman-numerals": RomanNumeralsTool,
  md5: Md5Tool,
  sha256: Sha256Tool,
  "aes-encrypt": AesEncryptTool,
  "morse-code": MorseCodeTool,
  "cps-test": CpsTestTool,
  metronome: MetronomeTool,
  notepad: NotepadTool,
};

interface ToolRendererProps {
  toolName: string;
  translations: Record<string, string>;
  toolKey: string;
}

export function ToolRenderer({ toolName, translations, toolKey }: ToolRendererProps) {
  const Component = TOOL_COMPONENTS[toolName];
  const t = (k: string) => translations[`${toolKey}.${k}`] ?? k;
  if (!Component) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--accent-muted)] p-6 text-[var(--muted)]">
        Инструмент в разработке. Tool: {toolName}
      </div>
    );
  }
  return <Component t={t} />;
}
