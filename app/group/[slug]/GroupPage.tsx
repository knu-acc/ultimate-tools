'use client';

import React, { useMemo } from 'react';
import {
  Container, Typography, Box, Grid, Breadcrumbs, Chip, alpha, useTheme, Paper,
  List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import { Home, NavigateNext, CheckCircleOutline } from '@mui/icons-material';
import DynamicIcon from '@/src/components/DynamicIcon';
import Link from 'next/link';
import { getGroupBySlug, getToolsByGroup, toolGroups } from '@/src/data/tools';
import ToolCard from '@/src/components/ToolCard';
import { useLanguage } from '@/src/i18n/LanguageContext';

// Расширенный SEO-контент для каждой категории
const groupSeoContent: Record<string, {
  h1: string;
  intro: string;
  features: string[];
  useCases: string;
}> = {
  converters: {
    h1: 'Онлайн конвертеры единиц измерения — бесплатно',
    intro: 'Коллекция бесплатных онлайн-конвертеров для мгновенного перевода единиц измерения. Температура, длина, вес, объём, скорость, энергия, давление и другие физические величины — всё в одном месте. Конвертеры работают прямо в браузере: не нужно скачивать приложения или проходить регистрацию. Результат появляется мгновенно с высокой точностью по международным стандартам.',
    features: [
      'Конвертеры температуры: Цельсий, Фаренгейт, Кельвин',
      'Конвертеры длины: метры, футы, дюймы, мили',
      'Конвертеры веса: кг, фунты, унции, тонны',
      'Конвертеры объёма: литры, галлоны, кубометры',
      'Конвертеры скорости: км/ч, м/с, миль/ч',
      'Конвертеры данных: байты, КБ, МБ, ГБ, ТБ',
      'Конвертер цветов: HEX, RGB, CMYK, HSL',
      'Конвертер координат GPS: DD, DMS, DDM',
    ],
    useCases: 'Конвертеры единиц незаменимы для студентов при решении задач, инженеров при проектировании, программистов при разработке международных сервисов и путешественников. Особенно полезны при работе с иностранными документами, рецептами, технической документацией.',
  },
  calculators: {
    h1: 'Онлайн калькуляторы — бесплатные расчёты',
    intro: 'Профессиональные онлайн-калькуляторы для финансовых, научных и бытовых расчётов. Ипотека, кредиты, налоги, зарплата, проценты, скидки — всё считается мгновенно прямо в браузере. Используйте готовые формулы без риска ошибок при ручном расчёте.',
    features: [
      'Ипотечный и кредитный калькулятор с графиком',
      'Калькулятор процентов, скидок и наценки',
      'Налоговый калькулятор НДФЛ и НДС',
      'Зарплатный калькулятор нетто/брутто',
      'Научный калькулятор с историей',
      'Калькулятор сложного процента',
      'Калькулятор чаевых и разделения счёта',
    ],
    useCases: 'Онлайн-калькуляторы используют студенты, бухгалтеры, финансисты, предприниматели и обычные пользователи. Позволяют быстро проверить расчёты, сравнить варианты и принять взвешенное решение.',
  },
  text: {
    h1: 'Онлайн инструменты для работы с текстом — бесплатно',
    intro: 'Полный набор бесплатных онлайн-инструментов для работы с текстом. Форматирование, очистка, подсчёт слов, изменение регистра, сравнение текстов, сортировка строк и многое другое. Все инструменты работают в браузере — вставьте текст и получите результат мгновенно.',
    features: [
      'Счётчик слов, символов и времени чтения',
      'Конвертер регистра: UPPER, lower, Title, camelCase',
      'Форматировщик и очиститель текста',
      'Удаление дубликатов строк',
      'Сортировка строк текста',
      'Сравнение двух текстов (diff)',
      'Транслитерация кириллицы',
      'Найти и заменить с поддержкой regex',
    ],
    useCases: 'Текстовые инструменты незаменимы для SEO-специалистов, копирайтеров, редакторов, разработчиков и студентов. Экономят время при рутинных операциях с большими объёмами текста.',
  },
  images: {
    h1: 'Онлайн редакторы изображений — бесплатно',
    intro: 'Бесплатные онлайн-инструменты для обработки изображений прямо в браузере. Сжатие, изменение размера, обрезка, фильтры, удаление фона — без Photoshop и без установки программ. Ваши фото обрабатываются локально и не передаются на сервер.',
    features: [
      'Сжатие изображений WebP, JPEG, PNG',
      'Изменение размера с сохранением пропорций',
      'Обрезка фото с настраиваемыми пропорциями',
      'Поворот и зеркальное отражение',
      'Фильтры: яркость, контраст, резкость',
      'Удаление фона (прозрачный PNG)',
      'Генератор favicon (ICO, PNG, SVG)',
      'Пиксель-арт редактор',
    ],
    useCases: 'Онлайн-редакторы используют блогеры, SMM-специалисты, дизайнеры, разработчики и все, кто работает с визуальным контентом. Идеальны для быстрой обработки фотографий без установки тяжёлых программ.',
  },
  generators: {
    h1: 'Онлайн генераторы — пароли, QR, UUID, данные',
    intro: 'Коллекция бесплатных онлайн-генераторов: надёжные пароли, QR-коды, штрих-коды, UUID, цветовые палитры, Lorem Ipsum, случайные числа и многое другое. Генерация происходит мгновенно прямо в браузере без ограничений.',
    features: [
      'Генератор надёжных паролей с настройкой',
      'Генератор QR-кодов (URL, Wi-Fi, визитка)',
      'Генератор UUID v4 и GUID',
      'Генератор хэшей MD5, SHA-256, SHA-512',
      'Генератор цветовых палитр',
      'Lorem Ipsum генератор текста',
      'Генератор случайных чисел',
      'Генератор тестовых данных JSON/CSV',
    ],
    useCases: 'Генераторы необходимы разработчикам, тестировщикам, дизайнерам и маркетологам. Используются для создания тестовых данных, генерации идентификаторов, создания визуальных материалов.',
  },
  developers: {
    h1: 'Онлайн инструменты для разработчиков — бесплатно',
    intro: 'Профессиональные онлайн-инструменты для разработчиков: форматтеры, валидаторы, декодеры, тестеры и справочники. JSON, CSS, JavaScript, SQL, HTML, regex, JWT, YAML, XML — всё доступно прямо в браузере. Без установки расширений и регистрации.',
    features: [
      'JSON Formatter, минификатор и валидатор',
      'Regex тестер с подсветкой совпадений',
      'JWT Decoder и валидатор',
      'CSS/JS/HTML/SQL форматтеры',
      'YAML ↔ JSON конвертер',
      'Diff Checker кода',
      'CSS Flexbox и Grid Playground',
      'Справочник HTTP статус-кодов',
    ],
    useCases: 'Инструменты для разработчиков ежедневно используют фронтенд и бэкенд разработчики, DevOps-инженеры, тестировщики и технические менеджеры.',
  },
  math: {
    h1: 'Онлайн математические калькуляторы — бесплатно',
    intro: 'Математические онлайн-калькуляторы для решения уравнений, работы с матрицами, статистического анализа и построения графиков. Точные результаты по проверенным алгоритмам. Работают в браузере без специализированных программ.',
    features: [
      'Решатель линейных и квадратных уравнений',
      'Калькулятор матриц (определитель, обратная)',
      'Статистика: среднее, медиана, дисперсия',
      'Факториал и комбинаторика',
      'Построитель графиков функций',
      'Калькулятор дробей и пропорций',
      'НОД и НОК',
      'Проверка простых чисел',
    ],
    useCases: 'Математические инструменты используют школьники, студенты, преподаватели, инженеры и научные работники для решения задач, проверки вычислений и изучения математики.',
  },
  health: {
    h1: 'Онлайн калькуляторы здоровья и фитнеса — бесплатно',
    intro: 'Бесплатные онлайн-калькуляторы для здоровья и фитнеса: ИМТ, норма калорий, идеальный вес, зоны пульса, калькулятор сна и воды. Расчёты по научно-обоснованным формулам для контроля здоровья.',
    features: [
      'Калькулятор ИМТ (индекс массы тела)',
      'Норма калорий BMR/TDEE',
      'Идеальный вес по нескольким формулам',
      'Зоны пульса для тренировок',
      'Калькулятор сна по фазам',
      'Суточная норма воды',
      'Процент жира в теле',
      'Калькулятор беременности',
    ],
    useCases: 'Калькуляторы здоровья используют люди, следящие за здоровьем, спортсмены, фитнес-тренеры и врачи. Результаты носят информационный характер и не заменяют консультацию специалиста.',
  },
  finance: {
    h1: 'Онлайн финансовые калькуляторы — бесплатно',
    intro: 'Бесплатные финансовые онлайн-калькуляторы для планирования бюджета, инвестиций, кредитов и вкладов. Все расчёты выполняются по стандартным финансовым формулам прямо в браузере — без передачи данных.',
    features: [
      'Планировщик личного бюджета',
      'Инвестиционный калькулятор ROI',
      'Калькулятор инфляции',
      'Пенсионный калькулятор',
      'Депозитный калькулятор вклада',
      'Кредитный и ипотечный калькуляторы',
      'Калькулятор сложного процента',
    ],
    useCases: 'Финансовые калькуляторы незаменимы при планировании крупных покупок, сравнении предложений банков и анализе инвестиционных решений.',
  },
  security: {
    h1: 'Онлайн инструменты для данных и безопасности',
    intro: 'Бесплатные онлайн-инструменты для работы с данными и безопасностью: генераторы хэшей, валидаторы, чекеры паролей. Все операции выполняются локально в браузере — ваши данные никогда не покидают устройство.',
    features: [
      'Проверка надёжности пароля',
      'Валидатор email-адресов',
      'Валидатор URL и IP-адресов',
      'Валидатор телефонных номеров',
      'Генератор тестовых данных JSON/CSV',
      'Калькулятор контрольных сумм',
    ],
    useCases: 'Инструменты безопасности используют разработчики, системные администраторы, IT-специалисты и все, кому важна защита данных.',
  },
  entertainment: {
    h1: 'Онлайн рандомайзеры и развлечения — бесплатно',
    intro: 'Весёлые онлайн-инструменты для случайного выбора и развлечений: колесо фортуны, бросок кубиков, подбрасывание монеты, генератор решений. Для игр, командных мероприятий и принятия сложных решений.',
    features: [
      'Колесо фортуны с кастомными вариантами',
      'Виртуальные кубики D4-D20',
      'Подбрасывание монеты',
      'Случайный выбор из списка',
      'Помощник в принятии решений',
      'Генератор случайных команд',
      'Обратный отсчёт до события',
    ],
    useCases: 'Рандомайзеры используют для корпоративов, семейных игр, конкурсов, жеребьёвки и любых ситуаций, где нужен беспристрастный случайный выбор.',
  },
  media: {
    h1: 'Онлайн аудио инструменты — метроном, шум, тоны',
    intro: 'Бесплатные онлайн-инструменты для работы с аудио на основе Web Audio API браузера: метроном, генератор тонов, белый шум. Для музыкантов, аудиофилов и всех, кто работает со звуком.',
    features: [
      'Онлайн метроном (20-300 BPM)',
      'Генератор звуковых тонов (20 Гц — 20 кГц)',
      'Белый, розовый и коричневый шум',
      'Калькулятор соотношения сторон видео',
    ],
    useCases: 'Аудио-инструменты используют музыканты, преподаватели музыки, аудиофилы и разработчики. Заменяют специализированные программы для простых задач.',
  },
  encoding: {
    h1: 'Онлайн кодирование и декодирование — Base64, URL, HTML',
    intro: 'Бесплатные онлайн-инструменты для кодирования и декодирования данных: Base64, URL, HTML, Морзе, бинарный код, Unicode. Мгновенная обработка в браузере без передачи данных.',
    features: [
      'Base64 кодирование и декодирование',
      'URL encoding/decoding (percent-encoding)',
      'HTML экранирование сущностей',
      'Азбука Морзе',
      'Текст в бинарный код',
      'Unicode справочник символов',
    ],
    useCases: 'Инструменты кодирования используют разработчики при отладке, работе с API и передаче данных. Также полезны для изучения форматов кодирования.',
  },
  qrbarcode: {
    h1: 'Онлайн генераторы QR-кодов и штрих-кодов',
    intro: 'Бесплатные онлайн-генераторы QR-кодов и штрих-кодов профессионального качества. Создавайте коды для URL, Wi-Fi, визиток, EAN-13, UPC, Code128 без регистрации и водяных знаков. Скачивайте в PNG и SVG.',
    features: [
      'QR-коды для URL, текста, Wi-Fi, vCard',
      'Штрих-коды EAN-13, UPC-A, Code128',
      'Настройка цвета и размера',
      'Скачивание PNG и SVG',
      'Высокое разрешение для печати',
    ],
    useCases: 'QR и штрих-коды используют маркетологи, владельцы бизнеса, разработчики и все, кто создаёт печатные материалы, упаковку или рекламные кампании.',
  },
  color: {
    h1: 'Онлайн инструменты для работы с цветом — бесплатно',
    intro: 'Профессиональные онлайн-инструменты для работы с цветом: пипетка, цветовое колесо, палитры, градиенты, проверка контраста WCAG, справочники Tailwind и Material Design. Для дизайнеров и разработчиков.',
    features: [
      'Цветовое колесо с гармоническими схемами',
      'Проверка контраста WCAG AA/AAA',
      'Смешивание и блендинг цветов',
      'Извлечение палитры из изображения',
      'Справочник цветов Tailwind CSS',
      'Справочник Material Design цветов',
    ],
    useCases: 'Цветовые инструменты используют веб-дизайнеры, UX-специалисты, разработчики и маркетологи при создании интерфейсов, брендинга и визуального контента.',
  },
  seo: {
    h1: 'Онлайн SEO инструменты для оптимизации сайта',
    intro: 'Бесплатные SEO-инструменты для оптимизации сайта под Google и Яндекс: генератор мета-тегов, Open Graph preview, генераторы robots.txt и sitemap.xml, анализ заголовков и плотности ключевых слов.',
    features: [
      'Генератор мета-тегов title и description',
      'Open Graph Preview для соцсетей',
      'Генератор robots.txt',
      'Генератор XML Sitemap',
      'Проверка структуры заголовков H1-H6',
      'Анализ плотности ключевых слов',
    ],
    useCases: 'SEO-инструменты используют веб-мастера, SEO-специалисты, копирайтеры и владельцы сайтов для улучшения видимости в поисковых системах и увеличения органического трафика.',
  },
  network: {
    h1: 'Онлайн сетевые инструменты — IP, MAC, порты',
    intro: 'Профессиональные онлайн-инструменты для сетевых администраторов: IP-калькулятор, калькулятор подсетей CIDR, MAC Lookup, справочник портов, парсер User-Agent. Без командной строки, прямо в браузере.',
    features: [
      'IP калькулятор: подсети, маски, CIDR',
      'Калькулятор подсетей IPv4',
      'MAC Address Lookup',
      'Справочник TCP/UDP портов',
      'User-Agent Parser',
    ],
    useCases: 'Сетевые инструменты используют системные администраторы, сетевые инженеры и DevOps-специалисты при настройке сетевой инфраструктуры.',
  },
  units: {
    h1: 'Онлайн справочники единиц измерения и размеров',
    intro: 'Бесплатные онлайн-справочники единиц измерения: размеры обуви и одежды EU/US/UK, разрешения экранов, форматы бумаги, кулинарные меры. Удобно при международных покупках и путешествиях.',
    features: [
      'Таблица размеров обуви EU, US, UK, JP',
      'Таблица размеров одежды EU, US, UK',
      'Справочник разрешений экранов и PPI',
      'Форматы бумаги A4, Letter, Legal',
      'Кулинарный конвертер мер',
    ],
    useCases: 'Справочники единиц незаменимы при покупках в иностранных магазинах, интернет-торговле и при работе с международными документами.',
  },
  productivity: {
    h1: 'Онлайн инструменты для продуктивности — бесплатно',
    intro: 'Бесплатные онлайн-инструменты для продуктивности: таймер Помодоро, список задач, заметки, тест скорости печати, расчёт времени чтения. Работают в браузере и сохраняют данные локально.',
    features: [
      'Таймер Помодоро (25/5 мин)',
      'Список задач ToDo с localStorage',
      'Онлайн блокнот для заметок',
      'Расчёт времени чтения',
      'Тест скорости печати (WPM)',
    ],
    useCases: 'Инструменты продуктивности используют фрилансеры, студенты, менеджеры и все, кто хочет лучше управлять временем и задачами.',
  },
  datetime: {
    h1: 'Онлайн инструменты для работы с датой и временем',
    intro: 'Точные онлайн-инструменты для работы с датами и временем: мировые часы, конвертер часовых поясов, разница дат, Unix timestamp, календарь с праздниками. С учётом летнего времени и международных стандартов.',
    features: [
      'Мировые часы в реальном времени',
      'Конвертер часовых поясов UTC/GMT',
      'Разница между двумя датами',
      'Unix Timestamp конвертер',
      'Таймер и секундомер',
      'Калькулятор возраста',
      'Онлайн календарь с праздниками',
    ],
    useCases: 'Инструменты для дат и времени используют путешественники, удалённые команды, разработчики и все, кто работает в разных часовых поясах.',
  },
};

const groupSeoContentEn: Record<string, { h1: string; intro: string; features: string[]; useCases: string }> = {
  converters: {
    h1: 'Free Online Unit Converters',
    intro: 'A collection of free online converters for instant unit conversion. Temperature, length, weight, volume, speed, energy, pressure and more — all in one place. Converters work right in your browser: no apps to download or registration required. Results appear instantly with high precision.',
    features: [
      'Temperature converters: Celsius, Fahrenheit, Kelvin',
      'Length converters: meters, feet, inches, miles',
      'Weight converters: kg, pounds, ounces, tons',
      'Volume converters: liters, gallons, cubic meters',
      'Speed converters: km/h, m/s, mph',
      'Data converters: bytes, KB, MB, GB, TB',
      'Color converter: HEX, RGB, CMYK, HSL',
      'GPS coordinate converter: DD, DMS, DDM',
    ],
    useCases: 'Unit converters are indispensable for students solving problems, engineers designing systems, developers building international services, and travelers. Especially useful when working with foreign documents, recipes, and technical documentation.',
  },
  calculators: {
    h1: 'Free Online Calculators',
    intro: 'Professional online calculators for financial, scientific and everyday calculations. Mortgage, loans, taxes, salary, percentages, discounts — all calculated instantly right in your browser. Use ready-made formulas without risk of manual calculation errors.',
    features: [
      'Mortgage and loan calculator with schedule',
      'Percentage, discount and markup calculator',
      'Tax calculator (income tax, VAT)',
      'Salary calculator (net/gross)',
      'Scientific calculator with history',
      'Compound interest calculator',
      'Tip calculator and bill splitter',
    ],
    useCases: 'Online calculators are used by students, accountants, financial professionals, entrepreneurs and everyday users. They allow you to quickly verify calculations, compare options and make informed decisions.',
  },
  text: {
    h1: 'Free Online Text Tools',
    intro: 'A complete set of free online tools for working with text. Formatting, cleaning, word counting, case conversion, text comparison, line sorting and more. All tools work in the browser — paste text and get results instantly.',
    features: [
      'Word, character and reading time counter',
      'Case converter: UPPER, lower, Title, camelCase',
      'Text formatter and cleaner',
      'Duplicate line remover',
      'Text line sorter',
      'Text comparison (diff)',
      'Cyrillic transliteration',
      'Find and replace with regex support',
    ],
    useCases: 'Text tools are essential for SEO specialists, copywriters, editors, developers and students. They save time on routine text operations that are hard to do manually.',
  },
  images: {
    h1: 'Free Online Image Editors',
    intro: 'Free online tools for image processing right in your browser. Compression, resizing, cropping, filters, background removal — without Photoshop and without installing software. Your photos are processed locally and never sent to a server.',
    features: [
      'Image compression: WebP, JPEG, PNG',
      'Resize with aspect ratio preservation',
      'Photo cropping with custom ratios',
      'Rotation and mirroring',
      'Filters: brightness, contrast, sharpness',
      'Background removal (transparent PNG)',
      'Favicon generator (ICO, PNG, SVG)',
      'Pixel art editor',
    ],
    useCases: 'Online editors are used by bloggers, social media managers, designers, developers and anyone working with visual content. Perfect for quick photo editing without heavy software.',
  },
  generators: {
    h1: 'Online Generators — Passwords, QR, UUID, Data',
    intro: 'A collection of free online generators: strong passwords, QR codes, barcodes, UUIDs, color palettes, Lorem Ipsum, random numbers and more. Generation happens instantly right in your browser without limits.',
    features: [
      'Customizable password generator',
      'QR code generator (URL, Wi-Fi, vCard)',
      'UUID v4 and GUID generator',
      'Hash generator: MD5, SHA-256, SHA-512',
      'Color palette generator',
      'Lorem Ipsum text generator',
      'Random number generator',
      'Test data generator (JSON/CSV)',
    ],
    useCases: 'Generators are essential for developers, testers, designers and marketers. Used for creating test data, generating identifiers, and producing visual materials.',
  },
  developers: {
    h1: 'Free Online Developer Tools',
    intro: 'Professional online tools for developers: formatters, validators, decoders, testers and references. JSON, CSS, JavaScript, SQL, HTML, regex, JWT, YAML, XML — all available right in your browser. No extensions or registration needed.',
    features: [
      'JSON Formatter, minifier and validator',
      'Regex tester with match highlighting',
      'JWT Decoder and validator',
      'CSS/JS/HTML/SQL formatters',
      'YAML ↔ JSON converter',
      'Code Diff Checker',
      'CSS Flexbox and Grid Playground',
      'HTTP status codes reference',
    ],
    useCases: 'Developer tools are used daily by frontend and backend developers, DevOps engineers, QA testers and technical managers.',
  },
  math: {
    h1: 'Free Online Math Calculators',
    intro: 'Mathematical online calculators for solving equations, working with matrices, statistical analysis and graph plotting. Accurate results using proven algorithms. Works in the browser without specialized software.',
    features: [
      'Linear and quadratic equation solver',
      'Matrix calculator (determinant, inverse)',
      'Statistics: mean, median, variance',
      'Factorial and combinatorics',
      'Function graph plotter',
      'Fraction and proportion calculator',
      'GCD and LCM',
      'Prime number checker',
    ],
    useCases: 'Math tools are used by students, teachers, engineers and researchers for solving problems, verifying calculations and studying mathematics.',
  },
  health: {
    h1: 'Free Online Health & Fitness Calculators',
    intro: 'Free online calculators for health and fitness: BMI, calorie needs, ideal weight, heart rate zones, sleep calculator and water intake. Calculations based on scientifically proven formulas for health monitoring.',
    features: [
      'BMI calculator (Body Mass Index)',
      'Calorie needs: BMR/TDEE',
      'Ideal weight by multiple formulas',
      'Training heart rate zones',
      'Sleep calculator by phases',
      'Daily water intake',
      'Body fat percentage',
      'Pregnancy calculator',
    ],
    useCases: 'Health calculators are used by health-conscious individuals, athletes, fitness trainers and doctors. Results are for informational purposes and do not replace professional medical advice.',
  },
  finance: {
    h1: 'Free Online Financial Calculators',
    intro: 'Free financial online calculators for budget planning, investments, loans and deposits. All calculations use standard financial formulas right in your browser — no data transmission.',
    features: [
      'Personal budget planner',
      'Investment ROI calculator',
      'Inflation calculator',
      'Retirement calculator',
      'Deposit calculator',
      'Loan and mortgage calculators',
      'Compound interest calculator',
    ],
    useCases: 'Financial calculators are essential for planning large purchases, comparing bank offers and analyzing investment decisions.',
  },
  security: {
    h1: 'Online Data & Security Tools',
    intro: 'Free online tools for data and security: hash generators, validators, password checkers. All operations are performed locally in your browser — your data never leaves your device.',
    features: [
      'Password strength checker',
      'Email address validator',
      'URL and IP address validator',
      'Phone number validator',
      'Test data generator (JSON/CSV)',
      'Checksum calculator',
    ],
    useCases: 'Security tools are used by developers, system administrators, IT professionals and anyone who values data protection.',
  },
  entertainment: {
    h1: 'Free Online Randomizers & Entertainment',
    intro: 'Fun online tools for random selection and entertainment: wheel spinner, dice roller, coin flip, decision maker. For games, team events and making tough decisions.',
    features: [
      'Wheel spinner with custom options',
      'Virtual dice D4-D20',
      'Coin flip',
      'Random picker from list',
      'Decision helper',
      'Random team generator',
      'Event countdown timer',
    ],
    useCases: 'Randomizers are used for parties, family games, contests, team drafts and any situation requiring an unbiased random choice.',
  },
  media: {
    h1: 'Online Audio Tools — Metronome, Noise, Tones',
    intro: 'Free online tools for working with audio using the browser Web Audio API: metronome, tone generator, white noise. For musicians, audiophiles and anyone working with sound.',
    features: [
      'Online metronome (20-300 BPM)',
      'Tone generator (20 Hz — 20 kHz)',
      'White, pink and brown noise',
      'Video aspect ratio calculator',
    ],
    useCases: 'Audio tools are used by musicians, music teachers, audiophiles and developers. They replace specialized software for simple tasks.',
  },
  encoding: {
    h1: 'Online Encoding & Decoding — Base64, URL, HTML',
    intro: 'Free online tools for encoding and decoding data: Base64, URL, HTML, Morse code, binary, Unicode. Instant processing in the browser without data transmission.',
    features: [
      'Base64 encoding and decoding',
      'URL encoding/decoding (percent-encoding)',
      'HTML entity escaping',
      'Morse code',
      'Text to binary code',
      'Unicode character reference',
    ],
    useCases: 'Encoding tools are used by developers for debugging, working with APIs and data transmission. Also useful for learning about encoding formats.',
  },
  qrbarcode: {
    h1: 'Online QR Code & Barcode Generators',
    intro: 'Free online QR code and barcode generators of professional quality. Create codes for URLs, Wi-Fi, vCards, EAN-13, UPC, Code128 without registration or watermarks. Download in PNG and SVG.',
    features: [
      'QR codes for URL, text, Wi-Fi, vCard',
      'Barcodes: EAN-13, UPC-A, Code128',
      'Color and size customization',
      'PNG and SVG download',
      'High resolution for printing',
    ],
    useCases: 'QR and barcodes are used by marketers, business owners, developers and anyone creating printed materials, packaging or advertising campaigns.',
  },
  color: {
    h1: 'Free Online Color Tools',
    intro: 'Professional online tools for working with color: color picker, color wheel, palettes, gradients, WCAG contrast checker, Tailwind and Material Design references. For designers and developers.',
    features: [
      'Color wheel with harmonic schemes',
      'WCAG AA/AAA contrast checker',
      'Color mixing and blending',
      'Palette extraction from images',
      'Tailwind CSS color reference',
      'Material Design color reference',
    ],
    useCases: 'Color tools are used by web designers, UX specialists, developers and marketers when creating interfaces, branding and visual content.',
  },
  seo: {
    h1: 'Online SEO Tools for Website Optimization',
    intro: 'Free SEO tools for optimizing your website for Google and other search engines: meta tag generator, Open Graph preview, robots.txt and sitemap.xml generators, heading and keyword density analysis.',
    features: [
      'Meta tag title and description generator',
      'Open Graph Preview for social media',
      'robots.txt generator',
      'XML Sitemap generator',
      'H1-H6 heading structure checker',
      'Keyword density analysis',
    ],
    useCases: 'SEO tools are used by webmasters, SEO specialists, copywriters and website owners to improve search engine visibility and increase organic traffic.',
  },
  network: {
    h1: 'Online Network Tools — IP, MAC, Ports',
    intro: 'Professional online tools for network administrators: IP calculator, CIDR subnet calculator, MAC Lookup, port reference, User-Agent parser. No command line needed, right in your browser.',
    features: [
      'IP calculator: subnets, masks, CIDR',
      'IPv4 subnet calculator',
      'MAC Address Lookup',
      'TCP/UDP port reference',
      'User-Agent Parser',
    ],
    useCases: 'Network tools are used by system administrators, network engineers and DevOps specialists when configuring network infrastructure.',
  },
  units: {
    h1: 'Online Unit & Size References',
    intro: 'Free online references for units and sizes: shoe and clothing sizes EU/US/UK, screen resolutions, paper formats, cooking measures. Convenient for international shopping and travel.',
    features: [
      'Shoe size chart: EU, US, UK, JP',
      'Clothing size chart: EU, US, UK',
      'Screen resolution and PPI reference',
      'Paper formats: A4, Letter, Legal',
      'Cooking measurement converter',
    ],
    useCases: 'Unit references are essential when shopping at foreign stores, in international trade and when working with international documents.',
  },
  productivity: {
    h1: 'Free Online Productivity Tools',
    intro: 'Free online productivity tools: Pomodoro timer, todo list, notes, typing speed test, reading time calculator. Work in the browser and save data locally.',
    features: [
      'Pomodoro Timer (25/5 min)',
      'Todo list with localStorage',
      'Online notepad',
      'Reading time calculator',
      'Typing speed test (WPM)',
    ],
    useCases: 'Productivity tools are used by freelancers, students, managers and anyone who wants to better manage their time and tasks.',
  },
  datetime: {
    h1: 'Online Date & Time Tools',
    intro: 'Precise online tools for working with dates and time: world clock, timezone converter, date difference, Unix timestamp, calendar with holidays. With daylight saving time support and international standards.',
    features: [
      'Real-time world clock',
      'UTC/GMT timezone converter',
      'Date difference calculator',
      'Unix Timestamp converter',
      'Timer and stopwatch',
      'Age calculator',
      'Online calendar with holidays',
    ],
    useCases: 'Date and time tools are used by travelers, remote teams, developers and anyone working across different time zones.',
  },
};

export default function GroupPage({ slug }: { slug: string }) {
  const theme = useTheme();
  const { locale, t, lHref } = useLanguage();
  const isEn = locale === 'en';
  const group = getGroupBySlug(slug);

  if (!group) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4">{isEn ? 'Category not found' : 'Категория не найдена'}</Typography>
      </Container>
    );
  }

  const groupTools = useMemo(() => getToolsByGroup(group.id), [group.id]);
  const relatedGroups = useMemo(() => toolGroups.filter(g => g.id !== group.id), [group.id]);
  const seoContent = isEn ? groupSeoContentEn[group.id] : groupSeoContent[group.id];

  // Pre-compute tool counts for related groups to avoid N×getToolsByGroup in render
  const relatedGroupCounts = useMemo(
    () => new Map(relatedGroups.map(g => [g.id, getToolsByGroup(g.id).length])),
    [relatedGroups]
  );
  const implementedGroupTools = useMemo(() => groupTools.filter(t => t.implemented), [groupTools]);
  const collectionPageJson = useMemo(
    () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: isEn ? ((group as any).nameEn || group.name) : (seoContent?.h1 || group.name),
      description: isEn ? ((group as any).descriptionEn || group.description) : group.description,
      url: `https://ulti-tools.com/${locale}/group/${group.slug}`,
      inLanguage: locale,
      numberOfItems: groupTools.length,
      hasPart: implementedGroupTools.slice(0, 24).map(t => ({
        '@type': 'SoftwareApplication',
        name: isEn ? ((t as any).nameEn || t.name) : ((t as any).seoTitle || t.name),
        url: `https://ulti-tools.com/${locale}/tools/${t.slug}`,
        applicationCategory: 'UtilitiesApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      })),
    }),
    [isEn, group, seoContent, locale, groupTools.length, implementedGroupTools]
  );
  const groupToolsListJson = useMemo(
    () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: isEn ? `${(group as any).nameEn || group.name} — tools` : `${group.name} — инструменты`,
      numberOfItems: implementedGroupTools.length,
      itemListElement: implementedGroupTools.slice(0, 80).map((t, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: isEn ? ((t as any).nameEn || t.name) : t.name,
          url: `https://ulti-tools.com/${locale}/tools/${t.slug}`,
          applicationCategory: 'UtilitiesApplication',
        },
      })),
    }),
    [isEn, group, implementedGroupTools, locale]
  );
  const relatedGroupsJson = useMemo(
    () => relatedGroups.length > 0
      ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: isEn ? 'More tool categories' : 'Другие категории инструментов',
        numberOfItems: relatedGroups.length,
        itemListElement: relatedGroups.map((g, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CollectionPage',
            name: isEn ? ((g as any).nameEn || g.name) : g.name,
            url: `https://ulti-tools.com/${locale}/group/${g.slug}`,
          },
        })),
      })
      : '',
    [relatedGroups, isEn, locale]
  );
  const breadcrumbJson = useMemo(
    () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Главная', item: `https://ulti-tools.com/${locale}` },
        { '@type': 'ListItem', position: 2, name: isEn ? ((group as any).nameEn || group.name) : group.name, item: `https://ulti-tools.com/${locale}/group/${group.slug}` },
      ],
    }),
    [isEn, locale, group]
  );
  const groupFaqJson = useMemo(
    () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: isEn
            ? `What tools are included in ${(group as any).nameEn || group.name}?`
            : `Какие инструменты есть в категории «${group.name}»?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: isEn
              ? `${implementedGroupTools.length} tools are available in this category.`
              : `В этой категории доступно ${implementedGroupTools.length} инструментов.`,
          },
        },
        {
          '@type': 'Question',
          name: isEn
            ? 'Are these tools free to use?'
            : 'Эти инструменты бесплатные?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: isEn
              ? 'Yes. Tools on Ultimate Tools are free and work in the browser without registration.'
              : 'Да. Инструменты Ultimate Tools бесплатны и работают в браузере без регистрации.',
          },
        },
        {
          '@type': 'Question',
          name: isEn
            ? 'Is my data sent to a server?'
            : 'Мои данные отправляются на сервер?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: isEn
              ? 'No. Core processing is done locally in the browser for privacy and speed.'
              : 'Нет. Базовая обработка выполняется локально в браузере для приватности и скорости.',
          },
        },
      ],
    }),
    [isEn, group, implementedGroupTools.length]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <Link href={lHref('/')} style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
          <Home sx={{ mr: 0.5, fontSize: 18 }} /> {t('toolPage.breadcrumb.home')}
        </Link>
        <Typography color="text.primary" fontWeight={500}>{isEn ? ((group as any).nameEn || group.name) : group.name}</Typography>
      </Breadcrumbs>

      {/* Header — SEO-оптимизированный H1 */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 18,
              bgcolor: alpha(group.color, 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DynamicIcon name={group.icon} sx={{ color: group.color, fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h3" component="h1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              {isEn ? ((group as any).nameEn || group.name) : (seoContent?.h1 || group.name)}
            </Typography>
            <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
              {isEn ? ((group as any).descriptionEn || group.description) : group.description} — <strong>{groupTools.length}</strong> {isEn ? 'tools' : 'инструментов'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tools Grid */}
      <Grid container spacing={2} sx={{ mb: 5 }}>
        {groupTools.map(tool => (
          <Grid key={tool.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ToolCard tool={tool} />
          </Grid>
        ))}
      </Grid>

      {/* SEO Content Block */}
      {seoContent && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 18,
            bgcolor: theme.palette.surfaceContainerLow,
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            mb: 4,
          }}
        >
          <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
            {isEn
              ? `${(group as any).nameEn || group.name} — free online tools`
              : `${group.name} — бесплатные онлайн-инструменты`}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {seoContent.intro}
          </Typography>

          <Typography variant="h6" component="h3" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
            {isEn ? `What's included in "${(group as any).nameEn || group.name}"` : `Что входит в категорию «${group.name}»`}
          </Typography>
          <List dense disablePadding>
            {seoContent.features.map((feat, i) => (
              <ListItem key={i} disableGutters sx={{ py: 0.3 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <CheckCircleOutline sx={{ fontSize: 16, color: group.color }} />
                </ListItemIcon>
                <ListItemText
                  primary={feat}
                  primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" component="h3" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
            {isEn ? 'Who are these tools for' : 'Кому подходят эти инструменты'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEn
              ? 'All tools work right in your browser without registration or installation — data is processed locally.'
              : `${seoContent.useCases} Все инструменты работают прямо в браузере без регистрации и установки — данные обрабатываются локально.`}
          </Typography>
        </Paper>
      )}

      {/* Related Groups */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" fontWeight={600} sx={{ mb: 2 }}>
          {isEn ? 'Other tool categories' : 'Другие категории инструментов'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {relatedGroups.map(g => (
            <Chip
              key={g.id}
              label={`${isEn ? ((g as any).nameEn || g.name) : g.name} (${relatedGroupCounts.get(g.id) ?? 0})`}
              component={Link}
              href={lHref(`/group/${g.slug}`)}
              clickable
              variant="outlined"
              sx={{ borderColor: alpha(g.color, 0.4) }}
            />
          ))}
        </Box>
      </Box>

      {/* JSON-LD: CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: collectionPageJson,
        }}
      />

      {/* JSON-LD: tool list for category (crawl / entity graph) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: groupToolsListJson,
        }}
      />

      {/* JSON-LD: other categories hub */}
      {relatedGroups.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: relatedGroupsJson,
          }}
        />
      )}

      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJson,
        }}
      />
      {/* JSON-LD: category FAQ for answer engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: groupFaqJson,
        }}
      />
    </Container>
  );
}
