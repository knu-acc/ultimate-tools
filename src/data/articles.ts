import { calculatorArticles } from './articles/calculators';
import { colorArticles } from './articles/color';
import { datetimeArticles } from './articles/datetime';
import { developerArticles } from './articles/developers';
import { encodingArticles } from './articles/encoding';
import { entertainmentArticles } from './articles/entertainment';
import { financeArticles } from './articles/finance';
import { generatorArticles } from './articles/generators';
import { imageArticles } from './articles/images';
import { mathArticles } from './articles/math';
import { qrbarcodeArticles } from './articles/qrbarcode';
import { securityArticles } from './articles/security';
import { seoArticles } from './articles/seo';
import { textArticles } from './articles/text';
import { converterArticles } from './articles/converters';
import { healthArticles } from './articles/health';
import { mediaArticles } from './articles/media';
import { networkArticles } from './articles/network';
import { unitArticles } from './articles/units';
import { productivityArticles } from './articles/productivity';
import { articleOverridesEn } from './articleOverridesEn';

export interface Article {
  slug: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  toolSlug: string;
  type: 'guide' | 'tips' | 'use-cases';
  keywords: string[];
  date: string;
  readTime: number;
  content: string;
  contentEn?: string;
}

const baseArticles: Article[] = [
  // === Генератор паролей ===
  {
    slug: 'password-generator-guide',
    title: 'Как создать надёжный пароль — полное руководство',
    titleEn: 'How to Create a Strong Password — Complete Guide',
    description: 'Подробное руководство по созданию надёжных паролей. Узнайте, какие пароли безопасны, какой длины должен быть пароль и как использовать генератор.',
    descriptionEn: 'A detailed guide to creating strong passwords. Learn what makes a password secure, the ideal length, and how to use a password generator.',
    toolSlug: 'password-generator',
    type: 'guide',
    keywords: ['генератор паролей', 'надёжный пароль', 'безопасность', 'создание пароля'],
    date: '2026-03-01',
    readTime: 8,
    content: `
## Зачем нужен генератор паролей?

В эпоху цифровых технологий безопасность ваших аккаунтов напрямую зависит от надёжности паролей. По статистике, более 80% утечек данных происходят из-за слабых или повторно используемых паролей.

## Что делает пароль надёжным?

Надёжный пароль должен соответствовать нескольким критериям:

- **Длина** — минимум 12 символов, идеально 16-20
- **Сложность** — заглавные и строчные буквы, цифры, спецсимволы
- **Уникальность** — не повторяется на разных сайтах
- **Непредсказуемость** — не содержит словарных слов, дат, имён

## Как использовать наш генератор

### Шаг 1: Выберите длину пароля
Рекомендуем не менее 16 символов для важных аккаунтов (банки, почта) и не менее 12 для остальных.

### Шаг 2: Настройте состав
Включите все типы символов для максимальной безопасности:
| Тип символов | Пример | Количество вариантов |
|---|---|---|
| Строчные буквы | a-z | 26 |
| Заглавные буквы | A-Z | 26 |
| Цифры | 0-9 | 10 |
| Спецсимволы | !@#$%^&* | 32 |

### Шаг 3: Сгенерируйте и сохраните
Нажмите кнопку генерации, скопируйте пароль и сохраните его в менеджере паролей.

## Частые ошибки при создании паролей

1. Использование одного пароля везде
2. Слишком короткие пароли (менее 8 символов)
3. Использование личной информации (дата рождения, имя питомца)
4. Простые паттерны (qwerty, 12345, password)
5. Замена букв похожими символами (p@ssw0rd) — это давно неэффективно

## Рекомендации экспертов

- Используйте менеджер паролей для хранения
- Включите двухфакторную аутентификацию где возможно
- Меняйте пароли после утечек данных
- Используйте уникальный пароль для каждого сервиса

Смотрите также: [Проверка надёжности пароля](/tools/password-strength), [Генератор UUID](/tools/uuid-generator), [Base64 кодирование](/tools/base64-encoder)
    `.trim(),
    contentEn: `
## Why Do You Need a Password Generator?

In the digital age, the security of your accounts directly depends on password strength. Statistics show that over 80% of data breaches occur due to weak or reused passwords.

## What Makes a Password Strong?

A strong password must meet several criteria:

- **Length** — at least 12 characters, ideally 16-20
- **Complexity** — uppercase and lowercase letters, numbers, special characters
- **Uniqueness** — not reused across different sites
- **Unpredictability** — does not contain dictionary words, dates, or names

## How to Use Our Generator

### Step 1: Choose Password Length
We recommend at least 16 characters for important accounts (banking, email) and at least 12 for others.

### Step 2: Configure Composition
Enable all character types for maximum security:
| Character Type | Example | Number of Variants |
|---|---|---|
| Lowercase letters | a-z | 26 |
| Uppercase letters | A-Z | 26 |
| Digits | 0-9 | 10 |
| Special characters | !@#$%^&* | 32 |

### Step 3: Generate and Save
Click the generate button, copy the password, and save it in a password manager.

## Common Password Mistakes

1. Using the same password everywhere
2. Passwords that are too short (fewer than 8 characters)
3. Using personal information (date of birth, pet's name)
4. Simple patterns (qwerty, 12345, password)
5. Replacing letters with similar symbols (p@ssw0rd) — this has long been ineffective

## Expert Recommendations

- Use a password manager for storage
- Enable two-factor authentication wherever possible
- Change passwords after data breaches
- Use a unique password for each service

See also: [Password Strength Checker](/tools/password-strength), [UUID Generator](/tools/uuid-generator), [Base64 Encoder](/tools/base64-encoder)
    `.trim(),
  },
  {
    slug: 'password-generator-tips',
    title: '10 советов по безопасности паролей в 2026 году',
    titleEn: '10 Password Security Tips for 2026',
    description: 'Актуальные советы по защите ваших аккаунтов. Как создавать, хранить и управлять паролями безопасно.',
    descriptionEn: 'Up-to-date tips for protecting your accounts. How to create, store, and manage passwords securely.',
    toolSlug: 'password-generator',
    type: 'tips',
    keywords: ['советы по паролям', 'безопасность аккаунтов', 'менеджер паролей', 'защита'],
    date: '2026-03-05',
    readTime: 6,
    content: `
## 10 советов по безопасности паролей

### 1. Используйте пароли длиной от 16 символов
Каждый дополнительный символ увеличивает время взлома экспоненциально. Пароль из 16 случайных символов практически невозможно взломать перебором.

### 2. Никогда не используйте один пароль дважды
Если один сервис взломают, злоумышленники попробуют тот же пароль на других сайтах. Это называется credential stuffing.

### 3. Используйте менеджер паролей
Современные менеджеры паролей шифруют данные и синхронизируются между устройствами.

### 4. Включите двухфакторную аутентификацию (2FA)
Даже если пароль утёк, 2FA защитит ваш аккаунт.

### 5. Проверяйте утечки данных
Регулярно проверяйте, не попали ли ваши данные в утечки.

### 6. Не храните пароли в браузере без мастер-пароля
Встроенные хранилища браузеров менее защищены, чем специализированные менеджеры.

### 7. Используйте парольные фразы для запоминания
Случайная комбинация 4-5 слов может быть и надёжной, и запоминаемой: «корова синий прыгать лампа океан».

### 8. Не передавайте пароли по незащищённым каналам
Не отправляйте пароли в SMS, email или мессенджерах без шифрования.

### 9. Обновляйте пароли после подозрительной активности
Если заметили что-то странное в аккаунте — немедленно смените пароль.

### 10. Используйте наш генератор паролей
[Генератор паролей](/tools/password-generator) создаёт криптографически безопасные пароли прямо в вашем браузере.

Смотрите также: [Проверка надёжности пароля](/tools/password-strength), [Конвертер цветов](/tools/color-converter)
    `.trim(),
    contentEn: `
## 10 Password Security Tips

### 1. Use Passwords at Least 16 Characters Long
Each additional character increases cracking time exponentially. A 16-character random password is virtually impossible to brute-force.

### 2. Never Reuse a Password
If one service gets hacked, attackers will try the same password on other sites. This is called credential stuffing.

### 3. Use a Password Manager
Modern password managers encrypt your data and sync across devices.

### 4. Enable Two-Factor Authentication (2FA)
Even if a password leaks, 2FA will protect your account.

### 5. Check for Data Breaches
Regularly check whether your credentials have appeared in data breaches.

### 6. Don't Store Passwords in the Browser Without a Master Password
Built-in browser vaults are less secure than dedicated password managers.

### 7. Use Passphrases for Memorization
A random combination of 4-5 words can be both secure and memorable: "cow blue jump lamp ocean."

### 8. Don't Transmit Passwords Over Insecure Channels
Don't send passwords via SMS, email, or unencrypted messengers.

### 9. Update Passwords After Suspicious Activity
If you notice anything unusual in your account — change your password immediately.

### 10. Use Our Password Generator
[Password Generator](/tools/password-generator) creates cryptographically secure passwords right in your browser.

See also: [Password Strength Checker](/tools/password-strength), [Color Converter](/tools/color-converter)
    `.trim(),
  },
  {
    slug: 'password-generator-use-cases',
    title: 'Генератор паролей: 7 сценариев использования',
    titleEn: 'Password Generator: 7 Use Cases',
    description: 'Когда и зачем нужен генератор паролей. Реальные сценарии: регистрация, Wi-Fi, API-ключи, временные аккаунты.',
    descriptionEn: 'When and why you need a password generator. Real-world scenarios: registration, Wi-Fi, API keys, temporary accounts.',
    toolSlug: 'password-generator',
    type: 'use-cases',
    keywords: ['использование генератора', 'сценарии', 'пароли для Wi-Fi', 'API ключи'],
    date: '2026-03-08',
    readTime: 5,
    content: `
## 7 сценариев использования генератора паролей

### 1. Регистрация на новом сайте
Каждый раз при создании аккаунта используйте уникальный сгенерированный пароль.

### 2. Настройка Wi-Fi роутера
Создайте надёжный пароль для домашней сети. Рекомендуемая длина — 20+ символов.

### 3. API-ключи и токены
Для разработчиков: генерируйте безопасные ключи для API, вебхуков и интеграций.

### 4. Временные аккаунты
Для одноразовых регистраций используйте случайные пароли без необходимости запоминать.

### 5. Корпоративная безопасность
IT-администраторы могут массово генерировать пароли для новых сотрудников.

### 6. Шифрование файлов
При создании зашифрованных архивов или документов — используйте максимально сложный пароль.

### 7. Резервные коды
Генерируйте коды восстановления для двухфакторной аутентификации.

Используйте наш [Генератор паролей](/tools/password-generator) для всех этих сценариев. Также полезно: [Генератор UUID](/tools/uuid-generator), [JSON Formatter](/tools/json-formatter).
    `.trim(),
    contentEn: `
## 7 Use Cases for a Password Generator

### 1. Signing Up on a New Website
Every time you create an account, use a unique generated password.

### 2. Setting Up a Wi-Fi Router
Create a strong password for your home network. Recommended length — 20+ characters.

### 3. API Keys and Tokens
For developers: generate secure keys for APIs, webhooks, and integrations.

### 4. Temporary Accounts
For one-time registrations, use random passwords without the need to memorize them.

### 5. Corporate Security
IT administrators can bulk-generate passwords for new employees.

### 6. File Encryption
When creating encrypted archives or documents — use the most complex password possible.

### 7. Backup Codes
Generate recovery codes for two-factor authentication.

Use our [Password Generator](/tools/password-generator) for all these scenarios. Also useful: [UUID Generator](/tools/uuid-generator), [JSON Formatter](/tools/json-formatter).
    `.trim(),
  },

  // === JSON Formatter ===
  {
    slug: 'json-formatter-guide',
    title: 'JSON Formatter: как форматировать и валидировать JSON',
    titleEn: 'JSON Formatter: How to Format and Validate JSON',
    description: 'Руководство по форматированию JSON данных. Как читать, валидировать и минифицировать JSON онлайн.',
    descriptionEn: 'A guide to formatting JSON data. How to read, validate, and minify JSON online.',
    toolSlug: 'json-formatter',
    type: 'guide',
    keywords: ['json', 'форматирование', 'валидация', 'prettify', 'минификация'],
    date: '2026-02-20',
    readTime: 7,
    content: `
## Что такое JSON?

JSON (JavaScript Object Notation) — это текстовый формат обмена данными, основанный на JavaScript. Он используется практически в каждом веб-приложении для передачи данных между клиентом и сервером.

## Зачем форматировать JSON?

Минифицированный JSON экономит трафик, но невозможен для чтения:

\`\`\`
{"name":"Иван","age":25,"skills":["JS","Python"],"address":{"city":"Москва"}}
\`\`\`

Форматированный JSON легко читать и отлаживать:
\`\`\`json
{
  "name": "Иван",
  "age": 25,
  "skills": ["JS", "Python"],
  "address": {
    "city": "Москва"
  }
}
\`\`\`

## Как использовать JSON Formatter

### Форматирование
1. Вставьте JSON в поле ввода
2. Нажмите «Форматировать»
3. Получите отступленный, читаемый JSON

### Минификация
Удаляет все пробелы и переносы строк для уменьшения размера.

### Валидация
Проверяет корректность JSON и показывает ошибки с указанием строки.

## Частые ошибки JSON

| Ошибка | Пример | Исправление |
|---|---|---|
| Лишняя запятая | {"a": 1,} | {"a": 1} |
| Одинарные кавычки | {'a': 1} | {"a": 1} |
| Без кавычек у ключей | {a: 1} | {"a": 1} |
| Trailing comma | [1, 2, 3,] | [1, 2, 3] |

Смотрите также: [Regex тестер](/tools/regex-tester), [Base64 кодирование](/tools/base64-encoder), [Конвертер регистра](/tools/case-converter)
    `.trim(),
    contentEn: `
## What Is JSON?

JSON (JavaScript Object Notation) is a text-based data interchange format based on JavaScript. It is used in virtually every web application for transferring data between client and server.

## Why Format JSON?

Minified JSON saves bandwidth but is impossible to read:

\`\`\`
{"name":"Ivan","age":25,"skills":["JS","Python"],"address":{"city":"Moscow"}}
\`\`\`

Formatted JSON is easy to read and debug:
\`\`\`json
{
  "name": "Ivan",
  "age": 25,
  "skills": ["JS", "Python"],
  "address": {
    "city": "Moscow"
  }
}
\`\`\`

## How to Use JSON Formatter

### Formatting
1. Paste JSON into the input field
2. Click "Format"
3. Get indented, readable JSON

### Minification
Removes all whitespace and line breaks to reduce size.

### Validation
Checks JSON correctness and shows errors with line numbers.

## Common JSON Errors

| Error | Example | Fix |
|---|---|---|
| Trailing comma | {"a": 1,} | {"a": 1} |
| Single quotes | {'a': 1} | {"a": 1} |
| Unquoted keys | {a: 1} | {"a": 1} |
| Trailing comma | [1, 2, 3,] | [1, 2, 3] |

See also: [Regex Tester](/tools/regex-tester), [Base64 Encoder](/tools/base64-encoder), [Case Converter](/tools/case-converter)
    `.trim(),
  },
  {
    slug: 'json-formatter-tips',
    title: '5 советов по работе с JSON для разработчиков',
    titleEn: '5 JSON Tips for Developers',
    description: 'Практические советы по работе с JSON: валидация, отладка, безопасность и производительность.',
    descriptionEn: 'Practical tips for working with JSON: validation, debugging, security, and performance.',
    toolSlug: 'json-formatter',
    type: 'tips',
    keywords: ['json советы', 'api', 'разработка', 'отладка json'],
    date: '2026-02-25',
    readTime: 5,
    content: `
## 5 советов по работе с JSON

### 1. Всегда валидируйте JSON перед использованием
Невалидный JSON может сломать ваше приложение. Используйте [JSON Formatter](/tools/json-formatter) для быстрой проверки.

### 2. Используйте JSON Schema для валидации структуры
JSON Schema описывает ожидаемую структуру данных и позволяет автоматически проверять входящие данные.

### 3. Минифицируйте JSON для production
Минификация уменьшает размер данных на 20-40%, что ускоряет загрузку API.

### 4. Используйте правильные типы данных
- Числа без кавычек: \`"age": 25\` (не \`"age": "25"\`)
- Boolean без кавычек: \`"active": true\`
- Null для пустых значений: \`"email": null\`

### 5. Безопасность: санитизируйте JSON
Никогда не используйте \`eval()\` для парсинга JSON. Используйте \`JSON.parse()\`.

Полезные инструменты: [Regex тестер](/tools/regex-tester), [Генератор UUID](/tools/uuid-generator), [Счётчик слов](/tools/word-counter)
    `.trim(),
    contentEn: `
## 5 Tips for Working with JSON

### 1. Always Validate JSON Before Use
Invalid JSON can break your application. Use [JSON Formatter](/tools/json-formatter) for quick validation.

### 2. Use JSON Schema for Structure Validation
JSON Schema describes the expected data structure and allows automatic validation of incoming data.

### 3. Minify JSON for Production
Minification reduces data size by 20-40%, which speeds up API loading.

### 4. Use the Correct Data Types
- Numbers without quotes: \`"age": 25\` (not \`"age": "25"\`)
- Booleans without quotes: \`"active": true\`
- Null for empty values: \`"email": null\`

### 5. Security: Sanitize JSON
Never use \`eval()\` to parse JSON. Use \`JSON.parse()\`.

Useful tools: [Regex Tester](/tools/regex-tester), [UUID Generator](/tools/uuid-generator), [Word Counter](/tools/word-counter)
    `.trim(),
  },
  {
    slug: 'json-formatter-use-cases',
    title: 'JSON Formatter: когда и зачем использовать',
    titleEn: 'JSON Formatter: When and Why to Use It',
    description: 'Реальные сценарии использования JSON Formatter: отладка API, конфигурация, анализ данных.',
    descriptionEn: 'Real-world use cases for JSON Formatter: API debugging, configuration, data analysis.',
    toolSlug: 'json-formatter',
    type: 'use-cases',
    keywords: ['json использование', 'api отладка', 'конфигурация', 'данные'],
    date: '2026-03-01',
    readTime: 5,
    content: `
## Когда использовать JSON Formatter

### 1. Отладка API ответов
Скопируйте ответ API и вставьте в форматтер для удобного просмотра структуры данных.

### 2. Редактирование конфигурационных файлов
package.json, tsconfig.json, .eslintrc — все эти файлы можно проверить на корректность.

### 3. Анализ данных из базы данных
Экспортированные из MongoDB или другой NoSQL базы данные часто приходят в виде JSON.

### 4. Подготовка тестовых данных
Создайте и отформатируйте тестовые JSON-объекты для unit-тестов.

### 5. Документирование API
Форматированные примеры JSON делают документацию API понятнее.

Другие инструменты для разработчиков: [Regex тестер](/tools/regex-tester), [Base64 кодирование](/tools/base64-encoder), [Конвертер цветов](/tools/color-converter)
    `.trim(),
    contentEn: `
## When to Use JSON Formatter

### 1. Debugging API Responses
Copy an API response and paste it into the formatter for a convenient view of the data structure.

### 2. Editing Configuration Files
package.json, tsconfig.json, .eslintrc — all these files can be checked for correctness.

### 3. Analyzing Database Data
Data exported from MongoDB or other NoSQL databases often comes in JSON format.

### 4. Preparing Test Data
Create and format test JSON objects for unit tests.

### 5. Documenting APIs
Formatted JSON examples make API documentation more understandable.

Other developer tools: [Regex Tester](/tools/regex-tester), [Base64 Encoder](/tools/base64-encoder), [Color Converter](/tools/color-converter)
    `.trim(),
  },

  // === BMI Калькулятор ===
  {
    slug: 'bmi-calculator-guide',
    title: 'Индекс массы тела (BMI): полное руководство',
    titleEn: 'Body Mass Index (BMI): Complete Guide',
    description: 'Что такое BMI, как его рассчитать, нормы ВОЗ и ограничения показателя.',
    descriptionEn: 'What is BMI, how to calculate it, WHO standards, and limitations of the metric.',
    toolSlug: 'bmi-calc',
    type: 'guide',
    keywords: ['bmi', 'индекс массы тела', 'калькулятор bmi', 'вес', 'здоровье'],
    date: '2026-03-05',
    readTime: 7,
    content: `
## Что такое BMI (индекс массы тела)?

BMI — это показатель, который помогает оценить соответствие веса и роста человека. Формула проста: вес (кг) делить на рост (м) в квадрате.

## Категории BMI по данным ВОЗ

| BMI | Категория |
|---|---|
| Менее 18.5 | Дефицит массы тела |
| 18.5 — 24.9 | Нормальный вес |
| 25.0 — 29.9 | Избыточный вес |
| 30.0 и выше | Ожирение |

## Как пользоваться калькулятором

1. Введите свой рост в сантиметрах
2. Введите свой вес в килограммах
3. Получите результат с расшифровкой

Используйте наш [Калькулятор BMI](/tools/bmi-calc) для мгновенного расчёта.

## Ограничения BMI

BMI не учитывает мышечную массу, возраст и пол. Спортсмены могут иметь высокий BMI при нормальном проценте жира.

Смотрите также: [Калькулятор калорий](/tools/calorie-calc), [Калькулятор сна](/tools/sleep-calc)
    `.trim(),
    contentEn: `
## What Is BMI (Body Mass Index)?

BMI is a metric that helps assess the correspondence between a person's weight and height. The formula is simple: weight (kg) divided by height (m) squared.

## BMI Categories According to WHO

| BMI | Category |
|---|---|
| Below 18.5 | Underweight |
| 18.5 — 24.9 | Normal weight |
| 25.0 — 29.9 | Overweight |
| 30.0 and above | Obesity |

## How to Use the Calculator

1. Enter your height in centimeters
2. Enter your weight in kilograms
3. Get the result with an explanation

Use our [BMI Calculator](/tools/bmi-calc) for instant calculation.

## Limitations of BMI

BMI does not account for muscle mass, age, or sex. Athletes may have a high BMI while having a normal body fat percentage.

See also: [Calorie Calculator](/tools/calorie-calc), [Sleep Calculator](/tools/sleep-calc)
    `.trim(),
  },

  // === Конвертер температуры ===
  {
    slug: 'temperature-converter-guide',
    title: 'Конвертер температуры: Цельсий, Фаренгейт, Кельвин',
    titleEn: 'Temperature Converter: Celsius, Fahrenheit, Kelvin',
    description: 'Как переводить температуру между шкалами. Формулы, таблицы и онлайн-конвертер.',
    descriptionEn: 'How to convert temperature between scales. Formulas, tables, and an online converter.',
    toolSlug: 'temperature-converter',
    type: 'guide',
    keywords: ['температура', 'конвертер', 'цельсий', 'фаренгейт', 'кельвин'],
    date: '2026-03-03',
    readTime: 5,
    content: `
## Шкалы температуры

### Цельсий (°C)
Наиболее распространённая шкала в мире. 0°C — точка замерзания воды, 100°C — точка кипения.

### Фаренгейт (°F)
Используется в США. 32°F — замерзание воды, 212°F — кипение.

### Кельвин (K)
Абсолютная шкала для науки. 0K = −273.15°C (абсолютный ноль).

## Формулы конвертации

- °F = °C × 9/5 + 32
- °C = (°F − 32) × 5/9
- K = °C + 273.15

## Часто используемые значения

| Описание | °C | °F | K |
|---|---|---|---|
| Абсолютный ноль | −273.15 | −459.67 | 0 |
| Замерзание воды | 0 | 32 | 273.15 |
| Температура тела | 36.6 | 97.9 | 309.75 |
| Кипение воды | 100 | 212 | 373.15 |

Используйте наш [Конвертер температуры](/tools/temperature-converter) для мгновенного перевода.

Смотрите также: [Конвертер длины](/tools/length-converter), [Конвертер веса](/tools/weight-converter)
    `.trim(),
    contentEn: `
## Temperature Scales

### Celsius (°C)
The most widely used scale in the world. 0°C is the freezing point of water, 100°C is the boiling point.

### Fahrenheit (°F)
Used in the United States. 32°F is the freezing point of water, 212°F is the boiling point.

### Kelvin (K)
The absolute scale for science. 0K = -273.15°C (absolute zero).

## Conversion Formulas

- °F = °C × 9/5 + 32
- °C = (°F − 32) × 5/9
- K = °C + 273.15

## Commonly Used Values

| Description | °C | °F | K |
|---|---|---|---|
| Absolute zero | −273.15 | −459.67 | 0 |
| Freezing point of water | 0 | 32 | 273.15 |
| Body temperature | 36.6 | 97.9 | 309.75 |
| Boiling point of water | 100 | 212 | 373.15 |

Use our [Temperature Converter](/tools/temperature-converter) for instant conversion.

See also: [Length Converter](/tools/length-converter), [Weight Converter](/tools/weight-converter)
    `.trim(),
  },

  // === Regex тестер ===
  {
    slug: 'regex-tester-guide',
    title: 'Регулярные выражения: полное руководство для начинающих',
    titleEn: 'Regular Expressions: A Complete Beginner\'s Guide',
    description: 'Основы регулярных выражений с примерами. Как писать regex для поиска email, телефонов, URL.',
    descriptionEn: 'Regex basics with examples. How to write regular expressions for finding emails, phone numbers, and URLs.',
    toolSlug: 'regex-tester',
    type: 'guide',
    keywords: ['regex', 'регулярные выражения', 'паттерн', 'поиск', 'javascript'],
    date: '2026-03-07',
    readTime: 10,
    content: `
## Что такое регулярные выражения?

Регулярные выражения (regex) — мощный инструмент для поиска и замены текста по шаблонам.

## Основные символы

| Символ | Значение |
|---|---|
| . | Любой символ |
| \\d | Цифра (0-9) |
| \\w | Буква, цифра, _ |
| \\s | Пробельный символ |
| ^ | Начало строки |
| $ | Конец строки |
| * | 0 или более повторений |
| + | 1 или более повторений |
| ? | 0 или 1 повторение |

## Примеры

### Email
\`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\`

### Телефон (Россия)
\`\\+7[\\s-]?\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{2}[\\s-]?\\d{2}\`

### URL
\`https?:\\/\\/[\\w.-]+\\.[a-z]{2,}[\\/\\w.-]*\`

Тестируйте свои выражения в [Regex тестере](/tools/regex-tester).

Смотрите также: [JSON Formatter](/tools/json-formatter), [Найти и заменить](/tools/text-replace)
    `.trim(),
    contentEn: `
## What Are Regular Expressions?

Regular expressions (regex) are a powerful tool for searching and replacing text using patterns.

## Basic Characters

| Character | Meaning |
|---|---|
| . | Any character |
| \\d | Digit (0-9) |
| \\w | Letter, digit, _ |
| \\s | Whitespace character |
| ^ | Start of line |
| $ | End of line |
| * | 0 or more repetitions |
| + | 1 or more repetitions |
| ? | 0 or 1 repetition |

## Examples

### Email
\`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\`

### Phone (Russia)
\`\\+7[\\s-]?\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{2}[\\s-]?\\d{2}\`

### URL
\`https?:\\/\\/[\\w.-]+\\.[a-z]{2,}[\\/\\w.-]*\`

Test your expressions in the [Regex Tester](/tools/regex-tester).

See also: [JSON Formatter](/tools/json-formatter), [Find and Replace](/tools/text-replace)
    `.trim(),
  },

  // === Помодоро ===
  {
    slug: 'pomodoro-guide',
    title: 'Техника Помодоро: как повысить продуктивность',
    titleEn: 'The Pomodoro Technique: How to Boost Productivity',
    description: 'Что такое метод Помодоро, как его применять и почему он работает.',
    descriptionEn: 'What is the Pomodoro method, how to apply it, and why it works.',
    toolSlug: 'pomodoro',
    type: 'guide',
    keywords: ['помодоро', 'продуктивность', 'таймер', 'тайм-менеджмент', 'фокус'],
    date: '2026-03-08',
    readTime: 6,
    content: `
## Что такое техника Помодоро?

Помодоро — метод управления временем, разработанный Франческо Чирилло. Суть: работайте 25 минут, затем отдыхайте 5 минут. После 4 циклов — длинный перерыв 15-30 минут.

## Как применять

1. Выберите задачу
2. Установите таймер на 25 минут
3. Работайте без отвлечений
4. Сделайте перерыв 5 минут
5. Каждые 4 помодоро — длинный перерыв

## Почему это работает

- Фокус: 25 минут — оптимальный интервал концентрации
- Отдых: регулярные перерывы предотвращают выгорание
- Мотивация: маленькие цели легче достигать
- Трекинг: видите, сколько помодоро потратили на задачу

Попробуйте наш [Помодоро таймер](/tools/pomodoro) прямо сейчас.

Смотрите также: [Таймер и Секундомер](/tools/timer), [Список задач](/tools/todo-list)
    `.trim(),
    contentEn: `
## What Is the Pomodoro Technique?

Pomodoro is a time management method developed by Francesco Cirillo. The idea: work for 25 minutes, then rest for 5 minutes. After 4 cycles, take a longer break of 15-30 minutes.

## How to Apply It

1. Choose a task
2. Set a timer for 25 minutes
3. Work without distractions
4. Take a 5-minute break
5. Every 4 pomodoros — take a long break

## Why It Works

- Focus: 25 minutes is an optimal concentration interval
- Rest: regular breaks prevent burnout
- Motivation: small goals are easier to achieve
- Tracking: you can see how many pomodoros you spent on a task

Try our [Pomodoro Timer](/tools/pomodoro) right now.

See also: [Timer and Stopwatch](/tools/timer), [To-Do List](/tools/todo-list)
    `.trim(),
  },

  // === Конвертер цветов ===
  {
    slug: 'color-converter-guide',
    title: 'Цветовые модели: HEX, RGB, HSL, CMYK — полный гид',
    titleEn: 'Color Models: HEX, RGB, HSL, CMYK — Complete Guide',
    description: 'Разница между цветовыми моделями и как переводить цвета между форматами.',
    descriptionEn: 'The difference between color models and how to convert colors between formats.',
    toolSlug: 'color-converter',
    type: 'guide',
    keywords: ['цвет', 'hex', 'rgb', 'hsl', 'cmyk', 'конвертер'],
    date: '2026-03-04',
    readTime: 7,
    content: `
## Цветовые модели

### HEX
Шестнадцатеричная запись: #RRGGBB. Используется в CSS и веб-дизайне.

### RGB
Red, Green, Blue — 3 канала от 0 до 255. rgb(255, 0, 0) = красный.

### HSL
Hue (тон), Saturation (насыщенность), Lightness (яркость). Удобна для дизайнеров.

### CMYK
Cyan, Magenta, Yellow, Key (чёрный). Для полиграфии и печати.

## Когда какую использовать

| Модель | Применение |
|---|---|
| HEX | CSS, веб-дизайн |
| RGB | Экранная графика |
| HSL | Подбор оттенков |
| CMYK | Печать |

Переводите цвета в [Конвертере цветов](/tools/color-converter).

Смотрите также: [Генератор палитр](/tools/palette-generator), [Генератор градиентов](/tools/gradient-generator), [Проверка контраста](/tools/contrast-checker)
    `.trim(),
    contentEn: `
## Color Models

### HEX
Hexadecimal notation: #RRGGBB. Used in CSS and web design.

### RGB
Red, Green, Blue — 3 channels from 0 to 255. rgb(255, 0, 0) = red.

### HSL
Hue, Saturation, Lightness. Convenient for designers.

### CMYK
Cyan, Magenta, Yellow, Key (black). For printing and publishing.

## When to Use Which

| Model | Application |
|---|---|
| HEX | CSS, web design |
| RGB | Screen graphics |
| HSL | Choosing shades |
| CMYK | Printing |

Convert colors in the [Color Converter](/tools/color-converter).

See also: [Palette Generator](/tools/palette-generator), [Gradient Generator](/tools/gradient-generator), [Contrast Checker](/tools/contrast-checker)
    `.trim(),
  },

  // === Markdown ===
  {
    slug: 'markdown-preview-guide',
    title: 'Markdown: синтаксис и примеры использования',
    titleEn: 'Markdown: Syntax and Usage Examples',
    description: 'Полное руководство по Markdown: заголовки, списки, ссылки, таблицы, код.',
    descriptionEn: 'A complete Markdown guide: headings, lists, links, tables, and code.',
    toolSlug: 'markdown-preview',
    type: 'guide',
    keywords: ['markdown', 'синтаксис', 'форматирование', 'md', 'github'],
    date: '2026-03-06',
    readTime: 8,
    content: `
## Что такое Markdown?

Markdown — лёгкий язык разметки для форматирования текста. Широко используется на GitHub, в документации и блогах.

## Основной синтаксис

### Заголовки
\`# H1\`, \`## H2\`, \`### H3\`

### Выделение
- **Жирный**: \`**текст**\`
- *Курсив*: \`*текст*\`
- ~~Зачёркнутый~~: \`~~текст~~\`

### Списки
- Маркированный: \`- элемент\`
- Нумерованный: \`1. элемент\`

### Ссылки и изображения
- Ссылка: \`[текст](url)\`
- Изображение: \`![alt](url)\`

### Код
- Инлайн: обратные кавычки
- Блок: три обратные кавычки с указанием языка

### Таблицы
Используйте | для разделения столбцов.

Попробуйте редактор в [Markdown превью](/tools/markdown-preview).

Смотрите также: [Счётчик слов](/tools/word-counter), [Конвертер регистра](/tools/case-converter)
    `.trim(),
    contentEn: `
## What Is Markdown?

Markdown is a lightweight markup language for formatting text. It is widely used on GitHub, in documentation, and in blogs.

## Basic Syntax

### Headings
\`# H1\`, \`## H2\`, \`### H3\`

### Emphasis
- **Bold**: \`**text**\`
- *Italic*: \`*text*\`
- ~~Strikethrough~~: \`~~text~~\`

### Lists
- Unordered: \`- item\`
- Ordered: \`1. item\`

### Links and Images
- Link: \`[text](url)\`
- Image: \`![alt](url)\`

### Code
- Inline: backticks
- Block: triple backticks with language specification

### Tables
Use | to separate columns.

Try the editor in [Markdown Preview](/tools/markdown-preview).

See also: [Word Counter](/tools/word-counter), [Case Converter](/tools/case-converter)
    `.trim(),
  },

  // === Калькулятор скидок ===
  {
    slug: 'discount-calc-tips',
    title: '5 советов по расчёту скидок и экономии',
    titleEn: '5 Tips for Calculating Discounts and Saving Money',
    description: 'Как правильно считать скидки, сравнивать предложения и экономить на покупках.',
    descriptionEn: 'How to correctly calculate discounts, compare offers, and save on purchases.',
    toolSlug: 'discount-calc',
    type: 'tips',
    keywords: ['скидка', 'расчёт', 'экономия', 'распродажа', 'калькулятор'],
    date: '2026-03-09',
    readTime: 4,
    content: `
## Как правильно считать скидки

### 1. Двойные скидки
Скидка 20% + 10% ≠ 30%. Это: цена × 0.8 × 0.9 = скидка 28%.

### 2. Сравнивайте цену за единицу
При акциях «3 по цене 2» посчитайте цену за штуку.

### 3. Процент от чего?
Скидка 50% от 1000₽ = 500₽, а скидка 50% от уже скидочной цены 500₽ = 250₽.

### 4. Учитывайте дополнительные расходы
Доставка, комиссия, упаковка могут «съесть» выгоду от скидки.

### 5. Используйте калькулятор
Считайте точно в [Калькуляторе скидок](/tools/discount-calc).

Смотрите также: [Калькулятор процентов](/tools/percentage-calc), [Калькулятор чаевых](/tools/tip-calc)
    `.trim(),
    contentEn: `
## How to Calculate Discounts Correctly

### 1. Stacked Discounts
A 20% discount + 10% discount ≠ 30%. The actual calculation: price × 0.8 × 0.9 = 28% off.

### 2. Compare Price per Unit
For "3 for the price of 2" promotions, calculate the cost per item.

### 3. Percent of What?
A 50% discount on $100 = $50, but a 50% discount on the already-discounted price of $50 = $25.

### 4. Account for Additional Costs
Shipping, fees, and packaging can eat into the savings from a discount.

### 5. Use a Calculator
Get accurate results with the [Discount Calculator](/tools/discount-calc).

See also: [Percentage Calculator](/tools/percentage-calc), [Tip Calculator](/tools/tip-calc)
    `.trim(),
  },

  // === Ипотечный калькулятор ===
  {
    slug: 'mortgage-calc-guide',
    title: 'Ипотечный калькулятор: как рассчитать платёж',
    titleEn: 'Mortgage Calculator: How to Calculate Your Payment',
    description: 'Как работает расчёт ипотеки: аннуитетные платежи, переплата, досрочное погашение.',
    descriptionEn: 'How mortgage calculations work: annuity payments, total interest paid, and early repayment.',
    toolSlug: 'mortgage-calc',
    type: 'guide',
    keywords: ['ипотека', 'калькулятор', 'платёж', 'кредит', 'банк'],
    date: '2026-03-10',
    readTime: 7,
    content: `
## Как рассчитывается ипотечный платёж?

Аннуитетный платёж — фиксированная сумма каждый месяц. Формула учитывает сумму кредита, процентную ставку и срок.

## На что обратить внимание

### Процентная ставка
Даже 0.5% разницы за 20 лет — это сотни тысяч рублей переплаты.

### Срок кредита
Короче срок = больше ежемесячный платёж, но меньше переплата.

### Первоначальный взнос
Чем больше взнос, тем меньше сумма кредита и переплата.

## Рассчитайте свою ипотеку

Используйте [Ипотечный калькулятор](/tools/mortgage-calc) для точного расчёта.

Смотрите также: [Калькулятор процентов](/tools/percentage-calc), [Научный калькулятор](/tools/scientific-calc)
    `.trim(),
    contentEn: `
## How Is a Mortgage Payment Calculated?

An annuity payment is a fixed amount paid each month. The formula takes into account the loan amount, interest rate, and term.

## Key Factors to Consider

### Interest Rate
Even a 0.5% difference over 20 years can mean hundreds of thousands in extra interest paid.

### Loan Term
A shorter term means higher monthly payments but less total interest paid.

### Down Payment
The larger the down payment, the smaller the loan amount and the less interest you pay.

## Calculate Your Mortgage

Use the [Mortgage Calculator](/tools/mortgage-calc) for an accurate calculation.

See also: [Percentage Calculator](/tools/percentage-calc), [Scientific Calculator](/tools/scientific-calc)
    `.trim(),
  },

  // === Скорость печати ===
  {
    slug: 'typing-speed-tips',
    title: 'Как увеличить скорость печати: 7 советов',
    titleEn: 'How to Increase Typing Speed: 7 Tips',
    description: 'Практические советы по увеличению скорости набора текста на клавиатуре.',
    descriptionEn: 'Practical tips for increasing your keyboard typing speed.',
    toolSlug: 'typing-speed',
    type: 'tips',
    keywords: ['скорость печати', 'WPM', 'клавиатура', 'набор текста', 'тест'],
    date: '2026-03-11',
    readTime: 5,
    content: `
## Как печатать быстрее

### 1. Используйте все 10 пальцев
Слепая печать — базовый навык. Каждый палец отвечает за свои клавиши.

### 2. Не смотрите на клавиатуру
Доверьтесь мышечной памяти. Первое время будет медленнее, но потом — быстрее.

### 3. Правильная осанка
Сядьте прямо, руки на уровне клавиатуры, запястья не висят.

### 4. Тренируйтесь регулярно
15-20 минут в день достаточно для заметного прогресса за месяц.

### 5. Начинайте с точности, не со скорости
Лучше печатать медленно без ошибок, чем быстро с ошибками.

### 6. Используйте горячие клавиши
Ctrl+C, Ctrl+V, Ctrl+Z — экономят время.

### 7. Проверяйте прогресс
Регулярно тестируйте скорость в [Тесте скорости печати](/tools/typing-speed).

Средние показатели: 40 WPM для обычного пользователя, 60-80 WPM для опытного, 100+ WPM для профессионалов.

Смотрите также: [Помодоро таймер](/tools/pomodoro), [Счётчик слов](/tools/word-counter)
    `.trim(),
    contentEn: `
## How to Type Faster

### 1. Use All 10 Fingers
Touch typing is a fundamental skill. Each finger is responsible for specific keys.

### 2. Don't Look at the Keyboard
Trust your muscle memory. It will be slower at first, but faster in the long run.

### 3. Maintain Proper Posture
Sit up straight, keep your hands at keyboard level, and let your wrists float.

### 4. Practice Regularly
15-20 minutes a day is enough to see noticeable progress within a month.

### 5. Start with Accuracy, Not Speed
It's better to type slowly without mistakes than quickly with errors.

### 6. Use Keyboard Shortcuts
Ctrl+C, Ctrl+V, Ctrl+Z — these save time every day.

### 7. Track Your Progress
Regularly test your speed with the [Typing Speed Test](/tools/typing-speed).

Average benchmarks: 40 WPM for a casual user, 60-80 WPM for an experienced typist, 100+ WPM for professionals.

See also: [Pomodoro Timer](/tools/pomodoro), [Word Counter](/tools/word-counter)
    `.trim(),
  },

  // === Генератор QR-кодов ===
  {
    slug: 'qr-generator-guide',
    title: 'QR-коды: что это, как работают и как создать',
    titleEn: 'QR Codes: What They Are, How They Work, and How to Create One',
    description: 'Полное руководство по QR-кодам: история, принцип работы, виды и создание собственного QR-кода бесплатно.',
    descriptionEn: 'A complete guide to QR codes: history, how they work, types, and how to create your own QR code for free.',
    toolSlug: 'qr-generator',
    type: 'guide',
    keywords: ['QR-код', 'генератор QR', 'qr code', 'создать QR', 'сканирование'],
    date: '2026-03-11',
    readTime: 6,
    content: `
## Что такое QR-код?

QR-код (Quick Response) — двумерный штрих-код, который хранит информацию в виде чёрно-белой матрицы. Изобретён в 1994 году компанией Denso Wave для автомобильной промышленности, а сегодня используется повсеместно.

## Что можно закодировать в QR?

- **Ссылки** — адреса сайтов, социальных сетей
- **Текст** — любой текст до ~4000 символов
- **Контакт** — vCard с именем, телефоном, email
- **Email** — готовое письмо с темой и текстом
- **WiFi** — данные для автоматического подключения
- **Геолокация** — координаты на карте
- **Телефон** — номер для быстрого звонка

## Как создать QR-код

### Шаг 1: Выберите данные
Определитесь, что должен делать код: открывать сайт, показывать текст или что-то другое.

### Шаг 2: Настройте внешний вид
Выберите цвет, размер и уровень коррекции ошибок:

| Уровень | Восстановление | Применение |
|---|---|---|
| L (7%) | Низкое | Чистые условия |
| M (15%) | Среднее | Стандарт |
| Q (25%) | Высокое | Промышленность |
| H (30%) | Максимальное | С логотипом |

### Шаг 3: Скачайте и используйте
Сохраните в SVG (для печати) или PNG (для экрана).

## Советы по использованию

- **Тестируйте перед публикацией** — проверьте код несколькими смартфонами
- **Размер имеет значение** — минимум 2×2 см для надёжного сканирования
- **Контраст** — тёмный код на светлом фоне, не наоборот
- **Добавьте CTA** — подпишите «Сканируй меня» рядом с кодом

Создайте свой QR-код в [Генераторе QR-кодов](/tools/qr-generator).

Смотрите также: [Генератор штрих-кодов](/tools/barcode-generator), [Base64](/tools/base64-encoder)
    `.trim(),
    contentEn: `
## What Is a QR Code?

A QR code (Quick Response) is a two-dimensional barcode that stores information as a black-and-white matrix. It was invented in 1994 by Denso Wave for the automotive industry and is now used everywhere.

## What Can You Encode in a QR Code?

- **Links** — website addresses, social media profiles
- **Text** — any text up to ~4,000 characters
- **Contact** — vCard with name, phone number, and email
- **Email** — a pre-composed email with subject and body
- **WiFi** — credentials for automatic network connection
- **Geolocation** — map coordinates
- **Phone** — a number for quick calling

## How to Create a QR Code

### Step 1: Choose Your Data
Decide what the code should do: open a website, display text, or something else.

### Step 2: Customize the Appearance
Choose the color, size, and error correction level:

| Level | Recovery | Use Case |
|---|---|---|
| L (7%) | Low | Clean surfaces |
| M (15%) | Medium | Standard use |
| Q (25%) | High | Industrial |
| H (30%) | Maximum | With a logo |

### Step 3: Download and Use
Save as SVG (for print) or PNG (for screens).

## Usage Tips

- **Test before publishing** — scan the code with multiple smartphones
- **Size matters** — minimum 2×2 cm for reliable scanning
- **Contrast** — dark code on a light background, not the other way around
- **Add a CTA** — label it "Scan me" near the code

Create your QR code in the [QR Code Generator](/tools/qr-generator).

See also: [Barcode Generator](/tools/barcode-generator), [Base64 Encoder](/tools/base64-encoder)
    `.trim(),
  },

  // === Калькулятор возраста ===
  {
    slug: 'age-calculator-guide',
    title: 'Калькулятор возраста: точный расчёт лет, месяцев и дней',
    titleEn: 'Age Calculator: Exact Calculation of Years, Months, and Days',
    description: 'Как точно рассчитать возраст в годах, месяцах, днях и даже секундах. Интересные факты о подсчёте возраста.',
    descriptionEn: 'How to accurately calculate age in years, months, days, and even seconds. Interesting facts about age counting.',
    toolSlug: 'age-calculator',
    type: 'guide',
    keywords: ['калькулятор возраста', 'сколько мне лет', 'дата рождения', 'возраст в днях', 'сколько дней прожил'],
    date: '2026-03-11',
    readTime: 5,
    content: `
## Зачем знать точный возраст?

Точный возраст нужен во многих ситуациях: при оформлении документов, расчёте пенсии, определении права на льготы, медицинских расчётах или просто из любопытства.

## Как рассчитывается возраст?

Алгоритм учитывает:
- Полные прожитые годы
- Оставшиеся полные месяцы
- Оставшиеся дни
- Переход через високосные годы

### Пример расчёта
Родились 15 марта 1990, сегодня 11 марта 2026:
- **Годы**: 35 (ещё не было дня рождения в 2026)
- **Месяцы**: 11 месяцев и 24 дня
- **Всего дней**: ~13144

## Интересные факты о возрасте

- В **Корее** традиционно считают возраст иначе: ребёнок рождается уже 1-летним, а все прибавляют год 1 января
- **Юридический возраст** считается по дате рождения, а не по времени суток
- **Средний возраст** в мире — около 30 лет
- За 1 год вы делаете примерно **8 миллионов вдохов**

## Что ещё можно посчитать?

| Единица | Примерное значение (35 лет) |
|---|---|
| Годы | 35 |
| Месяцы | ~420 |
| Недели | ~1826 |
| Дни | ~12775 |
| Часы | ~306 600 |

Рассчитайте свой точный возраст в [Калькуляторе возраста](/tools/age-calculator).

Смотрите также: [Разница дат](/tools/date-difference), [Unix Timestamp](/tools/unix-timestamp), [Номер недели](/tools/week-number)
    `.trim(),
    contentEn: `
## Why Know Your Exact Age?

Knowing your exact age is needed in many situations: when processing documents, calculating pension eligibility, determining entitlement to benefits, for medical calculations, or simply out of curiosity.

## How Is Age Calculated?

The algorithm accounts for:
- Completed full years lived
- Remaining full months
- Remaining days
- Transitions through leap years

### Calculation Example
Born March 15, 1990, today is March 11, 2026:
- **Years**: 35 (birthday in 2026 hasn't happened yet)
- **Months**: 11 months and 24 days
- **Total days**: ~13,144

## Interesting Facts About Age

- In **Korea**, age is traditionally counted differently: a child is born already 1 year old, and everyone adds a year on January 1st
- **Legal age** is counted from the date of birth, not the time of day
- The **average age** in the world is about 30 years
- In 1 year you take approximately **8 million breaths**

## What Else Can You Calculate?

| Unit | Approximate Value (age 35) |
|---|---|
| Years | 35 |
| Months | ~420 |
| Weeks | ~1,826 |
| Days | ~12,775 |
| Hours | ~306,600 |

Calculate your exact age with the [Age Calculator](/tools/age-calculator).

See also: [Date Difference](/tools/date-difference), [Unix Timestamp](/tools/unix-timestamp), [Week Number](/tools/week-number)
    `.trim(),
  },

  // === Генератор хэшей ===
  {
    slug: 'hash-generator-guide',
    title: 'Хэш-функции: MD5, SHA-256, SHA-512 — что это и зачем',
    titleEn: 'Hash Functions: MD5, SHA-256, SHA-512 — What They Are and Why You Need Them',
    description: 'Объяснение хэш-функций простым языком: что такое MD5, SHA-1, SHA-256, когда их использовать и как проверить целостность файла.',
    descriptionEn: 'Hash functions explained in plain language: what MD5, SHA-1, and SHA-256 are, when to use them, and how to verify file integrity.',
    toolSlug: 'hash-generator',
    type: 'guide',
    keywords: ['хэш', 'md5', 'sha256', 'sha512', 'контрольная сумма', 'целостность'],
    date: '2026-03-11',
    readTime: 7,
    content: `
## Что такое хэш-функция?

Хэш-функция — это математический алгоритм, который преобразует данные любого размера в строку фиксированной длины. Главные свойства: одинаковый ввод всегда даёт одинаковый хэш, но изменение хотя бы одного символа полностью меняет результат.

## Основные алгоритмы

### MD5
- Длина: 32 символа (128 бит)
- Скорость: очень быстрый
- Безопасность: **устарел**, не рекомендуется для паролей
- Применение: проверка целостности файлов

### SHA-1
- Длина: 40 символов (160 бит)
- Безопасность: **уязвим**, не использовать для критичных данных
- Применение: Git использует SHA-1 для коммитов

### SHA-256
- Длина: 64 символа (256 бит)
- Безопасность: **надёжный** стандарт
- Применение: SSL-сертификаты, Bitcoin, подписи

### SHA-512
- Длина: 128 символов (512 бит)
- Безопасность: **максимальная** из стандартных
- Применение: критичные данные, финтех

## Зачем нужны хэши?

| Задача | Алгоритм |
|---|---|
| Проверка скачанного файла | MD5 или SHA-256 |
| Хранение паролей в БД | bcrypt, SHA-256 |
| Цифровая подпись | SHA-256, SHA-512 |
| Быстрая проверка дубликатов | MD5 |

## Проверка целостности файла

При скачивании с официальных сайтов часто указан хэш файла. Посчитайте хэш скачанного файла и сравните — если совпадает, файл не изменён.

## Важно: хэш ≠ шифрование

Хэш нельзя «расшифровать» — это односторонняя функция. Для шифрования используйте AES или RSA.

Вычислите хэш текста в [Генераторе хэшей](/tools/hash-generator).

Смотрите также: [Base64 кодирование](/tools/base64-encoder), [Генератор паролей](/tools/password-generator), [Контрольная сумма](/tools/checksum-calc)
    `.trim(),
    contentEn: `
## What Is a Hash Function?

A hash function is a mathematical algorithm that converts data of any size into a fixed-length string. Key properties: the same input always produces the same hash, but changing even a single character completely changes the result.

## Main Algorithms

### MD5
- Length: 32 characters (128 bits)
- Speed: very fast
- Security: **outdated**, not recommended for passwords
- Use case: file integrity verification

### SHA-1
- Length: 40 characters (160 bits)
- Security: **vulnerable**, do not use for sensitive data
- Use case: Git uses SHA-1 for commits

### SHA-256
- Length: 64 characters (256 bits)
- Security: **reliable** standard
- Use case: SSL certificates, Bitcoin, digital signatures

### SHA-512
- Length: 128 characters (512 bits)
- Security: **maximum** among standard algorithms
- Use case: critical data, fintech

## Why Are Hashes Needed?

| Task | Algorithm |
|---|---|
| Verifying a downloaded file | MD5 or SHA-256 |
| Storing passwords in a database | bcrypt, SHA-256 |
| Digital signature | SHA-256, SHA-512 |
| Quick duplicate checking | MD5 |

## Verifying File Integrity

When downloading from official websites, the file hash is often provided. Calculate the hash of the downloaded file and compare — if it matches, the file has not been tampered with.

## Important: Hash ≠ Encryption

A hash cannot be "decrypted" — it is a one-way function. For encryption, use AES or RSA.

Compute the hash of any text in the [Hash Generator](/tools/hash-generator).

See also: [Base64 Encoder](/tools/base64-encoder), [Password Generator](/tools/password-generator), [Checksum Calculator](/tools/checksum-calc)
    `.trim(),
  },

  // === UUID Генератор ===
  {
    slug: 'uuid-generator-guide',
    title: 'UUID — что это такое и зачем нужен генератор UUID',
    titleEn: 'UUID — What It Is and Why You Need a UUID Generator',
    description: 'Подробное руководство по UUID: что означают версии v1–v5, как использовать UUID в базах данных и API, и почему UUID v4 является лучшим выбором для большинства задач.',
    descriptionEn: 'A detailed guide to UUID: what versions v1–v5 mean, how to use UUID in databases and APIs, and why UUID v4 is the best choice for most tasks.',
    toolSlug: 'uuid-generator',
    type: 'guide',
    keywords: ['UUID', 'GUID', 'генератор UUID', 'UUID v4', 'уникальный идентификатор'],
    date: '2026-03-11',
    readTime: 6,
    content: `
## Что такое UUID?

UUID (Universally Unique Identifier) — это стандартизированный 128-битный идентификатор, который гарантирует уникальность без центральной координации. Формат: \`xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx\`.

## Версии UUID

| Версия | Основа | Применение |
|--------|--------|------------|
| v1 | Время + MAC | Серверные системы, требующие временной сортировки |
| v3 | MD5 хэш | Детерминированные ID из имён |
| v4 | Случайные числа | Наиболее популярный — подходит для большинства задач |
| v5 | SHA-1 хэш | Улучшенная версия v3 |

## Почему UUID v4?

UUID v4 — оптимальный выбор для большинства задач:
- **Полная случайность** — невозможно предугадать следующий ID
- **Нет зависимостей** — не нужен сервер или координация
- **Глобальная уникальность** — вероятность коллизии ничтожно мала (1 шанс на 5,3×10³⁶)

## Применение в разработке

### Базы данных
Используйте UUID вместо auto-increment ID, когда:
- Синхронизируете данные между несколькими базами
- Хотите скрыть количество записей от пользователей
- Нужны идентификаторы до сохранения в БД

### REST API
\`\`\`
GET /api/users/550e8400-e29b-41d4-a716-446655440000
\`\`\`

### JavaScript
\`\`\`javascript
// Crypto API (современный подход)
const id = crypto.randomUUID();
\`\`\`

## UUID vs. GUID

GUID (Globally Unique Identifier) — это название Microsoft для UUID. Технически это одно и то же, хотя GUID v4 от Microsoft может иметь чуть другую кодировку в некоторых вариантах реализации.

Генерируйте UUID мгновенно в [Генераторе UUID](/tools/uuid-generator).

Смотрите также: [Генератор паролей](/tools/password-generator), [Генератор хэшей](/tools/hash-generator), [Base64 кодирование](/tools/base64-encoder)
    `.trim(),
    contentEn: `
## What Is UUID?

UUID (Universally Unique Identifier) is a standardized 128-bit identifier that guarantees uniqueness without central coordination. Format: \`xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx\`.

## UUID Versions

| Version | Basis | Use Case |
|--------|--------|------------|
| v1 | Time + MAC | Server systems requiring time-based sorting |
| v3 | MD5 hash | Deterministic IDs from names |
| v4 | Random numbers | Most popular — suitable for most tasks |
| v5 | SHA-1 hash | Improved version of v3 |

## Why UUID v4?

UUID v4 is the optimal choice for most tasks:
- **Full randomness** — the next ID is impossible to predict
- **No dependencies** — no server or coordination needed
- **Global uniqueness** — collision probability is negligible (1 in 5.3×10³⁶)

## Use in Development

### Databases
Use UUID instead of auto-increment IDs when:
- Synchronizing data across multiple databases
- You want to hide the number of records from users
- Identifiers are needed before saving to the database

### REST API
\`\`\`
GET /api/users/550e8400-e29b-41d4-a716-446655440000
\`\`\`

### JavaScript
\`\`\`javascript
// Crypto API (modern approach)
const id = crypto.randomUUID();
\`\`\`

## UUID vs. GUID

GUID (Globally Unique Identifier) is Microsoft's name for UUID. Technically they are the same thing, although Microsoft's GUID v4 may use slightly different encoding in some implementations.

Generate UUIDs instantly with the [UUID Generator](/tools/uuid-generator).

See also: [Password Generator](/tools/password-generator), [Hash Generator](/tools/hash-generator), [Base64 Encoder](/tools/base64-encoder)
    `.trim(),
  },

  // === Конвертер длины ===
  {
    slug: 'length-converter-guide',
    title: 'Перевод единиц длины: метры, дюймы, футы, мили — полное руководство',
    titleEn: 'Length Unit Conversion: Meters, Inches, Feet, Miles — Complete Guide',
    description: 'Как переводить метры в футы и дюймы, километры в мили, морские мили и другие единицы. Таблица перевода и формулы для расчётов.',
    descriptionEn: 'How to convert meters to feet and inches, kilometers to miles, nautical miles, and other units. Conversion tables and formulas.',
    toolSlug: 'length-converter',
    type: 'guide',
    keywords: ['конвертер длины', 'метры в футы', 'километры в мили', 'дюймы', 'перевод единиц'],
    date: '2026-03-11',
    readTime: 5,
    content: `
## Системы единиц длины

В мире используются две основные системы: **метрическая** (СИ) и **имперская** (США, Великобритания).

## Основные единицы и соотношения

### Метрическая система
| Единица | Сокращение | Соотношение |
|---------|------------|-------------|
| Нанометр | нм | 10⁻⁹ м |
| Микрометр | мкм | 10⁻⁶ м |
| Миллиметр | мм | 0,001 м |
| Сантиметр | см | 0,01 м |
| Дециметр | дм | 0,1 м |
| Метр | м | базовая единица |
| Километр | км | 1000 м |

### Имперская система
| Единица | Сокращение | В метрах |
|---------|------------|---------|
| Дюйм | in / ″ | 0,0254 м |
| Фут | ft / ′ | 0,3048 м |
| Ярд | yd | 0,9144 м |
| Миля | mi | 1 609,344 м |
| Морская миля | nmi | 1 852 м |

## Популярные переводы

- **1 метр = 3,281 фута = 39,37 дюйма**
- **1 километр = 0,621 мили**
- **1 фут = 30,48 см**
- **1 дюйм = 2,54 см**
- **1 морская миля = 1,852 км**

## Где это нужно?

**Строительство и ремонт:** американские товары указывают размеры в дюймах — нужен перевод при покупке материалов.

**Путешествия:** дорожные знаки в США и Великобритании в милях, скорость — в милях в час.

**Спорт:** в беге используются и километры, и мили (марафон = 42,195 км = 26,219 мили).

**Авиация и морское дело:** высоты в футах, расстояния — в морских милях.

Переведите любые единицы длины в [Конвертере длины](/tools/length-converter).

Смотрите также: [Конвертер веса](/tools/weight-converter), [Конвертер скорости](/tools/speed-converter), [Конвертер температуры](/tools/temperature-converter)
    `.trim(),
    contentEn: `
## Length Unit Systems

Two main systems are used in the world: the **metric** (SI) and **imperial** (USA, UK) systems.

## Main Units and Relationships

### Metric System
| Unit | Abbreviation | Relationship |
|---------|------------|-------------|
| Nanometer | nm | 10⁻⁹ m |
| Micrometer | µm | 10⁻⁶ m |
| Millimeter | mm | 0.001 m |
| Centimeter | cm | 0.01 m |
| Decimeter | dm | 0.1 m |
| Meter | m | base unit |
| Kilometer | km | 1,000 m |

### Imperial System
| Unit | Abbreviation | In Meters |
|---------|------------|---------|
| Inch | in / ″ | 0.0254 m |
| Foot | ft / ′ | 0.3048 m |
| Yard | yd | 0.9144 m |
| Mile | mi | 1,609.344 m |
| Nautical mile | nmi | 1,852 m |

## Common Conversions

- **1 meter = 3.281 feet = 39.37 inches**
- **1 kilometer = 0.621 miles**
- **1 foot = 30.48 cm**
- **1 inch = 2.54 cm**
- **1 nautical mile = 1.852 km**

## Where Is This Needed?

**Construction and renovation:** American products list dimensions in inches — conversion is needed when buying materials.

**Travel:** Road signs in the US and UK are in miles, and speed is in miles per hour.

**Sports:** Running uses both kilometers and miles (marathon = 42.195 km = 26.219 miles).

**Aviation and maritime:** Altitudes are in feet, distances in nautical miles.

Convert any length units with the [Length Converter](/tools/length-converter).

See also: [Weight Converter](/tools/weight-converter), [Speed Converter](/tools/speed-converter), [Temperature Converter](/tools/temperature-converter)
    `.trim(),
  },

  // === Калькулятор кредита ===
  {
    slug: 'loan-calc-guide',
    title: 'Кредитный калькулятор: как рассчитать платёж и переплату',
    titleEn: 'Loan Calculator: How to Calculate Your Payment and Total Interest',
    description: 'Как самостоятельно рассчитать ежемесячный платёж по кредиту. Формула аннуитетного платежа, сравнение аннуитета и дифференцированного платежа, советы по выбору кредита.',
    descriptionEn: 'How to calculate your monthly loan payment yourself. The annuity payment formula, comparing annuity and differentiated payments, and tips for choosing a loan.',
    toolSlug: 'loan-calc',
    type: 'guide',
    keywords: ['кредитный калькулятор', 'ежемесячный платёж', 'аннуитет', 'переплата по кредиту'],
    date: '2026-03-11',
    readTime: 7,
    content: `
## Два типа кредитных платежей

### Аннуитетный платёж
Фиксированный платёж каждый месяц на весь срок. Удобнее для планирования, но в начале вы платите в основном проценты.

**Формула:**
\`\`\`
PMT = P × r / (1 − (1+r)^−n)
\`\`\`
где P — сумма кредита, r — месячная ставка, n — количество месяцев.

### Дифференцированный платёж
Тело кредита делится равномерно, а проценты начисляются на остаток. Платёж уменьшается каждый месяц.

**Итог:** Дифференцированный = меньше переплата. Аннуитетный = удобнее планировать.

## Пример расчёта

Кредит 500 000 ₽, ставка 15% годовых, срок 3 года (36 месяцев):
- Месячная ставка: 15% / 12 = 1,25%
- Аннуитетный платёж: ≈ **17 333 ₽/мес**
- Переплата: ≈ **124 000 ₽** (24,8%)

## Что влияет на переплату?

1. **Процентная ставка** — самый важный фактор
2. **Срок кредита** — чем дольше, тем больше переплата
3. **Досрочное погашение** — снижает итоговую переплату
4. **Страховка** — часто включается в стоимость кредита

## Советы по кредиту

- **Сравнивайте ПСК** (полная стоимость кредита), а не только ставку — в ПСК учтены все комиссии
- **Читайте договор** — обратите внимание на штрафы за досрочное погашение
- **Не берите в валюте**, если доходы в рублях — курсовой риск слишком велик
- **Рефинансируйте** при снижении ставок — это может сэкономить десятки тысяч рублей

Рассчитайте точную сумму платежа в [Кредитном калькуляторе](/tools/loan-calc).

Смотрите также: [Ипотечный калькулятор](/tools/mortgage-calc), [Депозитный калькулятор](/tools/deposit-calc), [Налоговый калькулятор](/tools/tax-calc)
    `.trim(),
    contentEn: `
## Two Types of Loan Payments

### Annuity Payment
A fixed payment every month for the entire term. Easier to plan around, but in the early months you are mostly paying interest.

**Formula:**
\`\`\`
PMT = P × r / (1 − (1+r)^−n)
\`\`\`
where P is the loan amount, r is the monthly rate, n is the number of months.

### Differentiated Payment
The principal is divided evenly, and interest accrues on the remaining balance. The payment decreases each month.

**Bottom line:** Differentiated = less total interest. Annuity = easier to budget.

## Example Calculation

Loan of $50,000, interest rate 15% per year, term 3 years (36 months):
- Monthly rate: 15% / 12 = 1.25%
- Annuity payment: ≈ **$1,733/month**
- Total interest paid: ≈ **$12,400** (24.8%)

## What Affects the Total Interest Paid?

1. **Interest rate** — the most important factor
2. **Loan term** — the longer the term, the more interest you pay
3. **Early repayment** — reduces total interest paid
4. **Insurance** — is often included in the cost of the loan

## Loan Tips

- **Compare APR** (annual percentage rate), not just the stated rate — APR includes all fees
- **Read the contract** — pay attention to penalties for early repayment
- **Don't borrow in a foreign currency** if your income is in local currency — exchange rate risk is too great
- **Refinance** when rates drop — it can save tens of thousands

Calculate the exact payment amount with the [Loan Calculator](/tools/loan-calc).

See also: [Mortgage Calculator](/tools/mortgage-calc), [Deposit Calculator](/tools/deposit-calc), [Tax Calculator](/tools/tax-calc)
    `.trim(),
  },

  // === Генератор QR-кодов ===
  {
    slug: 'qr-generator-tips',
    title: 'QR-коды: где применять и как создать идеальный QR-код',
    titleEn: 'QR Codes: Where to Use Them and How to Create the Perfect QR Code',
    description: 'Практические советы по созданию QR-кодов для бизнеса, маркетинга и личных нужд. Оптимальный размер, коррекция ошибок, форматы данных.',
    descriptionEn: 'Practical tips for creating QR codes for business, marketing, and personal use. Optimal size, error correction levels, and data formats.',
    toolSlug: 'qr-generator',
    type: 'tips',
    keywords: ['QR-код', 'генератор QR', 'создать QR-код', 'QR для бизнеса'],
    date: '2026-03-11',
    readTime: 5,
    content: `
## 10 практических советов по QR-кодам

### 1. Выбирайте правильный уровень коррекции ошибок
- **L (7%)** — для чистых поверхностей (экраны, бумага без изображений)
- **M (15%)** — стандарт, подходит для большинства случаев
- **Q (25%)** — для небольшого логотипа в центре
- **H (30%)** — для повреждённых или грязных поверхностей

### 2. Минимальный размер — 2×2 см
Меньший QR-код нечитаем большинством смартфонов. Для баннеров и вывесок — от 10×10 см.

### 3. Контраст важнее цвета
Тёмный QR на светлом фоне — лучшее сочетание. Инверсия (светлый на тёмном) работает хуже. Избегайте красного цвета — он плохо сканируется.

### 4. Форматы данных

| Тип | Пример | Применение |
|-----|--------|------------|
| URL | https://example.com | Сайты, лендинги |
| Телефон | tel:+79001234567 | Визитки |
| Email | mailto:info@example.com | Обратная связь |
| SMS | SMSTO:+7900:Текст | Акции |
| Wi-Fi | WIFI:S:Name;T:WPA;P:pass;; | Гости |
| vCard | BEGIN:VCARD... | Контакты |

### 5. Укорачивайте URL
Длинные URL делают QR-код «перегруженным» и трудночитаемым. Используйте bit.ly или ваш собственный домен.

### 6. Добавляйте белые поля (quiet zone)
Вокруг QR обязательно должно быть белое пространство шириной минимум 4 модуля (маленьких квадрата). Без него сканирование ненадёжно.

### 7. Тестируйте на разных устройствах
Перед печатью проверьте QR с iPhone, Android и планшета — приложения по-разному читают коды.

### 8. Динамические vs. статические QR
- **Статические** — URL зашит в код, нельзя изменить после печати
- **Динамические** (через сервис) — можно менять URL, отслеживать сканирования

### 9. QR в PDF для сохранения качества
Экспортируйте QR в SVG или PNG с высоким разрешением (300+ DPI для печати).

### 10. Не нужно говорить «Отсканируйте QR-код»
Люди знают, что такое QR. Лучше укажите мотивацию: «Получите скидку 10%» или «Смотрите видео инструкцию».

Создайте QR-код в [Генераторе QR-кодов](/tools/qr-generator).

Смотрите также: [Генератор штрих-кодов](/tools/barcode-generator), [Генератор паролей](/tools/password-generator), [Генератор аватаров](/tools/avatar-generator)
    `.trim(),
    contentEn: `
## 10 Practical Tips for QR Codes

### 1. Choose the Right Error Correction Level
- **L (7%)** — for clean surfaces (screens, plain paper)
- **M (15%)** — standard, suitable for most cases
- **Q (25%)** — for a small logo in the center
- **H (30%)** — for damaged or dirty surfaces

### 2. Minimum Size — 2×2 cm
A smaller QR code is unreadable by most smartphones. For banners and signs — at least 10×10 cm.

### 3. Contrast Matters More Than Color
Dark QR on a light background is the best combination. Inverse (light on dark) works less reliably. Avoid red — it scans poorly.

### 4. Data Formats

| Type | Example | Use Case |
|-----|--------|------------|
| URL | https://example.com | Websites, landing pages |
| Phone | tel:+15551234567 | Business cards |
| Email | mailto:info@example.com | Contact forms |
| SMS | SMSTO:+1555:Text | Promotions |
| Wi-Fi | WIFI:S:Name;T:WPA;P:pass;; | Guests |
| vCard | BEGIN:VCARD... | Contacts |

### 5. Shorten Your URLs
Long URLs make the QR code "dense" and harder to scan. Use bit.ly or your own domain.

### 6. Add Quiet Zones
There must always be a white border at least 4 modules (small squares) wide around the QR code. Without it, scanning becomes unreliable.

### 7. Test on Multiple Devices
Before printing, test the QR on an iPhone, Android, and tablet — apps read codes differently.

### 8. Dynamic vs. Static QR Codes
- **Static** — the URL is embedded in the code and cannot be changed after printing
- **Dynamic** (via a service) — the URL can be changed and scans can be tracked

### 9. Export QR to PDF to Preserve Quality
Export QR as SVG or high-resolution PNG (300+ DPI for print).

### 10. You Don't Need to Say "Scan the QR Code"
People know what a QR code is. Instead, state the benefit: "Get 10% off" or "Watch the video tutorial."

Create a QR code with the [QR Code Generator](/tools/qr-generator).

See also: [Barcode Generator](/tools/barcode-generator), [Password Generator](/tools/password-generator), [Avatar Generator](/tools/avatar-generator)
    `.trim(),
  },

  // === Конвертер веса ===
  {
    slug: 'weight-converter-tips',
    title: 'Килограммы, фунты, унции: как переводить единицы веса',
    titleEn: 'Kilograms, Pounds, Ounces: How to Convert Weight Units',
    description: 'Быстрый справочник по переводу единиц веса и массы. Килограммы в фунты, граммы в унции, тонны в стоуны. Таблицы и формулы.',
    descriptionEn: 'A quick reference for converting weight and mass units. Kilograms to pounds, grams to ounces, tonnes to stones. Tables and formulas.',
    toolSlug: 'weight-converter',
    type: 'tips',
    keywords: ['конвертер веса', 'килограммы в фунты', 'граммы в унции', 'единицы массы'],
    date: '2026-03-11',
    readTime: 4,
    content: `
## Таблица популярных переводов

| Из | В | Множитель |
|----|---|-----------|
| 1 кг | фунты (lb) | × 2,20462 |
| 1 кг | унции (oz) | × 35,274 |
| 1 фунт | кг | × 0,453592 |
| 1 унция | граммы | × 28,3495 |
| 1 стоун (st) | кг | × 6,35029 |
| 1 тонна (т) | кг | × 1000 |
| 1 short ton (США) | кг | × 907,185 |
| 1 long ton (UK) | кг | × 1016,05 |

## Когда это нужно

### Фитнес и медицина
В США и Великобритании вес измеряют в фунтах (lb) и стоунах (st). Если на упаковке спортпита написано «5 lbs», это 2,27 кг.

### Кулинария
Американские рецепты часто используют унции (oz) и фунты вместо граммов:
- 1 oz ≈ 28 г
- 1 lb ≈ 454 г

### Почта и логистика
Международные тарифы часто указывают ограничения в кг и в lbs. FedEx и UPS в США работают с фунтами.

### Ювелирное дело
- Тройская унция (troy oz) = 31,1035 г (для золота, серебра)
- Карат (ct) = 0,2 г (для драгоценных камней)

## Быстрые формулы в уме

- **кг → фунты:** умножь на 2, добавь 10% → 70 кг ≈ 154 lb
- **фунты → кг:** умножь на 0,45 → 150 lb ≈ 67,5 кг
- **унции → граммы:** умножь на 28 → 8 oz ≈ 224 г

Переведите любые единицы веса в [Конвертере веса](/tools/weight-converter).

Смотрите также: [Конвертер длины](/tools/length-converter), [Калькулятор BMI](/tools/bmi-calc), [Кулинарный конвертер](/tools/cooking-converter)
    `.trim(),
    contentEn: `
## Common Conversion Table

| From | To | Multiplier |
|----|---|-----------|
| 1 kg | pounds (lb) | × 2.20462 |
| 1 kg | ounces (oz) | × 35.274 |
| 1 pound | kg | × 0.453592 |
| 1 ounce | grams | × 28.3495 |
| 1 stone (st) | kg | × 6.35029 |
| 1 tonne (t) | kg | × 1,000 |
| 1 short ton (US) | kg | × 907.185 |
| 1 long ton (UK) | kg | × 1,016.05 |

## When Is This Needed?

### Fitness and Medicine
In the US and UK, weight is measured in pounds (lb) and stones (st). If a sports nutrition package says "5 lbs," that is 2.27 kg.

### Cooking
American recipes often use ounces (oz) and pounds instead of grams:
- 1 oz ≈ 28 g
- 1 lb ≈ 454 g

### Shipping and Logistics
International rates often list weight limits in both kg and lbs. FedEx and UPS in the US work with pounds.

### Jewelry
- Troy ounce (troy oz) = 31.1035 g (for gold, silver)
- Carat (ct) = 0.2 g (for gemstones)

## Quick Mental Formulas

- **kg → pounds:** multiply by 2, add 10% → 70 kg ≈ 154 lb
- **pounds → kg:** multiply by 0.45 → 150 lb ≈ 67.5 kg
- **ounces → grams:** multiply by 28 → 8 oz ≈ 224 g

Convert any weight units with the [Weight Converter](/tools/weight-converter).

See also: [Length Converter](/tools/length-converter), [BMI Calculator](/tools/bmi-calc), [Cooking Converter](/tools/cooking-converter)
    `.trim(),
  },
];

const _allArticles: Article[] = [
  ...baseArticles,
  ...calculatorArticles,
  ...colorArticles,
  ...datetimeArticles,
  ...developerArticles,
  ...encodingArticles,
  ...entertainmentArticles,
  ...financeArticles,
  ...generatorArticles,
  ...imageArticles,
  ...mathArticles,
  ...qrbarcodeArticles,
  ...securityArticles,
  ...seoArticles,
  ...textArticles,
  ...converterArticles,
  ...healthArticles,
  ...mediaArticles,
  ...networkArticles,
  ...unitArticles,
  ...productivityArticles,
];

// Deduplicate by slug (keep first occurrence)
export const articles: Article[] = _allArticles
  .filter((a, i, arr) => arr.findIndex(b => b.slug === a.slug) === i)
  .map(a => ({
    ...a,
    ...(articleOverridesEn as Record<string, Partial<Article>>)[a.slug] ?? {},
  }));

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}

export function getArticlesByTool(toolSlug: string): Article[] {
  return articles.filter(a => a.toolSlug === toolSlug);
}

// ── Lightweight metadata for client-side listing pages ──
// BlogPage only needs title/description/slug/type/date/readTime for the card grid.
// Stripping `content` and `contentEn` saves ~1.4 MB from the client JS bundle.
export type ArticleMeta = Omit<Article, 'content' | 'contentEn'>;

export const articlesMeta: ArticleMeta[] = articles.map(
  ({ content, contentEn, ...meta }) => meta
);
