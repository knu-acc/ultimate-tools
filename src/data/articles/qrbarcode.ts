import { Article } from '../articles';

export const qrbarcodeArticles: Article[] = [
  // === QR-код генератор ===
  {
    slug: 'qr-code-gen-guide',
    title: 'QR-код генератор: полное руководство по созданию QR-кодов',
    titleEn: 'QR Code Generator: Complete Guide to Creating QR Codes',
    description: 'Как создать QR-код онлайн: пошаговая инструкция, форматы данных, настройки размера и коррекции ошибок.',
    descriptionEn: 'How to create a QR code online: step-by-step instructions, data formats, size settings, and error correction.',
    toolSlug: 'qr-code-gen',
    type: 'guide',
    keywords: ['qr-код', 'генератор qr', 'создать qr-код', 'qr онлайн'],
    date: '2026-02-10',
    readTime: 7,
    content: `
## Что такое QR-код?

QR-код (Quick Response) — двумерный штрих-код, способный хранить до 4296 символов. Он был разработан в 1994 году компанией Denso Wave и сегодня используется повсеместно — от ресторанных меню до платёжных систем.

## Какие данные можно зашифровать

- **URL-адреса** — ссылки на сайты и лендинги
- **Текст** — любая текстовая информация
- **Wi-Fi** — параметры подключения к сети
- **Контакт (vCard)** — имя, телефон, email
- **Email** — автоматическое создание письма
- **Геолокация** — координаты на карте

## Как создать QR-код

### Шаг 1: Выберите тип данных
Определите, что будет закодировано: ссылка, текст, контакт или Wi-Fi.

### Шаг 2: Введите содержимое
Заполните поле данных. Для URL убедитесь, что ссылка начинается с https://.

### Шаг 3: Настройте параметры
| Параметр | Описание | Рекомендация |
|---|---|---|
| Размер | Разрешение изображения | 256×256 и выше |
| Коррекция ошибок | Устойчивость к повреждениям | Уровень M или H |
| Формат | PNG, SVG, JPEG | SVG для печати |

### Шаг 4: Скачайте и используйте
Сохраните QR-код в нужном формате. SVG подходит для печати, PNG — для веба.

## Уровни коррекции ошибок

- **L (Low)** — восстановление 7% данных
- **M (Medium)** — восстановление 15% данных
- **Q (Quartile)** — восстановление 25% данных
- **H (High)** — восстановление 30% данных

Смотрите также: [Штрих-код генератор](/tools/barcode-gen), [Base64 кодирование](/tools/base64-encoder), [Генератор UTM-меток](/tools/utm-generator)
    `.trim(),
    contentEn: `
## What Is a QR Code?

A QR code (Quick Response) is a two-dimensional barcode capable of storing up to 4,296 characters. It was developed in 1994 by Denso Wave and is now used everywhere — from restaurant menus to payment systems.

## What Data Can Be Encoded

- **URLs** — links to websites and landing pages
- **Text** — any textual information
- **Wi-Fi** — network connection parameters
- **Contact (vCard)** — name, phone, email
- **Email** — automatic email creation
- **Geolocation** — map coordinates

## How to Create a QR Code

### Step 1: Choose the Data Type
Decide what will be encoded: a link, text, contact, or Wi-Fi.

### Step 2: Enter the Content
Fill in the data field. For URLs, make sure the link starts with https://.

### Step 3: Configure the Settings
| Parameter | Description | Recommendation |
|---|---|---|
| Size | Image resolution | 256×256 and above |
| Error Correction | Damage resistance | Level M or H |
| Format | PNG, SVG, JPEG | SVG for print |

### Step 4: Download and Use
Save the QR code in the desired format. SVG is suitable for print, PNG — for the web.

## Error Correction Levels

- **L (Low)** — recovers 7% of data
- **M (Medium)** — recovers 15% of data
- **Q (Quartile)** — recovers 25% of data
- **H (High)** — recovers 30% of data

See also: [Barcode Generator](/tools/barcode-gen), [Base64 Encoding](/tools/base64-encoder), [UTM Tag Generator](/tools/utm-generator)
    `.trim(),
  },
  {
    slug: 'qr-code-gen-tips',
    title: '8 советов по созданию эффективных QR-кодов',
    titleEn: '8 Tips for Creating Effective QR Codes',
    description: 'Практические рекомендации по дизайну, размещению и тестированию QR-кодов для максимальной конверсии.',
    descriptionEn: 'Practical recommendations for designing, placing, and testing QR codes for maximum conversion.',
    toolSlug: 'qr-code-gen',
    type: 'tips',
    keywords: ['qr-код советы', 'дизайн qr', 'печать qr', 'qr маркетинг'],
    date: '2026-02-18',
    readTime: 5,
    content: `
## 8 советов для эффективных QR-кодов

### 1. Всегда тестируйте перед печатью
Отсканируйте QR-код несколькими устройствами. Разные камеры могут считывать по-разному.

### 2. Выбирайте высокую коррекцию ошибок
Уровень H позволяет QR-коду работать даже при повреждении до 30% площади.

### 3. Обеспечьте достаточный контраст
Тёмный код на светлом фоне — классика. Избегайте цветных фонов, снижающих контраст.

### 4. Не перегружайте данными
Чем больше данных, тем сложнее код и труднее сканирование. Используйте короткие ссылки.

### 5. Добавьте призыв к действию
Текст «Отсканируйте для скидки» или «Сканируйте меню» повышает конверсию на 30-50%.

### 6. Соблюдайте минимальный размер
Для печати QR-код должен быть не менее 2×2 см. Для билбордов — минимум 30×30 см.

### 7. Оставляйте тихую зону
Белое поле вокруг кода (минимум 4 модуля) обязательно для корректного сканирования.

### 8. Используйте SVG для печати
Векторный формат масштабируется без потери качества.

Смотрите также: [Штрих-код генератор](/tools/barcode-gen), [Open Graph Preview](/tools/og-preview)
    `.trim(),
    contentEn: `
## 8 Tips for Effective QR Codes

### 1. Always Test Before Printing
Scan your QR code with multiple devices. Different cameras may read them differently.

### 2. Choose High Error Correction
Level H allows a QR code to work even when up to 30% of its area is damaged.

### 3. Ensure Sufficient Contrast
A dark code on a light background is the classic approach. Avoid colored backgrounds that reduce contrast.

### 4. Don't Overload with Data
The more data, the more complex the code and the harder it is to scan. Use short links.

### 5. Add a Call to Action
Text like "Scan for a discount" or "Scan the menu" increases conversion by 30-50%.

### 6. Maintain Minimum Size
For print, a QR code should be at least 2×2 cm. For billboards — at least 30×30 cm.

### 7. Leave a Quiet Zone
A white border around the code (at least 4 modules) is required for proper scanning.

### 8. Use SVG for Print
Vector format scales without quality loss.

See also: [Barcode Generator](/tools/barcode-gen), [Open Graph Preview](/tools/og-preview)
    `.trim(),
  },
  {
    slug: 'qr-code-gen-use-cases',
    title: 'QR-коды: 7 сценариев применения в бизнесе и жизни',
    titleEn: 'QR Codes: 7 Use Cases in Business and Everyday Life',
    description: 'Где и как использовать QR-коды: маркетинг, рестораны, визитки, оплата, образование и логистика.',
    descriptionEn: 'Where and how to use QR codes: marketing, restaurants, business cards, payments, education, and logistics.',
    toolSlug: 'qr-code-gen',
    type: 'use-cases',
    keywords: ['qr-код применение', 'qr бизнес', 'qr маркетинг', 'qr оплата'],
    date: '2026-02-25',
    readTime: 6,
    content: `
## 7 сценариев использования QR-кодов

### 1. Ресторанное меню
Замените бумажное меню на QR-код на столе. Гости сканируют и видят актуальное меню с ценами.

### 2. Цифровые визитки
Закодируйте vCard с контактными данными. При сканировании контакт автоматически сохраняется в телефоне.

### 3. Маркетинговые материалы
Добавьте QR-код на листовки, баннеры и упаковку для перехода на лендинг или соцсети.

### 4. Wi-Fi без ввода пароля
Создайте QR-код с параметрами Wi-Fi сети. Гости подключаются одним сканированием.

### 5. Оплата и финансы
QR-коды используются в системах быстрых платежей (СБП) для мгновенного перевода средств.

### 6. Образование
Преподаватели размещают QR-коды на раздаточных материалах со ссылками на дополнительные ресурсы.

### 7. Логистика и склад
Маркировка товаров QR-кодами для отслеживания перемещения и инвентаризации.

Создайте свой QR-код в [QR-код генераторе](/tools/qr-code-gen).

Смотрите также: [Штрих-код генератор](/tools/barcode-gen), [Генератор мета-тегов](/tools/meta-generator), [Генератор UTM-меток](/tools/utm-generator)
    `.trim(),
    contentEn: `
## 7 QR Code Use Cases

### 1. Restaurant Menus
Replace paper menus with a QR code on the table. Guests scan and see the current menu with prices.

### 2. Digital Business Cards
Encode a vCard with contact information. When scanned, the contact is automatically saved to the phone.

### 3. Marketing Materials
Add a QR code to flyers, banners, and packaging to direct users to a landing page or social media.

### 4. Wi-Fi Without Entering a Password
Create a QR code with Wi-Fi network parameters. Guests connect with a single scan.

### 5. Payments and Finance
QR codes are used in instant payment systems for quick money transfers.

### 6. Education
Teachers place QR codes on handouts with links to additional resources.

### 7. Logistics and Warehousing
Labeling products with QR codes for tracking movement and inventory management.

Create your QR code in the [QR Code Generator](/tools/qr-code-gen).

See also: [Barcode Generator](/tools/barcode-gen), [Meta Tag Generator](/tools/meta-generator), [UTM Tag Generator](/tools/utm-generator)
    `.trim(),
  },

  // === Штрих-код генератор ===
  {
    slug: 'barcode-gen-guide',
    title: 'Штрих-код генератор: руководство по созданию штрих-кодов',
    titleEn: 'Barcode Generator: Guide to Creating Barcodes',
    description: 'Как создать штрих-код онлайн. Форматы EAN-13, Code128, UPC — какой выбрать и для чего.',
    descriptionEn: 'How to create a barcode online. EAN-13, Code128, UPC formats — which to choose and for what purpose.',
    toolSlug: 'barcode-gen',
    type: 'guide',
    keywords: ['штрих-код', 'генератор', 'ean-13', 'code128', 'barcode'],
    date: '2026-01-28',
    readTime: 7,
    content: `
## Что такое штрих-код?

Штрих-код — графическое представление данных в виде чередующихся чёрных и белых полос. Сканер считывает ширину полос и пробелов, декодируя информацию.

## Популярные форматы штрих-кодов

| Формат | Длина | Применение |
|---|---|---|
| EAN-13 | 13 цифр | Товары в магазинах (Европа, Россия) |
| EAN-8 | 8 цифр | Малые товары |
| UPC-A | 12 цифр | Товары в США и Канаде |
| Code128 | Любая | Логистика, склады |
| Code39 | Буквы + цифры | Промышленность |
| ITF-14 | 14 цифр | Транспортная упаковка |

## Как создать штрих-код

### Шаг 1: Выберите формат
Для розничных товаров в России используйте EAN-13. Для внутреннего учёта — Code128.

### Шаг 2: Введите данные
Для EAN-13 введите 12 цифр — контрольная цифра рассчитается автоматически.

### Шаг 3: Настройте отображение
Укажите ширину, высоту и нужно ли отображать текст под штрих-кодом.

### Шаг 4: Экспортируйте
Скачайте в PNG для экрана или SVG для печати.

## Структура EAN-13

- Первые 3 цифры — код страны (460-469 для России)
- Следующие 4-6 цифр — код производителя
- Далее — код товара
- Последняя цифра — контрольная сумма

Смотрите также: [QR-код генератор](/tools/qr-code-gen), [Генератор UUID](/tools/uuid-generator)
    `.trim(),
    contentEn: `
## What Is a Barcode?

A barcode is a graphical representation of data in the form of alternating black and white bars. A scanner reads the width of bars and spaces, decoding the information.

## Popular Barcode Formats

| Format | Length | Application |
|---|---|---|
| EAN-13 | 13 digits | Retail products (Europe, Russia) |
| EAN-8 | 8 digits | Small products |
| UPC-A | 12 digits | Products in the USA and Canada |
| Code128 | Any | Logistics, warehouses |
| Code39 | Letters + digits | Industry |
| ITF-14 | 14 digits | Shipping packaging |

## How to Create a Barcode

### Step 1: Choose the Format
For retail products in Russia, use EAN-13. For internal tracking — Code128.

### Step 2: Enter the Data
For EAN-13, enter 12 digits — the check digit is calculated automatically.

### Step 3: Configure the Display
Specify the width, height, and whether to display text below the barcode.

### Step 4: Export
Download in PNG for screen or SVG for print.

## EAN-13 Structure

- First 3 digits — country code (460-469 for Russia)
- Next 4-6 digits — manufacturer code
- Then — product code
- Last digit — checksum

See also: [QR Code Generator](/tools/qr-code-gen), [UUID Generator](/tools/uuid-generator)
    `.trim(),
  },
  {
    slug: 'barcode-gen-tips',
    title: '6 советов по работе со штрих-кодами',
    titleEn: '6 Tips for Working with Barcodes',
    description: 'Как правильно создавать и печатать штрих-коды: размеры, качество, тестирование.',
    descriptionEn: 'How to properly create and print barcodes: sizes, quality, and testing.',
    toolSlug: 'barcode-gen',
    type: 'tips',
    keywords: ['штрих-код печать', 'штрих-код качество', 'barcode советы'],
    date: '2026-02-05',
    readTime: 5,
    content: `
## 6 советов по работе со штрих-кодами

### 1. Соблюдайте минимальный размер
EAN-13 должен быть не менее 29.83 × 21.19 мм при стандартном масштабе. Уменьшение допустимо до 80%.

### 2. Обеспечьте тихую зону
Свободное пространство слева и справа от штрих-кода обязательно — минимум 3.63 мм для EAN-13.

### 3. Контраст имеет значение
Чёрные полосы на белом фоне — идеальный вариант. Избегайте красных и оранжевых фонов, так как сканеры используют красный лазер.

### 4. Проверяйте перед печатью
Всегда тестируйте штрих-код сканером перед массовой печатью.

### 5. Выбирайте правильный формат
- **EAN-13** — для розницы в России и Европе
- **Code128** — для внутреннего складского учёта
- **UPC-A** — для экспорта в США

### 6. Не размещайте на изгибах
Штрих-код на округлой поверхности может не считываться. Размещайте на плоских участках упаковки.

Смотрите также: [QR-код генератор](/tools/qr-code-gen), [Список портов](/tools/port-list)
    `.trim(),
    contentEn: `
## 6 Tips for Working with Barcodes

### 1. Maintain Minimum Size
EAN-13 must be at least 29.83 × 21.19 mm at standard scale. Reduction is allowed down to 80%.

### 2. Ensure the Quiet Zone
Free space to the left and right of the barcode is mandatory — at least 3.63 mm for EAN-13.

### 3. Contrast Matters
Black bars on a white background is the ideal option. Avoid red and orange backgrounds, as scanners use a red laser.

### 4. Test Before Printing
Always test the barcode with a scanner before mass printing.

### 5. Choose the Right Format
- **EAN-13** — for retail in Russia and Europe
- **Code128** — for internal warehouse tracking
- **UPC-A** — for export to the USA

### 6. Don't Place on Curved Surfaces
A barcode on a rounded surface may not be readable. Place it on flat areas of the packaging.

See also: [QR Code Generator](/tools/qr-code-gen), [Port List](/tools/port-list)
    `.trim(),
  },
  {
    slug: 'barcode-gen-use-cases',
    title: 'Штрих-коды: сценарии использования в бизнесе',
    titleEn: 'Barcodes: Business Use Cases',
    description: 'Где применяются штрих-коды: розница, склад, библиотеки, здравоохранение, билеты.',
    descriptionEn: 'Where barcodes are used: retail, warehouses, libraries, healthcare, and tickets.',
    toolSlug: 'barcode-gen',
    type: 'use-cases',
    keywords: ['штрих-код бизнес', 'штрих-код склад', 'штрих-код розница'],
    date: '2026-02-14',
    readTime: 5,
    content: `
## Сценарии использования штрих-кодов

### 1. Розничная торговля
Каждый товар на полке маркируется EAN-13. Кассовое оборудование мгновенно определяет цену и состав.

### 2. Складской учёт
Code128 используется для маркировки полок, паллет и зон хранения. Ускоряет инвентаризацию в разы.

### 3. Библиотеки
Каждая книга получает уникальный штрих-код для учёта выдачи и возврата.

### 4. Здравоохранение
Штрих-коды на браслетах пациентов и лекарствах предотвращают ошибки при назначении препаратов.

### 5. Транспорт и логистика
Маркировка посылок для автоматической сортировки на конвейере.

### 6. Входные билеты
Штрих-код на билете позволяет быстро проверять подлинность на входе.

### 7. Внутренний учёт
Маркировка оборудования, инвентаря и основных средств компании.

Создайте штрих-код в [Штрих-код генераторе](/tools/barcode-gen).

Смотрите также: [QR-код генератор](/tools/qr-code-gen), [Генератор UUID](/tools/uuid-generator), [Sitemap генератор](/tools/sitemap-generator)
    `.trim(),
    contentEn: `
## Barcode Use Cases

### 1. Retail
Every product on the shelf is labeled with EAN-13. Point-of-sale equipment instantly identifies the price and composition.

### 2. Warehouse Management
Code128 is used for labeling shelves, pallets, and storage zones. It speeds up inventory management significantly.

### 3. Libraries
Each book receives a unique barcode for tracking checkouts and returns.

### 4. Healthcare
Barcodes on patient wristbands and medications prevent errors in drug administration.

### 5. Transportation and Logistics
Labeling parcels for automatic sorting on conveyor belts.

### 6. Admission Tickets
A barcode on a ticket allows quick authenticity verification at the entrance.

### 7. Internal Asset Tracking
Labeling equipment, inventory, and fixed assets of a company.

Create a barcode in the [Barcode Generator](/tools/barcode-gen).

See also: [QR Code Generator](/tools/qr-code-gen), [UUID Generator](/tools/uuid-generator), [Sitemap Generator](/tools/sitemap-generator)
    `.trim(),
  },
];
