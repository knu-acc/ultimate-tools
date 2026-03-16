import { Article } from '../articles';

export const encodingArticles: Article[] = [
  // === Base64 кодирование ===
  {
    slug: 'base64-encoder-guide',
    title: 'Base64 кодирование — полное руководство',
    titleEn: 'Base64 Encoding — Complete Guide',
    description: 'Подробное руководство по Base64 кодированию и декодированию. Узнайте, как работает Base64, зачем он нужен и как использовать инструмент.',
    descriptionEn: 'A detailed guide to Base64 encoding and decoding. Learn how Base64 works, why it is needed, and how to use the tool.',
    toolSlug: 'base64-encoder',
    type: 'guide',
    keywords: ['base64', 'кодирование', 'декодирование', 'бинарные данные', 'текст в base64'],
    date: '2026-02-17',
    readTime: 7,
    content: `
## Что такое Base64?

Base64 — это метод кодирования бинарных данных в текстовый формат с использованием 64 символов: A-Z, a-z, 0-9, + и /. Символ = используется для выравнивания.

### Зачем нужен Base64

Многие протоколы и форматы поддерживают только текстовые данные. Base64 позволяет передавать бинарные данные (изображения, файлы) через текстовые каналы.

### Как использовать инструмент

1. Вставьте текст или данные в поле ввода
2. Выберите режим: кодирование или декодирование
3. Нажмите кнопку обработки
4. Скопируйте результат

### Примеры кодирования

| Исходный текст | Base64 результат      |
|----------------|------------------------|
| Привет         | 0J/RgNC40LLQtdGC       |
| Hello          | SGVsbG8=               |
| 123            | MTIz                   |

### Особенности

- Закодированные данные примерно на 33% больше оригинала
- Base64 — это кодирование, а не шифрование
- Не обеспечивает безопасность данных
- Широко используется в email (MIME), Data URI и JWT

Смотрите также: [URL кодирование](/tools/url-encoder), [HTML кодирование](/tools/html-encoder), [Бинарный текст](/tools/binary-text)
`,
    contentEn: `
## What Is Base64?

Base64 is a method of encoding binary data into a text format using 64 characters: A-Z, a-z, 0-9, + and /. The = character is used for padding.

### Why Base64 Is Needed

Many protocols and formats only support text data. Base64 allows you to transmit binary data (images, files) through text-based channels.

### How to Use the Tool

1. Paste text or data into the input field
2. Select the mode: encode or decode
3. Click the process button
4. Copy the result

### Encoding Examples

| Original Text | Base64 Result          |
|----------------|------------------------|
| Привет         | 0J/RgNC40LLQtdGC       |
| Hello          | SGVsbG8=               |
| 123            | MTIz                   |

### Key Features

- Encoded data is approximately 33% larger than the original
- Base64 is encoding, not encryption
- It does not provide data security
- Widely used in email (MIME), Data URIs, and JWT

See also: [URL Encoding](/tools/url-encoder), [HTML Encoding](/tools/html-encoder), [Binary Text](/tools/binary-text)
`.trim()
  },
  {
    slug: 'base64-encoder-tips',
    title: 'Советы по работе с Base64 — кодирование эффективно',
    titleEn: 'Tips for Working with Base64 — Encoding Efficiently',
    description: 'Практические советы по использованию Base64: оптимизация, подводные камни и лучшие практики.',
    descriptionEn: 'Practical tips for using Base64: optimization, pitfalls, and best practices.',
    toolSlug: 'base64-encoder',
    type: 'tips',
    keywords: ['base64 советы', 'кодирование лайфхаки', 'base64 оптимизация'],
    date: '2026-03-05',
    readTime: 6,
    content: `
## Советы по работе с Base64

Base64 кодирование имеет свои нюансы. Эти советы помогут вам использовать его правильно.

### Совет 1: Учитывайте увеличение размера

Base64 увеличивает объём данных на ~33%. Для маленьких изображений (иконок) это приемлемо, для больших файлов — нет.

### Совет 2: Используйте Data URI для мелких изображений

Встройте маленькие изображения прямо в CSS или HTML через Data URI. Это сокращает количество HTTP-запросов.

### Совет 3: Не используйте для безопасности

Base64 — это кодирование, не шифрование. Любой может декодировать данные. Для защиты используйте настоящее шифрование.

### Совет 4: Следите за кодировкой текста

При кодировании текста на русском языке убедитесь, что используется UTF-8. Иначе при декодировании получите нечитаемые символы.

### Совет 5: URL-safe вариант Base64

Для использования в URL заменяйте + на -, / на _ и убирайте =. Это стандарт Base64URL, применяемый в JWT.

### Совет 6: Проверяйте валидность

Перед декодированием убедитесь, что строка содержит только допустимые символы Base64. Невалидные символы вызовут ошибку.

### Совет 7: Потоковая обработка

Для больших файлов используйте потоковое кодирование, обрабатывая данные блоками по 3 байта.

Смотрите также: [URL кодирование](/tools/url-encoder), [Азбука Морзе](/tools/morse-code), [HTML кодирование](/tools/html-encoder)
`,
    contentEn: `
## Tips for Working with Base64

Base64 encoding has its nuances. These tips will help you use it correctly.

### Tip 1: Account for Size Increase

Base64 increases data size by ~33%. For small images (icons) this is acceptable, but not for large files.

### Tip 2: Use Data URIs for Small Images

Embed small images directly in CSS or HTML via Data URIs. This reduces the number of HTTP requests.

### Tip 3: Do Not Use for Security

Base64 is encoding, not encryption. Anyone can decode the data. For protection, use real encryption.

### Tip 4: Watch the Text Encoding

When encoding text in languages like Russian, make sure UTF-8 is used. Otherwise, decoding will produce unreadable characters.

### Tip 5: URL-safe Base64 Variant

For use in URLs, replace + with -, / with _, and remove =. This is the Base64URL standard used in JWT.

### Tip 6: Validate Before Decoding

Before decoding, make sure the string contains only valid Base64 characters. Invalid characters will cause an error.

### Tip 7: Stream Processing

For large files, use streaming encoding, processing data in 3-byte blocks.

See also: [URL Encoding](/tools/url-encoder), [Morse Code](/tools/morse-code), [HTML Encoding](/tools/html-encoder)
`.trim()
  },
  {
    slug: 'base64-encoder-use-cases',
    title: 'Base64 кодирование — примеры использования',
    titleEn: 'Base64 Encoding — Use Case Examples',
    description: 'Реальные сценарии применения Base64: от встраивания изображений до JWT токенов и API.',
    descriptionEn: 'Real-world Base64 use cases: from embedding images to JWT tokens and APIs.',
    toolSlug: 'base64-encoder',
    type: 'use-cases',
    keywords: ['base64 примеры', 'кодирование применение', 'data uri', 'jwt base64'],
    date: '2026-01-22',
    readTime: 7,
    content: `
## Примеры использования Base64

Base64 широко применяется в веб-разработке, API и передаче данных.

### Встраивание изображений в HTML/CSS

Data URI позволяет вставлять маленькие изображения прямо в код без отдельных файлов. Это уменьшает количество HTTP-запросов.

### Email и MIME

Вложения электронной почты кодируются в Base64, чтобы передаваться через текстовый протокол SMTP.

### JWT токены

JSON Web Tokens используют Base64URL для кодирования заголовка и полезной нагрузки. Каждый JWT состоит из трёх частей, разделённых точками.

### API и передача данных

- Передача бинарных данных через JSON API
- Хранение небольших файлов в базе данных в текстовом формате
- Обмен данными между системами с разными кодировками

### Хранение ключей и сертификатов

Криптографические ключи и сертификаты часто хранятся в формате PEM, который использует Base64 кодирование.

### Отладка и тестирование

Разработчики используют Base64 для быстрой проверки содержимого закодированных данных в логах и отладочных сообщениях.

Смотрите также: [URL кодирование](/tools/url-encoder), [HTML кодирование](/tools/html-encoder), [Бинарный текст](/tools/binary-text)
`,
    contentEn: `
## Base64 Use Case Examples

Base64 is widely used in web development, APIs, and data transmission.

### Embedding Images in HTML/CSS

Data URIs allow you to insert small images directly into code without separate files. This reduces the number of HTTP requests.

### Email and MIME

Email attachments are encoded in Base64 so they can be transmitted through the text-based SMTP protocol.

### JWT Tokens

JSON Web Tokens use Base64URL to encode the header and payload. Each JWT consists of three parts separated by dots.

### APIs and Data Transfer

- Transmitting binary data through JSON APIs
- Storing small files in databases in text format
- Exchanging data between systems with different encodings

### Storing Keys and Certificates

Cryptographic keys and certificates are often stored in PEM format, which uses Base64 encoding.

### Debugging and Testing

Developers use Base64 to quickly inspect the contents of encoded data in logs and debug messages.

See also: [URL Encoding](/tools/url-encoder), [HTML Encoding](/tools/html-encoder), [Binary Text](/tools/binary-text)
`.trim()
  },

  // === URL кодирование ===
  {
    slug: 'url-encoder-guide',
    title: 'URL кодирование — руководство по Percent-Encoding',
    titleEn: 'URL Encoding — Percent-Encoding Guide',
    description: 'Полное руководство по URL кодированию: как работает Percent-Encoding, какие символы кодируются и зачем это нужно.',
    descriptionEn: 'A complete guide to URL encoding: how Percent-Encoding works, which characters are encoded, and why it is needed.',
    toolSlug: 'url-encoder',
    type: 'guide',
    keywords: ['url кодирование', 'percent encoding', 'urlencode', 'кодирование ссылок'],
    date: '2026-02-10',
    readTime: 6,
    content: `
## Что такое URL кодирование?

URL кодирование (Percent-Encoding) — это механизм замены небезопасных символов в URL на их шестнадцатеричные коды в формате %XX.

### Зачем нужно кодирование URL

URL может содержать только определённые символы ASCII. Пробелы, кириллица и специальные символы требуют кодирования для корректной передачи.

### Какие символы кодируются

| Символ | Закодированный вид |
|--------|-------------------|
| Пробел | %20 или +         |
| &      | %26               |
| =      | %3D               |
| ?      | %3F               |
| #      | %23               |
| Кириллица | %D0%... (UTF-8) |

### Как использовать инструмент

1. Вставьте текст или URL в поле ввода
2. Выберите режим: кодирование или декодирование
3. Получите результат мгновенно
4. Скопируйте закодированный URL

### Режимы кодирования

- **Полное кодирование**: кодирует все не-ASCII символы
- **Кодирование компонентов**: для параметров запроса
- **Минимальное кодирование**: только обязательные символы

### Стандарт RFC 3986

Современное URL кодирование следует стандарту RFC 3986, который определяет набор зарезервированных и незарезервированных символов.

Смотрите также: [Base64 кодирование](/tools/base64-encoder), [HTML кодирование](/tools/html-encoder), [Unicode справочник](/tools/unicode-lookup)
`,
    contentEn: `
## What Is URL Encoding?

URL encoding (Percent-Encoding) is a mechanism for replacing unsafe characters in a URL with their hexadecimal codes in the format %XX.

### Why URL Encoding Is Needed

A URL can only contain certain ASCII characters. Spaces, Cyrillic characters, and special characters require encoding for proper transmission.

### Which Characters Are Encoded

| Character | Encoded Form       |
|-----------|-------------------|
| Space     | %20 or +          |
| &         | %26               |
| =         | %3D               |
| ?         | %3F               |
| #         | %23               |
| Cyrillic  | %D0%... (UTF-8)   |

### How to Use the Tool

1. Paste text or a URL into the input field
2. Select the mode: encode or decode
3. Get the result instantly
4. Copy the encoded URL

### Encoding Modes

- **Full encoding**: encodes all non-ASCII characters
- **Component encoding**: for query parameters
- **Minimal encoding**: only mandatory characters

### RFC 3986 Standard

Modern URL encoding follows the RFC 3986 standard, which defines the set of reserved and unreserved characters.

See also: [Base64 Encoding](/tools/base64-encoder), [HTML Encoding](/tools/html-encoder), [Unicode Lookup](/tools/unicode-lookup)
`.trim()
  },
  {
    slug: 'url-encoder-tips',
    title: 'Советы по URL кодированию — избегайте ошибок',
    titleEn: 'URL Encoding Tips — Avoid Common Mistakes',
    description: 'Практические советы и частые ошибки при URL кодировании. Как правильно кодировать параметры, пути и запросы.',
    descriptionEn: 'Practical tips and common mistakes in URL encoding. How to properly encode parameters, paths, and queries.',
    toolSlug: 'url-encoder',
    type: 'tips',
    keywords: ['url кодирование советы', 'percent encoding лайфхаки', 'urlencode ошибки'],
    date: '2026-01-28',
    readTime: 5,
    content: `
## Советы по URL кодированию

URL кодирование кажется простым, но часто приводит к ошибкам. Вот ключевые советы.

### Совет 1: Кодируйте только значения параметров

Не кодируйте весь URL целиком. Кодируйте только значения параметров запроса, оставляя структуру URL нетронутой.

### Совет 2: Пробел — это %20 или +

В пути URL пробел кодируется как %20. В теле формы (application/x-www-form-urlencoded) — как +. Не путайте контексты.

### Совет 3: Не кодируйте дважды

Двойное кодирование — частая ошибка. Символ & становится %26, а при повторном кодировании — %2526. Проверяйте входные данные.

### Совет 4: Учитывайте UTF-8

Кириллица и другие Unicode-символы сначала конвертируются в UTF-8 байты, затем каждый байт кодируется отдельно.

### Совет 5: Используйте encodeURIComponent

В JavaScript для кодирования параметров используйте encodeURIComponent(), а не encodeURI(). Они кодируют разные наборы символов.

### Совет 6: Проверяйте длину URL

Закодированные URL могут стать очень длинными. Большинство браузеров поддерживают URL до 2048 символов. Для длинных данных используйте POST-запросы.

Смотрите также: [Base64 кодирование](/tools/base64-encoder), [HTML кодирование](/tools/html-encoder), [Бинарный текст](/tools/binary-text)
`,
    contentEn: `
## URL Encoding Tips

URL encoding seems simple, but it often leads to mistakes. Here are the key tips.

### Tip 1: Only Encode Parameter Values

Do not encode the entire URL. Only encode query parameter values, leaving the URL structure intact.

### Tip 2: Space Is %20 or +

In the URL path, a space is encoded as %20. In form bodies (application/x-www-form-urlencoded) it is encoded as +. Do not confuse the contexts.

### Tip 3: Do Not Double-Encode

Double encoding is a common mistake. The & character becomes %26, and if encoded again — %2526. Always check your input data.

### Tip 4: Account for UTF-8

Cyrillic and other Unicode characters are first converted to UTF-8 bytes, then each byte is encoded separately.

### Tip 5: Use encodeURIComponent

In JavaScript, use encodeURIComponent() for encoding parameters, not encodeURI(). They encode different sets of characters.

### Tip 6: Check the URL Length

Encoded URLs can become very long. Most browsers support URLs up to 2048 characters. For long data, use POST requests.

See also: [Base64 Encoding](/tools/base64-encoder), [HTML Encoding](/tools/html-encoder), [Binary Text](/tools/binary-text)
`.trim()
  },
  {
    slug: 'url-encoder-use-cases',
    title: 'URL кодирование — практические примеры',
    titleEn: 'URL Encoding — Practical Examples',
    description: 'Сценарии применения URL кодирования в веб-разработке, API, аналитике и SEO.',
    descriptionEn: 'URL encoding use cases in web development, APIs, analytics, and SEO.',
    toolSlug: 'url-encoder',
    type: 'use-cases',
    keywords: ['url кодирование примеры', 'percent encoding применение', 'кодирование ссылок'],
    date: '2026-02-28',
    readTime: 6,
    content: `
## Примеры использования URL кодирования

URL кодирование необходимо во множестве веб-сценариев.

### Передача параметров в API

При отправке запросов к API значения параметров могут содержать специальные символы. Кодирование гарантирует корректную обработку на сервере.

### Поисковые запросы

Когда вы вводите запрос в поисковике, он кодируется в URL. Например, запрос «привет мир» превращается в параметр q=%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82+%D0%BC%D0%B8%D1%80.

### Формы на веб-сайтах

Данные форм, отправляемые методом GET, кодируются в URL автоматически. Понимание этого процесса помогает при отладке.

### UTM-метки и аналитика

Маркетологи добавляют UTM-параметры к URL для отслеживания источников трафика. Значения с пробелами и спецсимволами нужно кодировать.

### Редиректы и обратные ссылки

URL в параметре redirect_uri должен быть закодирован, чтобы не нарушить структуру основного URL.

### Интернационализированные домены (IDN)

Домены с кириллицей конвертируются в Punycode, а пути и параметры кодируются через Percent-Encoding.

Смотрите также: [Base64 кодирование](/tools/base64-encoder), [HTML кодирование](/tools/html-encoder), [Unicode справочник](/tools/unicode-lookup)
`,
    contentEn: `
## URL Encoding Use Cases

URL encoding is essential in many web scenarios.

### Passing Parameters to APIs

When sending API requests, parameter values may contain special characters. Encoding ensures proper processing on the server.

### Search Queries

When you enter a query in a search engine, it gets encoded in the URL. For example, the query "hello world" becomes the parameter q=hello+world.

### Website Forms

Form data submitted via GET is automatically encoded in the URL. Understanding this process helps with debugging.

### UTM Tags and Analytics

Marketers add UTM parameters to URLs to track traffic sources. Values with spaces and special characters need to be encoded.

### Redirects and Callback URLs

The URL in the redirect_uri parameter must be encoded so it does not break the structure of the main URL.

### Internationalized Domain Names (IDN)

Domains with Cyrillic characters are converted to Punycode, while paths and parameters are encoded via Percent-Encoding.

See also: [Base64 Encoding](/tools/base64-encoder), [HTML Encoding](/tools/html-encoder), [Unicode Lookup](/tools/unicode-lookup)
`.trim()
  },

  // === HTML кодирование ===
  {
    slug: 'html-encoder-guide',
    title: 'HTML кодирование — руководство по HTML entities',
    titleEn: 'HTML Encoding — Guide to HTML Entities',
    description: 'Руководство по кодированию и декодированию HTML entities. Защита от XSS, спецсимволы и безопасный вывод данных.',
    descriptionEn: 'A guide to encoding and decoding HTML entities. XSS protection, special characters, and safe data output.',
    toolSlug: 'html-encoder',
    type: 'guide',
    keywords: ['html кодирование', 'html entities', 'экранирование html', 'xss защита'],
    date: '2026-03-03',
    readTime: 7,
    content: `
## HTML кодирование — что это и зачем

HTML кодирование заменяет специальные символы на HTML entities — текстовые представления, которые браузер отображает как исходные символы.

### Основные HTML entities

| Символ | Entity       | Числовой код |
|--------|-------------|-------------|
| <      | &lt;        | &#60;       |
| >      | &gt;        | &#62;       |
| &      | &amp;       | &#38;       |
| "      | &quot;      | &#34;       |
| '      | &apos;      | &#39;       |

### Зачем кодировать HTML

1. **Безопасность**: защита от XSS-атак при выводе пользовательских данных
2. **Корректность**: символы < и > не интерпретируются как теги
3. **Спецсимволы**: отображение символов, которых нет на клавиатуре

### Как использовать инструмент

1. Вставьте текст с HTML-кодом в поле ввода
2. Выберите режим: кодирование или декодирование
3. Получите безопасный текст с entities
4. Скопируйте результат для использования в коде

### Именованные и числовые entities

Именованные entities (вроде &amp;) более читаемы. Числовые (&#38;) поддерживают любые Unicode-символы, даже те, для которых нет именованных аналогов.

Смотрите также: [URL кодирование](/tools/url-encoder), [Base64 кодирование](/tools/base64-encoder), [Unicode справочник](/tools/unicode-lookup)
`,
    contentEn: `
## HTML Encoding — What It Is and Why It Matters

HTML encoding replaces special characters with HTML entities — text representations that the browser renders as the original characters.

### Common HTML Entities

| Character | Entity       | Numeric Code |
|-----------|-------------|-------------|
| <         | &lt;        | &#60;       |
| >         | &gt;        | &#62;       |
| &         | &amp;       | &#38;       |
| "         | &quot;      | &#34;       |
| '         | &apos;      | &#39;       |

### Why Encode HTML

1. **Security**: protection against XSS attacks when outputting user data
2. **Correctness**: < and > characters are not interpreted as tags
3. **Special characters**: displaying characters not available on the keyboard

### How to Use the Tool

1. Paste text with HTML code into the input field
2. Select the mode: encode or decode
3. Get safe text with entities
4. Copy the result for use in your code

### Named and Numeric Entities

Named entities (like &amp;) are more readable. Numeric entities (&#38;) support any Unicode characters, even those without named equivalents.

See also: [URL Encoding](/tools/url-encoder), [Base64 Encoding](/tools/base64-encoder), [Unicode Lookup](/tools/unicode-lookup)
`.trim()
  },
  {
    slug: 'html-encoder-tips',
    title: 'Советы по HTML кодированию — безопасность и практика',
    titleEn: 'HTML Encoding Tips — Security and Best Practices',
    description: 'Практические советы по HTML кодированию: предотвращение XSS, работа со спецсимволами и лучшие практики.',
    descriptionEn: 'Practical HTML encoding tips: preventing XSS, working with special characters, and best practices.',
    toolSlug: 'html-encoder',
    type: 'tips',
    keywords: ['html кодирование советы', 'html entities лайфхаки', 'xss предотвращение'],
    date: '2026-02-03',
    readTime: 6,
    content: `
## Советы по HTML кодированию

Правильное HTML кодирование критически важно для безопасности и корректности веб-приложений.

### Совет 1: Всегда кодируйте пользовательский ввод

Любые данные, полученные от пользователя, должны быть закодированы перед вставкой в HTML. Это основная защита от XSS-атак.

### Совет 2: Контекст имеет значение

Кодирование для HTML-содержимого отличается от кодирования для атрибутов, JavaScript и CSS. Используйте соответствующий метод для каждого контекста.

### Совет 3: Не декодируйте без необходимости

Если данные уже закодированы, не декодируйте их для повторного кодирования. Это может создать уязвимости.

### Совет 4: Используйте библиотеки

Не пишите кодирование вручную. Используйте проверенные библиотеки вашего языка программирования: htmlspecialchars в PHP, html.escape в Python.

### Совет 5: Спецсимволы в контенте

Для вставки символов вроде ©, ™, € используйте именованные entities: &copy;, &trade;, &euro;. Это надёжнее прямой вставки Unicode.

### Совет 6: Проверяйте результат

После кодирования всегда проверяйте результат в браузере. Двойное кодирование приведёт к отображению &amp;amp; вместо &.

### Совет 7: Content Security Policy

HTML кодирование — лишь один слой защиты. Используйте CSP заголовки для дополнительной безопасности.

Смотрите также: [URL кодирование](/tools/url-encoder), [Base64 кодирование](/tools/base64-encoder), [Бинарный текст](/tools/binary-text)
`,
    contentEn: `
## HTML Encoding Tips

Proper HTML encoding is critically important for the security and correctness of web applications.

### Tip 1: Always Encode User Input

Any data received from users must be encoded before being inserted into HTML. This is the primary defense against XSS attacks.

### Tip 2: Context Matters

Encoding for HTML content differs from encoding for attributes, JavaScript, and CSS. Use the appropriate method for each context.

### Tip 3: Do Not Decode Unnecessarily

If data is already encoded, do not decode it for re-encoding. This can create vulnerabilities.

### Tip 4: Use Libraries

Do not write encoding manually. Use proven libraries for your programming language: htmlspecialchars in PHP, html.escape in Python.

### Tip 5: Special Characters in Content

To insert characters like ©, ™, € use named entities: &copy;, &trade;, &euro;. This is more reliable than directly inserting Unicode.

### Tip 6: Verify the Result

After encoding, always check the result in a browser. Double encoding will display &amp;amp; instead of &.

### Tip 7: Content Security Policy

HTML encoding is just one layer of defense. Use CSP headers for additional security.

See also: [URL Encoding](/tools/url-encoder), [Base64 Encoding](/tools/base64-encoder), [Binary Text](/tools/binary-text)
`.trim()
  },
  {
    slug: 'html-encoder-use-cases',
    title: 'HTML кодирование — сценарии применения',
    titleEn: 'HTML Encoding — Use Case Scenarios',
    description: 'Практические примеры использования HTML кодирования в веб-разработке, CMS, шаблонах и безопасности.',
    descriptionEn: 'Practical examples of HTML encoding in web development, CMS, templates, and security.',
    toolSlug: 'html-encoder',
    type: 'use-cases',
    keywords: ['html кодирование примеры', 'html entities применение', 'экранирование html'],
    date: '2026-01-18',
    readTime: 5,
    content: `
## Примеры использования HTML кодирования

HTML кодирование применяется повсеместно в веб-разработке и контент-менеджменте.

### Защита от XSS-атак

Когда пользователь вводит данные в форму, злоумышленник может попытаться вставить вредоносный скрипт. HTML кодирование превращает теги в безопасный текст.

### CMS и блог-платформы

Системы управления контентом кодируют пользовательские комментарии и посты для безопасного отображения на страницах.

### Отображение кода на страницах

Чтобы показать HTML-код на веб-странице (как в документации), все теги должны быть закодированы, иначе браузер интерпретирует их.

### Электронные письма в HTML

При формировании HTML-писем специальные символы в данных получателя должны быть закодированы для корректного отображения.

### Генерация XML и RSS

XML и RSS-ленты требуют кодирования спецсимволов в содержимом для валидности документа.

### Интернационализация

Символы разных алфавитов и специальные знаки надёжнее представлять через числовые entities для максимальной совместимости.

Смотрите также: [URL кодирование](/tools/url-encoder), [Unicode справочник](/tools/unicode-lookup), [Base64 кодирование](/tools/base64-encoder)
`,
    contentEn: `
## HTML Encoding Use Cases

HTML encoding is used extensively in web development and content management.

### Protection Against XSS Attacks

When a user enters data in a form, an attacker may try to inject a malicious script. HTML encoding turns tags into safe text.

### CMS and Blog Platforms

Content management systems encode user comments and posts for safe display on pages.

### Displaying Code on Pages

To show HTML code on a web page (as in documentation), all tags must be encoded, otherwise the browser will interpret them.

### HTML Emails

When composing HTML emails, special characters in recipient data must be encoded for correct display.

### XML and RSS Generation

XML and RSS feeds require encoding of special characters in content for document validity.

### Internationalization

Characters from different alphabets and special symbols are more reliably represented through numeric entities for maximum compatibility.

See also: [URL Encoding](/tools/url-encoder), [Unicode Lookup](/tools/unicode-lookup), [Base64 Encoding](/tools/base64-encoder)
`.trim()
  },

  // === Азбука Морзе ===
  {
    slug: 'morse-code-guide',
    title: 'Азбука Морзе онлайн — руководство по переводу',
    titleEn: 'Morse Code Online — Translation Guide',
    description: 'Полное руководство по азбуке Морзе: история, таблица символов, кодирование и декодирование текста в код Морзе.',
    descriptionEn: 'A complete guide to Morse code: history, character chart, encoding and decoding text to Morse code.',
    toolSlug: 'morse-code',
    type: 'guide',
    keywords: ['азбука морзе', 'код морзе', 'морзе переводчик', 'точки и тире'],
    date: '2026-02-20',
    readTime: 8,
    content: `
## Азбука Морзе — история и использование

Азбука Морзе — система кодирования символов с помощью точек (.) и тире (-), разработанная Сэмюэлем Морзе в 1830-х годах.

### Латинский алфавит в коде Морзе

| Буква | Код  | Буква | Код   |
|-------|------|-------|-------|
| A     | .-   | N     | -.    |
| B     | -... | O     | ---   |
| C     | -.-. | P     | .--. |
| D     | -..  | S     | ...   |
| E     | .    | T     | -     |

### Как использовать инструмент

1. Введите текст в поле ввода
2. Выберите направление: текст в Морзе или Морзе в текст
3. Получите результат мгновенно
4. Воспроизведите звуковой сигнал (опционально)

### Правила кодирования

- Точка (.) — короткий сигнал
- Тире (-) — длинный сигнал (3 точки)
- Пауза между элементами — 1 точка
- Пауза между буквами — 3 точки
- Пауза между словами — 7 точек

### Поддержка кириллицы

Наш инструмент поддерживает русский алфавит. Кириллические буквы имеют свои коды Морзе, утверждённые международным стандартом.

### Звуковое воспроизведение

Прослушайте закодированное сообщение — инструмент воспроизводит точки и тире как звуковые сигналы.

Смотрите также: [Бинарный текст](/tools/binary-text), [Base64 кодирование](/tools/base64-encoder), [Unicode справочник](/tools/unicode-lookup)
`,
    contentEn: `
## Morse Code — History and Usage

Morse code is a character encoding system using dots (.) and dashes (-), developed by Samuel Morse in the 1830s.

### Latin Alphabet in Morse Code

| Letter | Code | Letter | Code  |
|--------|------|--------|-------|
| A      | .-   | N      | -.    |
| B      | -... | O      | ---   |
| C      | -.-. | P      | .--. |
| D      | -..  | S      | ...   |
| E      | .    | T      | -     |

### How to Use the Tool

1. Enter text in the input field
2. Select the direction: text to Morse or Morse to text
3. Get the result instantly
4. Play the audio signal (optional)

### Encoding Rules

- Dot (.) — short signal
- Dash (-) — long signal (3 dots)
- Pause between elements — 1 dot
- Pause between letters — 3 dots
- Pause between words — 7 dots

### Cyrillic Support

Our tool supports the Russian alphabet. Cyrillic letters have their own Morse codes approved by international standards.

### Audio Playback

Listen to the encoded message — the tool plays dots and dashes as audio signals.

See also: [Binary Text](/tools/binary-text), [Base64 Encoding](/tools/base64-encoder), [Unicode Lookup](/tools/unicode-lookup)
`.trim()
  },
  {
    slug: 'morse-code-tips',
    title: 'Советы по изучению азбуки Морзе',
    titleEn: 'Tips for Learning Morse Code',
    description: 'Эффективные методы запоминания азбуки Морзе, мнемонические техники и практические рекомендации.',
    descriptionEn: 'Effective methods for memorizing Morse code, mnemonic techniques, and practical recommendations.',
    toolSlug: 'morse-code',
    type: 'tips',
    keywords: ['азбука морзе советы', 'код морзе обучение', 'морзе запоминание'],
    date: '2026-01-15',
    readTime: 6,
    content: `
## Советы по изучению азбуки Морзе

Изучение азбуки Морзе может показаться сложным, но с правильным подходом это увлекательный процесс.

### Совет 1: Начните с частых букв

Изучайте буквы в порядке частотности: E, T, A, O, I, N, S. Это позволит быстрее читать реальные сообщения.

### Совет 2: Учите звуками, не визуально

Не запоминайте точки и тире визуально. Слушайте звуки и ассоциируйте их с буквами. Это значительно ускоряет распознавание.

### Совет 3: Метод Коха

Начните с двух символов на высокой скорости. Когда достигнете 90% точности, добавьте третий символ и так далее.

### Совет 4: Практикуйтесь ежедневно

Короткие ежедневные сессии (10-15 минут) эффективнее длинных нерегулярных занятий.

### Совет 5: Используйте мнемоники

Придумайте ассоциации для сложных букв. Например, буква Q (--.-) — «тяга к чаю» (два длинных, короткий, длинный).

### Совет 6: Декодируйте в повседневности

Тренируйтесь мысленно кодировать надписи вокруг вас: вывески, номера автомобилей, названия улиц.

### Совет 7: SOS — начните с него

Самый известный сигнал SOS (... --- ...) — отличная отправная точка для запоминания букв S и O.

Смотрите также: [Бинарный текст](/tools/binary-text), [Base64 кодирование](/tools/base64-encoder), [URL кодирование](/tools/url-encoder)
`,
    contentEn: `
## Tips for Learning Morse Code

Learning Morse code may seem challenging, but with the right approach it becomes a fascinating process.

### Tip 1: Start with Frequent Letters

Learn letters in order of frequency: E, T, A, O, I, N, S. This allows you to read real messages more quickly.

### Tip 2: Learn by Sound, Not Visually

Do not memorize dots and dashes visually. Listen to the sounds and associate them with letters. This significantly speeds up recognition.

### Tip 3: The Koch Method

Start with two characters at high speed. When you reach 90% accuracy, add a third character, and so on.

### Tip 4: Practice Daily

Short daily sessions (10-15 minutes) are more effective than long irregular sessions.

### Tip 5: Use Mnemonics

Create associations for difficult letters. For example, the letter Q (--.-) can be remembered as "God save the Queen" (two long, short, long).

### Tip 6: Decode in Everyday Life

Practice mentally encoding signs around you: billboards, license plates, street names.

### Tip 7: SOS — Start with It

The most well-known signal SOS (... --- ...) is an excellent starting point for memorizing the letters S and O.

See also: [Binary Text](/tools/binary-text), [Base64 Encoding](/tools/base64-encoder), [URL Encoding](/tools/url-encoder)
`.trim()
  },
  {
    slug: 'morse-code-use-cases',
    title: 'Азбука Морзе — современные применения',
    titleEn: 'Morse Code — Modern Applications',
    description: 'Где используется азбука Морзе сегодня: от радиосвязи до доступности, геокэшинга и образования.',
    descriptionEn: 'Where Morse code is used today: from radio communication to accessibility, geocaching, and education.',
    toolSlug: 'morse-code',
    type: 'use-cases',
    keywords: ['азбука морзе примеры', 'код морзе применение', 'морзе сегодня'],
    date: '2026-03-08',
    readTime: 5,
    content: `
## Современные применения азбуки Морзе

Несмотря на возраст, азбука Морзе остаётся актуальной в нескольких областях.

### Радиолюбительство

Радиолюбители по всему миру используют код Морзе (CW) для дальних контактов. На малой мощности Морзе проходит там, где голосовая связь бессильна.

### Аварийная связь

В экстремальных ситуациях сигнал SOS можно передать фонариком, стуком или свистом. Это универсальный язык бедствия.

### Доступность и ассистивные технологии

Люди с ограниченной подвижностью используют код Морзе для ввода текста. Два переключателя (точка и тире) позволяют набирать сообщения.

### Образование

- Изучение основ телекоммуникаций
- История развития связи
- Криптография и кодирование

### Геокэшинг и квесты

Создатели квестов и геокэшей используют азбуку Морзе для шифрования подсказок и координат.

### Культура и искусство

Морзе встречается в украшениях (браслеты с именами в коде), татуировках и элементах дизайна.

### Военная история

Изучение азбуки Морзе позволяет лучше понять историю мировых войн и роль связи в военных операциях.

Смотрите также: [Бинарный текст](/tools/binary-text), [Unicode справочник](/tools/unicode-lookup), [HTML кодирование](/tools/html-encoder)
`,
    contentEn: `
## Modern Applications of Morse Code

Despite its age, Morse code remains relevant in several areas.

### Amateur Radio

Amateur radio operators around the world use Morse code (CW) for long-distance contacts. At low power, Morse gets through where voice communication fails.

### Emergency Communication

In extreme situations, the SOS signal can be transmitted with a flashlight, by tapping, or by whistling. It is a universal distress language.

### Accessibility and Assistive Technology

People with limited mobility use Morse code for text input. Two switches (dot and dash) allow them to compose messages.

### Education

- Learning the basics of telecommunications
- History of communication development
- Cryptography and encoding

### Geocaching and Quests

Quest and geocache creators use Morse code to encrypt clues and coordinates.

### Culture and Art

Morse code appears in jewelry (bracelets with names in code), tattoos, and design elements.

### Military History

Studying Morse code helps to better understand the history of world wars and the role of communication in military operations.

See also: [Binary Text](/tools/binary-text), [Unicode Lookup](/tools/unicode-lookup), [HTML Encoding](/tools/html-encoder)
`.trim()
  },

  // === Бинарный текст ===
  {
    slug: 'binary-text-guide',
    title: 'Бинарный текст — перевод текста в двоичный код',
    titleEn: 'Binary Text — Converting Text to Binary Code',
    description: 'Руководство по переводу текста в двоичный (бинарный) код и обратно. Узнайте, как компьютер хранит текстовую информацию.',
    descriptionEn: 'A guide to converting text to binary code and back. Learn how computers store text information.',
    toolSlug: 'binary-text',
    type: 'guide',
    keywords: ['бинарный текст', 'двоичный код', 'перевод в бинарный', 'единицы и нули'],
    date: '2026-01-25',
    readTime: 7,
    content: `
## Бинарный текст — язык компьютеров

Двоичная (бинарная) система счисления использует только два символа: 0 и 1. Это фундамент всей цифровой техники.

### Как текст превращается в двоичный код

Каждый символ имеет числовой код (ASCII или Unicode). Этот код записывается в двоичной системе:

| Символ | ASCII | Двоичный код |
|--------|-------|-------------|
| A      | 65    | 01000001    |
| B      | 66    | 01000010    |
| Z      | 90    | 01011010    |
| 0      | 48    | 00110000    |

### Как использовать инструмент

1. Введите текст в поле ввода
2. Выберите режим: текст в бинарный или бинарный в текст
3. Выберите кодировку: ASCII или UTF-8
4. Получите результат

### ASCII и UTF-8

- **ASCII**: 7 бит, 128 символов (латиница, цифры, знаки)
- **UTF-8**: переменная длина (1-4 байта), все символы Unicode

### Разделители

Двоичный код обычно разделяется пробелами по 8 бит (1 байт). Это упрощает чтение и декодирование.

### Почему именно двоичный?

Компьютеры используют двоичную систему, потому что электронные схемы имеют два состояния: есть ток (1) и нет тока (0).

Смотрите также: [Base64 кодирование](/tools/base64-encoder), [Азбука Морзе](/tools/morse-code), [Unicode справочник](/tools/unicode-lookup)
`,
    contentEn: `
## Binary Text — The Language of Computers

The binary number system uses only two symbols: 0 and 1. It is the foundation of all digital technology.

### How Text Becomes Binary Code

Each character has a numeric code (ASCII or Unicode). This code is written in the binary system:

| Character | ASCII | Binary Code |
|-----------|-------|-------------|
| A         | 65    | 01000001    |
| B         | 66    | 01000010    |
| Z         | 90    | 01011010    |
| 0         | 48    | 00110000    |

### How to Use the Tool

1. Enter text in the input field
2. Select the mode: text to binary or binary to text
3. Choose the encoding: ASCII or UTF-8
4. Get the result

### ASCII and UTF-8

- **ASCII**: 7 bits, 128 characters (Latin letters, digits, symbols)
- **UTF-8**: variable length (1-4 bytes), all Unicode characters

### Separators

Binary code is usually separated by spaces every 8 bits (1 byte). This makes it easier to read and decode.

### Why Binary?

Computers use the binary system because electronic circuits have two states: current on (1) and current off (0).

See also: [Base64 Encoding](/tools/base64-encoder), [Morse Code](/tools/morse-code), [Unicode Lookup](/tools/unicode-lookup)
`.trim()
  },
  {
    slug: 'binary-text-tips',
    title: 'Советы по работе с двоичным кодом',
    titleEn: 'Tips for Working with Binary Code',
    description: 'Практические советы по переводу текста в двоичный код: быстрый счёт, проверка и типичные ошибки.',
    descriptionEn: 'Practical tips for converting text to binary code: quick counting, verification, and common mistakes.',
    toolSlug: 'binary-text',
    type: 'tips',
    keywords: ['бинарный текст советы', 'двоичный код лайфхаки', 'бинарный перевод'],
    date: '2026-02-13',
    readTime: 5,
    content: `
## Советы по работе с двоичным кодом

Двоичный код — основа информатики. Эти советы помогут работать с ним увереннее.

### Совет 1: Запомните степени двойки

1, 2, 4, 8, 16, 32, 64, 128. Эти числа — позиционные значения битов в байте. Знание степеней упрощает ручное преобразование.

### Совет 2: Считайте справа налево

При ручном переводе из двоичного в десятичный начинайте с правого бита (2⁰) и двигайтесь влево, увеличивая степень.

### Совет 3: Разбивайте на тетрады

Для перевода в шестнадцатеричную систему разбейте двоичное число на группы по 4 бита. Каждая тетрада — одна шестнадцатеричная цифра.

### Совет 4: Проверяйте длину

ASCII-символ занимает 8 бит. Если получили другое количество, проверьте входные данные. Кириллица в UTF-8 занимает 16 бит.

### Совет 5: Используйте для обучения

Двоичный текст — отличный способ объяснить детям, как компьютер обрабатывает информацию. Закодируйте их имя в нули и единицы.

### Совет 6: Отличайте кодировки

Один и тот же символ в разных кодировках даёт разный двоичный код. Всегда проверяйте, какая кодировка используется.

Смотрите также: [Азбука Морзе](/tools/morse-code), [Base64 кодирование](/tools/base64-encoder), [HTML кодирование](/tools/html-encoder)
`,
    contentEn: `
## Tips for Working with Binary Code

Binary code is the foundation of computer science. These tips will help you work with it more confidently.

### Tip 1: Memorize Powers of Two

1, 2, 4, 8, 16, 32, 64, 128. These numbers are the positional values of bits in a byte. Knowing the powers simplifies manual conversion.

### Tip 2: Count from Right to Left

When manually converting from binary to decimal, start from the rightmost bit (2⁰) and move left, increasing the power.

### Tip 3: Split into Nibbles

To convert to hexadecimal, split the binary number into groups of 4 bits. Each nibble equals one hexadecimal digit.

### Tip 4: Check the Length

An ASCII character takes 8 bits. If you get a different count, check the input data. Cyrillic characters in UTF-8 take 16 bits.

### Tip 5: Use for Education

Binary text is an excellent way to explain to children how a computer processes information. Encode their name into zeros and ones.

### Tip 6: Distinguish Between Encodings

The same character in different encodings produces different binary code. Always verify which encoding is being used.

See also: [Morse Code](/tools/morse-code), [Base64 Encoding](/tools/base64-encoder), [HTML Encoding](/tools/html-encoder)
`.trim()
  },
  {
    slug: 'binary-text-use-cases',
    title: 'Бинарный текст — сценарии использования',
    titleEn: 'Binary Text — Use Case Scenarios',
    description: 'Практические примеры работы с двоичным кодом: образование, программирование, криптография и творчество.',
    descriptionEn: 'Practical examples of working with binary code: education, programming, cryptography, and creativity.',
    toolSlug: 'binary-text',
    type: 'use-cases',
    keywords: ['бинарный текст примеры', 'двоичный код применение', 'бинарный перевод'],
    date: '2026-03-01',
    readTime: 6,
    content: `
## Примеры использования бинарного текста

Перевод текста в двоичный код находит применение в образовании, программировании и творчестве.

### Образование и информатика

Перевод текста в двоичный код — базовое упражнение на уроках информатики. Оно помогает понять, как компьютер хранит информацию.

### Отладка и анализ данных

Программисты анализируют двоичное представление данных при отладке протоколов, форматов файлов и сетевых пакетов.

### Криптография

Многие криптографические алгоритмы работают на уровне битов. Понимание двоичного представления необходимо для изучения шифрования.

### Творческие проекты

- Футболки и постеры с двоичным кодом скрытых посланий
- Декоративные элементы с бинарными паттернами
- Тематические подарки для программистов

### Соревнования по программированию

На олимпиадах и CTF-соревнованиях часто встречаются задачи на работу с двоичными данными и побитовые операции.

### Сетевое администрирование

Понимание двоичного кода необходимо при работе с IP-адресами, масками подсети и битовыми флагами.

### Интернет вещей (IoT)

Микроконтроллеры работают с данными на уровне отдельных битов. Понимание двоичного кода обязательно для разработки IoT-устройств.

Смотрите также: [Азбука Морзе](/tools/morse-code), [Unicode справочник](/tools/unicode-lookup), [Base64 кодирование](/tools/base64-encoder)
`,
    contentEn: `
## Binary Text Use Cases

Converting text to binary code finds application in education, programming, and creativity.

### Education and Computer Science

Converting text to binary code is a fundamental exercise in computer science classes. It helps understand how a computer stores information.

### Debugging and Data Analysis

Programmers analyze the binary representation of data when debugging protocols, file formats, and network packets.

### Cryptography

Many cryptographic algorithms operate at the bit level. Understanding binary representation is essential for studying encryption.

### Creative Projects

- T-shirts and posters with binary code hidden messages
- Decorative elements with binary patterns
- Themed gifts for programmers

### Programming Competitions

Olympiads and CTF competitions often feature tasks involving binary data and bitwise operations.

### Network Administration

Understanding binary code is essential when working with IP addresses, subnet masks, and bit flags.

### Internet of Things (IoT)

Microcontrollers work with data at the individual bit level. Understanding binary code is mandatory for IoT device development.

See also: [Morse Code](/tools/morse-code), [Unicode Lookup](/tools/unicode-lookup), [Base64 Encoding](/tools/base64-encoder)
`.trim()
  },

  // === Unicode справочник ===
  {
    slug: 'unicode-lookup-guide',
    title: 'Unicode справочник — руководство по символам',
    titleEn: 'Unicode Lookup — Character Reference Guide',
    description: 'Полное руководство по Unicode: поиск символов, кодовые точки, блоки символов и использование в разработке.',
    descriptionEn: 'A complete guide to Unicode: character search, code points, character blocks, and usage in development.',
    toolSlug: 'unicode-lookup',
    type: 'guide',
    keywords: ['unicode', 'юникод', 'символы unicode', 'кодовые точки', 'справочник символов'],
    date: '2026-02-06',
    readTime: 8,
    content: `
## Unicode — единый стандарт символов

Unicode — это международный стандарт кодирования, который присваивает уникальный номер (кодовую точку) каждому символу каждого языка мира.

### Что такое кодовая точка

Кодовая точка — это числовой идентификатор символа в формате U+XXXX. Например:

| Символ | Кодовая точка | Описание      |
|--------|--------------|---------------|
| A      | U+0041       | Латинская A   |
| Я      | U+042F       | Кириллическая Я |
| €      | U+20AC       | Знак евро     |
| 😀     | U+1F600      | Смайлик       |

### Как использовать справочник

1. Введите символ для поиска его кодовой точки
2. Или введите кодовую точку для нахождения символа
3. Просматривайте блоки символов по категориям
4. Копируйте символы в буфер обмена

### Блоки Unicode

Unicode организован в блоки: Basic Latin, Cyrillic, CJK Ideographs, Emoji и другие. Каждый блок содержит символы определённого назначения.

### Кодировки и Unicode

Unicode определяет набор символов, а кодировки (UTF-8, UTF-16, UTF-32) определяют, как эти символы хранятся в памяти.

### Современный Unicode

Стандарт постоянно расширяется. Каждая новая версия добавляет символы: эмодзи, исторические письменности, математические символы.

Смотрите также: [HTML кодирование](/tools/html-encoder), [URL кодирование](/tools/url-encoder), [Бинарный текст](/tools/binary-text)
`,
    contentEn: `
## Unicode — A Unified Character Standard

Unicode is an international encoding standard that assigns a unique number (code point) to every character of every language in the world.

### What Is a Code Point

A code point is a numeric identifier of a character in the format U+XXXX. For example:

| Character | Code Point | Description       |
|-----------|------------|-------------------|
| A         | U+0041     | Latin A           |
| Я         | U+042F     | Cyrillic Ya       |
| €         | U+20AC     | Euro sign         |
| 😀        | U+1F600    | Smiley face       |

### How to Use the Lookup

1. Enter a character to find its code point
2. Or enter a code point to find the character
3. Browse character blocks by category
4. Copy characters to the clipboard

### Unicode Blocks

Unicode is organized into blocks: Basic Latin, Cyrillic, CJK Ideographs, Emoji, and others. Each block contains characters of a specific purpose.

### Encodings and Unicode

Unicode defines the character set, while encodings (UTF-8, UTF-16, UTF-32) define how those characters are stored in memory.

### Modern Unicode

The standard is constantly expanding. Each new version adds characters: emoji, historical scripts, mathematical symbols.

See also: [HTML Encoding](/tools/html-encoder), [URL Encoding](/tools/url-encoder), [Binary Text](/tools/binary-text)
`.trim()
  },
  {
    slug: 'unicode-lookup-tips',
    title: 'Советы по работе с Unicode символами',
    titleEn: 'Tips for Working with Unicode Characters',
    description: 'Практические советы по поиску, использованию и вставке Unicode символов в текст, код и дизайн.',
    descriptionEn: 'Practical tips for searching, using, and inserting Unicode characters in text, code, and design.',
    toolSlug: 'unicode-lookup',
    type: 'tips',
    keywords: ['unicode советы', 'юникод лайфхаки', 'символы unicode поиск'],
    date: '2026-01-19',
    readTime: 5,
    content: `
## Советы по работе с Unicode

Unicode содержит более 150 000 символов. Вот советы, как ориентироваться в этом многообразии.

### Совет 1: Ищите по описанию

Не знаете кодовую точку? Ищите по описанию символа на английском: «arrow», «star», «heart». Справочник найдёт все подходящие варианты.

### Совет 2: Используйте категории

Символы организованы по категориям: буквы, цифры, знаки препинания, математические символы, стрелки, эмодзи. Просматривайте категории для вдохновения.

### Совет 3: Копируйте, а не набирайте

Для редких символов используйте копирование из справочника. Это быстрее и надёжнее, чем ввод через Alt-коды или escape-последовательности.

### Совет 4: Учитывайте поддержку шрифтов

Не все шрифты поддерживают все символы Unicode. Проверяйте отображение в целевом шрифте перед публикацией.

### Совет 5: Нормализация строк

Некоторые символы имеют несколько представлений (например, «й» может быть одним символом или буквой + комбинирующим знаком). Используйте нормализацию NFC/NFD.

### Совет 6: Символы для оформления

Unicode содержит декоративные элементы: рамки (┌─┐), стрелки (→ ⇒ ➤), маркеры (• ◦ ▸), которые полезны в текстовых интерфейсах.

Смотрите также: [HTML кодирование](/tools/html-encoder), [Бинарный текст](/tools/binary-text), [Азбука Морзе](/tools/morse-code)
`,
    contentEn: `
## Tips for Working with Unicode

Unicode contains over 150,000 characters. Here are tips on how to navigate this diversity.

### Tip 1: Search by Description

Do not know the code point? Search by the character description in English: "arrow", "star", "heart". The lookup will find all matching options.

### Tip 2: Use Categories

Characters are organized by category: letters, digits, punctuation, mathematical symbols, arrows, emoji. Browse categories for inspiration.

### Tip 3: Copy, Do Not Type

For rare characters, use copying from the lookup. This is faster and more reliable than entering via Alt codes or escape sequences.

### Tip 4: Consider Font Support

Not all fonts support all Unicode characters. Check the display in the target font before publishing.

### Tip 5: String Normalization

Some characters have multiple representations (for example, accented characters can be one character or a letter + combining mark). Use NFC/NFD normalization.

### Tip 6: Characters for Formatting

Unicode contains decorative elements: box-drawing characters, arrows (→ ⇒ ➤), bullets (• ◦ ▸), which are useful in text interfaces.

See also: [HTML Encoding](/tools/html-encoder), [Binary Text](/tools/binary-text), [Morse Code](/tools/morse-code)
`.trim()
  },
  {
    slug: 'unicode-lookup-use-cases',
    title: 'Unicode справочник — примеры применения',
    titleEn: 'Unicode Lookup — Application Examples',
    description: 'Практические сценарии использования Unicode: от интернационализации до типографики и доступности.',
    descriptionEn: 'Practical Unicode use cases: from internationalization to typography and accessibility.',
    toolSlug: 'unicode-lookup',
    type: 'use-cases',
    keywords: ['unicode примеры', 'юникод применение', 'символы unicode использование'],
    date: '2026-02-24',
    readTime: 6,
    content: `
## Примеры использования Unicode справочника

Unicode — это основа многоязычного интернета и современных технологий.

### Интернационализация (i18n)

Разработчики используют Unicode для поддержки множества языков в приложениях. Один стандарт покрывает все письменности мира.

### Типографика и вёрстка

Типографские символы (кавычки «», тире —, неразрывный пробел) делают текст профессиональным. Справочник помогает найти нужные символы.

### Социальные сети

Пользователи украшают посты и профили Unicode-символами: звёздами ★, сердечками ♥, стрелками ➤ и декоративным текстом.

### Математика и наука

Математические символы (∑, ∫, ∞, ≠, ≤) и научные обозначения (°, µ, Ω) входят в стандарт Unicode.

### Программирование

- Идентификаторы переменных на разных языках
- Символы операторов в функциональных языках
- Тестирование поддержки Unicode в приложениях

### Лингвистика

Исследователи используют Unicode для работы с фонетической транскрипцией (IPA), историческими письменностями и диакритическими знаками.

### Доступность

Символы Брайля (⠃⠗⠇) закодированы в Unicode, что позволяет создавать тексты для слабовидящих в цифровом формате.

Смотрите также: [HTML кодирование](/tools/html-encoder), [URL кодирование](/tools/url-encoder), [Base64 кодирование](/tools/base64-encoder)
`,
    contentEn: `
## Unicode Lookup Use Cases

Unicode is the foundation of the multilingual internet and modern technology.

### Internationalization (i18n)

Developers use Unicode to support multiple languages in applications. A single standard covers all writing systems in the world.

### Typography and Layout

Typographic symbols (quotation marks, em dashes, non-breaking spaces) make text look professional. The lookup helps find the right characters.

### Social Media

Users decorate posts and profiles with Unicode symbols: stars ★, hearts ♥, arrows ➤, and decorative text.

### Mathematics and Science

Mathematical symbols (∑, ∫, ∞, ≠, ≤) and scientific notations (°, µ, Ω) are part of the Unicode standard.

### Programming

- Variable identifiers in different languages
- Operator symbols in functional languages
- Testing Unicode support in applications

### Linguistics

Researchers use Unicode to work with phonetic transcription (IPA), historical scripts, and diacritical marks.

### Accessibility

Braille symbols (⠃⠗⠇) are encoded in Unicode, enabling the creation of texts for the visually impaired in digital format.

See also: [HTML Encoding](/tools/html-encoder), [URL Encoding](/tools/url-encoder), [Base64 Encoding](/tools/base64-encoder)
`.trim()
  }
];
