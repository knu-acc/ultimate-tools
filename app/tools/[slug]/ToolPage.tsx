'use client';

import React from 'react';
import {
  Container, Typography, Box, Grid, Breadcrumbs, Paper, Chip, alpha, useTheme, Button,
} from '@mui/material';
import { Home, NavigateNext, Construction } from '@mui/icons-material';
import DynamicIcon from '@/src/components/DynamicIcon';
import Link from 'next/link';
import { getToolBySlug, getToolsByGroup, toolGroups } from '@/src/data/tools';
import ToolCard from '@/src/components/ToolCard';

// Import implemented tools
import PasswordGeneratorTool from '@/src/tools/PasswordGenerator';
import JsonFormatterTool from '@/src/tools/JsonFormatter';
import WordCounterTool from '@/src/tools/WordCounter';
import CaseConverterTool from '@/src/tools/CaseConverter';
import Base64EncoderTool from '@/src/tools/Base64Encoder';
import ColorConverterTool from '@/src/tools/ColorConverter';
import UuidGeneratorTool from '@/src/tools/UuidGenerator';
import PercentageCalcTool from '@/src/tools/PercentageCalc';
import DateDifferenceTool from '@/src/tools/DateDifference';
import RegexTesterTool from '@/src/tools/RegexTester';
import PasswordStrengthTool from '@/src/tools/PasswordStrength';
import NumberSystemTool from '@/src/tools/NumberSystem';
import TimerTool from '@/src/tools/Timer';
import ScientificCalcTool from '@/src/tools/ScientificCalc';
import ImageCompressorTool from '@/src/tools/ImageCompressor';
import TemperatureConverterTool from '@/src/tools/TemperatureConverter';
import LengthConverterTool from '@/src/tools/LengthConverter';
import WeightConverterTool from '@/src/tools/WeightConverter';
import SpeedConverterTool from '@/src/tools/SpeedConverter';
import BmiCalculatorTool from '@/src/tools/BmiCalculator';
import LoremGeneratorTool from '@/src/tools/LoremGenerator';
import MortgageCalcTool from '@/src/tools/MortgageCalc';
import TipCalculatorTool from '@/src/tools/TipCalculator';
import HashGeneratorTool from '@/src/tools/HashGenerator';
import UrlEncoderTool from '@/src/tools/UrlEncoder';
import QrGeneratorTool from '@/src/tools/QrGenerator';
import MarkdownPreviewTool from '@/src/tools/MarkdownPreview';
import DiscountCalcTool from '@/src/tools/DiscountCalc';
import TextDiffTool from '@/src/tools/TextDiff';
import RandomNumberTool from '@/src/tools/RandomNumber';
import CoinFlipTool from '@/src/tools/CoinFlip';
import DiceRollerTool from '@/src/tools/DiceRoller';
import ColorPaletteTool from '@/src/tools/ColorPalette';
import GradientGeneratorTool from '@/src/tools/GradientGenerator';
import HtmlEncoderTool from '@/src/tools/HtmlEncoder';
import JwtDecoderTool from '@/src/tools/JwtDecoder';
import MetaTagGeneratorTool from '@/src/tools/MetaTagGenerator';
import PomodoroTimerTool from '@/src/tools/PomodoroTimer';
import TransliterationTool from '@/src/tools/Transliteration';
import RemoveDuplicatesTool from '@/src/tools/RemoveDuplicates';
import AgeCalculatorTool from '@/src/tools/AgeCalculator';
import UnixTimestampTool from '@/src/tools/UnixTimestamp';
import CssMinifierTool from '@/src/tools/CssMinifier';
import TextReverseTool from '@/src/tools/TextReverse';
import RomanNumeralsTool from '@/src/tools/RomanNumerals';
import TextSortTool from '@/src/tools/TextSort';
import SlugGeneratorTool from '@/src/tools/SlugGenerator';
import CalorieCalcTool from '@/src/tools/CalorieCalc';
import MorseCodeTool from '@/src/tools/MorseCode';
import TypingSpeedTool from '@/src/tools/TypingSpeed';
import ContrastCheckerTool from '@/src/tools/ContrastChecker';
import SleepCalcTool from '@/src/tools/SleepCalc';
import WaterIntakeTool from '@/src/tools/WaterIntake';
import ReadingTimeTool from '@/src/tools/ReadingTime';
import NotesTool from '@/src/tools/Notes';
import EmailValidatorTool from '@/src/tools/EmailValidator';
import PhoneValidatorTool from '@/src/tools/PhoneValidator';
import TodoListTool from '@/src/tools/TodoList';
import TextToSpeechTool from '@/src/tools/TextToSpeech';
import TextReplaceTool from '@/src/tools/TextReplace';
import StringExtractorTool from '@/src/tools/StringExtractor';
import VolumeConverterTool from '@/src/tools/VolumeConverter';
import AreaConverterTool from '@/src/tools/AreaConverter';
import DataConverterTool from '@/src/tools/DataConverter';
import BinaryTextTool from '@/src/tools/BinaryText';
import MetronomeTool from '@/src/tools/Metronome';
import ToneGeneratorTool from '@/src/tools/ToneGenerator';
import CookingConverterTool from '@/src/tools/CookingConverter';
import ShoeSizeTool from '@/src/tools/ShoeSize';
import WheelSpinnerTool from '@/src/tools/WheelSpinner';
import RandomPickerTool from '@/src/tools/RandomPicker';
import PowerConverterTool from '@/src/tools/PowerConverter';
import FuelConverterTool from '@/src/tools/FuelConverter';
import SalaryCalcTool from '@/src/tools/SalaryCalc';
import FaviconGeneratorTool from '@/src/tools/FaviconGenerator';
import HttpStatusTool from '@/src/tools/HttpStatus';
import DecisionMakerTool from '@/src/tools/DecisionMaker';
import CountdownTool from '@/src/tools/Countdown';
import EnergyConverterTool from '@/src/tools/EnergyConverter';
import PressureConverterTool from '@/src/tools/PressureConverter';
import AngleConverterTool from '@/src/tools/AngleConverter';
import LoanCalcTool from '@/src/tools/LoanCalc';
import TaxCalcTool from '@/src/tools/TaxCalc';
import CompoundInterestTool from '@/src/tools/CompoundInterest';
import ImageResizerTool from '@/src/tools/ImageResizer';
import ImageCropTool from '@/src/tools/ImageCrop';
import ImageRotateTool from '@/src/tools/ImageRotate';
import JsBeautifierTool from '@/src/tools/JsBeautifier';
import HtmlFormatterTool from '@/src/tools/HtmlFormatter';
import CronGeneratorTool from '@/src/tools/CronGenerator';
import EquationSolverTool from '@/src/tools/EquationSolver';
import StatisticsCalcTool from '@/src/tools/StatisticsCalc';
import GcdLcmTool from '@/src/tools/GcdLcm';
import IdealWeightTool from '@/src/tools/IdealWeight';
import SqlFormatterTool from '@/src/tools/SqlFormatter';
import RandomColorTool from '@/src/tools/RandomColor';
import UrlValidatorTool from '@/src/tools/UrlValidator';
import ColorWheelTool from '@/src/tools/ColorWheel';
import HeartRateZoneTool from '@/src/tools/HeartRateZone';
import BodyFatTool from '@/src/tools/BodyFat';
import PregnancyCalcTool from '@/src/tools/PregnancyCalc';
import BudgetPlannerTool from '@/src/tools/BudgetPlanner';
import InvestmentCalcTool from '@/src/tools/InvestmentCalc';
import YamlJsonTool from '@/src/tools/YamlJson';
import XmlFormatterTool from '@/src/tools/XmlFormatter';
import DiffCheckerTool from '@/src/tools/DiffChecker';
import FlexboxPlaygroundTool from '@/src/tools/FlexboxPlayground';
import GridPlaygroundTool from '@/src/tools/GridPlayground';
import MatrixCalcTool from '@/src/tools/MatrixCalc';
import FactorialCalcTool from '@/src/tools/FactorialCalc';
import FractionCalcTool from '@/src/tools/FractionCalc';
import PrimeCheckerTool from '@/src/tools/PrimeChecker';
import ProportionCalcTool from '@/src/tools/ProportionCalc';
import ColorBlenderTool from '@/src/tools/ColorBlender';
import OgPreviewTool from '@/src/tools/OgPreview';
import RobotsGeneratorTool from '@/src/tools/RobotsGenerator';
import SitemapGeneratorTool from '@/src/tools/SitemapGenerator';
import KeywordDensityTool from '@/src/tools/KeywordDensity';
import IpCalculatorTool from '@/src/tools/IpCalculator';
import SubnetCalcTool from '@/src/tools/SubnetCalc';
import PortListTool from '@/src/tools/PortList';
import UserAgentParserTool from '@/src/tools/UserAgentParser';
import ClothingSizeTool from '@/src/tools/ClothingSize';
import TeamGeneratorTool from '@/src/tools/TeamGenerator';
import RandomNameTool from '@/src/tools/RandomName';
import AvatarGeneratorTool from '@/src/tools/AvatarGenerator';
import UnicodeLookupTool from '@/src/tools/UnicodeLookup';
import BarcodeGenTool from '@/src/tools/BarcodeGen';
import ImageFiltersTool from '@/src/tools/ImageFilters';
import NoiseGeneratorTool from '@/src/tools/NoiseGenerator';
import VideoAspectTool from '@/src/tools/VideoAspect';
import ScreenResolutionTool from '@/src/tools/ScreenResolution';
import PaperSizeTool from '@/src/tools/PaperSize';
import HeadingCheckerTool from '@/src/tools/HeadingChecker';
import IpValidatorTool from '@/src/tools/IpValidator';
import MimeTypesTool from '@/src/tools/MimeTypes';
import CoordinateConverterTool from '@/src/tools/CoordinateConverter';
import WorldClockTool from '@/src/tools/WorldClock';
import TimezoneConverterTool from '@/src/tools/TimezoneConverter';
import CalendarTool from '@/src/tools/Calendar';
import WeekNumberTool from '@/src/tools/WeekNumber';
import InflationCalcTool from '@/src/tools/InflationCalc';
import RetirementCalcTool from '@/src/tools/RetirementCalc';
import DepositCalcTool from '@/src/tools/DepositCalc';
import JsonDataGenTool from '@/src/tools/JsonDataGen';
import ChecksumCalcTool from '@/src/tools/ChecksumCalc';
import ImageToBase64Tool from '@/src/tools/ImageToBase64';
import PixelArtTool from '@/src/tools/PixelArt';
import SvgEditorTool from '@/src/tools/SvgEditor';
import ImageColorsTool from '@/src/tools/ImageColors';
import ColorPickerTool from '@/src/tools/ColorPicker';
import TailwindColorsTool from '@/src/tools/TailwindColors';
import MaterialColorsTool from '@/src/tools/MaterialColors';
import MacLookupTool from '@/src/tools/MacLookup';
import GithubReadmeTool from '@/src/tools/GithubReadme';
import GraphPlotterTool from '@/src/tools/GraphPlotter';
import MockdataGeneratorTool from '@/src/tools/MockdataGenerator';
import BgRemoverTool from '@/src/tools/BgRemover';
import MemeGeneratorTool from '@/src/tools/MemeGenerator';
import ScreenshotMockupTool from '@/src/tools/ScreenshotMockup';
import BarcodeGeneratorTool from '@/src/tools/BarcodeGenerator';
import QrCodeGenTool from '@/src/tools/QrCodeGen';

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
  'qr-generator': QrGeneratorTool,
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
  'barcode-generator': BarcodeGeneratorTool,
  'qr-code-gen': QrCodeGenTool,
};

function getToolFAQ(tool: { name: string; description: string; groupId: string; slug: string }): Array<{q: string; a: string}> {
  const base = [
    { q: `Как пользоваться инструментом «${tool.name}»?`, a: `Откройте страницу инструмента «${tool.name}» на сайте Ultimate Tools. Введите данные в соответствующие поля и результат появится автоматически. Инструмент работает полностью в браузере — никаких загрузок и регистрации не требуется.` },
    { q: `Бесплатно ли использование «${tool.name}»?`, a: `Да, «${tool.name}» абсолютно бесплатен и не требует регистрации. Все инструменты на Ultimate Tools доступны без ограничений.` },
    { q: `Безопасно ли использовать «${tool.name}»?`, a: `Да, все данные обрабатываются локально в вашем браузере. Никакая информация не отправляется на серверы — ваши данные остаются полностью конфиденциальными.` },
  ];

  const groupFAQs: Record<string, Array<{q: string; a: string}>> = {
    converters: [{ q: `Насколько точен ${tool.name}?`, a: `Конвертер использует стандартные коэффициенты перевода с высокой точностью. Результаты соответствуют международным стандартам измерений.` }],
    calculators: [{ q: `Можно ли доверять расчётам ${tool.name}?`, a: `Да, ${tool.name} использует проверенные формулы и алгоритмы. Тем не менее для важных финансовых решений рекомендуем проверять результаты у специалиста.` }],
    developers: [{ q: `Поддерживает ли ${tool.name} большие объёмы данных?`, a: `${tool.name} обрабатывает данные прямо в браузере, что обеспечивает высокую скорость работы. Для очень больших файлов рекомендуем разбивать данные на части.` }],
    images: [{ q: `Какие форматы изображений поддерживает ${tool.name}?`, a: `${tool.name} работает с популярными форматами: JPEG, PNG, WebP, GIF, SVG. Обработка происходит в браузере без загрузки файлов на сервер.` }],
    security: [{ q: `Хранятся ли мои данные при использовании ${tool.name}?`, a: `Нет. Все данные обрабатываются исключительно в вашем браузере. Пароли, хэши и другая чувствительная информация не передаётся и не сохраняется на серверах.` }],
    health: [{ q: `Заменяет ли ${tool.name} консультацию врача?`, a: `Нет, ${tool.name} предназначен только для информационных целей. Для медицинских решений всегда консультируйтесь с квалифицированным специалистом.` }],
    finance: [{ q: `Насколько точны финансовые расчёты в ${tool.name}?`, a: `${tool.name} выполняет расчёты по стандартным финансовым формулам. Для официальных финансовых решений рекомендуем проверять данные у финансового консультанта.` }],
  };

  return [...base, ...(groupFAQs[tool.groupId] || [])];
}

export default function ToolPage({ slug }: { slug: string }) {
  const theme = useTheme();
  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4">Инструмент не найден</Typography>
        <Button component={Link} href="/" sx={{ mt: 2 }}>На главную</Button>
      </Container>
    );
  }

  const group = toolGroups.find(g => g.id === tool.groupId);
  const relatedTools = getToolsByGroup(tool.groupId).filter(t => t.id !== tool.id).slice(0, 4);
  const ToolComponent = toolComponents[tool.slug];

  return (
    <>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
          <Home sx={{ mr: 0.5, fontSize: 18 }} /> Главная
        </Link>
        <Link href={`/group/${group?.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {group?.name}
        </Link>
        <Typography color="text.primary" fontWeight={500}>{tool.name}</Typography>
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
                  borderRadius: 3,
                  bgcolor: theme.palette.primaryContainer,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DynamicIcon name={tool.icon} sx={{ color: theme.palette.onPrimaryContainer, fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h4" component="h1" fontWeight={700}>
                  {tool.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {tool.description}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {tool.keywords.slice(0, 5).map(kw => (
                <Chip key={kw} label={kw} size="small" sx={{ bgcolor: theme.palette.surfaceContainerHigh }} />
              ))}
            </Box>
          </Box>

          {/* Tool Body */}
          <Paper
            elevation={1}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
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
                  В разработке
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Инструмент &laquo;{tool.name}&raquo; скоро будет доступен.
                  Следите за обновлениями!
                </Typography>
              </Box>
            )}
          </Paper>

          {/* SEO Description */}
          <Paper
            elevation={0}
            sx={{ mt: 3, p: 3, borderRadius: 3, bgcolor: theme.palette.surfaceContainerLow }}
          >
            <Typography variant="h6" component="h2" fontWeight={600} gutterBottom>
              О инструменте «{tool.name}»
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {tool.description}. Этот инструмент полностью бесплатен и работает прямо в вашем браузере.
              Данные не отправляются на сервер — полная конфиденциальность гарантирована.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Смотрите также другие инструменты в категории «{group?.name}»: {relatedTools.map(t => t.name).join(', ')}.
              Используйте поиск (Ctrl+K) для быстрого доступа к любому из {getToolsByGroup(tool.groupId).length}+ инструментов.
            </Typography>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Похожие инструменты
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {relatedTools.map(t => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </Box>

          <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
            Категории
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {toolGroups.slice(0, 8).map(g => (
              <Chip
                key={g.id}
                label={g.name}
                component={Link}
                href={`/group/${g.slug}`}
                clickable
                size="small"
                variant={g.id === group?.id ? 'filled' : 'outlined'}
                color={g.id === group?.id ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: tool.name,
            description: tool.description,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            url: `https://utools.app/tools/${tool.slug}`,
            inLanguage: 'ru',
            isAccessibleForFree: true,
            browserRequirements: 'Requires JavaScript',
            author: { '@type': 'Organization', name: 'Ultimate Tools', url: 'https://utools.app' },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: getToolFAQ(tool).map(faq => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </Container>
    </>
  );
}
