import { Article } from '../articles';

export const seoArticles: Article[] = [
  // === Генератор мета-тегов ===
  {
    slug: 'meta-generator-guide',
    title: 'Генератор мета-тегов: полное руководство по SEO-разметке',
    titleEn: 'Meta Tag Generator: Complete Guide to SEO Markup',
    description: 'Как правильно составить мета-теги для страниц сайта. Title, description, keywords и другие важные теги.',
    descriptionEn: 'How to properly create meta tags for web pages. Title, description, keywords and other important tags.',
    toolSlug: 'meta-generator',
    type: 'guide',
    keywords: ['мета-теги', 'seo', 'title', 'description', 'meta tags'],
    date: '2026-02-15',
    readTime: 8,
    content: `
## Что такое мета-теги?

Мета-теги — HTML-элементы в секции \`<head>\`, которые сообщают поисковым системам и браузерам информацию о странице. Они не видны пользователям, но критически важны для SEO.

## Основные мета-теги

### Title (заголовок страницы)
Самый важный тег для SEO. Отображается в результатах поиска и вкладке браузера.

- Оптимальная длина: 50-60 символов
- Содержит основной ключевой запрос
- Уникален для каждой страницы

### Description (описание)
Описание страницы, отображаемое в сниппете поисковой выдачи.

- Оптимальная длина: 150-160 символов
- Содержит призыв к действию
- Включает ключевые слова естественным образом

### Другие важные мета-теги

| Тег | Назначение |
|---|---|
| viewport | Адаптивная вёрстка |
| robots | Индексация и следование ссылкам |
| canonical | Каноническая ссылка |
| charset | Кодировка страницы (UTF-8) |
| author | Автор страницы |

## Как использовать генератор

1. Заполните title и description
2. Укажите ключевые слова
3. Настройте дополнительные теги
4. Скопируйте готовый HTML-код

Смотрите также: [Open Graph Preview](/tools/og-preview), [Robots.txt генератор](/tools/robots-generator), [Проверка заголовков](/tools/heading-checker)
    `.trim(),
    contentEn: `
## What Are Meta Tags?

Meta tags are HTML elements in the \`<head>\` section that provide search engines and browsers with information about a page. They are invisible to users but critically important for SEO.

## Main Meta Tags

### Title (Page Title)
The most important tag for SEO. Displayed in search results and the browser tab.

- Optimal length: 50-60 characters
- Contains the primary keyword
- Unique for each page

### Description
The page description displayed in the search results snippet.

- Optimal length: 150-160 characters
- Contains a call to action
- Includes keywords naturally

### Other Important Meta Tags

| Tag | Purpose |
|---|---|
| viewport | Responsive design |
| robots | Indexing and link following |
| canonical | Canonical URL |
| charset | Page encoding (UTF-8) |
| author | Page author |

## How to Use the Generator

1. Fill in the title and description
2. Specify keywords
3. Configure additional tags
4. Copy the generated HTML code

See also: [Open Graph Preview](/tools/og-preview), [Robots.txt Generator](/tools/robots-generator), [Heading Checker](/tools/heading-checker)
    `.trim(),
  },
  {
    slug: 'meta-generator-tips',
    title: '7 советов по оптимизации мета-тегов',
    titleEn: '7 Tips for Optimizing Meta Tags',
    description: 'Как написать мета-теги, которые повысят CTR и позиции в поиске.',
    descriptionEn: 'How to write meta tags that boost CTR and search rankings.',
    toolSlug: 'meta-generator',
    type: 'tips',
    keywords: ['мета-теги советы', 'seo оптимизация', 'ctr', 'поисковая выдача'],
    date: '2026-02-22',
    readTime: 6,
    content: `
## 7 советов по мета-тегам

### 1. Ставьте ключевое слово в начало title
Поисковые системы придают больший вес словам в начале заголовка.

### 2. Не дублируйте title и description
Title — для привлечения внимания, description — для раскрытия темы и призыва к действию.

### 3. Каждая страница — уникальные теги
Дублирование мета-тегов на разных страницах вредит SEO. Генерируйте уникальные теги для каждого URL.

### 4. Используйте числа и специальные символы
«10 способов...», «Гид 2026 года» — числа повышают CTR на 15-20%.

### 5. Добавьте призыв к действию в description
«Узнайте», «Попробуйте», «Скачайте бесплатно» — мотивируйте пользователя кликнуть.

### 6. Проверяйте длину тегов
Title обрезается после 60 символов, description — после 160. Убедитесь, что ключевая информация в начале.

### 7. Не забывайте про Open Graph
Мета-теги og: определяют, как страница выглядит при шаринге в соцсетях.

Смотрите также: [Плотность ключевых слов](/tools/keyword-density), [Sitemap генератор](/tools/sitemap-generator)
    `.trim(),
    contentEn: `
## 7 Meta Tag Tips

### 1. Place the Keyword at the Beginning of the Title
Search engines give more weight to words at the beginning of the title.

### 2. Don't Duplicate Title and Description
Title is for grabbing attention, description is for elaborating on the topic and encouraging action.

### 3. Each Page Needs Unique Tags
Duplicate meta tags across different pages hurt SEO. Generate unique tags for each URL.

### 4. Use Numbers and Special Characters
"10 Ways...", "2026 Guide" — numbers increase CTR by 15-20%.

### 5. Add a Call to Action in the Description
"Learn", "Try", "Download for free" — motivate users to click.

### 6. Check Tag Length
Title gets cut off after 60 characters, description after 160. Make sure key information comes first.

### 7. Don't Forget Open Graph
og: meta tags determine how your page looks when shared on social media.

See also: [Keyword Density](/tools/keyword-density), [Sitemap Generator](/tools/sitemap-generator)
    `.trim(),
  },
  {
    slug: 'meta-generator-use-cases',
    title: 'Генератор мета-тегов: 5 сценариев использования',
    titleEn: 'Meta Tag Generator: 5 Use Cases',
    description: 'Когда использовать генератор мета-тегов: запуск сайта, миграция, SEO-аудит.',
    descriptionEn: 'When to use the meta tag generator: site launch, migration, SEO audit.',
    toolSlug: 'meta-generator',
    type: 'use-cases',
    keywords: ['мета-теги применение', 'seo сайт', 'мета-теги wordpress'],
    date: '2026-03-01',
    readTime: 5,
    content: `
## 5 сценариев использования

### 1. Запуск нового сайта
Перед публикацией создайте мета-теги для всех ключевых страниц: главная, услуги, контакты, блог.

### 2. SEO-аудит существующего сайта
Проверьте и обновите мета-теги страниц с низким CTR в Google Search Console.

### 3. Миграция сайта
При переезде на новый домен или CMS убедитесь, что мета-теги перенесены корректно.

### 4. Локализация
Создайте мета-теги на разных языках с указанием \`hreflang\` для многоязычных сайтов.

### 5. Landing-страницы
Рекламные лендинги требуют точных мета-тегов для соответствия поисковому запросу и объявлению.

Создавайте мета-теги в [Генераторе мета-тегов](/tools/meta-generator).

Смотрите также: [Open Graph Preview](/tools/og-preview), [Robots.txt генератор](/tools/robots-generator), [Проверка заголовков](/tools/heading-checker)
    `.trim(),
    contentEn: `
## 5 Use Cases

### 1. Launching a New Website
Before publishing, create meta tags for all key pages: homepage, services, contacts, blog.

### 2. SEO Audit of an Existing Site
Review and update meta tags for pages with low CTR in Google Search Console.

### 3. Site Migration
When moving to a new domain or CMS, make sure meta tags are transferred correctly.

### 4. Localization
Create meta tags in different languages with \`hreflang\` attributes for multilingual websites.

### 5. Landing Pages
Advertising landing pages require precise meta tags to match the search query and ad copy.

Create meta tags in the [Meta Tag Generator](/tools/meta-generator).

See also: [Open Graph Preview](/tools/og-preview), [Robots.txt Generator](/tools/robots-generator), [Heading Checker](/tools/heading-checker)
    `.trim(),
  },

  // === Open Graph Preview ===
  {
    slug: 'og-preview-guide',
    title: 'Open Graph Preview: как настроить превью для соцсетей',
    titleEn: 'Open Graph Preview: How to Set Up Social Media Previews',
    description: 'Руководство по Open Graph тегам. Как ваш сайт выглядит при шаринге в Facebook, Twitter, Telegram.',
    descriptionEn: 'Guide to Open Graph tags. How your site looks when shared on Facebook, Twitter, Telegram.',
    toolSlug: 'og-preview',
    type: 'guide',
    keywords: ['open graph', 'og tags', 'превью соцсети', 'facebook preview', 'twitter card'],
    date: '2026-01-20',
    readTime: 7,
    content: `
## Что такое Open Graph?

Open Graph — протокол, разработанный Facebook, который определяет, как ваш контент отображается при публикации ссылки в социальных сетях и мессенджерах.

## Основные OG-теги

| Тег | Описание | Пример |
|---|---|---|
| og:title | Заголовок | Название статьи |
| og:description | Описание | Краткое содержание |
| og:image | Изображение | URL картинки 1200×630 |
| og:url | Каноническая ссылка | https://example.com/page |
| og:type | Тип контента | website, article |
| og:locale | Язык | ru_RU |

## Размеры изображений

- **Facebook**: 1200 × 630 px (соотношение 1.91:1)
- **Twitter**: 1200 × 628 px (summary_large_image)
- **LinkedIn**: 1200 × 627 px
- **Telegram**: 1200 × 630 px

## Twitter Card теги

Дополнительно для Twitter используются теги \`twitter:card\`, \`twitter:site\`, \`twitter:creator\`.

## Как проверить OG-теги

1. Вставьте URL или HTML-код в [Open Graph Preview](/tools/og-preview)
2. Увидите, как страница будет выглядеть в разных соцсетях
3. Исправьте теги для оптимального отображения

Смотрите также: [Генератор мета-тегов](/tools/meta-generator), [Sitemap генератор](/tools/sitemap-generator), [Проверка заголовков](/tools/heading-checker)
    `.trim(),
    contentEn: `
## What Is Open Graph?

Open Graph is a protocol developed by Facebook that determines how your content appears when a link is shared on social networks and messengers.

## Main OG Tags

| Tag | Description | Example |
|---|---|---|
| og:title | Title | Article name |
| og:description | Description | Brief summary |
| og:image | Image | Image URL 1200x630 |
| og:url | Canonical URL | https://example.com/page |
| og:type | Content type | website, article |
| og:locale | Language | en_US |

## Image Sizes

- **Facebook**: 1200 x 630 px (ratio 1.91:1)
- **Twitter**: 1200 x 628 px (summary_large_image)
- **LinkedIn**: 1200 x 627 px
- **Telegram**: 1200 x 630 px

## Twitter Card Tags

Additionally for Twitter, use tags \`twitter:card\`, \`twitter:site\`, \`twitter:creator\`.

## How to Check OG Tags

1. Paste the URL or HTML code into [Open Graph Preview](/tools/og-preview)
2. See how the page will look on different social networks
3. Fix the tags for optimal display

See also: [Meta Tag Generator](/tools/meta-generator), [Sitemap Generator](/tools/sitemap-generator), [Heading Checker](/tools/heading-checker)
    `.trim(),
  },
  {
    slug: 'og-preview-tips',
    title: '6 советов по настройке Open Graph тегов',
    titleEn: '6 Tips for Setting Up Open Graph Tags',
    description: 'Как сделать привлекательное превью ссылки в соцсетях: изображения, текст, типичные ошибки.',
    descriptionEn: 'How to create an attractive link preview on social media: images, text, common mistakes.',
    toolSlug: 'og-preview',
    type: 'tips',
    keywords: ['og теги советы', 'превью ссылок', 'facebook шаринг', 'twitter card'],
    date: '2026-01-28',
    readTime: 5,
    content: `
## 6 советов по Open Graph

### 1. Всегда указывайте og:image
Ссылка без изображения получает на 70% меньше взаимодействий. Используйте яркую, контрастную картинку.

### 2. Оптимальный размер изображения
1200 × 630 px — универсальный размер для всех платформ. Файл до 5 МБ в формате JPG или PNG.

### 3. Не дублируйте title и description
og:title может отличаться от обычного \`<title>\`. Адаптируйте текст для социальных сетей.

### 4. Тестируйте перед публикацией
Используйте [Open Graph Preview](/tools/og-preview) для проверки. Каждая соцсеть кэширует превью.

### 5. Обновляйте кэш соцсетей
После изменения OG-тегов очистите кэш через Facebook Debugger и Twitter Card Validator.

### 6. Добавьте текст на изображение
Изображение с наложенным заголовком привлекает больше внимания, чем просто фотография.

Смотрите также: [Генератор мета-тегов](/tools/meta-generator), [Плотность ключевых слов](/tools/keyword-density)
    `.trim(),
    contentEn: `
## 6 Open Graph Tips

### 1. Always Specify og:image
A link without an image gets 70% fewer interactions. Use a bright, high-contrast image.

### 2. Optimal Image Size
1200 x 630 px is the universal size for all platforms. File up to 5 MB in JPG or PNG format.

### 3. Don't Duplicate Title and Description
og:title can differ from the regular \`<title>\`. Adapt the text for social networks.

### 4. Test Before Publishing
Use [Open Graph Preview](/tools/og-preview) to check. Each social network caches the preview.

### 5. Update Social Media Cache
After changing OG tags, clear the cache via Facebook Debugger and Twitter Card Validator.

### 6. Add Text to the Image
An image with an overlaid headline attracts more attention than just a photo.

See also: [Meta Tag Generator](/tools/meta-generator), [Keyword Density](/tools/keyword-density)
    `.trim(),
  },
  {
    slug: 'og-preview-use-cases',
    title: 'Open Graph Preview: сценарии использования',
    titleEn: 'Open Graph Preview: Use Cases',
    description: 'Когда проверять OG-теги: блоги, интернет-магазины, портфолио, лендинги.',
    descriptionEn: 'When to check OG tags: blogs, online stores, portfolios, landing pages.',
    toolSlug: 'og-preview',
    type: 'use-cases',
    keywords: ['og preview применение', 'шаринг ссылок', 'соцсети превью'],
    date: '2026-02-05',
    readTime: 5,
    content: `
## Сценарии использования Open Graph Preview

### 1. Публикация блог-постов
Перед каждой публикацией проверьте, как статья будет выглядеть при шаринге. Заголовок, описание и картинка должны мотивировать к клику.

### 2. Интернет-магазин
Карточки товаров с og:image товара и ценой в описании увеличивают конверсию из социальных сетей.

### 3. Портфолио и резюме
Убедитесь, что ваше портфолио красиво отображается при отправке ссылки потенциальному работодателю.

### 4. Рекламные лендинги
Страницы рекламных кампаний часто распространяются через мессенджеры — превью должно привлекать внимание.

### 5. Корпоративный сайт
Страница «О компании» и вакансии часто шарятся в LinkedIn. Проверьте их OG-разметку.

### 6. Мероприятия и вебинары
Анонс мероприятия с датой, названием и обложкой на превью повышает регистрации.

Смотрите также: [Генератор мета-тегов](/tools/meta-generator), [QR-код генератор](/tools/qr-code-gen), [Robots.txt генератор](/tools/robots-generator)
    `.trim(),
    contentEn: `
## Open Graph Preview Use Cases

### 1. Publishing Blog Posts
Before each publication, check how the article will look when shared. The title, description, and image should encourage clicking.

### 2. Online Store
Product cards with og:image of the product and price in the description increase social media conversions.

### 3. Portfolio and Resume
Make sure your portfolio displays beautifully when sending a link to a potential employer.

### 4. Advertising Landing Pages
Ad campaign pages are often shared through messengers — the preview should grab attention.

### 5. Corporate Website
The "About" page and job listings are often shared on LinkedIn. Check their OG markup.

### 6. Events and Webinars
An event announcement with the date, name, and cover image on the preview boosts registrations.

See also: [Meta Tag Generator](/tools/meta-generator), [QR Code Generator](/tools/qr-code-gen), [Robots.txt Generator](/tools/robots-generator)
    `.trim(),
  },

  // === Robots.txt генератор ===
  {
    slug: 'robots-generator-guide',
    title: 'Robots.txt генератор: руководство по настройке индексации',
    titleEn: 'Robots.txt Generator: Guide to Configuring Indexing',
    description: 'Как создать robots.txt для управления сканированием сайта поисковыми роботами.',
    descriptionEn: 'How to create robots.txt to control search engine crawling of your site.',
    toolSlug: 'robots-generator',
    type: 'guide',
    keywords: ['robots.txt', 'индексация', 'поисковые роботы', 'crawling', 'seo'],
    date: '2026-02-08',
    readTime: 7,
    content: `
## Что такое robots.txt?

Robots.txt — текстовый файл в корне сайта, который указывает поисковым роботам, какие страницы можно сканировать, а какие нельзя. Файл располагается по адресу \`example.com/robots.txt\`.

## Синтаксис robots.txt

### Основные директивы

| Директива | Описание |
|---|---|
| User-agent | Для какого робота правило |
| Disallow | Запрет сканирования пути |
| Allow | Разрешение (приоритетнее Disallow) |
| Sitemap | Ссылка на карту сайта |
| Crawl-delay | Задержка между запросами |

### Примеры правил

- Запретить всем роботам весь сайт: \`Disallow: /\`
- Запретить только админку: \`Disallow: /admin/\`
- Разрешить всё: оставить \`Disallow:\` пустым

## Как использовать генератор

1. Выберите, каким роботам задать правила
2. Укажите запрещённые и разрешённые пути
3. Добавьте ссылку на Sitemap
4. Скопируйте готовый файл и загрузите в корень сайта

## Важные замечания

- Robots.txt — это рекомендация, а не запрет. Злонамеренные боты могут игнорировать его
- Не используйте для скрытия конфиденциальных данных
- Google может индексировать URL даже при Disallow, если на него ведут ссылки

Смотрите также: [Sitemap генератор](/tools/sitemap-generator), [Генератор мета-тегов](/tools/meta-generator), [Проверка заголовков](/tools/heading-checker)
    `.trim(),
    contentEn: `
## What Is robots.txt?

Robots.txt is a text file in the root of a website that tells search engine bots which pages can be crawled and which cannot. The file is located at \`example.com/robots.txt\`.

## Robots.txt Syntax

### Main Directives

| Directive | Description |
|---|---|
| User-agent | Which bot the rule applies to |
| Disallow | Block crawling of a path |
| Allow | Permission (overrides Disallow) |
| Sitemap | Link to the sitemap |
| Crawl-delay | Delay between requests |

### Rule Examples

- Block all bots from the entire site: \`Disallow: /\`
- Block only admin area: \`Disallow: /admin/\`
- Allow everything: leave \`Disallow:\` empty

## How to Use the Generator

1. Choose which bots to set rules for
2. Specify blocked and allowed paths
3. Add a link to your Sitemap
4. Copy the generated file and upload it to your site root

## Important Notes

- Robots.txt is a recommendation, not a restriction. Malicious bots may ignore it
- Do not use it to hide confidential data
- Google may index a URL even with Disallow if there are links pointing to it

See also: [Sitemap Generator](/tools/sitemap-generator), [Meta Tag Generator](/tools/meta-generator), [Heading Checker](/tools/heading-checker)
    `.trim(),
  },
  {
    slug: 'robots-generator-tips',
    title: '5 советов по настройке robots.txt',
    titleEn: '5 Tips for Configuring robots.txt',
    description: 'Как правильно настроить robots.txt: типичные ошибки, лучшие практики, проверка.',
    descriptionEn: 'How to properly configure robots.txt: common mistakes, best practices, validation.',
    toolSlug: 'robots-generator',
    type: 'tips',
    keywords: ['robots.txt советы', 'robots ошибки', 'индексация сайта'],
    date: '2026-02-16',
    readTime: 5,
    content: `
## 5 советов по robots.txt

### 1. Не блокируйте CSS и JS файлы
Googlebot должен видеть стили и скрипты для правильного рендеринга страниц. Блокировка ресурсов ухудшает ранжирование.

### 2. Всегда указывайте Sitemap
Директива \`Sitemap: https://example.com/sitemap.xml\` помогает роботам найти все страницы сайта.

### 3. Закройте служебные разделы
Заблокируйте технические страницы: /admin/, /api/, /tmp/, страницы поиска и фильтрации.

### 4. Проверяйте через Google Search Console
Инструмент проверки robots.txt в Search Console покажет, какие URL заблокированы.

### 5. Используйте подстановочные знаки осторожно
Символ \`*\` блокирует все совпадающие пути. \`Disallow: /*.pdf$\` заблокирует все PDF, включая полезные.

## Типичные ошибки

- Блокировка Sitemap в robots.txt
- Пустой User-agent (правила не применяются)
- Пробелы и опечатки в путях
- Размещение файла не в корне сайта

Смотрите также: [Sitemap генератор](/tools/sitemap-generator), [Плотность ключевых слов](/tools/keyword-density)
    `.trim(),
    contentEn: `
## 5 robots.txt Tips

### 1. Don't Block CSS and JS Files
Googlebot needs to see styles and scripts for proper page rendering. Blocking resources hurts rankings.

### 2. Always Specify a Sitemap
The \`Sitemap: https://example.com/sitemap.xml\` directive helps bots find all pages on your site.

### 3. Block Service Sections
Block technical pages: /admin/, /api/, /tmp/, search and filtering pages.

### 4. Verify Through Google Search Console
The robots.txt testing tool in Search Console shows which URLs are blocked.

### 5. Use Wildcards Carefully
The \`*\` character blocks all matching paths. \`Disallow: /*.pdf$\` will block all PDFs, including useful ones.

## Common Mistakes

- Blocking the Sitemap in robots.txt
- Empty User-agent (rules don't apply)
- Spaces and typos in paths
- Placing the file outside the site root

See also: [Sitemap Generator](/tools/sitemap-generator), [Keyword Density](/tools/keyword-density)
    `.trim(),
  },
  {
    slug: 'robots-generator-use-cases',
    title: 'Robots.txt: сценарии применения для разных сайтов',
    titleEn: 'Robots.txt: Use Cases for Different Websites',
    description: 'Примеры настройки robots.txt для интернет-магазинов, блогов, SPA и корпоративных сайтов.',
    descriptionEn: 'Robots.txt configuration examples for online stores, blogs, SPAs, and corporate websites.',
    toolSlug: 'robots-generator',
    type: 'use-cases',
    keywords: ['robots.txt примеры', 'robots интернет-магазин', 'robots блог'],
    date: '2026-02-24',
    readTime: 5,
    content: `
## Сценарии настройки robots.txt

### 1. Интернет-магазин
Закройте страницы корзины, оформления заказа, личного кабинета и результатов фильтрации.

### 2. Блог на WordPress
Заблокируйте /wp-admin/, /wp-includes/, страницы авторов и тегов (если дублируют категории).

### 3. SPA-приложение
Убедитесь, что Google может сканировать пререндеренные страницы. Не блокируйте JS-бандлы.

### 4. Staging-среда
Полностью заблокируйте тестовую версию сайта: \`Disallow: /\` для всех User-agent.

### 5. Многоязычный сайт
Разрешите сканирование всех языковых версий и укажите Sitemap для каждой.

### 6. API-документация
Заблокируйте внутренние эндпоинты, но разрешите публичную документацию.

Создайте robots.txt в [Robots.txt генераторе](/tools/robots-generator).

Смотрите также: [Sitemap генератор](/tools/sitemap-generator), [Open Graph Preview](/tools/og-preview), [Генератор мета-тегов](/tools/meta-generator)
    `.trim(),
    contentEn: `
## Robots.txt Configuration Scenarios

### 1. Online Store
Block cart pages, checkout, personal account, and filter results pages.

### 2. WordPress Blog
Block /wp-admin/, /wp-includes/, author pages, and tags (if they duplicate categories).

### 3. SPA Application
Make sure Google can crawl pre-rendered pages. Don't block JS bundles.

### 4. Staging Environment
Completely block the test version of the site: \`Disallow: /\` for all User-agents.

### 5. Multilingual Site
Allow crawling of all language versions and specify a Sitemap for each.

### 6. API Documentation
Block internal endpoints but allow public documentation.

Create robots.txt in the [Robots.txt Generator](/tools/robots-generator).

See also: [Sitemap Generator](/tools/sitemap-generator), [Open Graph Preview](/tools/og-preview), [Meta Tag Generator](/tools/meta-generator)
    `.trim(),
  },

  // === Sitemap генератор ===
  {
    slug: 'sitemap-generator-guide',
    title: 'Sitemap генератор: создание XML карты сайта',
    titleEn: 'Sitemap Generator: Creating an XML Sitemap',
    description: 'Как создать sitemap.xml для поисковых систем. Формат, обязательные поля и лучшие практики.',
    descriptionEn: 'How to create sitemap.xml for search engines. Format, required fields, and best practices.',
    toolSlug: 'sitemap-generator',
    type: 'guide',
    keywords: ['sitemap', 'карта сайта', 'xml', 'seo индексация', 'google'],
    date: '2026-01-25',
    readTime: 7,
    content: `
## Что такое Sitemap?

Sitemap (карта сайта) — XML-файл со списком всех URL сайта, которые должны быть проиндексированы. Он помогает поисковым роботам найти и проиндексировать все страницы.

## Структура sitemap.xml

Каждый URL описывается тегом \`<url>\` с обязательными и опциональными полями:

| Поле | Обязательность | Описание |
|---|---|---|
| loc | Да | URL страницы |
| lastmod | Нет | Дата последнего изменения |
| changefreq | Нет | Частота изменений |
| priority | Нет | Приоритет (0.0-1.0) |

## Значения changefreq

- **always** — страница меняется при каждом доступе
- **hourly** — обновляется каждый час
- **daily** — ежедневные обновления
- **weekly** — еженедельно
- **monthly** — ежемесячно
- **yearly** — раз в год
- **never** — архивные страницы

## Как использовать генератор

1. Введите список URL вашего сайта
2. Укажите приоритет и частоту обновления
3. Получите готовый XML-файл
4. Загрузите sitemap.xml в корень сайта
5. Укажите путь к sitemap в robots.txt

## Ограничения

- Максимум 50 000 URL в одном файле
- Размер файла — до 50 МБ
- Для больших сайтов используйте индексный sitemap

Смотрите также: [Robots.txt генератор](/tools/robots-generator), [Генератор мета-тегов](/tools/meta-generator), [Проверка заголовков](/tools/heading-checker)
    `.trim(),
    contentEn: `
## What Is a Sitemap?

A sitemap is an XML file listing all the URLs on a site that should be indexed. It helps search engine bots find and index all pages.

## Structure of sitemap.xml

Each URL is described with a \`<url>\` tag with required and optional fields:

| Field | Required | Description |
|---|---|---|
| loc | Yes | Page URL |
| lastmod | No | Last modification date |
| changefreq | No | Change frequency |
| priority | No | Priority (0.0-1.0) |

## changefreq Values

- **always** — page changes with every access
- **hourly** — updated every hour
- **daily** — daily updates
- **weekly** — weekly
- **monthly** — monthly
- **yearly** — once a year
- **never** — archived pages

## How to Use the Generator

1. Enter the list of URLs for your site
2. Set priority and update frequency
3. Get the generated XML file
4. Upload sitemap.xml to your site root
5. Specify the sitemap path in robots.txt

## Limitations

- Maximum 50,000 URLs per file
- File size up to 50 MB
- For large sites, use a sitemap index

See also: [Robots.txt Generator](/tools/robots-generator), [Meta Tag Generator](/tools/meta-generator), [Heading Checker](/tools/heading-checker)
    `.trim(),
  },
  {
    slug: 'sitemap-generator-tips',
    title: '5 советов по созданию эффективного Sitemap',
    titleEn: '5 Tips for Creating an Effective Sitemap',
    description: 'Как оптимизировать sitemap для лучшей индексации: приоритеты, обновления, проверка.',
    descriptionEn: 'How to optimize your sitemap for better indexing: priorities, updates, validation.',
    toolSlug: 'sitemap-generator',
    type: 'tips',
    keywords: ['sitemap советы', 'индексация google', 'sitemap оптимизация'],
    date: '2026-02-02',
    readTime: 5,
    content: `
## 5 советов по Sitemap

### 1. Включайте только канонические URL
Не добавляйте страницы с параметрами, дубли и редиректы. Только основные канонические версии.

### 2. Обновляйте lastmod реально
Указывайте lastmod только при реальных изменениях контента. Ежедневное обновление даты без изменений — спам.

### 3. Используйте индексный sitemap
Для сайтов с более чем 10 000 страниц разделите карту на несколько файлов с общим индексом.

### 4. Подайте sitemap в Google Search Console
Зарегистрируйте карту сайта в Search Console для мониторинга статуса индексации.

### 5. Автоматизируйте генерацию
Настройте автоматическую генерацию sitemap при публикации нового контента.

## Что не включать в Sitemap

- Страницы с noindex
- Страницы, закрытые в robots.txt
- Редиректы (301/302)
- Страницы с ошибками (404/500)
- Дубли контента

Смотрите также: [Robots.txt генератор](/tools/robots-generator), [Open Graph Preview](/tools/og-preview)
    `.trim(),
    contentEn: `
## 5 Sitemap Tips

### 1. Include Only Canonical URLs
Don't add pages with parameters, duplicates, or redirects. Only primary canonical versions.

### 2. Update lastmod Realistically
Only set lastmod when content actually changes. Updating the date daily without changes is spam.

### 3. Use a Sitemap Index
For sites with more than 10,000 pages, split the map into multiple files with a common index.

### 4. Submit the Sitemap to Google Search Console
Register the sitemap in Search Console to monitor indexing status.

### 5. Automate Generation
Set up automatic sitemap generation when new content is published.

## What Not to Include in a Sitemap

- Pages with noindex
- Pages blocked in robots.txt
- Redirects (301/302)
- Error pages (404/500)
- Duplicate content

See also: [Robots.txt Generator](/tools/robots-generator), [Open Graph Preview](/tools/og-preview)
    `.trim(),
  },
  {
    slug: 'sitemap-generator-use-cases',
    title: 'Sitemap: сценарии применения для разных типов сайтов',
    titleEn: 'Sitemap: Use Cases for Different Website Types',
    description: 'Как настроить sitemap для блога, интернет-магазина, новостного портала и SaaS.',
    descriptionEn: 'How to configure a sitemap for blogs, online stores, news portals, and SaaS.',
    toolSlug: 'sitemap-generator',
    type: 'use-cases',
    keywords: ['sitemap примеры', 'sitemap магазин', 'sitemap блог'],
    date: '2026-02-10',
    readTime: 5,
    content: `
## Сценарии использования Sitemap

### 1. Интернет-магазин
Включите страницы категорий и товаров с высоким приоритетом. Обновляйте lastmod при изменении цен или наличия.

### 2. Новостной портал
Используйте специальный News Sitemap с тегами \`<news:news>\` для быстрой индексации в Google News.

### 3. Блог
Все статьи с датами публикации. Приоритет свежих статей выше, архивных — ниже.

### 4. SaaS-продукт
Маркетинговые страницы, блог и документация. Внутренние страницы приложения не включайте.

### 5. Многоязычный сайт
Отдельные sitemaps для каждого языка или общий с hreflang-разметкой.

### 6. Видео-контент
Используйте Video Sitemap для продвижения видео в Google Video Search.

Создайте карту сайта в [Sitemap генераторе](/tools/sitemap-generator).

Смотрите также: [Robots.txt генератор](/tools/robots-generator), [Генератор мета-тегов](/tools/meta-generator), [Плотность ключевых слов](/tools/keyword-density)
    `.trim(),
    contentEn: `
## Sitemap Use Cases

### 1. Online Store
Include category and product pages with high priority. Update lastmod when prices or availability change.

### 2. News Portal
Use a special News Sitemap with \`<news:news>\` tags for fast indexing in Google News.

### 3. Blog
All articles with publication dates. Priority for fresh articles is higher, archived ones lower.

### 4. SaaS Product
Marketing pages, blog, and documentation. Don't include internal application pages.

### 5. Multilingual Site
Separate sitemaps for each language or a shared one with hreflang markup.

### 6. Video Content
Use Video Sitemap to promote videos in Google Video Search.

Create a sitemap in the [Sitemap Generator](/tools/sitemap-generator).

See also: [Robots.txt Generator](/tools/robots-generator), [Meta Tag Generator](/tools/meta-generator), [Keyword Density](/tools/keyword-density)
    `.trim(),
  },

  // === Проверка заголовков ===
  {
    slug: 'heading-checker-guide',
    title: 'Проверка заголовков: руководство по структуре H1-H6',
    titleEn: 'Heading Checker: Guide to H1-H6 Structure',
    description: 'Как правильно использовать заголовки H1-H6 для SEO и доступности. Проверка иерархии.',
    descriptionEn: 'How to properly use H1-H6 headings for SEO and accessibility. Hierarchy validation.',
    toolSlug: 'heading-checker',
    type: 'guide',
    keywords: ['заголовки', 'h1 h2 h3', 'структура страницы', 'seo заголовки'],
    date: '2026-01-30',
    readTime: 6,
    content: `
## Зачем проверять заголовки?

Заголовки H1-H6 формируют иерархическую структуру страницы. Правильная структура помогает поисковым системам понять содержание, а пользователям — навигировать по контенту.

## Иерархия заголовков

| Уровень | Назначение | Количество |
|---|---|---|
| H1 | Главный заголовок страницы | Один на страницу |
| H2 | Основные разделы | Несколько |
| H3 | Подразделы внутри H2 | По необходимости |
| H4-H6 | Глубокая вложенность | Редко |

## Правила правильной структуры

1. **Один H1 на страницу** — содержит основную тему
2. **Не пропускайте уровни** — после H2 идёт H3, не H4
3. **Логическая вложенность** — H3 раскрывает тему H2
4. **Содержательные заголовки** — описывают содержимое раздела

## Как использовать проверку

1. Вставьте HTML-код или URL страницы
2. Получите дерево заголовков с визуализацией иерархии
3. Увидите ошибки: пропуски уровней, множественные H1, пустые заголовки

## Влияние на SEO

Структурированные заголовки увеличивают шанс получить расширенный сниппет в поиске и улучшают поведенческие факторы.

Смотрите также: [Генератор мета-тегов](/tools/meta-generator), [Плотность ключевых слов](/tools/keyword-density), [Open Graph Preview](/tools/og-preview)
    `.trim(),
    contentEn: `
## Why Check Headings?

H1-H6 headings form the hierarchical structure of a page. Proper structure helps search engines understand the content and users navigate through it.

## Heading Hierarchy

| Level | Purpose | Count |
|---|---|---|
| H1 | Main page heading | One per page |
| H2 | Main sections | Multiple |
| H3 | Subsections within H2 | As needed |
| H4-H6 | Deep nesting | Rarely |

## Rules for Proper Structure

1. **One H1 per page** — contains the main topic
2. **Don't skip levels** — H3 follows H2, not H4
3. **Logical nesting** — H3 expands on the H2 topic
4. **Meaningful headings** — describe the section content

## How to Use the Checker

1. Paste the HTML code or page URL
2. Get a heading tree with hierarchy visualization
3. See errors: skipped levels, multiple H1s, empty headings

## Impact on SEO

Structured headings increase the chance of getting a rich snippet in search and improve behavioral metrics.

See also: [Meta Tag Generator](/tools/meta-generator), [Keyword Density](/tools/keyword-density), [Open Graph Preview](/tools/og-preview)
    `.trim(),
  },
  {
    slug: 'heading-checker-tips',
    title: '5 советов по использованию заголовков на сайте',
    titleEn: '5 Tips for Using Headings on Your Website',
    description: 'Как писать заголовки для SEO и пользователей: длина, ключевые слова, доступность.',
    descriptionEn: 'How to write headings for SEO and users: length, keywords, accessibility.',
    toolSlug: 'heading-checker',
    type: 'tips',
    keywords: ['заголовки советы', 'seo заголовки', 'h1 оптимизация'],
    date: '2026-02-07',
    readTime: 5,
    content: `
## 5 советов по заголовкам

### 1. H1 = основная тема страницы
H1 должен чётко описывать, о чём страница. Не используйте H1 для логотипа или слогана.

### 2. Включайте ключевые слова
Заголовки — важный сигнал для поисковых систем. Включайте основной ключевой запрос в H1 и LSI-ключи в H2.

### 3. Не используйте заголовки для стилизации
Если нужен крупный текст — используйте CSS, а не тег H2. Заголовки — для семантики, не для оформления.

### 4. Оптимальная длина заголовков
H1: 20-70 символов. H2-H3: 15-60 символов. Слишком длинные заголовки теряют фокус.

### 5. Проверяйте доступность
Скринридеры используют заголовки для навигации. Последовательная структура критична для пользователей с ограниченными возможностями.

## Частые ошибки

- Несколько H1 на странице
- Пропуск уровней (H1 → H3)
- Декоративные заголовки без смысла
- Заголовки только из ключевых слов

Смотрите также: [Генератор мета-тегов](/tools/meta-generator), [Robots.txt генератор](/tools/robots-generator)
    `.trim(),
    contentEn: `
## 5 Heading Tips

### 1. H1 = Main Page Topic
H1 should clearly describe what the page is about. Don't use H1 for logos or slogans.

### 2. Include Keywords
Headings are an important signal for search engines. Include the primary keyword in H1 and LSI keywords in H2.

### 3. Don't Use Headings for Styling
If you need large text, use CSS instead of the H2 tag. Headings are for semantics, not for design.

### 4. Optimal Heading Length
H1: 20-70 characters. H2-H3: 15-60 characters. Overly long headings lose focus.

### 5. Check Accessibility
Screen readers use headings for navigation. Sequential structure is critical for users with disabilities.

## Common Mistakes

- Multiple H1s on a page
- Skipping levels (H1 to H3)
- Decorative headings without meaning
- Headings made up only of keywords

See also: [Meta Tag Generator](/tools/meta-generator), [Robots.txt Generator](/tools/robots-generator)
    `.trim(),
  },
  {
    slug: 'heading-checker-use-cases',
    title: 'Проверка заголовков: сценарии использования',
    titleEn: 'Heading Checker: Use Cases',
    description: 'Когда проверять структуру заголовков: SEO-аудит, контент-маркетинг, редизайн.',
    descriptionEn: 'When to check heading structure: SEO audit, content marketing, redesign.',
    toolSlug: 'heading-checker',
    type: 'use-cases',
    keywords: ['проверка заголовков применение', 'seo аудит', 'контент структура'],
    date: '2026-02-15',
    readTime: 4,
    content: `
## Сценарии использования проверки заголовков

### 1. SEO-аудит сайта
Массовая проверка всех страниц на правильную иерархию заголовков. Исправление ошибок повышает ранжирование.

### 2. Контент-маркетинг
Перед публикацией статьи убедитесь, что структура заголовков логична и SEO-оптимизирована.

### 3. Редизайн сайта
При обновлении дизайна заголовки часто теряют правильную иерархию. Проверьте после каждого изменения.

### 4. Аудит доступности (a11y)
Проверка соответствия WCAG 2.1 — заголовки должны образовывать последовательную структуру.

### 5. Анализ конкурентов
Изучите структуру заголовков на сайтах конкурентов, занимающих топовые позиции по вашим запросам.

Проверьте заголовки в [Проверке заголовков](/tools/heading-checker).

Смотрите также: [Плотность ключевых слов](/tools/keyword-density), [Sitemap генератор](/tools/sitemap-generator), [Генератор мета-тегов](/tools/meta-generator)
    `.trim(),
    contentEn: `
## Heading Checker Use Cases

### 1. SEO Site Audit
Bulk check all pages for proper heading hierarchy. Fixing errors improves rankings.

### 2. Content Marketing
Before publishing an article, make sure the heading structure is logical and SEO-optimized.

### 3. Website Redesign
During design updates, headings often lose their proper hierarchy. Check after every change.

### 4. Accessibility Audit (a11y)
Checking WCAG 2.1 compliance — headings must form a sequential structure.

### 5. Competitor Analysis
Study the heading structure on competitor websites that rank in the top positions for your queries.

Check headings in the [Heading Checker](/tools/heading-checker).

See also: [Keyword Density](/tools/keyword-density), [Sitemap Generator](/tools/sitemap-generator), [Meta Tag Generator](/tools/meta-generator)
    `.trim(),
  },

  // === Плотность ключевых слов ===
  {
    slug: 'keyword-density-guide',
    title: 'Плотность ключевых слов: руководство по анализу текста',
    titleEn: 'Keyword Density: Text Analysis Guide',
    description: 'Как проверить плотность ключевых слов в тексте. Оптимальные значения и влияние на SEO.',
    descriptionEn: 'How to check keyword density in text. Optimal values and impact on SEO.',
    toolSlug: 'keyword-density',
    type: 'guide',
    keywords: ['плотность ключевых слов', 'keyword density', 'seo текст', 'оптимизация контента'],
    date: '2026-03-03',
    readTime: 7,
    content: `
## Что такое плотность ключевых слов?

Плотность ключевых слов — это процентное соотношение количества вхождений ключевого слова к общему числу слов в тексте. Формула: (количество вхождений / общее количество слов) × 100%.

## Оптимальная плотность

| Тип | Диапазон | Примечание |
|---|---|---|
| Основной ключ | 1-3% | Естественное вхождение |
| Дополнительные ключи | 0.5-1.5% | LSI-ключи |
| Стоп-значение | > 3.5% | Риск переспама |

## Как анализировать плотность

1. Вставьте текст в [Анализатор плотности](/tools/keyword-density)
2. Получите список всех слов и фраз с частотой вхождения
3. Проверьте, не превышает ли основной ключ порог в 3%

## Почему переспам опасен

Поисковые системы распознают искусственное нагнетание ключевых слов (keyword stuffing) и могут понизить сайт в выдаче или наложить санкции.

## Современный подход к ключевым словам

Google использует NLP (обработку естественного языка) и понимает контекст. Важнее писать естественный, полезный текст с семантически связанными словами, чем заниматься подсчётом вхождений.

Смотрите также: [Проверка заголовков](/tools/heading-checker), [Генератор мета-тегов](/tools/meta-generator), [Счётчик слов](/tools/word-counter)
    `.trim(),
    contentEn: `
## What Is Keyword Density?

Keyword density is the percentage ratio of keyword occurrences to the total number of words in the text. Formula: (number of occurrences / total word count) x 100%.

## Optimal Density

| Type | Range | Note |
|---|---|---|
| Primary keyword | 1-3% | Natural occurrence |
| Secondary keywords | 0.5-1.5% | LSI keywords |
| Spam threshold | > 3.5% | Risk of keyword stuffing |

## How to Analyze Density

1. Paste text into the [Keyword Density Analyzer](/tools/keyword-density)
2. Get a list of all words and phrases with occurrence frequency
3. Check if the primary keyword exceeds the 3% threshold

## Why Keyword Stuffing Is Dangerous

Search engines detect artificial keyword stuffing and may lower the site in rankings or impose penalties.

## Modern Approach to Keywords

Google uses NLP (natural language processing) and understands context. Writing natural, useful text with semantically related words is more important than counting occurrences.

See also: [Heading Checker](/tools/heading-checker), [Meta Tag Generator](/tools/meta-generator), [Word Counter](/tools/word-counter)
    `.trim(),
  },
  {
    slug: 'keyword-density-tips',
    title: '6 советов по оптимизации ключевых слов в тексте',
    titleEn: '6 Tips for Optimizing Keywords in Text',
    description: 'Как правильно использовать ключевые слова: естественность, LSI, размещение.',
    descriptionEn: 'How to properly use keywords: naturalness, LSI, placement.',
    toolSlug: 'keyword-density',
    type: 'tips',
    keywords: ['ключевые слова советы', 'seo текст', 'keyword stuffing', 'lsi ключи'],
    date: '2026-03-08',
    readTime: 5,
    content: `
## 6 советов по ключевым словам

### 1. Пишите для людей, не для роботов
Текст должен быть полезным и читаемым. Поисковые системы ценят пользовательский опыт выше формальных показателей.

### 2. Используйте LSI-ключи
Латентно-семантические ключи — синонимы и связанные слова. Для «купить квартиру»: недвижимость, жильё, ипотека.

### 3. Размещайте ключи в важных местах
- H1 и H2 заголовки
- Первый абзац текста
- Мета-теги title и description
- Alt-теги изображений

### 4. Не превышайте 3% плотности
Оптимальный диапазон для основного ключа — 1.5-2.5%. Больше 3% — риск переспама.

### 5. Проверяйте конкурентов
Проанализируйте плотность ключевых слов на страницах из топ-10 по вашему запросу.

### 6. Используйте длинный хвост
Long-tail запросы из 3-5 слов менее конкурентны и более целевые.

Смотрите также: [Проверка заголовков](/tools/heading-checker), [Sitemap генератор](/tools/sitemap-generator)
    `.trim(),
    contentEn: `
## 6 Keyword Tips

### 1. Write for People, Not Robots
Text should be useful and readable. Search engines value user experience over formal metrics.

### 2. Use LSI Keywords
Latent semantic indexing keywords are synonyms and related words. For "buy apartment": real estate, housing, mortgage.

### 3. Place Keywords in Important Locations
- H1 and H2 headings
- First paragraph of text
- Title and description meta tags
- Image alt tags

### 4. Don't Exceed 3% Density
The optimal range for the primary keyword is 1.5-2.5%. Over 3% risks keyword stuffing.

### 5. Analyze Competitors
Analyze keyword density on pages from the top 10 for your target query.

### 6. Use Long-Tail Keywords
Long-tail queries of 3-5 words are less competitive and more targeted.

See also: [Heading Checker](/tools/heading-checker), [Sitemap Generator](/tools/sitemap-generator)
    `.trim(),
  },
  {
    slug: 'keyword-density-use-cases',
    title: 'Анализ плотности ключевых слов: 5 сценариев',
    titleEn: 'Keyword Density Analysis: 5 Scenarios',
    description: 'Когда проверять плотность ключей: копирайтинг, SEO-аудит, анализ конкурентов.',
    descriptionEn: 'When to check keyword density: copywriting, SEO audit, competitor analysis.',
    toolSlug: 'keyword-density',
    type: 'use-cases',
    keywords: ['плотность ключей применение', 'копирайтинг seo', 'анализ текста'],
    date: '2026-03-10',
    readTime: 4,
    content: `
## 5 сценариев использования

### 1. Проверка текста копирайтера
Перед публикацией убедитесь, что текст не переспамлен ключевыми словами и читается естественно.

### 2. SEO-аудит существующего контента
Проанализируйте страницы с низким трафиком — возможно, ключевые слова используются недостаточно или чрезмерно.

### 3. Анализ конкурентов
Скопируйте текст страниц конкурентов из топ-10 и проверьте их стратегию использования ключевых слов.

### 4. Оптимизация товарных описаний
В интернет-магазинах описания товаров должны содержать ключевые запросы без переспама.

### 5. Подготовка ТЗ для авторов
Определите целевые ключевые слова и допустимую плотность для технического задания копирайтеру.

Проверяйте тексты в [Анализаторе плотности ключевых слов](/tools/keyword-density).

Смотрите также: [Проверка заголовков](/tools/heading-checker), [Генератор мета-тегов](/tools/meta-generator), [Open Graph Preview](/tools/og-preview)
    `.trim(),
    contentEn: `
## 5 Use Cases

### 1. Reviewing Copywriter's Text
Before publishing, make sure the text isn't stuffed with keywords and reads naturally.

### 2. SEO Audit of Existing Content
Analyze pages with low traffic — keywords may be used insufficiently or excessively.

### 3. Competitor Analysis
Copy the text from competitor pages in the top 10 and check their keyword usage strategy.

### 4. Optimizing Product Descriptions
In online stores, product descriptions should contain target keywords without stuffing.

### 5. Preparing Briefs for Writers
Define target keywords and acceptable density for the copywriter's technical brief.

Check texts in the [Keyword Density Analyzer](/tools/keyword-density).

See also: [Heading Checker](/tools/heading-checker), [Meta Tag Generator](/tools/meta-generator), [Open Graph Preview](/tools/og-preview)
    `.trim(),
  },
];
