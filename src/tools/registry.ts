/**
 * Tool Component Registry
 * Extracted from app/tools/[slug]/ToolPage.tsx
 * Single source of truth for all dynamic tool imports
 * Improves maintainability and reduces code duplication
 */

'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const ToolLoader = () =>
  React.createElement(
    'div',
    { style: { display: 'flex', justifyContent: 'center', padding: '2rem' } },
    'Loading...'
  );

const dyn = (fn: () => Promise<{ default: React.ComponentType }>) =>
  dynamic(fn, { loading: ToolLoader });

// ============================================================================
// Tool Component Dynamic Imports (163 tools)
// ============================================================================

export const toolComponents: Record<string, React.ComponentType> = {
  'age-calculator': dyn(() => import('@/src/tools/AgeCalculator')),
  'angle-converter': dyn(() => import('@/src/tools/AngleConverter')),
  'area-converter': dyn(() => import('@/src/tools/AreaConverter')),
  'avatar-generator': dyn(() => import('@/src/tools/AvatarGenerator')),
  'barcode-gen': dyn(() => import('@/src/tools/BarcodeGen')),
  'base64-encoder': dyn(() => import('@/src/tools/Base64Encoder')),
  'binary-text': dyn(() => import('@/src/tools/BinaryText')),
  'bmi-calc': dyn(() => import('@/src/tools/BmiCalculator')),
  'body-fat': dyn(() => import('@/src/tools/BodyFat')),
  'budget-planner': dyn(() => import('@/src/tools/BudgetPlanner')),
  'calendar': dyn(() => import('@/src/tools/Calendar')),
  'calorie-calc': dyn(() => import('@/src/tools/CalorieCalc')),
  'case-converter': dyn(() => import('@/src/tools/CaseConverter')),
  'checksum-calc': dyn(() => import('@/src/tools/ChecksumCalc')),
  'clothing-size': dyn(() => import('@/src/tools/ClothingSize')),
  'coin-flip': dyn(() => import('@/src/tools/CoinFlip')),
  'color-blender': dyn(() => import('@/src/tools/ColorBlender')),
  'color-converter': dyn(() => import('@/src/tools/ColorConverter')),
  'palette-generator': dyn(() => import('@/src/tools/ColorPalette')),
  'color-picker': dyn(() => import('@/src/tools/ColorPicker')),
  'color-wheel': dyn(() => import('@/src/tools/ColorWheel')),
  'compound-interest': dyn(() => import('@/src/tools/CompoundInterest')),
  'contrast-checker': dyn(() => import('@/src/tools/ContrastChecker')),
  'cooking-converter': dyn(() => import('@/src/tools/CookingConverter')),
  'coordinate-converter': dyn(() => import('@/src/tools/CoordinateConverter')),
  'countdown': dyn(() => import('@/src/tools/Countdown')),
  'cron-generator': dyn(() => import('@/src/tools/CronGenerator')),
  'css-minifier': dyn(() => import('@/src/tools/CssMinifier')),
  'data-converter': dyn(() => import('@/src/tools/DataConverter')),
  'date-difference': dyn(() => import('@/src/tools/DateDifference')),
  'decision-maker': dyn(() => import('@/src/tools/DecisionMaker')),
  'deposit-calc': dyn(() => import('@/src/tools/DepositCalc')),
  'dice-roller': dyn(() => import('@/src/tools/DiceRoller')),
  'diff-checker': dyn(() => import('@/src/tools/DiffChecker')),
  'discount-calc': dyn(() => import('@/src/tools/DiscountCalc')),
  'email-validator': dyn(() => import('@/src/tools/EmailValidator')),
  'energy-converter': dyn(() => import('@/src/tools/EnergyConverter')),
  'equation-solver': dyn(() => import('@/src/tools/EquationSolver')),
  'factorial-calc': dyn(() => import('@/src/tools/FactorialCalc')),
  'favicon-generator': dyn(() => import('@/src/tools/FaviconGenerator')),
  'flexbox-playground': dyn(() => import('@/src/tools/FlexboxPlayground')),
  'fraction-calc': dyn(() => import('@/src/tools/FractionCalc')),
  'fuel-converter': dyn(() => import('@/src/tools/FuelConverter')),
  'gcd-lcm': dyn(() => import('@/src/tools/GcdLcm')),
  'github-readme': dyn(() => import('@/src/tools/GithubReadme')),
  'gradient-generator': dyn(() => import('@/src/tools/GradientGenerator')),
  'graph-plotter': dyn(() => import('@/src/tools/GraphPlotter')),
  'grid-playground': dyn(() => import('@/src/tools/GridPlayground')),
  'hash-generator': dyn(() => import('@/src/tools/HashGenerator')),
  'heading-checker': dyn(() => import('@/src/tools/HeadingChecker')),
  'heart-rate-zone': dyn(() => import('@/src/tools/HeartRateZone')),
  'html-encoder': dyn(() => import('@/src/tools/HtmlEncoder')),
  'html-formatter': dyn(() => import('@/src/tools/HtmlFormatter')),
  'http-status': dyn(() => import('@/src/tools/HttpStatus')),
  'ideal-weight': dyn(() => import('@/src/tools/IdealWeight')),
  'image-colors': dyn(() => import('@/src/tools/ImageColors')),
  'image-compressor': dyn(() => import('@/src/tools/ImageCompressor')),
  'image-crop': dyn(() => import('@/src/tools/ImageCrop')),
  'image-filters': dyn(() => import('@/src/tools/ImageFilters')),
  'image-resizer': dyn(() => import('@/src/tools/ImageResizer')),
  'image-rotate': dyn(() => import('@/src/tools/ImageRotate')),
  'image-to-base64': dyn(() => import('@/src/tools/ImageToBase64')),
  'inflation-calc': dyn(() => import('@/src/tools/InflationCalc')),
  'investment-calc': dyn(() => import('@/src/tools/InvestmentCalc')),
  'ip-calculator': dyn(() => import('@/src/tools/IpCalculator')),
  'ip-validator': dyn(() => import('@/src/tools/IpValidator')),
  'js-beautifier': dyn(() => import('@/src/tools/JsBeautifier')),
  'json-data-gen': dyn(() => import('@/src/tools/JsonDataGen')),
  'json-formatter': dyn(() => import('@/src/tools/JsonFormatter')),
  'jwt-decoder': dyn(() => import('@/src/tools/JwtDecoder')),
  'keyword-density': dyn(() => import('@/src/tools/KeywordDensity')),
  'length-converter': dyn(() => import('@/src/tools/LengthConverter')),
  'loan-calc': dyn(() => import('@/src/tools/LoanCalc')),
  'lorem-ipsum': dyn(() => import('@/src/tools/LoremGenerator')),
  'mac-lookup': dyn(() => import('@/src/tools/MacLookup')),
  'markdown-preview': dyn(() => import('@/src/tools/MarkdownPreview')),
  'material-colors': dyn(() => import('@/src/tools/MaterialColors')),
  'matrix-calc': dyn(() => import('@/src/tools/MatrixCalc')),
  'meme-generator': dyn(() => import('@/src/tools/MemeGenerator')),
  'meta-generator': dyn(() => import('@/src/tools/MetaTagGenerator')),
  'metronome': dyn(() => import('@/src/tools/Metronome')),
  'mime-types': dyn(() => import('@/src/tools/MimeTypes')),
  'mockdata-generator': dyn(() => import('@/src/tools/MockdataGenerator')),
  'morse-code': dyn(() => import('@/src/tools/MorseCode')),
  'mortgage-calc': dyn(() => import('@/src/tools/MortgageCalc')),
  'noise-generator': dyn(() => import('@/src/tools/NoiseGenerator')),
  'notes': dyn(() => import('@/src/tools/Notes')),
  'number-system': dyn(() => import('@/src/tools/NumberSystem')),
  'og-preview': dyn(() => import('@/src/tools/OgPreview')),
  'paper-size': dyn(() => import('@/src/tools/PaperSize')),
  'password-generator': dyn(() => import('@/src/tools/PasswordGenerator')),
  'password-strength': dyn(() => import('@/src/tools/PasswordStrength')),
  'percentage-calc': dyn(() => import('@/src/tools/PercentageCalc')),
  'phone-validator': dyn(() => import('@/src/tools/PhoneValidator')),
  'pixel-art': dyn(() => import('@/src/tools/PixelArt')),
  'pomodoro': dyn(() => import('@/src/tools/PomodoroTimer')),
  'port-list': dyn(() => import('@/src/tools/PortList')),
  'power-converter': dyn(() => import('@/src/tools/PowerConverter')),
  'pregnancy-calc': dyn(() => import('@/src/tools/PregnancyCalc')),
  'pressure-converter': dyn(() => import('@/src/tools/PressureConverter')),
  'prime-checker': dyn(() => import('@/src/tools/PrimeChecker')),
  'proportion-calc': dyn(() => import('@/src/tools/ProportionCalc')),
  'qr-code-gen': dyn(() => import('@/src/tools/QrCodeGen')),
  'random-color': dyn(() => import('@/src/tools/RandomColor')),
  'random-name': dyn(() => import('@/src/tools/RandomName')),
  'random-number': dyn(() => import('@/src/tools/RandomNumber')),
  'random-picker': dyn(() => import('@/src/tools/RandomPicker')),
  'reading-time': dyn(() => import('@/src/tools/ReadingTime')),
  'regex-tester': dyn(() => import('@/src/tools/RegexTester')),
  'remove-duplicates': dyn(() => import('@/src/tools/RemoveDuplicates')),
  'retirement-calc': dyn(() => import('@/src/tools/RetirementCalc')),
  'robots-generator': dyn(() => import('@/src/tools/RobotsGenerator')),
  'roman-numerals': dyn(() => import('@/src/tools/RomanNumerals')),
  'salary-calc': dyn(() => import('@/src/tools/SalaryCalc')),
  'scientific-calc': dyn(() => import('@/src/tools/ScientificCalc')),
  'screen-resolution': dyn(() => import('@/src/tools/ScreenResolution')),
  'screenshot-mockup': dyn(() => import('@/src/tools/ScreenshotMockup')),
  'shoe-size': dyn(() => import('@/src/tools/ShoeSize')),
  'sitemap-generator': dyn(() => import('@/src/tools/SitemapGenerator')),
  'sleep-calc': dyn(() => import('@/src/tools/SleepCalc')),
  'slug-generator': dyn(() => import('@/src/tools/SlugGenerator')),
  'speaker-dryer': dyn(() => import('@/src/tools/SpeakerDryer')),
  'speed-converter': dyn(() => import('@/src/tools/SpeedConverter')),
  'sql-formatter': dyn(() => import('@/src/tools/SqlFormatter')),
  'statistics-calc': dyn(() => import('@/src/tools/StatisticsCalc')),
  'string-extractor': dyn(() => import('@/src/tools/StringExtractor')),
  'subnet-calc': dyn(() => import('@/src/tools/SubnetCalc')),
  'svg-editor': dyn(() => import('@/src/tools/SvgEditor')),
  'tailwind-colors': dyn(() => import('@/src/tools/TailwindColors')),
  'tax-calc': dyn(() => import('@/src/tools/TaxCalc')),
  'team-generator': dyn(() => import('@/src/tools/TeamGenerator')),
  'temperature-converter': dyn(() => import('@/src/tools/TemperatureConverter')),
  'text-diff': dyn(() => import('@/src/tools/TextDiff')),
  'text-formatter': dyn(() => import('@/src/tools/TextFormatter')),
  'text-replace': dyn(() => import('@/src/tools/TextReplace')),
  'text-reverse': dyn(() => import('@/src/tools/TextReverse')),
  'text-sort': dyn(() => import('@/src/tools/TextSort')),
  'text-to-speech': dyn(() => import('@/src/tools/TextToSpeech')),
  'timer': dyn(() => import('@/src/tools/Timer')),
  'timezone-converter': dyn(() => import('@/src/tools/TimezoneConverter')),
  'tip-calc': dyn(() => import('@/src/tools/TipCalculator')),
  'todo-list': dyn(() => import('@/src/tools/TodoList')),
  'tone-generator': dyn(() => import('@/src/tools/ToneGenerator')),
  'transliteration': dyn(() => import('@/src/tools/Transliteration')),
  'typing-speed': dyn(() => import('@/src/tools/TypingSpeed')),
  'unicode-lookup': dyn(() => import('@/src/tools/UnicodeLookup')),
  'unix-timestamp': dyn(() => import('@/src/tools/UnixTimestamp')),
  'url-encoder': dyn(() => import('@/src/tools/UrlEncoder')),
  'url-validator': dyn(() => import('@/src/tools/UrlValidator')),
  'user-agent-parser': dyn(() => import('@/src/tools/UserAgentParser')),
  'uuid-generator': dyn(() => import('@/src/tools/UuidGenerator')),
  'video-aspect': dyn(() => import('@/src/tools/VideoAspect')),
  'volume-converter': dyn(() => import('@/src/tools/VolumeConverter')),
  'water-intake': dyn(() => import('@/src/tools/WaterIntake')),
  'week-number': dyn(() => import('@/src/tools/WeekNumber')),
  'weight-converter': dyn(() => import('@/src/tools/WeightConverter')),
  'wheel-spinner': dyn(() => import('@/src/tools/WheelSpinner')),
  'word-counter': dyn(() => import('@/src/tools/WordCounter')),
  'world-clock': dyn(() => import('@/src/tools/WorldClock')),
  'xml-formatter': dyn(() => import('@/src/tools/XmlFormatter')),
  'yaml-json': dyn(() => import('@/src/tools/YamlJson')),
};

/**
 * Get a tool component by slug
 * @param slug The tool slug (e.g., 'password-generator')
 * @returns The lazy-loaded tool component or undefined if not found
 */
export function getToolComponent(slug: string): React.ComponentType | undefined {
  return toolComponents[slug];
}

/**
 * Get all available tool slugs
 * @returns Array of tool slugs
 */
export function getAvailableToolSlugs(): string[] {
  return Object.keys(toolComponents);
}

/**
 * Check if a tool is available
 * @param slug The tool slug
 * @returns true if tool is available, false otherwise
 */
export function isToolAvailable(slug: string): boolean {
  return slug in toolComponents;
}
