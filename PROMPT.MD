Создай полный код веб-приложения на Next.js 16 (последняя LTS-версия на март 2026) с использованием App Router, TypeScript, MUI (Material-UI v6+ с полной поддержкой Material Design 3) для идентичного Google-подобного дизайна. Проект называется Ultimate Tools (Utools-app) — универсальный набор из минимум 150-200 отдельных инструментов/утилит (ЕСЛИ УТИЛИТЫ ПОХОЖИ - МОЖНО ОБЪЕДЕНЯТЬ), разбитых по логическим группам (всего 15–30 групп). 

### Обязательные группы утилит (минимум 150-200 инструментов, расширь сам популярными аналогами из ниш: конвертеры, калькуляторы, генераторы, графика, текст, разработка, финансы, здоровье, развлечения, безопасность, данные, изображения, аудио/видео, математика, крипто, QR/баркоды, утилиты для devs)-И ТАК ДАЛЕЕ ВООБЩЕ ВСЁ САМОЕ ПОПУЛЯРНОЕ.
1. Конвертеры: Валюты, единицы длины/веса/объема/температуры/скорости/энергии/мощности/давления/площади/времени/углов/данных (биты/байты), цветов (HEX/RGB/CMYK/HSL), координат (lat/long), шрифтов-И ТАК ДАЛЕЕ ВООБЩЕ ВСЁ САМОЕ ПОПУЛЯРНОЕ.
2. Часовые пояса & Дата: Мировые часы, конвертер времени, календарь, таймер/секундомер, дата-разница, праздники/события-И ТАК ДАЛЕЕ ВООБЩЕ ВСЁ САМОЕ ПОПУЛЯРНОЕ 
3. Калькуляторы (12): Базовый/научный/финансовый/ипотека/кредиты/налоги/проценты/статистика/перcentiles/базовый BMI/калорий/рост/возраст-И ТАК ДАЛЕЕ ВООБЩЕ ВСЁ САМОЕ ПОПУЛЯРНОЕ.
4. Изображения & Графика (12): Сжатие фото (пакетное, WebP/AVIF/JPG), ресайз/кроп/поворот, удаление фона, фильтры (blur/sharpen), генератор QR, favicon (пакетный: из изображений/текста в PNG/ICO/SVG), цветовые палитры, градиенты, SVG-анимации, meme-генератор, пикселизация-И ТАК ДАЛЕЕ ВООБЩЕ ВСЁ САМОЕ ПОПУЛЯРНОЕ.
5. Текст & Контент (12): Переводчик (Google-like), переворот/зеркало текста, счётчик слов/символов, генератор lorem ipsum/случайный текст, case converter (upper/lower/title), удаление дубликатов/форматирование JSON/XML/YAML, HTML-энкодер, regex-тестер-И ТАК ДАЛЕЕ ВООБЩЕ ВСЁ САМОЕ ПОПУЛЯРНОЕ.
6. Генераторы (12): Пароли (strong/custom), UUID/GUID, lorem ipsum, QR-коды, баркоды, аватары (identicon), фавиконы (пакет), градиенты, палитры цветов, lorem пиксели, случайные имена/адреса/телефоны/карты/цитаты-И ТАК ДАЛЕЕ ВООБЩЕ ВСЁ САМОЕ ПОПУЛЯРНОЕ .
7. Для разработчиков 
Flexbox/Grid playground (примеры+экспорт), CSS minifier/validator, JS formatter/beautifier, JSON viewer/editor, base64 encoder/decoder, URL encoder/parser, regex builder, cron generator, MIME-type checker, HTTP status codes, color picker/blender, wireframe generator-И ТАК ДАЛЕЕ ВООБЩЕ ВСЁ САМОЕ ПОПУЛЯРНОЕ.
8. Математика & Статистика: Уравнения/матрицы, факториал/комбинаторика, статистика (среднее/медиана/дев), графики функций (Plotly-like), конвертер римских чисел, дроби/проценты-И ТАК ДАЛЕЕ ВООБЩЕ ВСЁ САМОЕ ПОПУЛЯРНОЕ.

9. Здоровье & Фитнес: BMI/идеальный вес/BMR/TDEE, тренировки/пульс, сон/циклы - САМ ТУТ ПРИДУМАЙ.
10. Финансы: Бюджет/расходы, инвестиции/сложный %, крипто-конвертер, инфляция - ТОЛЬКО ЛОКАЛЬНО НА КЛИЕНТЕ.
11. Данные & Безопасность: Хэши (MD5/SHA), UUID, password strength, случайные данные (JSON/CSV), валидатор email/тел/URL/IP, lorem data generator.
12. Развлечения & Рандом: Рандомайзеры (числа/строки/изображения/цвета/имена/пароли/карты/кости), генератор мемов/шуток, спиннер колесо фортуны - СРАЗУ ДЕЛАЙ УДОБНЫМ ДЛЯ ЮЗЕРА.
13. Аудио/Видео: Конвертер аудио (MP3/WAV), видео-сжатие/трим, спектрограмма- ПО ВОЗМОЖНОСТИ.
14. Другое: Погода API, заметки/ToDo, чатбот-placeholder, поиск по сайту-И ТАК ДАЛЕЕ ВООБЩЕ ВСЁ САМОЕ ПОПУЛЯРНОЕ.

Структура сайта:
- Главная страница: Hero с поиском по всем инструментам, популярные группы (grid cards), featured tools (12 топ), категории (grid), статистика (100+ tools), перелинковка на все группы/инструменты. SEO: H1 "Ultimate Tools — 100+ бесплатных онлайн утилит", meta, schema.org, МАКСИМАЛЬНОЕ СЕО.
- Группы утилит: /group/[slug] (e.g. /converters) — grid/list инструментов группы с описаниями, пагинация, поиск, перелинковка на инструменты/другие группы/статьи.
- Отдельный инструмент: /[group]/[tool-slug] (e.g. /converters/currency) — основной UI инструмента (формы/результаты), sidebar с related tools/группами. Для КАЖДОГО инструмента — 3 статьи (как минимум на 2000-5000 символов с сео-заголовками): /tools/[tool-slug]/guide (руководство), /blog/[tool-slug]-tips (советы), /blog/[tool-slug]-use-cases (кейсы). Каждая статья с H1–H6, списками, таблицами, перелинковками на другие инструменты/группы/главную. Общее: 280-300+ страниц статей для SEO!
- Блог: /blog — все статьи индексированы, теги, поиск, МАКСИМАЛЬНОЕ СЕО.
- Не указывать контакты/о компании.

Максимальное SEO/GEO/AEO:
- Next.js metadata API (dynamic/static), OpenGraph/Twitter cards, JSON-LD schema (Tools, SoftwareApplication для каждого), sitemap.xml (генерируй динамически все 400+ страниц), robots.txt.
- Русский hreflang, structured data для инструментов/статей (FAQPage, HowTo, Article).
- Перелинковка: В каждой странице/статье — 5–10 internal links на инструменты/группы/сопутствующие статьи (e.g. "Смотрите также конвертер ...").
- GEO: Русский язык, контент на русском (руководства/статьи на РУС, ключевые слова: "онлайн конвертер валют бесплатно", "генератор паролей", "сжатие фото пакетно") - ОТДЕЛЬНО ПЕРЕВОД СДЕЛАЕМ ПОСЛЕ ДОВЕДЕНИЯ РУССКОЙ ВЕРСИИ ДО ИДЕАЛА, ВСЕГО БУДЕТ 3 ЯЗЫКА - РУСС КЗ, АНГЛ .
- AEO: Featured snippets в статьях (списки шагов, таблицы сравнений).
- Скорость: Turbopack dev/prod, Image component (next/image), lazy loading, code splitting, PWA-ready (manifest) 95+ по скорости чтобы было на всех устройствах.

Дизайн — 90-100% Material Design 3 (MUI v6+ с MD3 theme):
- Цвета: MD3 palettes (primary/secondary/tertiary, surface/tonalElevation, light/dark dynamic scheme от system).
- Типографика: Roboto/Material fonts, scales MD3 (display/large/headline/body/label).
- Shapes: Material DESIGN SHAPES.
- Компоненты: AppBar (top nav), NavigationRail/Drawer (sidebar на десктоп/моб), Cards (tools/groups), Buttons/FAB (elevated/filled/tonal/outlined), Chips, TextFields/Selects/Textarea (MD3 styles), Progress/Loading, Dialogs/Snackbars, Tables/DataGrids.
- Иконки: Material Symbols (MD3 icons, 24dp/48dp).
- Анимации/переходы: MD3 motion (ease-in-out 200–300ms), ripple effects, scale/fade.
- Фоны/SVG: Gradient backgrounds (MD3 tonal), SVG icons/анимации (Lottie-like или Framer Motion).
- Адаптив: Mobile-first (xs/sm/md/lg/xl), breakpoints MD3, touch-friendly.
- Темы: Переключатель light/dark (localStorage/system), ThemeProvider.
- Языки: ТОЛЬКО РУССКИЙ на старте (next-intl или i18n). Укажи в промпте/комментах: "Сначала реализуй на РУС, доведи до идеала (тесты/оптимизация), ПОТОМ добавь Kazakh/English (всего 3 языка: RU/KZ/EN)". Используй JSON для переводов. - Я САМ ДАМ ЗНАТ MRJULF ПЕРЕВОДИТЬ - БЕЗ МЕНЯ НЕ ДЕЛАЙ 


Функционал:
- Удобство/UI/UX: Поиск глобальный (fuse.js), избранное (localStorage), история, экспорт (CSV/JSON/PNG/SVG), drag&drop (файлы), real-time previews, keyboard shortcuts, ARIA/accessibility (MD3 a11y).
- Безопасность: Sanitize inputs (DOMPurify), no client-side storage sensitive data, CSP headers, secure headers via next.config.
- Скорость: Server Components, React Server Actions для форм, streaming, Suspense.
- Другое: PWA (offline tools где возможно), service worker, analytics placeholder (no cookies), 100% Lighthouse 100+ score.


Генерируй ПОЛНЫЙ рабочий код: Все страницы, компоненты, данные (tools.json с 100+), примеры реализаций 5–10 ключевых инструментов (остальные skeletons+TODO), 9 статей (по 3 на 3 инструмента, full text на РУС). Используй shadcn? NO — чистый MUI MD3. Убедись в современности/красивости: glassmorphism? Нет, чистый MD3. Всё в едином стиле, плавно, удобно. Код чистый, scalable.

Цитаты:
[1] Next.js by Vercel - The React Framework https://nextjs.org/blog
[2] Next.js - endoflife.dateendoflife.date › nextjs https://endoflife.date/nextjs
[3] Next.js 16.1 https://nextjs.org/blog/next-16-1
[4] Next.js Changelog https://next-changelog.vercel.app
[5] Next.js by Vercel - Release Notes - February 2026 Latest Updates https://releasebot.io/updates/vercel/next-js
[6] GitHub - Gryt-chat/material-gryt-3: Material Design 3 NextJs implementation https://github.com/Gryt-chat/material-gryt-3
[7] Top 25+ Tools on the Web in 2026 - Webmaster Tips https://www.wmtips.com/technologies/tools/
[8] Everything you need to Know about Material Design 3 https://www.youtube.com/watch?v=h_JYW2hdI8U
[9] Next.js SEO Best Practices (App Router, 2025 Edition) - AverageDevs https://www.averagedevs.com/blog/nextjs-seo-best-practices
[10] 10 Best Calculator Builders in 2026 (Free + Paid No-Code ... - Taskade https://www.taskade.com/blog/best-calculator-builders
[11] 5 Best React UI Libraries for 2026 (And When to Use Each ... - Dev.to https://dev.to/ansonch/5-best-react-ui-libraries-for-2026-and-when-to-use-each-1p4j
[12] Which is the go-to React UI / Next JS library in 2026? - Reddit https://www.reddit.com/r/reactjs/comments/1rfenu5/which_is_the_goto_react_ui_next_js_library_in_2026/
[13] 15 Best React UI Libraries for 2026 - Builder.io https://www.builder.io/blog/react-component-libraries-2026
[14] Material Design 3 - Google's latest open source design system https://m3.material.io
[15] How to use Material-UI with Next.js https://www.geeksforgeeks.org/reactjs/how-to-use-material-ui-with-next-js/
[16] Online Tools And Converters - GitHub Gist https://gist.github.com/unitycoder/ade29d3e549b1c33c10ec55e4ea80b70
[17] Types of Mobile Application - Appium https://www.geeksforgeeks.org/python/types-of-mobile-application-appium/
[18] Material Icons Guide | Google Fonts https://developers.google.com/fonts/docs/material_icons
[19] GitHub - AbdurehmanSaleemi/Material-Design-3-React: Open Source Material Design 3 React Library https://github.com/AbdurehmanSaleemi/Material-Design-3-React