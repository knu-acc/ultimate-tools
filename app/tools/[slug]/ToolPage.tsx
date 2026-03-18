'use client';

import React, { useEffect, useMemo } from 'react';
import {
  Container, Typography, Box, Grid, Breadcrumbs, Paper, Chip, alpha, useTheme, Button,
  Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress,
} from '@mui/material';
import { accordionClasses } from '@mui/material/Accordion';
import { Home, NavigateNext, Construction, ExpandMore, CheckCircleOutline } from '@mui/icons-material';
import DynamicIcon from '@/src/components/DynamicIcon';
import Link from 'next/link';
import { getToolBySlug, getToolsByGroup, toolGroups, Tool } from '@/src/data/tools';
import ToolCard from '@/src/components/ToolCard';
import { useRecentTools } from '@/src/hooks/useRecentTools';
import { useLanguage } from '@/src/i18n/LanguageContext';

import dynamic from 'next/dynamic';

// One-line loading spinner shared by all lazy tool chunks
const ToolLoader = () => <CircularProgress size={32} sx={{ display: 'block', mx: 'auto', mt: 8 }} />;
const dyn = (fn: () => Promise<{ default: React.ComponentType }>) => dynamic(fn, { loading: ToolLoader });

// Lazy-loaded tool components — only the active tool's JS is fetched per visit
const PasswordGeneratorTool = dyn(() => import('@/src/tools/PasswordGenerator'));
const JsonFormatterTool = dyn(() => import('@/src/tools/JsonFormatter'));
const WordCounterTool = dyn(() => import('@/src/tools/WordCounter'));
const CaseConverterTool = dyn(() => import('@/src/tools/CaseConverter'));
const Base64EncoderTool = dyn(() => import('@/src/tools/Base64Encoder'));
const ColorConverterTool = dyn(() => import('@/src/tools/ColorConverter'));
const UuidGeneratorTool = dyn(() => import('@/src/tools/UuidGenerator'));
const PercentageCalcTool = dyn(() => import('@/src/tools/PercentageCalc'));
const DateDifferenceTool = dyn(() => import('@/src/tools/DateDifference'));
const RegexTesterTool = dyn(() => import('@/src/tools/RegexTester'));
const PasswordStrengthTool = dyn(() => import('@/src/tools/PasswordStrength'));
const NumberSystemTool = dyn(() => import('@/src/tools/NumberSystem'));
const TimerTool = dyn(() => import('@/src/tools/Timer'));
const ScientificCalcTool = dyn(() => import('@/src/tools/ScientificCalc'));
const ImageCompressorTool = dyn(() => import('@/src/tools/ImageCompressor'));
const TemperatureConverterTool = dyn(() => import('@/src/tools/TemperatureConverter'));
const LengthConverterTool = dyn(() => import('@/src/tools/LengthConverter'));
const WeightConverterTool = dyn(() => import('@/src/tools/WeightConverter'));
const SpeedConverterTool = dyn(() => import('@/src/tools/SpeedConverter'));
const BmiCalculatorTool = dyn(() => import('@/src/tools/BmiCalculator'));
const LoremGeneratorTool = dyn(() => import('@/src/tools/LoremGenerator'));
const MortgageCalcTool = dyn(() => import('@/src/tools/MortgageCalc'));
const TipCalculatorTool = dyn(() => import('@/src/tools/TipCalculator'));
const HashGeneratorTool = dyn(() => import('@/src/tools/HashGenerator'));
const UrlEncoderTool = dyn(() => import('@/src/tools/UrlEncoder'));
const MarkdownPreviewTool = dyn(() => import('@/src/tools/MarkdownPreview'));
const DiscountCalcTool = dyn(() => import('@/src/tools/DiscountCalc'));
const TextDiffTool = dyn(() => import('@/src/tools/TextDiff'));
const RandomNumberTool = dyn(() => import('@/src/tools/RandomNumber'));
const CoinFlipTool = dyn(() => import('@/src/tools/CoinFlip'));
const DiceRollerTool = dyn(() => import('@/src/tools/DiceRoller'));
const ColorPaletteTool = dyn(() => import('@/src/tools/ColorPalette'));
const GradientGeneratorTool = dyn(() => import('@/src/tools/GradientGenerator'));
const HtmlEncoderTool = dyn(() => import('@/src/tools/HtmlEncoder'));
const JwtDecoderTool = dyn(() => import('@/src/tools/JwtDecoder'));
const MetaTagGeneratorTool = dyn(() => import('@/src/tools/MetaTagGenerator'));
const PomodoroTimerTool = dyn(() => import('@/src/tools/PomodoroTimer'));
const TransliterationTool = dyn(() => import('@/src/tools/Transliteration'));
const RemoveDuplicatesTool = dyn(() => import('@/src/tools/RemoveDuplicates'));
const AgeCalculatorTool = dyn(() => import('@/src/tools/AgeCalculator'));
const UnixTimestampTool = dyn(() => import('@/src/tools/UnixTimestamp'));
const CssMinifierTool = dyn(() => import('@/src/tools/CssMinifier'));
const TextReverseTool = dyn(() => import('@/src/tools/TextReverse'));
const RomanNumeralsTool = dyn(() => import('@/src/tools/RomanNumerals'));
const TextSortTool = dyn(() => import('@/src/tools/TextSort'));
const SlugGeneratorTool = dyn(() => import('@/src/tools/SlugGenerator'));
const CalorieCalcTool = dyn(() => import('@/src/tools/CalorieCalc'));
const MorseCodeTool = dyn(() => import('@/src/tools/MorseCode'));
const TypingSpeedTool = dyn(() => import('@/src/tools/TypingSpeed'));
const ContrastCheckerTool = dyn(() => import('@/src/tools/ContrastChecker'));
const SleepCalcTool = dyn(() => import('@/src/tools/SleepCalc'));
const WaterIntakeTool = dyn(() => import('@/src/tools/WaterIntake'));
const ReadingTimeTool = dyn(() => import('@/src/tools/ReadingTime'));
const NotesTool = dyn(() => import('@/src/tools/Notes'));
const EmailValidatorTool = dyn(() => import('@/src/tools/EmailValidator'));
const PhoneValidatorTool = dyn(() => import('@/src/tools/PhoneValidator'));
const TodoListTool = dyn(() => import('@/src/tools/TodoList'));
const TextToSpeechTool = dyn(() => import('@/src/tools/TextToSpeech'));
const TextReplaceTool = dyn(() => import('@/src/tools/TextReplace'));
const StringExtractorTool = dyn(() => import('@/src/tools/StringExtractor'));
const VolumeConverterTool = dyn(() => import('@/src/tools/VolumeConverter'));
const AreaConverterTool = dyn(() => import('@/src/tools/AreaConverter'));
const DataConverterTool = dyn(() => import('@/src/tools/DataConverter'));
const BinaryTextTool = dyn(() => import('@/src/tools/BinaryText'));
const MetronomeTool = dyn(() => import('@/src/tools/Metronome'));
const ToneGeneratorTool = dyn(() => import('@/src/tools/ToneGenerator'));
const CookingConverterTool = dyn(() => import('@/src/tools/CookingConverter'));
const ShoeSizeTool = dyn(() => import('@/src/tools/ShoeSize'));
const WheelSpinnerTool = dyn(() => import('@/src/tools/WheelSpinner'));
const RandomPickerTool = dyn(() => import('@/src/tools/RandomPicker'));
const PowerConverterTool = dyn(() => import('@/src/tools/PowerConverter'));
const FuelConverterTool = dyn(() => import('@/src/tools/FuelConverter'));
const SalaryCalcTool = dyn(() => import('@/src/tools/SalaryCalc'));
const FaviconGeneratorTool = dyn(() => import('@/src/tools/FaviconGenerator'));
const HttpStatusTool = dyn(() => import('@/src/tools/HttpStatus'));
const DecisionMakerTool = dyn(() => import('@/src/tools/DecisionMaker'));
const CountdownTool = dyn(() => import('@/src/tools/Countdown'));
const EnergyConverterTool = dyn(() => import('@/src/tools/EnergyConverter'));
const PressureConverterTool = dyn(() => import('@/src/tools/PressureConverter'));
const AngleConverterTool = dyn(() => import('@/src/tools/AngleConverter'));
const LoanCalcTool = dyn(() => import('@/src/tools/LoanCalc'));
const TaxCalcTool = dyn(() => import('@/src/tools/TaxCalc'));
const CompoundInterestTool = dyn(() => import('@/src/tools/CompoundInterest'));
const ImageResizerTool = dyn(() => import('@/src/tools/ImageResizer'));
const ImageCropTool = dyn(() => import('@/src/tools/ImageCrop'));
const ImageRotateTool = dyn(() => import('@/src/tools/ImageRotate'));
const JsBeautifierTool = dyn(() => import('@/src/tools/JsBeautifier'));
const HtmlFormatterTool = dyn(() => import('@/src/tools/HtmlFormatter'));
const CronGeneratorTool = dyn(() => import('@/src/tools/CronGenerator'));
const EquationSolverTool = dyn(() => import('@/src/tools/EquationSolver'));
const StatisticsCalcTool = dyn(() => import('@/src/tools/StatisticsCalc'));
const GcdLcmTool = dyn(() => import('@/src/tools/GcdLcm'));
const IdealWeightTool = dyn(() => import('@/src/tools/IdealWeight'));
const SqlFormatterTool = dyn(() => import('@/src/tools/SqlFormatter'));
const RandomColorTool = dyn(() => import('@/src/tools/RandomColor'));
const UrlValidatorTool = dyn(() => import('@/src/tools/UrlValidator'));
const ColorWheelTool = dyn(() => import('@/src/tools/ColorWheel'));
const HeartRateZoneTool = dyn(() => import('@/src/tools/HeartRateZone'));
const BodyFatTool = dyn(() => import('@/src/tools/BodyFat'));
const PregnancyCalcTool = dyn(() => import('@/src/tools/PregnancyCalc'));
const BudgetPlannerTool = dyn(() => import('@/src/tools/BudgetPlanner'));
const InvestmentCalcTool = dyn(() => import('@/src/tools/InvestmentCalc'));
const YamlJsonTool = dyn(() => import('@/src/tools/YamlJson'));
const XmlFormatterTool = dyn(() => import('@/src/tools/XmlFormatter'));
const DiffCheckerTool = dyn(() => import('@/src/tools/DiffChecker'));
const FlexboxPlaygroundTool = dyn(() => import('@/src/tools/FlexboxPlayground'));
const GridPlaygroundTool = dyn(() => import('@/src/tools/GridPlayground'));
const MatrixCalcTool = dyn(() => import('@/src/tools/MatrixCalc'));
const FactorialCalcTool = dyn(() => import('@/src/tools/FactorialCalc'));
const FractionCalcTool = dyn(() => import('@/src/tools/FractionCalc'));
const PrimeCheckerTool = dyn(() => import('@/src/tools/PrimeChecker'));
const ProportionCalcTool = dyn(() => import('@/src/tools/ProportionCalc'));
const ColorBlenderTool = dyn(() => import('@/src/tools/ColorBlender'));
const OgPreviewTool = dyn(() => import('@/src/tools/OgPreview'));
const RobotsGeneratorTool = dyn(() => import('@/src/tools/RobotsGenerator'));
const SitemapGeneratorTool = dyn(() => import('@/src/tools/SitemapGenerator'));
const KeywordDensityTool = dyn(() => import('@/src/tools/KeywordDensity'));
const IpCalculatorTool = dyn(() => import('@/src/tools/IpCalculator'));
const SubnetCalcTool = dyn(() => import('@/src/tools/SubnetCalc'));
const PortListTool = dyn(() => import('@/src/tools/PortList'));
const UserAgentParserTool = dyn(() => import('@/src/tools/UserAgentParser'));
const ClothingSizeTool = dyn(() => import('@/src/tools/ClothingSize'));
const TeamGeneratorTool = dyn(() => import('@/src/tools/TeamGenerator'));
const RandomNameTool = dyn(() => import('@/src/tools/RandomName'));
const AvatarGeneratorTool = dyn(() => import('@/src/tools/AvatarGenerator'));
const UnicodeLookupTool = dyn(() => import('@/src/tools/UnicodeLookup'));
const BarcodeGenTool = dyn(() => import('@/src/tools/BarcodeGen'));
const ImageFiltersTool = dyn(() => import('@/src/tools/ImageFilters'));
const NoiseGeneratorTool = dyn(() => import('@/src/tools/NoiseGenerator'));
const VideoAspectTool = dyn(() => import('@/src/tools/VideoAspect'));
const ScreenResolutionTool = dyn(() => import('@/src/tools/ScreenResolution'));
const PaperSizeTool = dyn(() => import('@/src/tools/PaperSize'));
const HeadingCheckerTool = dyn(() => import('@/src/tools/HeadingChecker'));
const IpValidatorTool = dyn(() => import('@/src/tools/IpValidator'));
const MimeTypesTool = dyn(() => import('@/src/tools/MimeTypes'));
const CoordinateConverterTool = dyn(() => import('@/src/tools/CoordinateConverter'));
const WorldClockTool = dyn(() => import('@/src/tools/WorldClock'));
const TimezoneConverterTool = dyn(() => import('@/src/tools/TimezoneConverter'));
const CalendarTool = dyn(() => import('@/src/tools/Calendar'));
const WeekNumberTool = dyn(() => import('@/src/tools/WeekNumber'));
const InflationCalcTool = dyn(() => import('@/src/tools/InflationCalc'));
const RetirementCalcTool = dyn(() => import('@/src/tools/RetirementCalc'));
const DepositCalcTool = dyn(() => import('@/src/tools/DepositCalc'));
const JsonDataGenTool = dyn(() => import('@/src/tools/JsonDataGen'));
const ChecksumCalcTool = dyn(() => import('@/src/tools/ChecksumCalc'));
const ImageToBase64Tool = dyn(() => import('@/src/tools/ImageToBase64'));
const PixelArtTool = dyn(() => import('@/src/tools/PixelArt'));
const SvgEditorTool = dyn(() => import('@/src/tools/SvgEditor'));
const ImageColorsTool = dyn(() => import('@/src/tools/ImageColors'));
const ColorPickerTool = dyn(() => import('@/src/tools/ColorPicker'));
const TailwindColorsTool = dyn(() => import('@/src/tools/TailwindColors'));
const MaterialColorsTool = dyn(() => import('@/src/tools/MaterialColors'));
const MacLookupTool = dyn(() => import('@/src/tools/MacLookup'));
const GithubReadmeTool = dyn(() => import('@/src/tools/GithubReadme'));
const GraphPlotterTool = dyn(() => import('@/src/tools/GraphPlotter'));
const MockdataGeneratorTool = dyn(() => import('@/src/tools/MockdataGenerator'));
const BgRemoverTool = dyn(() => import('@/src/tools/BgRemover'));
const MemeGeneratorTool = dyn(() => import('@/src/tools/MemeGenerator'));
const ScreenshotMockupTool = dyn(() => import('@/src/tools/ScreenshotMockup'));
const QrCodeGenTool = dyn(() => import('@/src/tools/QrCodeGen'));
const TextFormatterTool = dyn(() => import('@/src/tools/TextFormatter'));
const SpeakerDryerTool = dyn(() => import('@/src/tools/SpeakerDryer'));

const toolComponents: Record<string, React.ComponentType> = {
  'password-generator': PasswordGeneratorTool,
  'json-formatter': JsonFormatterTool,
  'word-counter': WordCounterTool,
  'case-converter': CaseConverterTool,
  'base64-encoder': Base64EncoderTool,
  'color-converter': ColorConverterTool,
  'uuid-generator': UuidGeneratorTool,
  'percentage-calc': PercentageCalcTool,
  'date-difference': DateDifferenceTool,
  'regex-tester': RegexTesterTool,
  'password-strength': PasswordStrengthTool,
  'number-system': NumberSystemTool,
  'timer': TimerTool,
  'scientific-calc': ScientificCalcTool,
  'image-compressor': ImageCompressorTool,
  'temperature-converter': TemperatureConverterTool,
  'length-converter': LengthConverterTool,
  'weight-converter': WeightConverterTool,
  'speed-converter': SpeedConverterTool,
  'bmi-calc': BmiCalculatorTool,
  'lorem-ipsum': LoremGeneratorTool,
  'mortgage-calc': MortgageCalcTool,
  'tip-calc': TipCalculatorTool,
  'hash-generator': HashGeneratorTool,
  'url-encoder': UrlEncoderTool,
  'markdown-preview': MarkdownPreviewTool,
  'discount-calc': DiscountCalcTool,
  'text-diff': TextDiffTool,
  'random-number': RandomNumberTool,
  'coin-flip': CoinFlipTool,
  'dice-roller': DiceRollerTool,
  'palette-generator': ColorPaletteTool,
  'gradient-generator': GradientGeneratorTool,
  'html-encoder': HtmlEncoderTool,
  'jwt-decoder': JwtDecoderTool,
  'meta-generator': MetaTagGeneratorTool,
  'pomodoro': PomodoroTimerTool,
  'transliteration': TransliterationTool,
  'remove-duplicates': RemoveDuplicatesTool,
  'age-calculator': AgeCalculatorTool,
  'unix-timestamp': UnixTimestampTool,
  'css-minifier': CssMinifierTool,
  'text-reverse': TextReverseTool,
  'roman-numerals': RomanNumeralsTool,
  'text-sort': TextSortTool,
  'slug-generator': SlugGeneratorTool,
  'calorie-calc': CalorieCalcTool,
  'morse-code': MorseCodeTool,
  'typing-speed': TypingSpeedTool,
  'contrast-checker': ContrastCheckerTool,
  'sleep-calc': SleepCalcTool,
  'water-intake': WaterIntakeTool,
  'reading-time': ReadingTimeTool,
  'notes': NotesTool,
  'email-validator': EmailValidatorTool,
  'phone-validator': PhoneValidatorTool,
  'todo-list': TodoListTool,
  'text-to-speech': TextToSpeechTool,
  'text-replace': TextReplaceTool,
  'string-extractor': StringExtractorTool,
  'volume-converter': VolumeConverterTool,
  'area-converter': AreaConverterTool,
  'data-converter': DataConverterTool,
  'binary-text': BinaryTextTool,
  'metronome': MetronomeTool,
  'tone-generator': ToneGeneratorTool,
  'speaker-dryer': SpeakerDryerTool,
  'cooking-converter': CookingConverterTool,
  'shoe-size': ShoeSizeTool,
  'wheel-spinner': WheelSpinnerTool,
  'random-picker': RandomPickerTool,
  'power-converter': PowerConverterTool,
  'fuel-converter': FuelConverterTool,
  'salary-calc': SalaryCalcTool,
  'favicon-generator': FaviconGeneratorTool,
  'http-status': HttpStatusTool,
  'decision-maker': DecisionMakerTool,
  'countdown': CountdownTool,
  'energy-converter': EnergyConverterTool,
  'pressure-converter': PressureConverterTool,
  'angle-converter': AngleConverterTool,
  'loan-calc': LoanCalcTool,
  'tax-calc': TaxCalcTool,
  'compound-interest': CompoundInterestTool,
  'image-resizer': ImageResizerTool,
  'image-crop': ImageCropTool,
  'image-rotate': ImageRotateTool,
  'js-beautifier': JsBeautifierTool,
  'html-formatter': HtmlFormatterTool,
  'cron-generator': CronGeneratorTool,
  'equation-solver': EquationSolverTool,
  'statistics-calc': StatisticsCalcTool,
  'gcd-lcm': GcdLcmTool,
  'ideal-weight': IdealWeightTool,
  'sql-formatter': SqlFormatterTool,
  'random-color': RandomColorTool,
  'url-validator': UrlValidatorTool,
  'color-wheel': ColorWheelTool,
  'heart-rate-zone': HeartRateZoneTool,
  'body-fat': BodyFatTool,
  'pregnancy-calc': PregnancyCalcTool,
  'budget-planner': BudgetPlannerTool,
  'investment-calc': InvestmentCalcTool,
  'yaml-json': YamlJsonTool,
  'xml-formatter': XmlFormatterTool,
  'diff-checker': DiffCheckerTool,
  'flexbox-playground': FlexboxPlaygroundTool,
  'grid-playground': GridPlaygroundTool,
  'matrix-calc': MatrixCalcTool,
  'factorial-calc': FactorialCalcTool,
  'fraction-calc': FractionCalcTool,
  'prime-checker': PrimeCheckerTool,
  'proportion-calc': ProportionCalcTool,
  'color-blender': ColorBlenderTool,
  'og-preview': OgPreviewTool,
  'robots-generator': RobotsGeneratorTool,
  'sitemap-generator': SitemapGeneratorTool,
  'keyword-density': KeywordDensityTool,
  'ip-calculator': IpCalculatorTool,
  'subnet-calc': SubnetCalcTool,
  'port-list': PortListTool,
  'user-agent-parser': UserAgentParserTool,
  'clothing-size': ClothingSizeTool,
  'team-generator': TeamGeneratorTool,
  'random-name': RandomNameTool,
  'avatar-generator': AvatarGeneratorTool,
  'unicode-lookup': UnicodeLookupTool,
  'barcode-gen': BarcodeGenTool,
  'image-filters': ImageFiltersTool,
  'noise-generator': NoiseGeneratorTool,
  'video-aspect': VideoAspectTool,
  'screen-resolution': ScreenResolutionTool,
  'paper-size': PaperSizeTool,
  'heading-checker': HeadingCheckerTool,
  'ip-validator': IpValidatorTool,
  'mime-types': MimeTypesTool,
  'coordinate-converter': CoordinateConverterTool,
  'world-clock': WorldClockTool,
  'timezone-converter': TimezoneConverterTool,
  'calendar': CalendarTool,
  'week-number': WeekNumberTool,
  'inflation-calc': InflationCalcTool,
  'retirement-calc': RetirementCalcTool,
  'deposit-calc': DepositCalcTool,
  'json-data-gen': JsonDataGenTool,
  'checksum-calc': ChecksumCalcTool,
  'image-to-base64': ImageToBase64Tool,
  'pixel-art': PixelArtTool,
  'svg-editor': SvgEditorTool,
  'image-colors': ImageColorsTool,
  'color-picker': ColorPickerTool,
  'tailwind-colors': TailwindColorsTool,
  'material-colors': MaterialColorsTool,
  'mac-lookup': MacLookupTool,
  'github-readme': GithubReadmeTool,
  'graph-plotter': GraphPlotterTool,
  'mockdata-generator': MockdataGeneratorTool,
  'bg-remover': BgRemoverTool,
  'meme-generator': MemeGeneratorTool,
  'screenshot-mockup': ScreenshotMockupTool,
  'qr-code-gen': QrCodeGenTool,
  'text-formatter': TextFormatterTool,
};

// ============================================================
// SEO Content Generator — уникальный текст для каждой категории
// ============================================================

interface SeoContent {
  intro: string;
  howTo: string;
  features: string[];
  useCases: string;
  advantages: string;
}

function getToolSeoContent(tool: Tool, groupName: string): SeoContent {
  const name = tool.name;
  const desc = tool.description;
  const keys = tool.keywords.slice(0, 4).join(', ');

  const byGroup: Record<string, SeoContent> = {
    converters: {
      intro: `«${name}» — точный онлайн-конвертер для мгновенного перевода ${desc.toLowerCase()}. Просто введите исходное значение — результат появится в нужных единицах без лишних шагов. Инструмент работает полностью в вашем браузере: данные не передаются ни на какой сервер.`,
      howTo: `Введите значение в поле ввода. Конвертер автоматически рассчитает результат во всех поддерживаемых форматах. Скопируйте нужное значение одним нажатием. Для точных вычислений используйте числа с дробной частью.`,
      features: [
        'Мгновенный результат без задержки',
        `Поддержка ключевых форматов: ${keys}`,
        'Высокая точность до нескольких знаков после запятой',
        'Полная работа в браузере — без передачи данных',
        'Удобный интерфейс Material Design 3',
        'Бесплатно и без регистрации',
      ],
      useCases: `«${name}» незаменим для студентов, инженеров, программистов и всех, кто работает с международными данными. Особенно удобен при работе с документами, рецептами, технической документацией и в путешествиях, где единицы измерения отличаются от привычных.`,
      advantages: `В отличие от громоздких программ и приложений, ${name} работает прямо в браузере. Не нужно ничего скачивать, устанавливать или регистрироваться — просто откройте страницу и пользуйтесь. Данные обрабатываются локально: никакой утечки информации.`,
    },
    calculators: {
      intro: `«${name}» — удобный онлайн-калькулятор для точного расчёта ${desc.toLowerCase()}. Введите исходные данные и мгновенно получите результат. Подходит для быстрых вычислений в работе, учёбе и повседневной жизни без необходимости устанавливать дополнительные программы.`,
      howTo: `Заполните поля ввода нужными значениями. Калькулятор автоматически произведёт расчёт и покажет результат. При необходимости можно изменить параметры и пересчитать. Все вычисления выполняются мгновенно прямо в браузере.`,
      features: [
        'Мгновенные точные вычисления',
        `Расчёт по параметрам: ${keys}`,
        'Понятный интерфейс без лишних настроек',
        'Работает офлайн после первой загрузки страницы',
        'Без рекламы и регистрации',
        'Подходит для мобильных устройств',
      ],
      useCases: `«${name}» пригодится школьникам и студентам при решении задач, специалистам при работе, а также в повседневной жизни. Инструмент доступен 24/7 с любого устройства с браузером — компьютера, телефона или планшета.`,
      advantages: `Онлайн-калькулятор «${name}» даёт точный результат без установки программ и регистрации. Ваши данные остаются только у вас — ничего не отправляется на сервер. Работает даже без стабильного интернета после первой загрузки.`,
    },
    text: {
      intro: `«${name}» — удобный онлайн-инструмент для работы с текстом. ${desc}. Вставьте текст в поле — инструмент мгновенно выполнит нужную операцию. Подходит для копирайтеров, редакторов, разработчиков и всех, кто часто работает с текстовыми данными.`,
      howTo: `Вставьте или введите текст в поле ввода. Нажмите кнопку обработки или настройте параметры — результат появится сразу. Готовый текст можно скопировать одним нажатием. Инструмент обрабатывает тексты любого объёма прямо в браузере.`,
      features: [
        'Мгновенная обработка текста любого размера',
        `Работа с ${keys}`,
        'Копирование результата одним кликом',
        'Данные не покидают ваш браузер',
        'Поддержка кириллицы и латиницы',
        'Бесплатно и без регистрации',
      ],
      useCases: `«${name}» незаменим для SEO-специалистов, копирайтеров, редакторов, программистов и студентов. Экономит время при рутинных операциях с текстом, которые сложно делать вручную.`,
      advantages: `Онлайн-инструмент «${name}» не требует установки и работает в любом браузере. Ваши тексты обрабатываются локально — конфиденциальность гарантирована. Бесплатный и доступный 24/7.`,
    },
    generators: {
      intro: `«${name}» — надёжный онлайн-генератор для создания ${desc.toLowerCase()}. Настройте параметры под свои задачи и нажмите кнопку генерации — результат будет готов мгновенно. Инструмент работает полностью в браузере, без регистрации и без ограничений.`,
      howTo: `Укажите нужные параметры генерации (длину, количество, тип и т.д.). Нажмите кнопку «Сгенерировать» — результат появится сразу. Можно сгенерировать несколько вариантов и выбрать подходящий. Скопируйте результат одним кликом.`,
      features: [
        'Мгновенная генерация без ожидания',
        `Настройка параметров: ${keys}`,
        'Генерация нескольких вариантов за раз',
        'Копирование одним нажатием',
        'Безопасная обработка в браузере',
        'Бесплатно, без лимитов',
      ],
      useCases: `«${name}» необходим разработчикам, дизайнерам, тестировщикам и всем, кто регулярно генерирует данные. Экономит время на рутинных задачах и снижает риск человеческих ошибок при создании данных вручную.`,
      advantages: `Генератор «${name}» доступен онлайн без скачивания и установки. Данные генерируются локально в браузере — никакой утечки. Бесплатен без ограничений на количество операций.`,
    },
    developers: {
      intro: `«${name}» — профессиональный онлайн-инструмент для разработчиков. ${desc}. Работает прямо в браузере без установки расширений. Повышает продуктивность при работе с кодом и техническими данными.`,
      howTo: `Вставьте код или данные в поле ввода. Инструмент автоматически обработает их и выдаст результат. Используйте кнопки копирования для быстрого переноса в ваш редактор. Поддерживается обработка больших объёмов данных.`,
      features: [
        'Быстрая обработка кода и данных',
        `Поддержка форматов: ${keys}`,
        'Подсветка синтаксиса и валидация',
        'Работает без расширений браузера',
        'Копирование результата одним кликом',
        'Бесплатный инструмент для разработчиков',
      ],
      useCases: `«${name}» ежедневно используют фронтенд и бэкенд разработчики, DevOps-инженеры и тестировщики. Особенно полезен при отладке, разработке API, работе с конфигурационными файлами и оптимизации кода.`,
      advantages: `В отличие от IDE-плагинов, «${name}» работает в браузере на любом компьютере без настройки окружения. Идеален для быстрых задач прямо в процессе работы. Данные не покидают браузер — безопасно для работы с чувствительными данными.`,
    },
    images: {
      intro: `«${name}» — удобный онлайн-редактор для работы с изображениями. ${desc}. Загрузите фото — обработка произойдёт прямо в браузере за секунды. Никаких установок и регистраций — только результат.`,
      howTo: `Загрузите изображение через кнопку или перетащите файл в область загрузки. Настройте параметры обработки. Нажмите кнопку обработки и скачайте результат. Инструмент поддерживает популярные форматы изображений.`,
      features: [
        'Обработка изображений прямо в браузере',
        'Поддержка JPEG, PNG, WebP, GIF',
        `Операции: ${keys}`,
        'Загрузка результата в несколько кликов',
        'Изображения не передаются на сервер',
        'Бесплатно без лимитов',
      ],
      useCases: `«${name}» используют дизайнеры, блогеры, SMM-специалисты и все, кто работает с визуальным контентом. Незаменим для быстрой обработки фотографий без Photoshop и других тяжёлых редакторов.`,
      advantages: `Онлайн-инструмент «${name}» не требует установки Photoshop или других дорогих программ. Работает в браузере на любом устройстве. Ваши изображения обрабатываются локально — никакой утечки личных фото.`,
    },
    security: {
      intro: `«${name}» — надёжный онлайн-инструмент для работы с данными и безопасностью. ${desc}. Все операции выполняются в вашем браузере — данные никогда не покидают ваше устройство. Бесплатно и без регистрации.`,
      howTo: `Введите данные в поле инструмента. Нажмите кнопку обработки — результат появится мгновенно. Для безопасности не используйте инструмент с реальными производственными паролями или ключами на общедоступных устройствах.`,
      features: [
        'Обработка данных только в браузере',
        'Без передачи данных на сервер',
        `Поддержка: ${keys}`,
        'Соответствие современным стандартам безопасности',
        'Подходит для чувствительных данных',
        'Бесплатно без ограничений',
      ],
      useCases: `«${name}» используют разработчики, администраторы безопасности, IT-специалисты и обычные пользователи, которым важна безопасность своих данных. Инструмент подходит для аудита, проверки и генерации защищённых данных.`,
      advantages: `Ключевое преимущество «${name}» — полная конфиденциальность. Все вычисления происходят на стороне клиента. Ни ваши пароли, ни другие чувствительные данные не передаются никому. Открытый браузерный код — максимальная прозрачность.`,
    },
    health: {
      intro: `«${name}» — удобный онлайн-калькулятор для здоровья и фитнеса. ${desc}. Введите свои данные — инструмент выдаст персонализированный результат на основе проверенных формул. Быстро, бесплатно и без регистрации.`,
      howTo: `Введите свои параметры (возраст, вес, рост, активность и т.д.) в соответствующие поля. Нажмите «Рассчитать» — результат появится с пояснениями и рекомендациями. Результаты носят информационный характер.`,
      features: [
        'Расчёт по научно-обоснованным формулам',
        `Учитываемые параметры: ${keys}`,
        'Персонализированные результаты',
        'Понятные пояснения к результатам',
        'Работает в браузере без сбора данных',
        'Бесплатно и без регистрации',
      ],
      useCases: `«${name}» пригодится людям, следящим за своим здоровьем, спортсменам, фитнес-тренерам и тем, кто хочет скорректировать образ жизни. Используйте инструмент как вспомогательный для ориентировочных расчётов.`,
      advantages: `Онлайн-калькулятор «${name}» доступен в любое время и работает без регистрации. Не нужно устанавливать приложения — достаточно браузера. Важно: результаты носят информационный характер и не заменяют консультацию врача.`,
    },
    finance: {
      intro: `«${name}» — бесплатный онлайн-калькулятор для финансовых расчётов. ${desc}. Введите данные — инструмент мгновенно выполнит расчёт по финансовым формулам. Помогает принимать взвешенные финансовые решения.`,
      howTo: `Введите финансовые параметры в соответствующие поля: суммы, ставки, сроки. Нажмите «Рассчитать» — инструмент покажет подробный результат с разбивкой. При необходимости измените параметры для сравнения сценариев.`,
      features: [
        'Точные расчёты по финансовым формулам',
        `Параметры: ${keys}`,
        'Подробная разбивка результата',
        'Сравнение различных сценариев',
        'Данные остаются в браузере',
        'Бесплатно без ограничений',
      ],
      useCases: `«${name}» помогает при планировании крупных покупок, ипотеки, вкладов и инвестиций. Незаменим для сравнения предложений банков и анализа финансовых решений перед их принятием.`,
      advantages: `Онлайн-калькулятор «${name}» даёт ориентировочный расчёт для самостоятельного анализа. Ваши финансовые данные не покидают браузер. Важно: для официальных финансовых решений рекомендуем консультацию финансового специалиста.`,
    },
    math: {
      intro: `«${name}» — мощный онлайн-калькулятор для математических вычислений. ${desc}. Введите данные — инструмент мгновенно выдаст точный ответ с подробным решением. Незаменим для учёбы и работы.`,
      howTo: `Введите числа или математические выражения в поля ввода. Нажмите «Вычислить» или «Решить» — результат появится с пошаговым объяснением при возможности. Поддерживаются числа с плавающей точкой и большие числа.`,
      features: [
        'Точные математические вычисления',
        `Поддержка операций: ${keys}`,
        'Пошаговое решение (где применимо)',
        'Работает с большими числами',
        'Высокая точность вычислений',
        'Бесплатно без ограничений',
      ],
      useCases: `«${name}» используют школьники, студенты, преподаватели, инженеры и научные работники. Помогает при решении задач, проверке вычислений и изучении математики.`,
      advantages: `Онлайн-калькулятор «${name}» доступен без установки и регистрации. Работает в браузере на любом устройстве. Бесплатная альтернатива платным математическим пакетам для повседневных задач.`,
    },
    encoding: {
      intro: `«${name}» — удобный онлайн-инструмент для кодирования и декодирования данных. ${desc}. Вставьте данные — конвертация произойдёт мгновенно в вашем браузере без передачи данных на сервер.`,
      howTo: `Вставьте исходные данные в поле ввода. Выберите направление: кодирование или декодирование. Нажмите кнопку — результат появится сразу. Скопируйте преобразованные данные одним кликом.`,
      features: [
        'Кодирование и декодирование в один клик',
        `Форматы: ${keys}`,
        'Мгновенная обработка без задержки',
        'Данные не передаются на сервер',
        'Поддержка Unicode и кириллицы',
        'Бесплатно и без регистрации',
      ],
      useCases: `«${name}» незаменим для разработчиков при отладке, тестировании API, работе с конфигурационными файлами и передаче данных. Также используется для образовательных целей при изучении форматов кодирования.`,
      advantages: `Инструмент «${name}» обрабатывает данные локально — никакой утечки. Не требует установки и авторизации. Поддерживает большие объёмы данных прямо в браузере.`,
    },
    color: {
      intro: `«${name}» — профессиональный онлайн-инструмент для работы с цветами. ${desc}. Создан для дизайнеров, разработчиков и всех, кто работает с визуальным контентом. Работает в браузере без установки графических редакторов.`,
      howTo: `Выберите или введите цвет с помощью доступных инструментов. Инструмент автоматически покажет связанные значения и варианты. Скопируйте нужный формат одним кликом для использования в дизайне или коде.`,
      features: [
        `Работа с форматами: ${keys}`,
        'Визуальный предпросмотр цветов',
        'Копирование значений одним кликом',
        'Подходит для веб-дизайна и разработки',
        'Работает без Photoshop и других программ',
        'Бесплатно без ограничений',
      ],
      useCases: `«${name}» используют веб-дизайнеры при создании интерфейсов, разработчики при написании CSS, UX-специалисты при подборе цветовых схем и маркетологи при создании брендовых материалов.`,
      advantages: `Онлайн-инструмент «${name}» заменяет дорогостоящие программы для профессиональной работы с цветом. Доступен в любом браузере без регистрации. Результаты можно сразу использовать в CSS, HTML или графических редакторах.`,
    },
    seo: {
      intro: `«${name}» — профессиональный SEO-инструмент для оптимизации сайта. ${desc}. Помогает улучшить видимость в поисковиках Google и Яндекс без специальных знаний. Работает в браузере — никакой установки.`,
      howTo: `Введите URL сайта или текстовые данные в поле инструмента. Нажмите кнопку анализа или генерации — результат появится мгновенно. Используйте сгенерированные данные для оптимизации своего сайта.`,
      features: [
        'Быстрый SEO-анализ и генерация',
        `Работа с: ${keys}`,
        'Рекомендации по оптимизации',
        'Соответствие требованиям Google и Яндекс',
        'Без регистрации и платных планов',
        'Данные обрабатываются в браузере',
      ],
      useCases: `«${name}» используют SEO-специалисты, владельцы сайтов, копирайтеры и маркетологи. Помогает оптимизировать страницы для поисковых систем, улучшить позиции в выдаче и привлечь больше органического трафика.`,
      advantages: `SEO-инструмент «${name}» доступен бесплатно и без регистрации. Не нужно платить за дорогие SEO-сервисы для базовых задач. Быстрый и точный результат прямо в браузере.`,
    },
    network: {
      intro: `«${name}» — специализированный онлайн-инструмент для работы с сетевыми данными. ${desc}. Предназначен для системных администраторов, сетевых инженеров и разработчиков. Работает в браузере без установки утилит.`,
      howTo: `Введите сетевые данные (IP-адрес, маску, MAC-адрес и т.д.) в поле ввода. Нажмите кнопку анализа — инструмент выдаст подробный результат. Поддерживаются различные форматы сетевых данных.`,
      features: [
        `Работа с форматами: ${keys}`,
        'Точный расчёт сетевых параметров',
        'Подробный вывод результата',
        'Поддержка IPv4 и IPv6',
        'Работает без утилит командной строки',
        'Бесплатно для сетевых инженеров',
      ],
      useCases: `«${name}» ежедневно используют сисадмины при настройке сетей, DevOps-инженеры при деплое инфраструктуры и разработчики при работе с сетевыми приложениями.`,
      advantages: `Онлайн-инструмент «${name}» доступен с любого компьютера без установки специализированного ПО. Заменяет командные утилиты для быстрых расчётов прямо в браузере.`,
    },
    productivity: {
      intro: `«${name}» — удобный онлайн-инструмент для повышения продуктивности. ${desc}. Помогает организовать работу и сфокусироваться на важном. Доступен в браузере без установки — всегда под рукой.`,
      howTo: `Откройте инструмент в браузере. Настройте параметры под свои задачи. Все данные сохраняются в вашем браузере автоматически — они будут на месте при следующем открытии. Работает без интернета после первой загрузки.`,
      features: [
        'Сохранение данных в браузере (localStorage)',
        `Функции: ${keys}`,
        'Работает офлайн',
        'Синхронизация не требуется',
        'Чистый интерфейс без отвлекающих элементов',
        'Бесплатно и без аккаунта',
      ],
      useCases: `«${name}» используют фрилансеры, студенты, менеджеры и все, кто хочет лучше управлять временем и задачами. Идеален для быстрых записей, таймеров и ежедневного планирования прямо в браузере.`,
      advantages: `«${name}» — простой и быстрый инструмент без лишнего функционала. Данные хранятся локально в браузере — без облаков и регистрации. Работает мгновенно с любого устройства.`,
    },
    entertainment: {
      intro: `«${name}» — весёлый онлайн-инструмент для развлечений и принятия случайных решений. ${desc}. Используйте для игр, конкурсов, командных мероприятий или когда просто не можете определиться. Работает мгновенно и бесплатно.`,
      howTo: `Настройте параметры (варианты, списки участников и т.д.) и нажмите кнопку — инструмент сделает свой случайный выбор. Результат полностью случаен и не поддаётся манипуляциям. Повторяйте сколько угодно раз.`,
      features: [
        'Полностью случайный результат',
        `Возможности: ${keys}`,
        'Настраиваемые параметры',
        'Анимация и визуальный эффект',
        'Честный рандом на базе браузера',
        'Бесплатно без ограничений',
      ],
      useCases: `«${name}» идеален для корпоративов, семейных игр, конкурсов, жеребьёвки в командах и любых ситуаций, где нужен беспристрастный случайный выбор. Также используется учителями для опросов в классе.`,
      advantages: `«${name}» — быстрый и честный способ принять случайное решение. Никаких скрытых алгоритмов — стандартный криптографический рандом браузера. Открыт для всех без регистрации.`,
    },
    media: {
      intro: `«${name}» — онлайн-инструмент для работы с аудио и видео. ${desc}. Работает прямо в браузере с использованием Web Audio API. Без установки программ и регистрации.`,
      howTo: `Запустите инструмент в браузере. Настройте параметры (частоту, темп, длительность и т.д.) с помощью ползунков или полей ввода. Используйте кнопки управления для запуска и остановки. Работает со встроенным звуком браузера.`,
      features: [
        'Работа через Web Audio API браузера',
        `Возможности: ${keys}`,
        'Точная настройка параметров',
        'Не требует установки кодеков',
        'Поддержка всех современных браузеров',
        'Бесплатно для музыкантов и аудиофилов',
      ],
      useCases: `«${name}» используют музыканты, звукорежиссёры, аудиофилы и все, кто работает со звуком. Удобен для практики, настройки инструментов и работы с аудио без специализированных программ.`,
      advantages: `«${name}» работает прямо в браузере на основе современных веб-технологий. Не нужно скачивать DAW или другие программы для простых аудио-задач. Доступен в любое время на любом устройстве.`,
    },
    datetime: {
      intro: `«${name}» — точный онлайн-инструмент для работы с датами и временем. ${desc}. Работает с учётом часовых поясов и международных стандартов. Бесплатно и без регистрации.`,
      howTo: `Введите нужные даты или время в соответствующие поля. Инструмент автоматически выполнит расчёт или конвертацию. При необходимости выберите часовой пояс или формат даты. Результат появится мгновенно.`,
      features: [
        'Точный расчёт с учётом часовых поясов',
        `Работа с: ${keys}`,
        'Поддержка международных форматов дат',
        'Учёт летнего/зимнего времени',
        'Мгновенный результат',
        'Бесплатно без ограничений',
      ],
      useCases: `«${name}» используют путешественники, удалённые команды, разработчики и все, кто работает в разных часовых поясах. Незаменим при планировании встреч, рейсов и международных проектов.`,
      advantages: `«${name}» учитывает все нюансы работы со временем, включая летнее время и часовые пояса. Не требует установки и работает в любом браузере. Точнее ручных вычислений.`,
    },
    qrbarcode: {
      intro: `«${name}» — профессиональный онлайн-генератор для создания ${desc.toLowerCase()}. Создавайте коды мгновенно и скачивайте в высоком качестве. Подходит для бизнеса, маркетинга и личного использования.`,
      howTo: `Введите данные для кодирования (URL, текст, Wi-Fi данные и т.д.) в поле ввода. Настройте параметры (размер, цвет) если нужно. Нажмите «Создать» — код появится мгновенно. Скачайте в формате PNG или SVG.`,
      features: [
        `Форматы: ${keys}`,
        'Скачивание PNG и SVG',
        'Настройка размера и цвета',
        'Высокое качество изображения',
        'Генерация прямо в браузере',
        'Бесплатно без водяных знаков',
      ],
      useCases: `«${name}» используют маркетологи, SMM-специалисты, владельцы бизнеса, ивент-менеджеры и разработчики. Коды применяются на печатных материалах, упаковке, в рекламе и на сайтах.`,
      advantages: `«${name}» создаёт коды профессионального качества без регистрации и без водяных знаков. Работает в браузере — никаких установок. Скачивайте в SVG для масштабирования без потери качества.`,
    },
    units: {
      intro: `«${name}» — удобный справочник и конвертер единиц измерения. ${desc}. Найдите нужное значение или выполните быстрый перевод прямо в браузере без скачивания справочников.`,
      howTo: `Введите значение или найдите нужную единицу через поиск. Инструмент покажет таблицу соответствий или выполнит конвертацию. Используйте таблицы для быстрого сравнения стандартов разных стран.`,
      features: [
        `Форматы и стандарты: ${keys}`,
        'Полная таблица соответствий',
        'Быстрый поиск по стандарту',
        'Данные для мужчин и женщин',
        'Международные стандарты',
        'Бесплатный онлайн-справочник',
      ],
      useCases: `«${name}» незаменим при покупках в зарубежных магазинах, международных поставках и путешествиях. Помогает правильно выбрать размер или форм-фактор без ошибок при заказе.`,
      advantages: `«${name}» заменяет бумажные таблицы и устаревшие справочники. Всегда актуальные данные, доступные в любом браузере без скачивания. Удобен на мобильных устройствах при покупках.`,
    },
  };

  return byGroup[tool.groupId] || {
    intro: `«${name}» — бесплатный онлайн-инструмент. ${desc}. Работает прямо в вашем браузере без установки и регистрации. Все данные обрабатываются локально — конфиденциальность гарантирована.`,
    howTo: `Откройте инструмент в браузере, введите нужные данные и нажмите кнопку обработки. Результат появится мгновенно. Скопируйте его одним кликом.`,
    features: [
      'Работает в браузере, без установки',
      'Бесплатно без ограничений',
      'Без регистрации и аккаунта',
      'Данные не передаются на сервер',
      `Ключевые функции: ${keys}`,
    ],
    useCases: `«${name}» подходит для работы, учёбы и повседневных задач. Доступен 24/7 с любого устройства.`,
    advantages: `Онлайн-инструмент «${name}» не требует установки и регистрации. Бесплатный и всегда доступный из браузера.`,
  };
}

// ============================================================
// SEO Content Generator (English)
// ============================================================

function getToolSeoContentEn(tool: Tool, groupName: string): SeoContent {
  const name = tool.nameEn || tool.name;
  const desc = tool.descriptionEn || tool.description;
  const keys = tool.keywords.slice(0, 4).join(', ');

  const byGroup: Record<string, SeoContent> = {
    converters: {
      intro: `"${name}" is a precise online converter for instant conversion of ${desc.toLowerCase()}. Simply enter the source value — the result appears in the desired units without extra steps. The tool works entirely in your browser: no data is sent to any server.`,
      howTo: `Enter a value in the input field. The converter automatically calculates the result in all supported formats. Copy the desired value with one click. For precise calculations, use decimal numbers.`,
      features: [
        'Instant results without delay',
        `Support for key formats: ${keys}`,
        'High precision to several decimal places',
        'Fully browser-based — no data transmission',
        'Clean Material Design 3 interface',
        'Free and no registration required',
      ],
      useCases: `"${name}" is essential for students, engineers, developers and anyone working with international data. Especially handy when working with documents, recipes, technical documentation and while traveling.`,
      advantages: `Unlike bulky apps and programs, ${name} works right in your browser. No downloads, installations or registration — just open the page and use it. Data is processed locally: no information leaks.`,
    },
    calculators: {
      intro: `"${name}" is a convenient online calculator for precise computation of ${desc.toLowerCase()}. Enter your data and get instant results. Perfect for quick calculations at work, school and everyday life without installing additional software.`,
      howTo: `Fill in the input fields with the required values. The calculator automatically performs the computation and displays the result. You can modify parameters and recalculate as needed. All computations happen instantly in your browser.`,
      features: [
        'Instant precise calculations',
        `Calculation parameters: ${keys}`,
        'Clear interface with no unnecessary settings',
        'Works offline after first page load',
        'No ads and no registration',
        'Mobile-friendly design',
      ],
      useCases: `"${name}" is useful for students solving problems, professionals at work, and in everyday life. Available 24/7 from any device with a browser — computer, phone or tablet.`,
      advantages: `The online calculator "${name}" delivers accurate results without software installation or registration. Your data stays with you — nothing is sent to a server. Works even without stable internet after the first load.`,
    },
    text: {
      intro: `"${name}" is a convenient online tool for working with text. ${desc}. Paste text into the field — the tool instantly performs the desired operation. Perfect for copywriters, editors, developers and anyone who frequently works with text data.`,
      howTo: `Paste or type text in the input field. Click the process button or adjust parameters — the result appears immediately. Copy the processed text with one click. The tool handles texts of any size right in the browser.`,
      features: [
        'Instant text processing of any size',
        `Works with ${keys}`,
        'One-click result copying',
        'Data never leaves your browser',
        'Supports Latin and Cyrillic',
        'Free and no registration required',
      ],
      useCases: `"${name}" is essential for SEO specialists, copywriters, editors, developers and students. Saves time on routine text operations that are difficult to do manually.`,
      advantages: `The online tool "${name}" requires no installation and works in any browser. Your texts are processed locally — privacy guaranteed. Free and available 24/7.`,
    },
    generators: {
      intro: `"${name}" is a reliable online generator for creating ${desc.toLowerCase()}. Configure parameters for your needs and click generate — the result is ready instantly. The tool works entirely in the browser, without registration and without limits.`,
      howTo: `Set the desired generation parameters (length, quantity, type, etc.). Click "Generate" — the result appears immediately. Generate multiple variants and choose the best one. Copy the result with one click.`,
      features: [
        'Instant generation without waiting',
        `Customizable parameters: ${keys}`,
        'Generate multiple variants at once',
        'One-click copying',
        'Secure browser-based processing',
        'Free with no limits',
      ],
      useCases: `"${name}" is essential for developers, designers, testers and anyone who regularly generates data. Saves time on routine tasks and reduces human error when creating data manually.`,
      advantages: `The generator "${name}" is available online without download or installation. Data is generated locally in the browser — no leaks. Free with no limits on operations.`,
    },
    developers: {
      intro: `"${name}" is a professional online tool for developers. ${desc}. Works right in the browser without installing extensions. Boosts productivity when working with code and technical data.`,
      howTo: `Paste code or data into the input field. The tool automatically processes it and delivers the result. Use copy buttons for quick transfer to your editor. Supports processing large volumes of data.`,
      features: [
        'Fast code and data processing',
        `Format support: ${keys}`,
        'Syntax highlighting and validation',
        'Works without browser extensions',
        'One-click result copying',
        'Free developer tool',
      ],
      useCases: `"${name}" is used daily by frontend and backend developers, DevOps engineers and QA testers. Especially useful for debugging, API development, working with config files and code optimization.`,
      advantages: `Unlike IDE plugins, "${name}" works in the browser on any computer without environment setup. Ideal for quick tasks during work. Data stays in the browser — safe for sensitive data.`,
    },
    images: {
      intro: `"${name}" is a convenient online editor for working with images. ${desc}. Upload a photo — processing happens right in the browser in seconds. No installations or registrations — just results.`,
      howTo: `Upload an image via the button or drag and drop a file into the upload area. Adjust processing parameters. Click the process button and download the result. The tool supports popular image formats.`,
      features: [
        'Image processing right in the browser',
        'Support for JPEG, PNG, WebP, GIF',
        `Operations: ${keys}`,
        'Download results in a few clicks',
        'Images are never sent to a server',
        'Free with no limits',
      ],
      useCases: `"${name}" is used by designers, bloggers, social media managers and anyone working with visual content. Perfect for quick photo editing without Photoshop or other heavy editors.`,
      advantages: `The online tool "${name}" doesn't require Photoshop or other expensive software. Works in the browser on any device. Your images are processed locally — no personal photo leaks.`,
    },
    security: {
      intro: `"${name}" is a reliable online tool for data and security. ${desc}. All operations are performed in your browser — data never leaves your device. Free and no registration required.`,
      howTo: `Enter data in the tool field. Click the process button — the result appears instantly. For security, avoid using the tool with real production passwords or keys on shared devices.`,
      features: [
        'Data processing only in the browser',
        'No data transmitted to servers',
        `Support: ${keys}`,
        'Meets modern security standards',
        'Suitable for sensitive data',
        'Free with no limits',
      ],
      useCases: `"${name}" is used by developers, security administrators, IT professionals and regular users who value data security. Suitable for auditing, checking and generating secure data.`,
      advantages: `The key advantage of "${name}" is complete privacy. All computations happen client-side. Neither your passwords nor other sensitive data is transmitted to anyone. Open browser code — maximum transparency.`,
    },
    health: {
      intro: `"${name}" is a convenient online health and fitness calculator. ${desc}. Enter your data — the tool provides a personalized result based on proven formulas. Fast, free and no registration required.`,
      howTo: `Enter your parameters (age, weight, height, activity level, etc.) in the appropriate fields. Click "Calculate" — the result appears with explanations and recommendations. Results are for informational purposes.`,
      features: [
        'Calculations based on scientifically proven formulas',
        `Parameters considered: ${keys}`,
        'Personalized results',
        'Clear explanations of results',
        'Works in browser without data collection',
        'Free and no registration required',
      ],
      useCases: `"${name}" is useful for health-conscious individuals, athletes, fitness trainers and anyone looking to improve their lifestyle. Use the tool as a supplementary guide for approximate calculations.`,
      advantages: `The online calculator "${name}" is available anytime and works without registration. No need to install apps — a browser is enough. Important: results are for informational purposes and do not replace medical consultation.`,
    },
    finance: {
      intro: `"${name}" is a free online calculator for financial computations. ${desc}. Enter data — the tool instantly performs calculations using financial formulas. Helps make informed financial decisions.`,
      howTo: `Enter financial parameters in the appropriate fields: amounts, rates, terms. Click "Calculate" — the tool shows a detailed result with breakdown. Change parameters to compare different scenarios.`,
      features: [
        'Precise calculations using financial formulas',
        `Parameters: ${keys}`,
        'Detailed result breakdown',
        'Compare different scenarios',
        'Data stays in the browser',
        'Free with no limits',
      ],
      useCases: `"${name}" helps when planning major purchases, mortgages, deposits and investments. Essential for comparing bank offers and analyzing financial decisions before making them.`,
      advantages: `The online calculator "${name}" provides approximate calculations for self-analysis. Your financial data never leaves the browser. Important: for official financial decisions, consult a financial professional.`,
    },
    math: {
      intro: `"${name}" is a powerful online calculator for mathematical computations. ${desc}. Enter data — the tool instantly provides an accurate answer with detailed solution. Essential for study and work.`,
      howTo: `Enter numbers or mathematical expressions in the input fields. Click "Calculate" or "Solve" — the result appears with step-by-step explanation when possible. Supports floating-point and large numbers.`,
      features: [
        'Precise mathematical calculations',
        `Supported operations: ${keys}`,
        'Step-by-step solution (where applicable)',
        'Works with large numbers',
        'High calculation precision',
        'Free with no limits',
      ],
      useCases: `"${name}" is used by students, teachers, engineers and researchers. Helps with problem solving, verifying calculations and studying mathematics.`,
      advantages: `The online calculator "${name}" is available without installation or registration. Works in the browser on any device. A free alternative to paid math packages for everyday tasks.`,
    },
    encoding: {
      intro: `"${name}" is a convenient online tool for encoding and decoding data. ${desc}. Paste data — conversion happens instantly in your browser without sending data to a server.`,
      howTo: `Paste source data in the input field. Choose the direction: encode or decode. Click the button — the result appears immediately. Copy the converted data with one click.`,
      features: [
        'One-click encoding and decoding',
        `Formats: ${keys}`,
        'Instant processing without delay',
        'No data sent to servers',
        'Unicode and multilingual support',
        'Free and no registration required',
      ],
      useCases: `"${name}" is essential for developers when debugging, testing APIs, working with config files and data transmission. Also used for educational purposes when learning encoding formats.`,
      advantages: `The tool "${name}" processes data locally — no leaks. Requires no installation or authorization. Supports large data volumes right in the browser.`,
    },
    color: {
      intro: `"${name}" is a professional online tool for working with colors. ${desc}. Built for designers, developers and anyone working with visual content. Works in the browser without graphic editors.`,
      howTo: `Select or enter a color using the available tools. The tool automatically shows related values and options. Copy the desired format with one click for use in design or code.`,
      features: [
        `Works with formats: ${keys}`,
        'Visual color preview',
        'One-click value copying',
        'Suitable for web design and development',
        'Works without Photoshop or other software',
        'Free with no limits',
      ],
      useCases: `"${name}" is used by web designers creating interfaces, developers writing CSS, UX specialists selecting color schemes, and marketers creating brand materials.`,
      advantages: `The online tool "${name}" replaces expensive software for professional color work. Available in any browser without registration. Results can be used directly in CSS, HTML or graphic editors.`,
    },
    seo: {
      intro: `"${name}" is a professional SEO tool for website optimization. ${desc}. Helps improve visibility in Google and other search engines without specialized knowledge. Works in the browser — no installation needed.`,
      howTo: `Enter the website URL or text data in the tool field. Click the analyze or generate button — the result appears instantly. Use the generated data to optimize your website.`,
      features: [
        'Quick SEO analysis and generation',
        `Works with: ${keys}`,
        'Optimization recommendations',
        'Meets Google requirements',
        'No registration or paid plans',
        'Data processed in the browser',
      ],
      useCases: `"${name}" is used by SEO specialists, website owners, copywriters and marketers. Helps optimize pages for search engines, improve rankings and attract more organic traffic.`,
      advantages: `The SEO tool "${name}" is available for free without registration. No need to pay for expensive SEO services for basic tasks. Fast and accurate results right in the browser.`,
    },
    network: {
      intro: `"${name}" is a specialized online tool for working with network data. ${desc}. Designed for system administrators, network engineers and developers. Works in the browser without installing utilities.`,
      howTo: `Enter network data (IP address, mask, MAC address, etc.) in the input field. Click the analyze button — the tool provides a detailed result. Various network data formats are supported.`,
      features: [
        `Works with formats: ${keys}`,
        'Precise network parameter calculation',
        'Detailed output',
        'IPv4 and IPv6 support',
        'Works without command-line utilities',
        'Free for network engineers',
      ],
      useCases: `"${name}" is used daily by sysadmins configuring networks, DevOps engineers deploying infrastructure, and developers working with network applications.`,
      advantages: `The online tool "${name}" is accessible from any computer without installing specialized software. Replaces command-line utilities for quick calculations right in the browser.`,
    },
    productivity: {
      intro: `"${name}" is a convenient online tool for boosting productivity. ${desc}. Helps organize work and focus on what matters. Available in the browser without installation — always at hand.`,
      howTo: `Open the tool in your browser. Configure parameters for your tasks. All data is saved in your browser automatically — it will be there next time you open it. Works offline after the first load.`,
      features: [
        'Data saved in browser (localStorage)',
        `Features: ${keys}`,
        'Works offline',
        'No sync required',
        'Clean interface without distractions',
        'Free and no account needed',
      ],
      useCases: `"${name}" is used by freelancers, students, managers and anyone who wants to better manage their time and tasks. Ideal for quick notes, timers and daily planning right in the browser.`,
      advantages: `"${name}" is a simple and fast tool without unnecessary features. Data is stored locally in the browser — no cloud or registration. Works instantly from any device.`,
    },
    entertainment: {
      intro: `"${name}" is a fun online tool for entertainment and random decision-making. ${desc}. Use for games, contests, team events or when you simply can't decide. Works instantly and for free.`,
      howTo: `Configure parameters (options, participant lists, etc.) and click the button — the tool makes its random selection. The result is completely random and cannot be manipulated. Repeat as many times as you want.`,
      features: [
        'Completely random results',
        `Features: ${keys}`,
        'Customizable parameters',
        'Animation and visual effects',
        'Fair randomization using browser crypto',
        'Free with no limits',
      ],
      useCases: `"${name}" is perfect for parties, family games, contests, team drafts and any situation requiring an unbiased random selection. Also used by teachers for class polls.`,
      advantages: `"${name}" is a fast and fair way to make a random decision. No hidden algorithms — standard browser cryptographic randomization. Open to everyone without registration.`,
    },
    media: {
      intro: `"${name}" is an online tool for working with audio and video. ${desc}. Works right in the browser using the Web Audio API. No software installation or registration needed.`,
      howTo: `Launch the tool in your browser. Adjust parameters (frequency, tempo, duration, etc.) using sliders or input fields. Use control buttons to start and stop. Works with the browser's built-in audio.`,
      features: [
        'Works via browser Web Audio API',
        `Features: ${keys}`,
        'Precise parameter tuning',
        'No codec installation required',
        'Supports all modern browsers',
        'Free for musicians and audiophiles',
      ],
      useCases: `"${name}" is used by musicians, sound engineers, audiophiles and anyone working with sound. Handy for practice, instrument tuning and audio work without specialized software.`,
      advantages: `"${name}" works right in the browser using modern web technologies. No need to download a DAW or other software for simple audio tasks. Available anytime on any device.`,
    },
    datetime: {
      intro: `"${name}" is a precise online tool for working with dates and time. ${desc}. Works with timezone awareness and international standards. Free and no registration required.`,
      howTo: `Enter the desired dates or times in the appropriate fields. The tool automatically performs the calculation or conversion. Select a timezone or date format if needed. Results appear instantly.`,
      features: [
        'Precise calculations with timezone awareness',
        `Works with: ${keys}`,
        'International date format support',
        'Daylight saving time handling',
        'Instant results',
        'Free with no limits',
      ],
      useCases: `"${name}" is used by travelers, remote teams, developers and anyone working across different time zones. Essential for planning meetings, flights and international projects.`,
      advantages: `"${name}" accounts for all nuances of working with time, including daylight saving and time zones. Requires no installation and works in any browser. More accurate than manual calculations.`,
    },
    qrbarcode: {
      intro: `"${name}" is a professional online generator for creating ${desc.toLowerCase()}. Create codes instantly and download in high quality. Suitable for business, marketing and personal use.`,
      howTo: `Enter the data to encode (URL, text, Wi-Fi data, etc.) in the input field. Adjust parameters (size, color) if needed. Click "Create" — the code appears instantly. Download in PNG or SVG format.`,
      features: [
        `Formats: ${keys}`,
        'PNG and SVG download',
        'Size and color customization',
        'High quality output',
        'Generation right in the browser',
        'Free without watermarks',
      ],
      useCases: `"${name}" is used by marketers, social media managers, business owners, event managers and developers. Codes are used on printed materials, packaging, in advertising and on websites.`,
      advantages: `"${name}" creates professional quality codes without registration or watermarks. Works in the browser — no installations. Download in SVG for scaling without quality loss.`,
    },
    units: {
      intro: `"${name}" is a handy reference and unit converter. ${desc}. Find the value you need or perform a quick conversion right in the browser without downloading references.`,
      howTo: `Enter a value or find the desired unit via search. The tool shows a correspondence table or performs the conversion. Use tables for quick comparison of standards across countries.`,
      features: [
        `Formats and standards: ${keys}`,
        'Complete correspondence table',
        'Quick search by standard',
        'Data for men and women',
        'International standards',
        'Free online reference',
      ],
      useCases: `"${name}" is essential when shopping at foreign stores, in international shipping and while traveling. Helps choose the right size or form factor without ordering mistakes.`,
      advantages: `"${name}" replaces paper tables and outdated references. Always up-to-date data available in any browser without downloading. Convenient on mobile devices while shopping.`,
    },
  };

  return byGroup[tool.groupId] || {
    intro: `"${name}" is a free online tool. ${desc}. Works right in your browser without installation or registration. All data is processed locally — privacy guaranteed.`,
    howTo: `Open the tool in the browser, enter the required data and click the process button. The result appears instantly. Copy it with one click.`,
    features: [
      'Works in the browser, no installation',
      'Free with no limits',
      'No registration or account needed',
      'No data sent to servers',
      `Key features: ${keys}`,
    ],
    useCases: `"${name}" is suitable for work, study and everyday tasks. Available 24/7 from any device.`,
    advantages: `The online tool "${name}" requires no installation or registration. Free and always available in the browser.`,
  };
}

// ============================================================
// FAQ Generator
// ============================================================

function getToolFAQ(tool: Tool): Array<{ q: string; a: string }> {
  const base = [
    {
      q: `Как пользоваться инструментом «${tool.name}»?`,
      a: `Откройте страницу инструмента «${tool.name}» на сайте Ultimate Tools. Введите данные в соответствующие поля — результат появится автоматически. Инструмент работает полностью в браузере: никаких загрузок и регистрации не требуется.`,
    },
    {
      q: `Бесплатно ли использование «${tool.name}»?`,
      a: `Да, «${tool.name}» абсолютно бесплатен и не требует регистрации. Все инструменты на Ultimate Tools доступны без ограничений и без скрытых платежей.`,
    },
    {
      q: `Безопасно ли использовать «${tool.name}»?`,
      a: `Да, все данные обрабатываются локально в вашем браузере. Никакая информация не отправляется на серверы — ваши данные остаются полностью конфиденциальными.`,
    },
    {
      q: `Работает ли «${tool.name}» на смартфоне?`,
      a: `Да, «${tool.name}» полностью адаптирован для мобильных устройств и работает в любом современном браузере на iOS и Android.`,
    },
  ];

  const groupFAQs: Record<string, Array<{ q: string; a: string }>> = {
    converters: [{
      q: `Насколько точен «${tool.name}»?`,
      a: `Конвертер использует стандартные коэффициенты перевода с высокой точностью. Результаты соответствуют международным стандартам измерений.`,
    }],
    calculators: [{
      q: `Можно ли доверять расчётам «${tool.name}»?`,
      a: `Да, «${tool.name}» использует проверенные формулы и алгоритмы. Тем не менее для важных финансовых решений рекомендуем проверять результаты у специалиста.`,
    }],
    developers: [{
      q: `Поддерживает ли «${tool.name}» большие объёмы данных?`,
      a: `«${tool.name}» обрабатывает данные прямо в браузере, что обеспечивает высокую скорость работы. Для очень больших файлов рекомендуем разбивать данные на части.`,
    }],
    images: [{
      q: `Какие форматы изображений поддерживает «${tool.name}»?`,
      a: `«${tool.name}» работает с популярными форматами: JPEG, PNG, WebP, GIF, SVG. Обработка происходит в браузере без загрузки файлов на сервер.`,
    }],
    security: [{
      q: `Хранятся ли мои данные при использовании «${tool.name}»?`,
      a: `Нет. Все данные обрабатываются исключительно в вашем браузере. Пароли, хэши и другая чувствительная информация не передаётся и не сохраняется на серверах.`,
    }],
    health: [{
      q: `Заменяет ли «${tool.name}» консультацию врача?`,
      a: `Нет, «${tool.name}» предназначен только для информационных целей. Для медицинских решений всегда консультируйтесь с квалифицированным специалистом.`,
    }],
    finance: [{
      q: `Насколько точны финансовые расчёты в «${tool.name}»?`,
      a: `«${tool.name}» выполняет расчёты по стандартным финансовым формулам. Для официальных финансовых решений рекомендуем проверять данные у финансового консультанта.`,
    }],
    generators: [{
      q: `Можно ли использовать данные из «${tool.name}» в продакшн?`,
      a: `Да, данные генерируются с использованием криптографически стойкого рандома браузера. Для генераторов паролей и UUID — данные надёжны для реального использования.`,
    }],
    text: [{
      q: `Есть ли ограничения на размер текста в «${tool.name}»?`,
      a: `«${tool.name}» обрабатывает тексты большого объёма прямо в браузере. Ограничение зависит от оперативной памяти устройства, но обычно работает с текстами до нескольких мегабайт.`,
    }],
  };

  return [...base, ...(groupFAQs[tool.groupId] || [])];
}

// ============================================================
// FAQ Generator (English)
// ============================================================

function getToolFAQEn(tool: Tool): Array<{ q: string; a: string }> {
  const name = tool.nameEn || tool.name;
  const base = [
    {
      q: `How do I use "${name}"?`,
      a: `Open the "${name}" tool page on Ultimate Tools. Enter data in the appropriate fields — the result appears automatically. The tool works entirely in the browser: no downloads or registration required.`,
    },
    {
      q: `Is "${name}" free to use?`,
      a: `Yes, "${name}" is completely free and requires no registration. All tools on Ultimate Tools are available without limits or hidden fees.`,
    },
    {
      q: `Is it safe to use "${name}"?`,
      a: `Yes, all data is processed locally in your browser. No information is sent to servers — your data remains completely private.`,
    },
    {
      q: `Does "${name}" work on smartphones?`,
      a: `Yes, "${name}" is fully responsive and works in any modern browser on iOS and Android.`,
    },
  ];

  const groupFAQs: Record<string, Array<{ q: string; a: string }>> = {
    converters: [{
      q: `How accurate is "${name}"?`,
      a: `The converter uses standard conversion coefficients with high precision. Results comply with international measurement standards.`,
    }],
    calculators: [{
      q: `Can I trust the calculations from "${name}"?`,
      a: `Yes, "${name}" uses proven formulas and algorithms. However, for important financial decisions, we recommend verifying results with a specialist.`,
    }],
    developers: [{
      q: `Does "${name}" support large data volumes?`,
      a: `"${name}" processes data right in the browser, ensuring high-speed operation. For very large files, we recommend splitting data into parts.`,
    }],
    images: [{
      q: `What image formats does "${name}" support?`,
      a: `"${name}" works with popular formats: JPEG, PNG, WebP, GIF, SVG. Processing happens in the browser without uploading files to a server.`,
    }],
    security: [{
      q: `Is my data stored when using "${name}"?`,
      a: `No. All data is processed exclusively in your browser. Passwords, hashes and other sensitive information is never transmitted or stored on servers.`,
    }],
    health: [{
      q: `Does "${name}" replace medical consultation?`,
      a: `No, "${name}" is intended for informational purposes only. For medical decisions, always consult a qualified professional.`,
    }],
    finance: [{
      q: `How accurate are the financial calculations in "${name}"?`,
      a: `"${name}" performs calculations using standard financial formulas. For official financial decisions, we recommend consulting a financial advisor.`,
    }],
    generators: [{
      q: `Can I use data from "${name}" in production?`,
      a: `Yes, data is generated using the browser's cryptographically secure random number generator. For password generators and UUIDs, the data is reliable for real-world use.`,
    }],
    text: [{
      q: `Are there text size limits in "${name}"?`,
      a: `"${name}" processes large texts right in the browser. The limit depends on your device's RAM, but typically works with texts up to several megabytes.`,
    }],
  };

  return [...base, ...(groupFAQs[tool.groupId] || [])];
}

// ============================================================
// Main Component
// ============================================================

export default function ToolPage({ slug }: { slug: string }) {
  const theme = useTheme();
  const { locale, t, lHref } = useLanguage();
  const isEn = locale === 'en';
  const tool = getToolBySlug(slug);
  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    if (tool) addRecentTool(tool.slug);
  }, [tool?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!tool) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4">{isEn ? 'Tool not found' : 'Инструмент не найден'}</Typography>
        <Button component={Link} href={lHref('/')} sx={{ mt: 2 }}>{isEn ? 'Home' : 'На главную'}</Button>
      </Container>
    );
  }

  const group = toolGroups.find(g => g.id === tool.groupId);
  const ToolComponent = toolComponents[tool.slug];
  const seoTitle = (tool as any).seoTitle || tool.name;

  // Memoize expensive computations — getToolsByGroup scans all tools,
  // SEO content/FAQ generators create new objects on every call.
  const relatedTools = useMemo(
    () => getToolsByGroup(tool.groupId).filter(t => t.id !== tool.id).slice(0, 4),
    [tool.groupId, tool.id]
  );
  const seoContent = useMemo(
    () => isEn ? getToolSeoContentEn(tool, group?.name || '') : getToolSeoContent(tool, group?.name || ''),
    [tool.id, isEn, group?.name]
  );
  const faqItems = useMemo(
    () => isEn ? getToolFAQEn(tool) : getToolFAQ(tool),
    [tool.id, isEn]
  );

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
          <Link href={lHref('/')} style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
            <Home sx={{ mr: 0.5, fontSize: 18 }} /> {t('toolPage.breadcrumb.home')}
          </Link>
          <Link href={lHref(`/group/${group?.slug}`)} style={{ color: 'inherit', textDecoration: 'none' }}>
            {isEn ? ((group as any)?.nameEn || group?.name) : group?.name}
          </Link>
          <Typography color="text.primary" fontWeight={500}>{isEn ? ((tool as any).nameEn || tool.name) : tool.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            {/* Tool Header */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 18,
                    bgcolor: alpha(group?.color ?? theme.palette.primary.main, 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <DynamicIcon name={tool.icon} sx={{ color: group?.color ?? theme.palette.primary.main, fontSize: 24 }} />
                </Box>
                <Box>
                  {/* SEO-оптимизированный H1 */}
                  <Typography variant="h4" component="h1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                    {isEn ? ((tool as any).nameEn || seoTitle) : seoTitle}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    {isEn ? ((tool as any).descriptionEn || tool.description) : tool.description}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                {tool.keywords.slice(0, 5).map(kw => (
                  <Chip key={kw} label={kw} size="small" sx={{ bgcolor: alpha(group?.color ?? theme.palette.primary.main, 0.08) }} />
                ))}
              </Box>
            </Box>

            {/* Tool Body */}
            <Paper
              elevation={1}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 18,
                bgcolor: theme.palette.surfaceContainerLowest,
                minHeight: 300,
              }}
            >
              {ToolComponent ? (
                <ToolComponent />
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Construction sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    {t('toolPage.underConstruction')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('toolPage.underConstructionDesc', { name: isEn ? ((tool as any).nameEn || tool.name) : tool.name })}
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* SEO Content Block */}
            <Paper
              elevation={0}
              sx={{ mt: 3, p: { xs: 2, md: 3 }, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow }}
            >
              {/* What is */}
              <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
                {t('toolPage.seoSection.whatIs', { name: isEn ? ((tool as any).nameEn || tool.name) : tool.name })}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {seoContent.intro}
              </Typography>

              {/* How to use */}
              <Typography variant="h6" component="h3" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                {t('toolPage.seoSection.howToUse')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {seoContent.howTo}
              </Typography>

              {/* Features */}
              <Typography variant="h6" component="h3" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                {t('toolPage.seoSection.features', { name: isEn ? ((tool as any).nameEn || tool.name) : tool.name })}
              </Typography>
              <List dense disablePadding>
                {seoContent.features.map((feat, i) => (
                  <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckCircleOutline sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={feat}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
              </List>

              {/* When to use */}
              <Typography variant="h6" component="h3" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                {t('toolPage.seoSection.whenToUse')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {seoContent.useCases}
              </Typography>

              {/* Advantages */}
              <Typography variant="h6" component="h3" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                {t('toolPage.seoSection.advantages')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 0 }}>
                {seoContent.advantages}
              </Typography>
            </Paper>

            {/* Visible FAQ */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" component="h2" fontWeight={600} sx={{ mb: 2 }}>
                {t('toolPage.faq.title')}
              </Typography>
              {faqItems.map((faq, i) => (
                <Accordion
                  key={i}
                  elevation={0}
                  disableGutters
                  sx={{
                    bgcolor: theme.palette.surfaceContainerLow,
                    mb: 1,
                    border: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
                    [`&.${accordionClasses.expanded}`]: {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <Box sx={{
                        width: 36, height: 36,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '50%',
                        transitionProperty: 'background-color',
                        transitionDuration: theme.md3?.motion.duration.short4 ?? '200ms',
                        transitionTimingFunction: theme.md3?.motion.easing.standard ?? 'cubic-bezier(0.2, 0, 0, 1)',
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                      }}>
                        <ExpandMore sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
                      </Box>
                    }
                    sx={{
                      '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.04) },
                    }}
                  >
                    <Typography variant="body1" fontWeight={500} color="text.primary">
                      {faq.q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                      {faq.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* Related tools in category */}
            {relatedTools.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('toolPage.relatedLinks', { group: isEn ? ((group as any)?.nameEn || group?.name) : group?.name })}{' '}
                  {relatedTools.map((rt, i) => (
                    <React.Fragment key={rt.id}>
                      <Link href={lHref(`/tools/${rt.slug}`)} style={{ color: 'inherit' }}>{isEn ? ((rt as any).nameEn || rt.name) : rt.name}</Link>
                      {i < relatedTools.length - 1 ? ', ' : '.'}
                    </React.Fragment>
                  ))}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              {t('toolPage.sidebar.relatedTools')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {relatedTools.map(t => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </Box>

            <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
              {t('toolPage.sidebar.categories')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {toolGroups.slice(0, 8).map(g => (
                <Chip
                  key={g.id}
                  label={isEn ? ((g as any).nameEn || g.name) : g.name}
                  component={Link}
                  href={lHref(`/group/${g.slug}`)}
                  clickable
                  variant={g.id === group?.id ? 'filled' : 'outlined'}
                  color={g.id === group?.id ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* JSON-LD: SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: seoTitle,
              description: (tool as any).seoDescription || tool.description,
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              url: `https://ulti-tools.com/${locale}/tools/${tool.slug}`,
              inLanguage: locale,
              isAccessibleForFree: true,
              browserRequirements: 'Requires JavaScript',
              author: { '@type': 'Organization', name: 'Ultimate Tools', url: 'https://ulti-tools.com' },
              keywords: tool.keywords.join(', '),
            }),
          }}
        />

        {/* JSON-LD: FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqItems.map(faq => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
              })),
            }),
          }}
        />

        {/* JSON-LD: BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Главная', item: `https://ulti-tools.com/${locale}` },
                { '@type': 'ListItem', position: 2, name: isEn ? ((group as any)?.nameEn || group?.name || 'Tools') : (group?.name || 'Инструменты'), item: `https://ulti-tools.com/${locale}/group/${group?.slug}` },
                { '@type': 'ListItem', position: 3, name: isEn ? ((tool as any).nameEn || seoTitle) : seoTitle, item: `https://ulti-tools.com/${locale}/tools/${tool.slug}` },
              ],
            }),
          }}
        />
      </Container>
    </>
  );
}
