import { Article } from '../articles';

export const colorArticles: Article[] = [
  // === Цветовое колесо ===
  {
    slug: 'color-wheel-guide',
    title: 'Цветовое колесо: руководство по теории цвета',
    titleEn: 'Color Wheel: A Guide to Color Theory',
    description: 'Как работает цветовое колесо, основные цветовые схемы и принципы гармонии цветов для дизайнеров.',
    descriptionEn: 'How the color wheel works, main color schemes, and principles of color harmony for designers.',
    toolSlug: 'color-wheel',
    type: 'guide',
    keywords: ['цветовое колесо', 'теория цвета', 'гармония цветов', 'цветовые схемы'],
    date: '2026-02-01',
    readTime: 8,
    content: `
## Что такое цветовое колесо?

Цветовое колесо — круговая диаграмма, показывающая взаимосвязи между цветами. Оно было разработано Исааком Ньютоном в 1666 году и остаётся фундаментальным инструментом дизайнеров.

## Типы цветов на колесе

- **Первичные** — красный, жёлтый, синий (нельзя получить смешиванием)
- **Вторичные** — оранжевый, зелёный, фиолетовый (смешивание двух первичных)
- **Третичные** — жёлто-оранжевый, красно-фиолетовый и др. (смешивание первичного и вторичного)

## Цветовые схемы

| Схема | Описание | Пример |
|---|---|---|
| Комплементарная | Противоположные на колесе | Синий + оранжевый |
| Аналоговая | Соседние цвета | Синий + голубой + зелёный |
| Триадная | 3 цвета через 120° | Красный + жёлтый + синий |
| Расщеплённая | Цвет + два соседних к комплементарному | Синий + жёлто-оранжевый + красно-оранжевый |
| Тетрадная | 4 цвета, две комплементарные пары | Синий + оранжевый + красный + зелёный |

## Тёплые и холодные цвета

Колесо делится на тёплую (красный, оранжевый, жёлтый) и холодную (синий, зелёный, фиолетовый) половины. Тёплые цвета создают ощущение энергии, холодные — спокойствия.

## Практическое применение

Используйте [Цветовое колесо](/tools/color-wheel) для подбора гармоничных сочетаний в дизайне интерфейсов, логотипов и маркетинговых материалов.

Смотрите также: [Смешивание цветов](/tools/color-blender), [Проверка контраста](/tools/contrast-checker), [Tailwind CSS цвета](/tools/tailwind-colors)
    `.trim(),
    contentEn: `
## What Is the Color Wheel?

The color wheel is a circular diagram showing the relationships between colors. It was developed by Isaac Newton in 1666 and remains a fundamental tool for designers.

## Types of Colors on the Wheel

- **Primary** — red, yellow, blue (cannot be created by mixing)
- **Secondary** — orange, green, violet (mixing two primaries)
- **Tertiary** — yellow-orange, red-violet, etc. (mixing a primary and a secondary)

## Color Schemes

| Scheme | Description | Example |
|---|---|---|
| Complementary | Opposite on the wheel | Blue + orange |
| Analogous | Adjacent colors | Blue + cyan + green |
| Triadic | 3 colors at 120° | Red + yellow + blue |
| Split-complementary | Color + two neighbors of complementary | Blue + yellow-orange + red-orange |
| Tetradic | 4 colors, two complementary pairs | Blue + orange + red + green |

## Warm and Cool Colors

The wheel is divided into a warm half (red, orange, yellow) and a cool half (blue, green, violet). Warm colors convey energy, cool colors convey calmness.

## Practical Application

Use the [Color Wheel](/tools/color-wheel) to find harmonious combinations for UI design, logos, and marketing materials.

See also: [Color Blender](/tools/color-blender), [Contrast Checker](/tools/contrast-checker), [Tailwind CSS Colors](/tools/tailwind-colors)
    `.trim(),
  },
  {
    slug: 'color-wheel-tips',
    title: '7 советов по работе с цветовым колесом',
    titleEn: '7 Tips for Working with the Color Wheel',
    description: 'Практические советы по подбору цветов: правило 60-30-10, контраст, психология цвета.',
    descriptionEn: 'Practical tips for choosing colors: the 60-30-10 rule, contrast, and color psychology.',
    toolSlug: 'color-wheel',
    type: 'tips',
    keywords: ['подбор цветов', 'советы дизайн', 'цветовые сочетания', 'палитра'],
    date: '2026-02-08',
    readTime: 5,
    content: `
## 7 советов по работе с цветом

### 1. Правило 60-30-10
Основной цвет занимает 60% площади, вторичный — 30%, акцентный — 10%. Эта пропорция создаёт визуальный баланс.

### 2. Начинайте с одного цвета
Выберите главный цвет бренда и стройте палитру вокруг него с помощью цветового колеса.

### 3. Используйте не более 3-4 цветов
Избыток цветов создаёт хаос. Ограничьте палитру тремя основными цветами и их оттенками.

### 4. Учитывайте психологию цвета
- Синий — доверие и стабильность
- Красный — энергия и срочность
- Зелёный — природа и рост
- Жёлтый — оптимизм и внимание

### 5. Проверяйте контраст
Текст должен быть читаемым. Используйте [Проверку контраста](/tools/contrast-checker) для оценки доступности.

### 6. Тестируйте на разных экранах
Цвета отображаются по-разному на мониторах, ноутбуках и смартфонах.

### 7. Вдохновляйтесь природой
Природные сочетания цветов всегда гармоничны — закат, лес, океан.

Смотрите также: [Цвета из изображения](/tools/image-colors), [Material Design цвета](/tools/material-colors)
    `.trim(),
    contentEn: `
## 7 Tips for Working with Color

### 1. The 60-30-10 Rule
The primary color takes up 60% of the space, the secondary — 30%, and the accent — 10%. This proportion creates visual balance.

### 2. Start with One Color
Choose the main brand color and build the palette around it using the color wheel.

### 3. Use No More Than 3-4 Colors
Too many colors create chaos. Limit the palette to three main colors and their shades.

### 4. Consider Color Psychology
- Blue — trust and stability
- Red — energy and urgency
- Green — nature and growth
- Yellow — optimism and attention

### 5. Check Contrast
Text must be readable. Use the [Contrast Checker](/tools/contrast-checker) to evaluate accessibility.

### 6. Test on Different Screens
Colors appear differently on monitors, laptops, and smartphones.

### 7. Get Inspired by Nature
Natural color combinations are always harmonious — sunsets, forests, oceans.

See also: [Image Colors](/tools/image-colors), [Material Design Colors](/tools/material-colors)
    `.trim(),
  },
  {
    slug: 'color-wheel-use-cases',
    title: 'Цветовое колесо: 6 сценариев применения',
    titleEn: 'Color Wheel: 6 Use Cases',
    description: 'Где и как применять цветовое колесо: веб-дизайн, брендинг, интерьер, мода, презентации.',
    descriptionEn: 'Where and how to use the color wheel: web design, branding, interiors, fashion, presentations.',
    toolSlug: 'color-wheel',
    type: 'use-cases',
    keywords: ['применение цветового колеса', 'дизайн цвет', 'брендинг цвет'],
    date: '2026-02-15',
    readTime: 5,
    content: `
## 6 сценариев применения цветового колеса

### 1. Веб-дизайн
Подбор цветовой схемы для сайта: фон, текст, кнопки, ссылки. Комплементарные цвета для кнопок CTA.

### 2. Брендинг и логотипы
Выбор фирменных цветов, которые передают ценности бренда и выделяют его среди конкурентов.

### 3. Дизайн интерьера
Гармоничное сочетание цветов стен, мебели и декора. Аналоговые схемы для спокойных пространств.

### 4. Мода и стиль
Подбор сочетающихся цветов одежды. Триадные схемы для ярких образов.

### 5. Презентации и инфографика
Цветовая кодировка данных и визуальная иерархия слайдов.

### 6. Иллюстрация и живопись
Выбор палитры для цифровых и традиционных работ с учётом настроения и атмосферы.

Попробуйте наш [Цветовое колесо](/tools/color-wheel) для поиска идеальных сочетаний.

Смотрите также: [Смешивание цветов](/tools/color-blender), [Конвертер цветов](/tools/color-converter), [Генератор палитр](/tools/palette-generator)
    `.trim(),
    contentEn: `
## 6 Use Cases for the Color Wheel

### 1. Web Design
Choosing a color scheme for a website: background, text, buttons, links. Complementary colors for CTA buttons.

### 2. Branding and Logos
Selecting brand colors that convey the brand's values and differentiate it from competitors.

### 3. Interior Design
Harmonious combinations of wall, furniture, and decor colors. Analogous schemes for calm spaces.

### 4. Fashion and Style
Choosing matching clothing colors. Triadic schemes for bold outfits.

### 5. Presentations and Infographics
Color coding for data and visual hierarchy of slides.

### 6. Illustration and Painting
Choosing a palette for digital and traditional works considering mood and atmosphere.

Try our [Color Wheel](/tools/color-wheel) to find perfect combinations.

See also: [Color Blender](/tools/color-blender), [Color Converter](/tools/color-converter), [Palette Generator](/tools/palette-generator)
    `.trim(),
  },

  // === Проверка контраста ===
  {
    slug: 'contrast-checker-guide',
    title: 'Проверка контраста: руководство по доступности цветов',
    titleEn: 'Contrast Checker: Color Accessibility Guide',
    description: 'Как проверить контраст текста по стандартам WCAG. Требования AA и AAA, формулы расчёта.',
    descriptionEn: 'How to check text contrast according to WCAG standards. AA and AAA requirements, calculation formulas.',
    toolSlug: 'contrast-checker',
    type: 'guide',
    keywords: ['контраст', 'wcag', 'доступность', 'a11y', 'цвет текста'],
    date: '2026-01-20',
    readTime: 7,
    content: `
## Зачем проверять контраст?

Контраст между текстом и фоном напрямую влияет на читаемость. По данным ВОЗ, более 2 миллиардов людей имеют нарушения зрения. Правильный контраст делает ваш сайт доступным для всех.

## Стандарт WCAG

Web Content Accessibility Guidelines определяет минимальные требования к контрасту:

| Уровень | Обычный текст | Крупный текст |
|---|---|---|
| AA | 4.5:1 | 3:1 |
| AAA | 7:1 | 4.5:1 |

Крупный текст — от 18pt (24px) или 14pt (18.66px) жирный.

## Как рассчитывается коэффициент контраста

Коэффициент определяется отношением относительной яркости более светлого цвета к более тёмному. Диапазон: от 1:1 (нет контраста) до 21:1 (чёрный на белом).

## Как использовать проверку контраста

1. Введите цвет текста (HEX, RGB или выберите пипеткой)
2. Введите цвет фона
3. Получите коэффициент контраста и оценку по WCAG AA/AAA

## Типичные ошибки

- Серый текст на белом фоне (#999 на #fff = 2.85:1 — не проходит)
- Цветной текст на цветном фоне без проверки
- Игнорирование контраста на мобильных устройствах

Смотрите также: [Цветовое колесо](/tools/color-wheel), [Смешивание цветов](/tools/color-blender), [Конвертер цветов](/tools/color-converter)
    `.trim(),
    contentEn: `
## Why Check Contrast?

The contrast between text and background directly affects readability. According to WHO, over 2 billion people have vision impairments. Proper contrast makes your site accessible to everyone.

## WCAG Standard

Web Content Accessibility Guidelines define minimum contrast requirements:

| Level | Normal Text | Large Text |
|---|---|---|
| AA | 4.5:1 | 3:1 |
| AAA | 7:1 | 4.5:1 |

Large text is 18pt (24px) or 14pt (18.66px) bold and above.

## How the Contrast Ratio Is Calculated

The ratio is determined by the relative luminance of the lighter color to the darker one. Range: from 1:1 (no contrast) to 21:1 (black on white).

## How to Use the Contrast Checker

1. Enter the text color (HEX, RGB, or pick with the eyedropper)
2. Enter the background color
3. Get the contrast ratio and WCAG AA/AAA rating

## Common Mistakes

- Gray text on a white background (#999 on #fff = 2.85:1 — fails)
- Colored text on a colored background without checking
- Ignoring contrast on mobile devices

See also: [Color Wheel](/tools/color-wheel), [Color Blender](/tools/color-blender), [Color Converter](/tools/color-converter)
    `.trim(),
  },
  {
    slug: 'contrast-checker-tips',
    title: '5 советов по обеспечению контрастности на сайте',
    titleEn: '5 Tips for Ensuring Contrast on Your Website',
    description: 'Практические рекомендации по контрасту для веб-дизайнеров и разработчиков.',
    descriptionEn: 'Practical contrast recommendations for web designers and developers.',
    toolSlug: 'contrast-checker',
    type: 'tips',
    keywords: ['контраст советы', 'доступность сайта', 'читаемость', 'wcag советы'],
    date: '2026-01-27',
    readTime: 5,
    content: `
## 5 советов по контрасту

### 1. Проверяйте все состояния элементов
Не только обычное состояние, но и hover, focus, disabled. Кнопка с хорошим контрастом может терять его при наведении.

### 2. Не полагайтесь только на цвет
Используйте иконки, подчёркивания и паттерны в дополнение к цвету. Ссылки должны отличаться не только цветом.

### 3. Тестируйте с реальным контентом
Заголовки, основной текст, подписи к изображениям — у каждого элемента свои требования к контрасту.

### 4. Используйте тёмную тему правильно
В тёмной теме избегайте чисто белого текста (#fff) на чёрном (#000) — это утомляет глаза. Используйте светло-серый (#e0e0e0) на тёмно-сером (#1a1a1a).

### 5. Автоматизируйте проверку
Интегрируйте проверку контраста в процесс дизайна. Проверяйте каждый новый цвет в [Проверке контраста](/tools/contrast-checker).

## Быстрая таблица безопасных сочетаний

| Текст | Фон | Коэффициент |
|---|---|---|
| #000000 | #ffffff | 21:1 |
| #333333 | #ffffff | 12.63:1 |
| #ffffff | #0066cc | 5.26:1 |
| #000000 | #ffcc00 | 13.07:1 |

Смотрите также: [Цветовое колесо](/tools/color-wheel), [Material Design цвета](/tools/material-colors)
    `.trim(),
    contentEn: `
## 5 Tips for Contrast

### 1. Check All Element States
Not just the default state, but also hover, focus, and disabled. A button with good contrast may lose it on hover.

### 2. Don't Rely on Color Alone
Use icons, underlines, and patterns in addition to color. Links should differ by more than just color.

### 3. Test with Real Content
Headings, body text, image captions — each element has its own contrast requirements.

### 4. Use Dark Theme Correctly
In dark themes, avoid pure white text (#fff) on black (#000) — it strains the eyes. Use light gray (#e0e0e0) on dark gray (#1a1a1a).

### 5. Automate the Check
Integrate contrast checking into your design process. Check every new color in the [Contrast Checker](/tools/contrast-checker).

## Quick Reference for Safe Combinations

| Text | Background | Ratio |
|---|---|---|
| #000000 | #ffffff | 21:1 |
| #333333 | #ffffff | 12.63:1 |
| #ffffff | #0066cc | 5.26:1 |
| #000000 | #ffcc00 | 13.07:1 |

See also: [Color Wheel](/tools/color-wheel), [Material Design Colors](/tools/material-colors)
    `.trim(),
  },
  {
    slug: 'contrast-checker-use-cases',
    title: 'Проверка контраста: когда и зачем использовать',
    titleEn: 'Contrast Checker: When and Why to Use It',
    description: 'Сценарии проверки контраста: веб-разработка, мобильные приложения, печатные материалы.',
    descriptionEn: 'Contrast checking scenarios: web development, mobile apps, printed materials.',
    toolSlug: 'contrast-checker',
    type: 'use-cases',
    keywords: ['контраст применение', 'доступность веб', 'wcag проверка'],
    date: '2026-02-03',
    readTime: 5,
    content: `
## Сценарии использования проверки контраста

### 1. Аудит доступности сайта
Проверьте все текстовые элементы сайта на соответствие WCAG AA. Это юридическое требование во многих странах.

### 2. Дизайн-система компании
При создании дизайн-системы убедитесь, что все цветовые токены проходят проверку контраста при любом сочетании.

### 3. Мобильные приложения
На солнце экран выцветает — проверьте, что интерфейс остаётся читаемым при сниженном контрасте.

### 4. Email-рассылки
Почтовые клиенты отображают цвета по-разному. Убедитесь в достаточном контрасте для всех платформ.

### 5. Печатные материалы
Цветной текст на цветном фоне буклетов и визиток требует проверки перед отправкой в типографию.

### 6. Цифровые вывески и табло
Информационные экраны в аэропортах, вокзалах и магазинах должны быть читаемы с расстояния.

Проверьте контраст ваших цветов в [Проверке контраста](/tools/contrast-checker).

Смотрите также: [Tailwind CSS цвета](/tools/tailwind-colors), [Цвета из изображения](/tools/image-colors), [Генератор палитр](/tools/palette-generator)
    `.trim(),
    contentEn: `
## Use Cases for Contrast Checking

### 1. Website Accessibility Audit
Check all text elements on the site for WCAG AA compliance. This is a legal requirement in many countries.

### 2. Company Design System
When building a design system, ensure that all color tokens pass contrast checks in any combination.

### 3. Mobile Applications
In sunlight, the screen washes out — check that the interface remains readable with reduced contrast.

### 4. Email Newsletters
Email clients render colors differently. Ensure sufficient contrast for all platforms.

### 5. Printed Materials
Colored text on colored backgrounds in brochures and business cards needs to be checked before sending to print.

### 6. Digital Signage and Displays
Information screens in airports, train stations, and stores must be readable from a distance.

Check the contrast of your colors in the [Contrast Checker](/tools/contrast-checker).

See also: [Tailwind CSS Colors](/tools/tailwind-colors), [Image Colors](/tools/image-colors), [Palette Generator](/tools/palette-generator)
    `.trim(),
  },

  // === Смешивание цветов ===
  {
    slug: 'color-blender-guide',
    title: 'Смешивание цветов: руководство по созданию оттенков',
    titleEn: 'Color Blending: A Guide to Creating Shades',
    description: 'Как смешивать цвета онлайн, создавать промежуточные оттенки и градиентные палитры.',
    descriptionEn: 'How to blend colors online, create intermediate shades, and gradient palettes.',
    toolSlug: 'color-blender',
    type: 'guide',
    keywords: ['смешивание цветов', 'оттенки', 'градиент', 'палитра'],
    date: '2026-01-25',
    readTime: 6,
    content: `
## Что такое смешивание цветов?

Смешивание цветов — процесс создания новых оттенков путём комбинирования двух или более цветов. В цифровом мире это делается математически, рассчитывая промежуточные значения между цветами.

## Аддитивное и субтрактивное смешивание

### Аддитивное (RGB)
Используется на экранах. Красный + зелёный = жёлтый. Все цвета вместе дают белый.

### Субтрактивное (CMYK)
Используется в печати. Жёлтый + голубой = зелёный. Все цвета вместе дают чёрный.

## Как использовать инструмент

1. Выберите два исходных цвета
2. Укажите количество промежуточных шагов
3. Получите серию плавно переходящих оттенков

## Применение промежуточных оттенков

| Задача | Шагов | Результат |
|---|---|---|
| Градиент для кнопки | 3-5 | Плавный переход |
| Палитра для дизайн-системы | 8-10 | Шкала оттенков |
| Тепловая карта | 5-7 | Визуализация данных |

## Цветовые пространства для смешивания

Смешивание в RGB даёт предсказуемые результаты для экрана. Смешивание в HSL сохраняет насыщенность промежуточных цветов.

Смотрите также: [Цветовое колесо](/tools/color-wheel), [Проверка контраста](/tools/contrast-checker), [Генератор градиентов](/tools/gradient-generator)
    `.trim(),
    contentEn: `
## What Is Color Blending?

Color blending is the process of creating new shades by combining two or more colors. In the digital world, this is done mathematically by calculating intermediate values between colors.

## Additive and Subtractive Blending

### Additive (RGB)
Used on screens. Red + green = yellow. All colors together produce white.

### Subtractive (CMYK)
Used in printing. Yellow + cyan = green. All colors together produce black.

## How to Use the Tool

1. Choose two source colors
2. Specify the number of intermediate steps
3. Get a series of smoothly transitioning shades

## Uses for Intermediate Shades

| Task | Steps | Result |
|---|---|---|
| Button gradient | 3-5 | Smooth transition |
| Design system palette | 8-10 | Shade scale |
| Heat map | 5-7 | Data visualization |

## Color Spaces for Blending

Blending in RGB gives predictable results for screens. Blending in HSL preserves the saturation of intermediate colors.

See also: [Color Wheel](/tools/color-wheel), [Contrast Checker](/tools/contrast-checker), [Gradient Generator](/tools/gradient-generator)
    `.trim(),
  },
  {
    slug: 'color-blender-tips',
    title: '5 советов по смешиванию цветов в дизайне',
    titleEn: '5 Tips for Blending Colors in Design',
    description: 'Практические приёмы смешивания цветов для создания гармоничных палитр и градиентов.',
    descriptionEn: 'Practical color blending techniques for creating harmonious palettes and gradients.',
    toolSlug: 'color-blender',
    type: 'tips',
    keywords: ['смешивание советы', 'цветовая палитра', 'градиент дизайн'],
    date: '2026-02-02',
    readTime: 4,
    content: `
## 5 советов по смешиванию цветов

### 1. Избегайте «грязных» промежуточных цветов
При смешивании комплементарных цветов (например, красного и зелёного) промежуточные оттенки могут выглядеть мутными. Добавьте третий точечный цвет.

### 2. Используйте HSL для сохранения яркости
Смешивание в пространстве HSL даёт более насыщенные промежуточные цвета, чем RGB.

### 3. Создавайте монохроматические палитры
Смешайте основной цвет с белым (tint) и чёрным (shade) для создания полной шкалы оттенков.

### 4. Тестируйте на доступность
Каждый промежуточный оттенок должен проходить проверку контраста для текстовых элементов.

### 5. Ограничьте количество шагов
3-5 шагов достаточно для большинства градиентов. Слишком много шагов создают визуальный шум.

## Рецепты популярных сочетаний

- **Закат**: #FF6B35 → #F7C59F (5 шагов)
- **Океан**: #0077B6 → #90E0EF (7 шагов)
- **Лес**: #2D6A4F → #95D5B2 (6 шагов)

Смотрите также: [Цвета из изображения](/tools/image-colors), [Tailwind CSS цвета](/tools/tailwind-colors)
    `.trim(),
    contentEn: `
## 5 Tips for Color Blending

### 1. Avoid "Muddy" Intermediate Colors
When blending complementary colors (e.g., red and green), intermediate shades can look murky. Add a third accent color.

### 2. Use HSL to Preserve Brightness
Blending in HSL space produces more saturated intermediate colors than RGB.

### 3. Create Monochromatic Palettes
Blend the main color with white (tint) and black (shade) to create a full shade scale.

### 4. Test for Accessibility
Every intermediate shade should pass the contrast check for text elements.

### 5. Limit the Number of Steps
3-5 steps are enough for most gradients. Too many steps create visual noise.

## Popular Combination Recipes

- **Sunset**: #FF6B35 → #F7C59F (5 steps)
- **Ocean**: #0077B6 → #90E0EF (7 steps)
- **Forest**: #2D6A4F → #95D5B2 (6 steps)

See also: [Image Colors](/tools/image-colors), [Tailwind CSS Colors](/tools/tailwind-colors)
    `.trim(),
  },
  {
    slug: 'color-blender-use-cases',
    title: 'Смешивание цветов: сценарии применения',
    titleEn: 'Color Blending: Use Cases',
    description: 'Где использовать смешивание цветов: дизайн-системы, градиенты, визуализация данных.',
    descriptionEn: 'Where to use color blending: design systems, gradients, data visualization.',
    toolSlug: 'color-blender',
    type: 'use-cases',
    keywords: ['смешивание применение', 'градиенты', 'дизайн-система цвета'],
    date: '2026-02-10',
    readTime: 5,
    content: `
## Сценарии использования смешивания цветов

### 1. Дизайн-системы
Создание шкалы оттенков от 50 до 900 для каждого цвета бренда. Смешайте основной цвет с белым и чёрным.

### 2. CSS-градиенты
Подберите промежуточные точки для плавного CSS-градиента без «полос» и артефактов.

### 3. Визуализация данных
Тепловые карты, графики и диаграммы используют цветовые шкалы для отображения значений.

### 4. Анимация цвета
Плавные переходы между состояниями элемента: обычное → hover → active.

### 5. Иллюстрации
Подбор промежуточных оттенков для теней, бликов и объёма в цифровых рисунках.

### 6. Карты и геоданные
Хороплетные карты используют градиентные палитры для отображения статистических данных по регионам.

Попробуйте [Смешивание цветов](/tools/color-blender) для создания собственных палитр.

Смотрите также: [Цветовое колесо](/tools/color-wheel), [Material Design цвета](/tools/material-colors), [Генератор градиентов](/tools/gradient-generator)
    `.trim(),
    contentEn: `
## Use Cases for Color Blending

### 1. Design Systems
Creating a shade scale from 50 to 900 for each brand color. Blend the base color with white and black.

### 2. CSS Gradients
Choose intermediate points for a smooth CSS gradient without banding and artifacts.

### 3. Data Visualization
Heat maps, charts, and diagrams use color scales to represent values.

### 4. Color Animation
Smooth transitions between element states: default → hover → active.

### 5. Illustrations
Selecting intermediate shades for shadows, highlights, and volume in digital drawings.

### 6. Maps and Geodata
Choropleth maps use gradient palettes to display statistical data by region.

Try [Color Blender](/tools/color-blender) to create your own palettes.

See also: [Color Wheel](/tools/color-wheel), [Material Design Colors](/tools/material-colors), [Gradient Generator](/tools/gradient-generator)
    `.trim(),
  },

  // === Цвета из изображения ===
  {
    slug: 'image-colors-guide',
    title: 'Извлечение цветов из изображения: полное руководство',
    titleEn: 'Extracting Colors from Images: Complete Guide',
    description: 'Как извлечь цветовую палитру из фото или изображения. Алгоритмы и практическое применение.',
    descriptionEn: 'How to extract a color palette from a photo or image. Algorithms and practical applications.',
    toolSlug: 'image-colors',
    type: 'guide',
    keywords: ['цвета из фото', 'палитра из изображения', 'извлечение цветов', 'пипетка'],
    date: '2026-02-12',
    readTime: 6,
    content: `
## Зачем извлекать цвета из изображений?

Фотографии, логотипы и произведения искусства содержат тщательно подобранные цветовые сочетания. Извлечение этих цветов позволяет использовать проверенные палитры в своих проектах.

## Как работает извлечение цветов

Алгоритм анализирует все пиксели изображения и группирует похожие цвета. Результат — набор доминирующих цветов, представляющих палитру изображения.

## Как использовать инструмент

1. Загрузите изображение (JPG, PNG, WebP)
2. Укажите количество цветов для извлечения (обычно 5-8)
3. Получите палитру с HEX-кодами каждого цвета

## Советы по выбору источника

- **Фотографии природы** — гармоничные естественные сочетания
- **Произведения искусства** — проверенные временем палитры
- **Скриншоты сайтов** — анализ конкурентов
- **Фото продукта** — цвета для landing page

## Формат результата

| Цвет | HEX | RGB | Доля |
|---|---|---|---|
| Основной фон | #2C3E50 | 44, 62, 80 | 35% |
| Акцент | #E74C3C | 231, 76, 60 | 15% |
| Вторичный | #ECF0F1 | 236, 240, 241 | 25% |

Смотрите также: [Цветовое колесо](/tools/color-wheel), [Смешивание цветов](/tools/color-blender), [Конвертер цветов](/tools/color-converter)
    `.trim(),
    contentEn: `
## Why Extract Colors from Images?

Photographs, logos, and artwork contain carefully selected color combinations. Extracting these colors allows you to use proven palettes in your projects.

## How Color Extraction Works

The algorithm analyzes all pixels in the image and groups similar colors. The result is a set of dominant colors representing the image's palette.

## How to Use the Tool

1. Upload an image (JPG, PNG, WebP)
2. Specify the number of colors to extract (usually 5-8)
3. Get a palette with the HEX code of each color

## Tips for Choosing a Source

- **Nature photos** — harmonious natural combinations
- **Artwork** — time-tested palettes
- **Website screenshots** — competitor analysis
- **Product photos** — colors for a landing page

## Result Format

| Color | HEX | RGB | Share |
|---|---|---|---|
| Main background | #2C3E50 | 44, 62, 80 | 35% |
| Accent | #E74C3C | 231, 76, 60 | 15% |
| Secondary | #ECF0F1 | 236, 240, 241 | 25% |

See also: [Color Wheel](/tools/color-wheel), [Color Blender](/tools/color-blender), [Color Converter](/tools/color-converter)
    `.trim(),
  },
  {
    slug: 'image-colors-tips',
    title: '5 советов по извлечению цветов из изображений',
    titleEn: '5 Tips for Extracting Colors from Images',
    description: 'Как получить лучшие результаты при извлечении палитры: выбор фото, настройки, применение.',
    descriptionEn: 'How to get the best results when extracting a palette: photo selection, settings, application.',
    toolSlug: 'image-colors',
    type: 'tips',
    keywords: ['извлечение цветов советы', 'палитра из фото', 'подбор цветов'],
    date: '2026-02-20',
    readTime: 4,
    content: `
## 5 советов по извлечению цветов

### 1. Выбирайте качественные изображения
Размытые или сжатые фото дают искажённые цвета. Используйте оригиналы в высоком разрешении.

### 2. Обрезайте ненужные области
Если вам нужны цвета только конкретного объекта, обрежьте фон перед извлечением.

### 3. Экспериментируйте с количеством цветов
5 цветов — для минималистичной палитры. 8-10 — для детальной проработки оттенков.

### 4. Проверяйте контраст извлечённых цветов
Не все цвета из фото подходят для текста. Обязательно проверьте контраст парных сочетаний.

### 5. Комбинируйте с цветовым колесом
Извлечённые цвета используйте как основу, а дополнительные подберите через цветовое колесо.

## Лучшие источники для вдохновения

- Фотографии закатов и рассветов
- Макросъёмка цветов и насекомых
- Городские пейзажи в «золотой час»
- Произведения импрессионистов

Смотрите также: [Проверка контраста](/tools/contrast-checker), [Генератор палитр](/tools/palette-generator)
    `.trim(),
    contentEn: `
## 5 Tips for Extracting Colors

### 1. Choose High-Quality Images
Blurry or heavily compressed photos produce distorted colors. Use high-resolution originals.

### 2. Crop Unnecessary Areas
If you only need colors from a specific object, crop the background before extracting.

### 3. Experiment with the Number of Colors
5 colors — for a minimalist palette. 8-10 — for detailed shade development.

### 4. Check the Contrast of Extracted Colors
Not all colors from a photo are suitable for text. Always check the contrast of paired combinations.

### 5. Combine with the Color Wheel
Use extracted colors as a base, and select additional ones using the color wheel.

## Best Sources for Inspiration

- Sunset and sunrise photos
- Macro photography of flowers and insects
- Urban landscapes during the "golden hour"
- Impressionist artworks

See also: [Contrast Checker](/tools/contrast-checker), [Palette Generator](/tools/palette-generator)
    `.trim(),
  },
  {
    slug: 'image-colors-use-cases',
    title: 'Цвета из изображения: 5 сценариев использования',
    titleEn: 'Image Colors: 5 Use Cases',
    description: 'Где применять извлечение цветов: брендинг, веб-дизайн, интерьер, мода, соцсети.',
    descriptionEn: 'Where to apply color extraction: branding, web design, interiors, fashion, social media.',
    toolSlug: 'image-colors',
    type: 'use-cases',
    keywords: ['цвета из фото применение', 'палитра бренд', 'цвета для сайта'],
    date: '2026-02-28',
    readTime: 5,
    content: `
## 5 сценариев использования

### 1. Брендинг на основе фотографии
Извлеките цвета из ключевого изображения бренда и постройте визуальную идентичность вокруг них.

### 2. Дизайн лендинга
Загрузите фото главного продукта и используйте его цвета для оформления страницы. Это создаёт визуальную целостность.

### 3. Оформление социальных сетей
Единый стиль постов: извлеките палитру из фирменного фото и применяйте её ко всем публикациям.

### 4. Дизайн интерьера
Сфотографируйте понравившийся интерьер и извлеките цвета для подбора краски и мебели.

### 5. Подбор гардероба
Сфотографируйте любимый наряд и найдите точные цвета для подбора аксессуаров и дополнений.

Попробуйте извлечь палитру в инструменте [Цвета из изображения](/tools/image-colors).

Смотрите также: [Цветовое колесо](/tools/color-wheel), [Tailwind CSS цвета](/tools/tailwind-colors), [Смешивание цветов](/tools/color-blender)
    `.trim(),
    contentEn: `
## 5 Use Cases

### 1. Photo-Based Branding
Extract colors from the brand's key image and build visual identity around them.

### 2. Landing Page Design
Upload the main product photo and use its colors for page styling. This creates visual coherence.

### 3. Social Media Styling
Consistent post style: extract a palette from the brand photo and apply it to all publications.

### 4. Interior Design
Photograph a favorite interior and extract colors for selecting paint and furniture.

### 5. Wardrobe Matching
Photograph a favorite outfit and find exact colors for selecting accessories and additions.

Try extracting a palette with the [Image Colors](/tools/image-colors) tool.

See also: [Color Wheel](/tools/color-wheel), [Tailwind CSS Colors](/tools/tailwind-colors), [Color Blender](/tools/color-blender)
    `.trim(),
  },

  // === Tailwind CSS цвета ===
  {
    slug: 'tailwind-colors-guide',
    title: 'Tailwind CSS цвета: полный справочник палитры',
    titleEn: 'Tailwind CSS Colors: Complete Palette Reference',
    description: 'Все цвета Tailwind CSS с оттенками 50-950. Как использовать цветовые утилиты в проектах.',
    descriptionEn: 'All Tailwind CSS colors with shades 50-950. How to use color utilities in projects.',
    toolSlug: 'tailwind-colors',
    type: 'guide',
    keywords: ['tailwind', 'tailwind css', 'цвета tailwind', 'утилиты цветов'],
    date: '2026-01-15',
    readTime: 7,
    content: `
## Палитра Tailwind CSS

Tailwind CSS предоставляет тщательно подобранную палитру из 22 цветов, каждый с 11 оттенками (от 50 до 950). Это более 240 готовых цветов для любого проекта.

## Структура именования

Формат: \`{свойство}-{цвет}-{оттенок}\`

- \`bg-blue-500\` — фон синего цвета средней яркости
- \`text-gray-900\` — тёмно-серый текст
- \`border-red-300\` — светло-красная рамка

## Шкала оттенков

| Оттенок | Применение |
|---|---|
| 50 | Очень светлый фон |
| 100-200 | Фон карточек, подложки |
| 300-400 | Рамки, разделители |
| 500 | Основной цвет |
| 600-700 | Hover-состояния, акценты |
| 800-900 | Текст, заголовки |
| 950 | Максимально тёмный |

## Семантические цвета

Рекомендуется создавать семантические переменные:
- **Primary** — основной цвет действий
- **Secondary** — вторичный цвет
- **Success** — green-500
- **Warning** — amber-500
- **Error** — red-500

## Кастомизация

Tailwind позволяет расширять палитру через tailwind.config.js, добавляя собственные цвета и оттенки.

Смотрите также: [Material Design цвета](/tools/material-colors), [Проверка контраста](/tools/contrast-checker), [Конвертер цветов](/tools/color-converter)
    `.trim(),
    contentEn: `
## Tailwind CSS Palette

Tailwind CSS provides a carefully curated palette of 22 colors, each with 11 shades (from 50 to 950). That's over 240 ready-made colors for any project.

## Naming Structure

Format: \`{property}-{color}-{shade}\`

- \`bg-blue-500\` — medium-brightness blue background
- \`text-gray-900\` — dark gray text
- \`border-red-300\` — light red border

## Shade Scale

| Shade | Usage |
|---|---|
| 50 | Very light background |
| 100-200 | Card backgrounds, surfaces |
| 300-400 | Borders, dividers |
| 500 | Primary color |
| 600-700 | Hover states, accents |
| 800-900 | Text, headings |
| 950 | Darkest |

## Semantic Colors

It is recommended to create semantic variables:
- **Primary** — main action color
- **Secondary** — secondary color
- **Success** — green-500
- **Warning** — amber-500
- **Error** — red-500

## Customization

Tailwind allows extending the palette through tailwind.config.js by adding custom colors and shades.

See also: [Material Design Colors](/tools/material-colors), [Contrast Checker](/tools/contrast-checker), [Color Converter](/tools/color-converter)
    `.trim(),
  },
  {
    slug: 'tailwind-colors-tips',
    title: '6 советов по работе с цветами в Tailwind CSS',
    titleEn: '6 Tips for Working with Colors in Tailwind CSS',
    description: 'Практические советы по использованию цветовой палитры Tailwind: темы, кастомизация, доступность.',
    descriptionEn: 'Practical tips for using the Tailwind color palette: themes, customization, accessibility.',
    toolSlug: 'tailwind-colors',
    type: 'tips',
    keywords: ['tailwind советы', 'tailwind цвета', 'tailwind тема', 'dark mode tailwind'],
    date: '2026-01-22',
    readTime: 5,
    content: `
## 6 советов по цветам в Tailwind CSS

### 1. Используйте CSS-переменные для тем
Определите цвета через CSS-переменные и переключайте их для светлой и тёмной тем.

### 2. Соблюдайте контраст
Текст с оттенком 900 на фоне 50 — безопасная комбинация. Проверяйте промежуточные варианты в [Проверке контраста](/tools/contrast-checker).

### 3. Группируйте цвета по назначению
Создайте семантические классы: primary, secondary, accent, neutral — вместо прямого использования blue-500.

### 4. Не используйте слишком много цветов
Ограничьтесь 2-3 основными цветами палитры Tailwind и их оттенками.

### 5. Используйте opacity-модификаторы
\`bg-blue-500/75\` — фон с 75% прозрачностью. Удобно для оверлеев и полупрозрачных элементов.

### 6. Тестируйте тёмную тему
Утилита \`dark:\` позволяет задать альтернативные цвета. Убедитесь, что все элементы читаемы.

Смотрите также: [Цветовое колесо](/tools/color-wheel), [Цвета из изображения](/tools/image-colors)
    `.trim(),
    contentEn: `
## 6 Tips for Colors in Tailwind CSS

### 1. Use CSS Variables for Themes
Define colors via CSS variables and toggle them for light and dark themes.

### 2. Maintain Contrast
Text with shade 900 on a 50 background is a safe combination. Check intermediate variants in the [Contrast Checker](/tools/contrast-checker).

### 3. Group Colors by Purpose
Create semantic classes: primary, secondary, accent, neutral — instead of directly using blue-500.

### 4. Don't Use Too Many Colors
Limit yourself to 2-3 main Tailwind palette colors and their shades.

### 5. Use Opacity Modifiers
\`bg-blue-500/75\` — background with 75% opacity. Convenient for overlays and semi-transparent elements.

### 6. Test the Dark Theme
The \`dark:\` utility lets you set alternative colors. Make sure all elements remain readable.

See also: [Color Wheel](/tools/color-wheel), [Image Colors](/tools/image-colors)
    `.trim(),
  },
  {
    slug: 'tailwind-colors-use-cases',
    title: 'Tailwind CSS цвета: сценарии применения',
    titleEn: 'Tailwind CSS Colors: Use Cases',
    description: 'Как использовать палитру Tailwind: дизайн-системы, прототипирование, email-шаблоны.',
    descriptionEn: 'How to use the Tailwind palette: design systems, prototyping, email templates.',
    toolSlug: 'tailwind-colors',
    type: 'use-cases',
    keywords: ['tailwind применение', 'tailwind дизайн', 'tailwind прототипирование'],
    date: '2026-01-30',
    readTime: 5,
    content: `
## Сценарии использования цветов Tailwind CSS

### 1. Быстрое прототипирование
Готовая палитра позволяет мгновенно стилизовать интерфейс без подбора цветов вручную.

### 2. Дизайн-система компании
Базируйте корпоративную дизайн-систему на палитре Tailwind, расширяя её фирменными цветами.

### 3. Компонентные библиотеки
Создавайте переиспользуемые компоненты с предсказуемыми цветами: кнопки, карточки, алерты.

### 4. Email-шаблоны
Используйте HEX-значения цветов Tailwind для стилизации email-рассылок с единым стилем.

### 5. Документация и туториалы
Стандартная палитра упрощает коммуникацию в команде: «используй gray-200 для фона».

### 6. Кроссплатформенная разработка
Цветовые токены Tailwind можно экспортировать в React Native, Flutter и другие фреймворки.

Найдите нужный цвет в [Tailwind CSS цвета](/tools/tailwind-colors).

Смотрите также: [Material Design цвета](/tools/material-colors), [Смешивание цветов](/tools/color-blender), [Проверка контраста](/tools/contrast-checker)
    `.trim(),
    contentEn: `
## Use Cases for Tailwind CSS Colors

### 1. Rapid Prototyping
The ready-made palette lets you instantly style an interface without manually picking colors.

### 2. Company Design System
Base the corporate design system on the Tailwind palette, extending it with brand colors.

### 3. Component Libraries
Create reusable components with predictable colors: buttons, cards, alerts.

### 4. Email Templates
Use Tailwind color HEX values to style email newsletters with a consistent look.

### 5. Documentation and Tutorials
A standard palette simplifies team communication: "use gray-200 for the background."

### 6. Cross-Platform Development
Tailwind color tokens can be exported to React Native, Flutter, and other frameworks.

Find the right color in [Tailwind CSS Colors](/tools/tailwind-colors).

See also: [Material Design Colors](/tools/material-colors), [Color Blender](/tools/color-blender), [Contrast Checker](/tools/contrast-checker)
    `.trim(),
  },

  // === Material Design цвета ===
  {
    slug: 'material-colors-guide',
    title: 'Material Design цвета: руководство по палитре Google',
    titleEn: 'Material Design Colors: Google Palette Guide',
    description: 'Полный обзор цветовой системы Material Design. Основные и акцентные цвета, оттенки, применение.',
    descriptionEn: 'Complete overview of the Material Design color system. Primary and accent colors, shades, applications.',
    toolSlug: 'material-colors',
    type: 'guide',
    keywords: ['material design', 'цвета google', 'material palette', 'android цвета'],
    date: '2026-02-06',
    readTime: 7,
    content: `
## Цветовая система Material Design

Material Design — дизайн-система Google, предоставляющая палитру из 19 основных цветов с 14 оттенками каждый (от 50 до 900 + акцентные A100-A700).

## Структура палитры

Каждый цвет имеет шкалу оттенков:

| Оттенок | Назначение |
|---|---|
| 50-100 | Светлые фоны |
| 200-300 | Второстепенные элементы |
| 500 | Основной цвет |
| 700 | Status bar (Android) |
| 900 | Максимально тёмный |
| A100-A700 | Акцентные варианты |

## Правила использования цветов

### Основной цвет (Primary)
Используется для toolbar, крупных блоков и основного акцента. Выберите оттенок 500.

### Вторичный цвет (Secondary)
Для кнопок действия (FAB), переключателей, ссылок. Обычно акцентный оттенок A200.

### Фоновые цвета
Светлые оттенки (50-100) для фона карточек и страниц.

## Material Design 3

Новая версия системы (Material You) автоматически генерирует палитру из одного цвета, создавая тональные группы и поверхности.

Смотрите также: [Tailwind CSS цвета](/tools/tailwind-colors), [Цветовое колесо](/tools/color-wheel), [Проверка контраста](/tools/contrast-checker)
    `.trim(),
    contentEn: `
## Material Design Color System

Material Design is Google's design system, providing a palette of 19 primary colors with 14 shades each (from 50 to 900 + accent shades A100-A700).

## Palette Structure

Each color has a shade scale:

| Shade | Purpose |
|---|---|
| 50-100 | Light backgrounds |
| 200-300 | Secondary elements |
| 500 | Primary color |
| 700 | Status bar (Android) |
| 900 | Darkest |
| A100-A700 | Accent variants |

## Color Usage Rules

### Primary Color
Used for toolbars, large blocks, and the main accent. Choose shade 500.

### Secondary Color
For action buttons (FAB), toggles, links. Usually accent shade A200.

### Background Colors
Light shades (50-100) for card and page backgrounds.

## Material Design 3

The new version (Material You) automatically generates a palette from a single color, creating tonal groups and surfaces.

See also: [Tailwind CSS Colors](/tools/tailwind-colors), [Color Wheel](/tools/color-wheel), [Contrast Checker](/tools/contrast-checker)
    `.trim(),
  },
  {
    slug: 'material-colors-tips',
    title: '5 советов по использованию цветов Material Design',
    titleEn: '5 Tips for Using Material Design Colors',
    description: 'Практические рекомендации по работе с палитрой Material Design в Android и веб-приложениях.',
    descriptionEn: 'Practical recommendations for working with the Material Design palette in Android and web apps.',
    toolSlug: 'material-colors',
    type: 'tips',
    keywords: ['material design советы', 'android дизайн', 'material palette советы'],
    date: '2026-02-14',
    readTime: 5,
    content: `
## 5 советов по Material Design цветам

### 1. Используйте правило 3-1
Один основной цвет, один акцентный и один нейтральный (серый). Это основа гармоничного интерфейса Material Design.

### 2. Акцентные цвета — для действий
Оттенки A200, A400 предназначены для интерактивных элементов: кнопок, ссылок, иконок действий.

### 3. Проверяйте контраст на поверхностях
Белый текст на основном цвете должен иметь коэффициент контраста не менее 4.5:1. Оттенки 500 и выше обычно подходят.

### 4. Не смешивайте случайные оттенки
Используйте оттенки одного цвета для создания иерархии: 900 для заголовков, 700 для текста, 300 для фона.

### 5. Тестируйте в тёмной теме
Material Design предлагает инвертированную палитру для тёмной темы: оттенок 200 вместо 500 для основного цвета.

## Популярные сочетания

| Primary | Secondary | Стиль |
|---|---|---|
| Indigo 500 | Pink A200 | Классический Material |
| Teal 500 | Orange A400 | Современный |
| Deep Purple 500 | Lime A200 | Творческий |

Смотрите также: [Tailwind CSS цвета](/tools/tailwind-colors), [Смешивание цветов](/tools/color-blender)
    `.trim(),
    contentEn: `
## 5 Tips for Material Design Colors

### 1. Use the 3-1 Rule
One primary color, one accent, and one neutral (gray). This is the foundation of a harmonious Material Design interface.

### 2. Accent Colors Are for Actions
Shades A200, A400 are intended for interactive elements: buttons, links, action icons.

### 3. Check Contrast on Surfaces
White text on the primary color should have a contrast ratio of at least 4.5:1. Shades 500 and above usually work.

### 4. Don't Mix Random Shades
Use shades of one color to create hierarchy: 900 for headings, 700 for text, 300 for backgrounds.

### 5. Test in Dark Theme
Material Design offers an inverted palette for dark theme: shade 200 instead of 500 for the primary color.

## Popular Combinations

| Primary | Secondary | Style |
|---|---|---|
| Indigo 500 | Pink A200 | Classic Material |
| Teal 500 | Orange A400 | Modern |
| Deep Purple 500 | Lime A200 | Creative |

See also: [Tailwind CSS Colors](/tools/tailwind-colors), [Color Blender](/tools/color-blender)
    `.trim(),
  },
  {
    slug: 'material-colors-use-cases',
    title: 'Material Design цвета: сценарии применения',
    titleEn: 'Material Design Colors: Use Cases',
    description: 'Где применять палитру Material Design: Android, веб, кроссплатформенные проекты.',
    descriptionEn: 'Where to apply the Material Design palette: Android, web, cross-platform projects.',
    toolSlug: 'material-colors',
    type: 'use-cases',
    keywords: ['material design применение', 'android приложение', 'google дизайн'],
    date: '2026-02-22',
    readTime: 5,
    content: `
## Сценарии использования Material Design цветов

### 1. Android-приложения
Стандартная палитра для нативных Android-приложений. Интегрируется с компонентами Material Components.

### 2. Веб-приложения на Angular/React
Библиотеки Angular Material и MUI (React) используют палитру Material Design по умолчанию.

### 3. Кроссплатформенная разработка
Flutter использует Material Design как основу. Цвета синхронизированы между платформами.

### 4. Дизайн-макеты в Figma
Плагины Material Design для Figma содержат всю палитру для быстрого прототипирования.

### 5. Корпоративные приложения
Material Design подходит для внутренних инструментов: дашборды, CRM, админ-панели.

### 6. Прогрессивные веб-приложения (PWA)
Цвет \`theme-color\` в manifest.json берётся из палитры Material для оформления системных элементов.

Найдите нужный цвет в [Material Design цвета](/tools/material-colors).

Смотрите также: [Tailwind CSS цвета](/tools/tailwind-colors), [Цветовое колесо](/tools/color-wheel), [Конвертер цветов](/tools/color-converter)
    `.trim(),
    contentEn: `
## Use Cases for Material Design Colors

### 1. Android Apps
The standard palette for native Android apps. Integrates with Material Components.

### 2. Angular/React Web Apps
Angular Material and MUI (React) libraries use the Material Design palette by default.

### 3. Cross-Platform Development
Flutter uses Material Design as its foundation. Colors are synchronized across platforms.

### 4. Design Mockups in Figma
Material Design plugins for Figma contain the full palette for rapid prototyping.

### 5. Enterprise Applications
Material Design is suitable for internal tools: dashboards, CRM, admin panels.

### 6. Progressive Web Apps (PWA)
The \`theme-color\` in manifest.json is taken from the Material palette for styling system elements.

Find the right color in [Material Design Colors](/tools/material-colors).

See also: [Tailwind CSS Colors](/tools/tailwind-colors), [Color Wheel](/tools/color-wheel), [Color Converter](/tools/color-converter)
    `.trim(),
  },
];
