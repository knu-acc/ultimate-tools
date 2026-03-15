'use client';

import React, { useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Breadcrumbs, Paper, Chip, alpha, useTheme, Button,
  Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import { Home, NavigateNext, Construction, ExpandMore, CheckCircleOutline } from '@mui/icons-material';
import DynamicIcon from '@/src/components/DynamicIcon';
import Link from 'next/link';
import { getToolBySlug, getToolsByGroup, toolGroups, Tool } from '@/src/data/tools';
import ToolCard from '@/src/components/ToolCard';
import { useRecentTools } from '@/src/hooks/useRecentTools';

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
import QrCodeGenTool from '@/src/tools/QrCodeGen';
import TextFormatterTool from '@/src/tools/TextFormatter';

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
// Main Component
// ============================================================

export default function ToolPage({ slug }: { slug: string }) {
  const theme = useTheme();
  const tool = getToolBySlug(slug);
  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    if (tool) addRecentTool(tool.slug);
  }, [tool?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const seoTitle = (tool as any).seoTitle || tool.name;
  const seoContent = getToolSeoContent(tool, group?.name || '');
  const faqItems = getToolFAQ(tool);

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
                    flexShrink: 0,
                  }}
                >
                  <DynamicIcon name={tool.icon} sx={{ color: theme.palette.onPrimaryContainer, fontSize: 24 }} />
                </Box>
                <Box>
                  {/* SEO-оптимизированный H1 */}
                  <Typography variant="h4" component="h1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                    {seoTitle}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    {tool.description}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
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

            {/* SEO Content Block */}
            <Paper
              elevation={0}
              sx={{ mt: 3, p: { xs: 2, md: 3 }, borderRadius: 3, bgcolor: theme.palette.surfaceContainerLow }}
            >
              {/* What is */}
              <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
                Что такое «{tool.name}»?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {seoContent.intro}
              </Typography>

              {/* How to use */}
              <Typography variant="h6" component="h3" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Как пользоваться инструментом
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {seoContent.howTo}
              </Typography>

              {/* Features */}
              <Typography variant="h6" component="h3" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Возможности «{tool.name}»
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
                Когда использовать
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {seoContent.useCases}
              </Typography>

              {/* Advantages */}
              <Typography variant="h6" component="h3" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Преимущества онлайн-версии
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 0 }}>
                {seoContent.advantages}
              </Typography>
            </Paper>

            {/* Visible FAQ */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" component="h2" fontWeight={600} sx={{ mb: 2 }}>
                Часто задаваемые вопросы
              </Typography>
              {faqItems.map((faq, i) => (
                <Accordion
                  key={i}
                  elevation={0}
                  disableGutters
                  sx={{
                    bgcolor: theme.palette.surfaceContainerLow,
                    borderRadius: '12px !important',
                    mb: 1,
                    '&:before': { display: 'none' },
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{ borderRadius: 3 }}
                  >
                    <Typography variant="body2" fontWeight={500}>{faq.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">{faq.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* Related tools in category */}
            {relatedTools.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Смотрите также другие инструменты в категории «{group?.name}»:{' '}
                  {relatedTools.map((t, i) => (
                    <React.Fragment key={t.id}>
                      <Link href={`/tools/${t.slug}`} style={{ color: 'inherit' }}>{t.name}</Link>
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
              url: `https://utools.app/tools/${tool.slug}`,
              inLanguage: 'ru',
              isAccessibleForFree: true,
              browserRequirements: 'Requires JavaScript',
              author: { '@type': 'Organization', name: 'Ultimate Tools', url: 'https://utools.app' },
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
                { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://utools.app' },
                { '@type': 'ListItem', position: 2, name: group?.name || 'Инструменты', item: `https://utools.app/group/${group?.slug}` },
                { '@type': 'ListItem', position: 3, name: seoTitle, item: `https://utools.app/tools/${tool.slug}` },
              ],
            }),
          }}
        />
      </Container>
    </>
  );
}
