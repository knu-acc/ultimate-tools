import type { Lang } from "./tools-registry";

export interface ToolSeoMeta {
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  seoIntro: Record<Lang, string>;
  keywords: Record<Lang, string[]>;
}

export const TOOL_SEO: Record<string, ToolSeoMeta> = {
  "percent-calc": {
    title: {
      ru: "Калькулятор процентов онлайн — расчёт процентов от числа",
      kz: "Пайыз калькуляторы онлайн — саннан пайызды есептеу",
      en: "Percentage Calculator Online — Calculate Percent of Number",
    },
    description: {
      ru: "Бесплатный калькулятор процентов: вычислите X% от числа, сколько процентов составляет число, добавьте процент к сумме. Работает в браузере.",
      kz: "Тегін пайыз калькуляторы: саннан X% есептеңіз, сан қанша пайызды құрайды. Браузерде жұмыс істейді.",
      en: "Free percentage calculator: find X% of a number, what percent is a number, add percent to amount. Runs in browser.",
    },
    seoIntro: {
      ru: "Калькулятор процентов позволяет быстро вычислить процент от любого числа, определить долю одного числа в другом или добавить процент к сумме. Все расчёты выполняются мгновенно на вашем устройстве — данные никуда не отправляются.",
      kz: "Пайыз калькуляторы кез келген саннан пайызды жылдам есептеуге, бір санның екіншісіндегі үлесін анықтауға немесе сомаға пайыз қосуға мүмкіндік береді.",
      en: "The percentage calculator lets you quickly find a percent of any number, determine what percent one number is of another, or add a percentage to an amount. All calculations run instantly on your device.",
    },
    keywords: {
      ru: ["калькулятор процентов", "процент от числа", "расчёт процентов", "онлайн калькулятор"],
      kz: ["пайыз калькуляторы", "саннан пайыз", "пайызды есептеу"],
      en: ["percentage calculator", "percent of number", "calculate percentage"],
    },
  },
  bmi: {
    title: {
      ru: "Калькулятор ИМТ — индекс массы тела онлайн",
      kz: "Дене салмағы индексі калькуляторы — ИМТ онлайн",
      en: "BMI Calculator — Body Mass Index Online",
    },
    description: {
      ru: "Рассчитайте индекс массы тела (ИМТ) по росту и весу. Определите норму, недостаток или избыток веса. Бесплатный онлайн-калькулятор ИМТ.",
      kz: "Бой мен салмақ бойынша дене салмағы индексін (ИМТ) есептеңіз. Тегін онлайн калькулятор.",
      en: "Calculate Body Mass Index (BMI) from height and weight. Determine if you're underweight, normal, overweight or obese. Free online BMI calculator.",
    },
    seoIntro: {
      ru: "Индекс массы тела (ИМТ) — показатель соотношения веса и роста, используемый для оценки нормальности массы тела. Введите свой рост в сантиметрах и вес в килограммах, чтобы получить результат и интерпретацию.",
      kz: "Дене салмағы индексі (ИМТ) — салмақ пен бой арақатынасын көрсететін көрсеткіш. Сантиметрдегі бойыңызды және килограммдағы салмағыңызды енгізіңіз.",
      en: "Body Mass Index (BMI) is a measure of body fat based on height and weight. Enter your height in centimeters and weight in kilograms to get your result and interpretation.",
    },
    keywords: {
      ru: ["калькулятор ИМТ", "индекс массы тела", "расчёт ИМТ", "норма веса"],
      kz: ["ИМТ калькуляторы", "дене салмағы индексі", "салмақ нормасы"],
      en: ["BMI calculator", "body mass index", "BMI calculation", "weight norm"],
    },
  },
  "loan-calc": {
    title: {
      ru: "Калькулятор кредита — расчёт ежемесячного платежа",
      kz: "Несие калькуляторы — айлық төлемді есептеу",
      en: "Loan Calculator — Monthly Payment Calculation",
    },
    description: {
      ru: "Рассчитайте ежемесячный платёж по кредиту: введите сумму, процентную ставку и срок. Аннуитетная формула. Бесплатный кредитный калькулятор онлайн.",
      kz: "Несие бойынша айлық төлемді есептеңіз: соманы, пайыздық мөлшерлемені және мерзімді енгізіңіз.",
      en: "Calculate monthly loan payment: enter principal, interest rate and term. Annuity formula. Free online loan calculator.",
    },
    seoIntro: {
      ru: "Кредитный калькулятор помогает рассчитать размер ежемесячного аннуитетного платежа по кредиту. Укажите сумму займа, годовую процентную ставку и срок в месяцах — результат отобразится мгновенно.",
      kz: "Несие калькуляторы айлық аннуитеттік төлем мөлшерін есептеуге көмектеседі. Несие сомасын, жылдық пайыздық мөлшерлемені және айлардағы мерзімді көрсетіңіз.",
      en: "The loan calculator helps you determine the monthly annuity payment. Enter the loan amount, annual interest rate and term in months — the result appears instantly.",
    },
    keywords: {
      ru: ["калькулятор кредита", "расчёт кредита", "ежемесячный платёж", "ипотечный калькулятор"],
      kz: ["несие калькуляторы", "айлық төлем", "несие есептеу"],
      en: ["loan calculator", "mortgage calculator", "monthly payment", "loan calculation"],
    },
  },
  "vat-calc": {
    title: {
      ru: "Калькулятор НДС — расчёт НДС онлайн",
      kz: "ҚҚС калькуляторы — қосымша салық есептеу",
      en: "VAT Calculator — Calculate VAT Online",
    },
    description: {
      ru: "Рассчитайте НДС 10% или 20%: выделите НДС из суммы или начислите. Калькулятор для бухгалтеров и предпринимателей. Работает офлайн.",
      kz: "ҚҚС 10% немесе 20% есептеңіз: сомадан қосыңыз немесе бөліп алыңыз. Бухгалтерлер мен кәсіпкерлер үшін.",
      en: "Calculate VAT 10% or 20%: add or extract VAT from amount. Calculator for accountants and entrepreneurs. Works offline.",
    },
    seoIntro: {
      ru: "Калькулятор НДС позволяет быстро выделить или начислить налог на добавленную стоимость. Выберите ставку (0%, 10%, 20%), укажите сумму и отметьте, включён ли НДС в указанную сумму.",
      kz: "ҚҚС калькуляторы қосымша құн салығын жылдам қосуға немесе бөліп алуға мүмкіндік береді. Мөлшерлемені таңдаңыз (0%, 10%, 20%).",
      en: "The VAT calculator lets you quickly add or extract value-added tax. Select the rate (0%, 10%, 20%), enter the amount and indicate whether VAT is included.",
    },
    keywords: {
      ru: ["калькулятор НДС", "расчёт НДС", "выделить НДС", "начислить НДС"],
      kz: ["ҚҚС калькуляторы", "қосымша салық", "ҚҚС есептеу"],
      en: ["VAT calculator", "VAT calculation", "add VAT", "extract VAT"],
    },
  },
  "number-systems": {
    title: {
      ru: "Конвертер систем счисления — двоичная, восьмеричная, шестнадцатеричная",
      kz: "Санау жүйелері түрлендіргіші — екілік, сегіздік, он алтылық",
      en: "Number Base Converter — Binary, Octal, Hexadecimal",
    },
    description: {
      ru: "Конвертируйте числа между двоичной (2), восьмеричной (8), десятичной (10) и шестнадцатеричной (16) системами счисления. Онлайн конвертер бесплатно.",
      kz: "Сандарды екілік (2), сегіздік (8), ондық (10) және он алтылық (16) санау жүйелері арасында түрлендіріңіз.",
      en: "Convert numbers between binary (2), octal (8), decimal (10) and hexadecimal (16) number systems. Free online converter.",
    },
    seoIntro: {
      ru: "Конвертер систем счисления позволяет переводить числа между различными основаниями: двоичная (бинарная), восьмеричная, десятичная и шестнадцатеричная. Полезно для программистов и изучения информатики.",
      kz: "Санау жүйелері түрлендіргіші сандарды әртүрлі негіздер арасында ауыстыруға мүмкіндік береді: екілік, сегіздік, ондық және он алтылық.",
      en: "The number base converter lets you convert numbers between different bases: binary, octal, decimal and hexadecimal. Useful for programmers and computer science.",
    },
    keywords: {
      ru: ["конвертер систем счисления", "двоичная в десятичную", "hex в decimal", "бинарный конвертер"],
      kz: ["санау жүйелері түрлендіргіші", "екілік ондық", "hex decimal"],
      en: ["number base converter", "binary to decimal", "hex to decimal", "base converter"],
    },
  },
  "word-counter": {
    title: { ru: "Счётчик слов онлайн — подсчёт слов и символов в тексте", kz: "Сөздер санағыш онлайн", en: "Word Counter Online — Count Words and Characters" },
    description: { ru: "Бесплатный счётчик слов: подсчитайте слова, символы, строки в тексте. Для копирайтеров, SEO, соцсетей. Без регистрации.", kz: "Тегін сөз санағыш: мәтіндегі сөздер мен таңбаларды санаңыз.", en: "Free word counter: count words, characters, lines. For copywriters, SEO, social media. No signup." },
    seoIntro: { ru: "Счётчик слов мгновенно подсчитывает количество слов, символов с пробелами и без, а также строк в тексте. Незаменим для SEO-оптимизации, лимитов Twitter и Instagram, проверки объёмов статей.", kz: "Сөз санағыш мәтіндегі сөздер, таңбаларды және жолдарды лезде санайды.", en: "The word counter instantly counts words, characters with and without spaces, and lines. Essential for SEO, Twitter/Instagram limits, article length." },
    keywords: { ru: ["счётчик слов", "подсчёт символов", "количество слов в тексте", "счётчик слов онлайн"], kz: ["сөз санағыш", "таңбалар саны"], en: ["word counter", "character count", "word count online"] },
  },
  "case-converter": {
    title: { ru: "Конвертер регистра текста — верхний, нижний, заглавные буквы", kz: "Мәтін регистрі түрлендіргіші", en: "Text Case Converter — Upper, Lower, Title Case" },
    description: { ru: "Измените регистр текста: ВЕРХНИЙ, нижний, Заглавные Слова. Бесплатный конвертер регистра онлайн.", kz: "Мәтін регистрін өзгерту: ҮЛКЕН, кіші, Заголовок Сөздер.", en: "Change text case: UPPER, lower, Title Case. Free case converter online." },
    seoIntro: { ru: "Конвертер регистра позволяет быстро изменить написание текста: сделать всё заглавными буквами, строчными, заглавными каждого слова или только первой буквы предложения.", kz: "Регистр түрлендіргіші мәтіннің жазылуын жылдам өзгертуге мүмкіндік береді.", en: "The case converter lets you quickly change text to uppercase, lowercase, title case or sentence case." },
    keywords: { ru: ["конвертер регистра", "изменить регистр", "заглавные буквы", "капс лок"], kz: ["регистр түрлендіргіші"], en: ["case converter", "change case", "uppercase lowercase", "title case"] },
  },
  "password-generator": {
    title: { ru: "Генератор паролей онлайн — создать надёжный пароль", kz: "Құпия сөз генераторы онлайн", en: "Password Generator Online — Create Strong Password" },
    description: { ru: "Создайте надёжный пароль: буквы, цифры, символы. Настройка длины. Генератор паролей бесплатно без регистрации.", kz: "Сенімді құпия сөз жасаңыз: әріптер, сандар, таңбалар.", en: "Create strong password: letters, digits, symbols. Custom length. Free password generator." },
    seoIntro: { ru: "Генератор паролей создаёт криптографически стойкие случайные пароли. Выберите длину от 6 до 64 символов, включите заглавные, строчные, цифры и спецсимволы. Все расчёты в браузере.", kz: "Құпия сөз генераторы криптографиялық тұрғыдан күшті кездейсоқ парольдер жасайды.", en: "The password generator creates cryptographically secure random passwords. Choose length 6-64, include letters, digits, symbols. All in browser." },
    keywords: { ru: ["генератор паролей", "создать пароль", "надёжный пароль", "генератор паролей онлайн"], kz: ["құпия сөз генераторы"], en: ["password generator", "create password", "strong password", "random password"] },
  },
  "random-number": {
    title: { ru: "Генератор случайных чисел — случайное число онлайн", kz: "Кездейсоқ сандар генераторы онлайн", en: "Random Number Generator — Random Number Online" },
    description: { ru: "Сгенерируйте случайное число в диапазоне. Укажите минимум и максимум. Бесплатный генератор случайных чисел без регистрации.", kz: "Диапазонда кездейсоқ сан жасаңыз. Минимум және максимумды көрсетіңіз.", en: "Generate random number in range. Set min and max. Free random number generator." },
    seoIntro: { ru: "Генератор случайных чисел выдаёт псевдослучайные числа в указанном диапазоне. Можно сгенерировать одно или несколько чисел. Удобно для розыгрышей, тестов, игр.", kz: "Кездейсоқ сандар генераторы көрсетілген диапазонда сандарды шығарады.", en: "The random number generator produces numbers within your specified range. Generate one or multiple. Useful for giveaways, tests, games." },
    keywords: { ru: ["генератор случайных чисел", "случайное число", "рандом число", "random number"], kz: ["кездейсоқ сандар генераторы"], en: ["random number generator", "random number", "random integer"] },
  },
  "base64": {
    title: { ru: "Base64 кодирование — декодировать Base64 онлайн", kz: "Base64 кодтау — онлайн декодтау", en: "Base64 Encode Decode — Base64 Converter Online" },
    description: { ru: "Закодируйте или декодируйте Base64. Текст в Base64 и обратно. Бесплатный Base64 конвертер. Работает в браузере.", kz: "Base64 кодтаңыз немесе декодтаңыз. Браузерде жұмыс істейді.", en: "Encode or decode Base64. Text to Base64 and back. Free Base64 converter. Runs in browser." },
    seoIntro: { ru: "Base64 — способ кодирования двоичных данных в текстовый формат. Используется в email, HTML, API. Конвертер поддерживает кодирование и декодирование в обе стороны.", kz: "Base64 — екілік деректерді мәтін форматына кодтау әдісі.", en: "Base64 encodes binary data as text. Used in email, HTML, JSON. The converter supports both encode and decode." },
    keywords: { ru: ["base64", "base64 декодер", "base64 кодировать", "base64 онлайн"], kz: ["base64", "base64 декодер"], en: ["base64", "base64 decode", "base64 encode", "base64 converter"] },
  },
  "json-formatter": {
    title: { ru: "JSON форматирование — форматировать JSON онлайн", kz: "JSON форматтау онлайн", en: "JSON Formatter — Format JSON Online" },
    description: { ru: "Форматируйте и минифицируйте JSON. Красивое отображение с отступами. Валидация JSON. Бесплатный JSON formatter.", kz: "JSON форматтаңыз және минификациялаңыз. Тегін JSON formatter.", en: "Format and minify JSON. Pretty print with indentation. JSON validation. Free JSON formatter." },
    seoIntro: { ru: "JSON Formatter делает нечитаемый JSON удобным для чтения с отступами и переносами. Или минифицирует для компактного хранения. Проверяет синтаксис.", kz: "JSON Formatter JSON-ды оқылуға ыңғайлы етеді.", en: "JSON Formatter makes unreadable JSON human-readable with indentation. Or minifies for compact storage. Validates syntax." },
    keywords: { ru: ["json форматирование", "форматировать json", "json beautifier", "json validator"], kz: ["json форматтау"], en: ["json formatter", "format json", "json beautifier", "json validator"] },
  },
  "md5": {
    title: { ru: "MD5 хеш — генератор MD5 онлайн", kz: "MD5 хеш — MD5 генераторы онлайн", en: "MD5 Hash — MD5 Generator Online" },
    description: { ru: "Создайте MD5 хеш от текста. MD5 хеширование онлайн бесплатно. Для проверки целостности и паролей.", kz: "Мәтіннен MD5 хеш жасаңыз. Тегін MD5 хеширование.", en: "Create MD5 hash from text. MD5 hashing online free. For integrity checks and passwords." },
    seoIntro: { ru: "MD5 — криптографическая хеш-функция. Выдаёт 32-символьный хеш. Используется для проверки целостности файлов. Не для паролей (устарел).", kz: "MD5 — криптографиялық хеш функциясы. 32 таңбалы хеш береді.", en: "MD5 is a cryptographic hash function. Produces 32-character hash. Used for file integrity. Not for passwords (deprecated)." },
    keywords: { ru: ["md5", "md5 хеш", "md5 онлайн", "хеш md5"], kz: ["md5", "md5 хеш"], en: ["md5", "md5 hash", "md5 generator", "md5 online"] },
  },
  "sha256": {
    title: { ru: "SHA256 хеш — SHA256 генератор онлайн", kz: "SHA256 хеш — SHA256 генераторы онлайн", en: "SHA256 Hash — SHA256 Generator Online" },
    description: { ru: "Создайте SHA256 хеш от текста. SHA256 хеширование онлайн. Безопаснее MD5. Бесплатно.", kz: "Мәтіннен SHA256 хеш жасаңыз. MD5-дан қауіпсіз.", en: "Create SHA256 hash from text. SHA256 hashing online. More secure than MD5. Free." },
    seoIntro: { ru: "SHA-256 — криптографическая хеш-функция. Выдаёт 64-символьный хеш. Используется в блокчейне, SSL, подписи. Безопаснее MD5.", kz: "SHA-256 — криптографиялық хеш функциясы. 64 таңбалы хеш береді.", en: "SHA-256 is a cryptographic hash. Produces 64-character hash. Used in blockchain, SSL. More secure than MD5." },
    keywords: { ru: ["sha256", "sha256 хеш", "sha256 онлайн", "хеш sha256"], kz: ["sha256", "sha256 хеш"], en: ["sha256", "sha256 hash", "sha256 generator", "sha256 online"] },
  },
  "url-encode": {
    title: { ru: "URL кодирование — URL encode decode онлайн", kz: "URL кодтау — онлайн encode decode", en: "URL Encode Decode — URL Encoder Online" },
    description: { ru: "Закодируйте или декодируйте URL. Преобразование спецсимволов в %XX. URL encoder decoder бесплатно.", kz: "URL кодтаңыз немесе декодтаңыз. Арнайы таңбаларды %XX-ге түрлендіру.", en: "Encode or decode URL. Convert special chars to %XX. URL encoder decoder free." },
    seoIntro: { ru: "URL encoding преобразует спецсимволы (пробелы, кириллицу, &, =) в формат %XX для безопасной передачи в URL. Конвертер поддерживает encode и decode.", kz: "URL кодтау арнайы таңбаларды URL-да қауіпсіз жіберу үшін %XX форматына түрлендіреді.", en: "URL encoding converts special chars (spaces, etc.) to %XX format for safe URL transmission. Supports encode and decode." },
    keywords: { ru: ["url encode", "url декодирование", "url encoder", "url decode онлайн"], kz: ["url encode", "url декодтау"], en: ["url encode", "url decode", "url encoder", "percent encoding"] },
  },
  "utm-builder": {
    title: { ru: "UTM метки — генератор UTM ссылок онлайн", kz: "UTM белгілері — UTM сілтеме генераторы", en: "UTM Builder — UTM Link Generator Online" },
    description: { ru: "Создайте ссылку с UTM метками. utm_source, utm_medium, utm_campaign. Удобно для аналитики и рекламы.", kz: "UTM белгілері бар сілтеме жасаңыз. Аналитика және жарнама үшін.", en: "Create link with UTM tags. utm_source, utm_medium, utm_campaign. For analytics and ads." },
    seoIntro: { ru: "UTM-метки позволяют отслеживать эффективность рекламных кампаний в Google Analytics и Яндекс.Метрике. Укажите URL, источник, канал и кампанию.", kz: "UTM белгілері Google Analytics және Яндекс.Метрикада жарнама тиімділігін бақылауға мүмкіндік береді.", en: "UTM tags let you track ad campaign performance in Google Analytics. Add source, medium, campaign to your URL." },
    keywords: { ru: ["utm метки", "utm builder", "utm ссылка", "генератор utm"], kz: ["utm белгілері", "utm генераторы"], en: ["utm builder", "utm tags", "utm generator", "utm links"] },
  },
  "tip-calculator": {
    title: { ru: "Калькулятор чаевых онлайн — рассчитать чаевые и сумму с человека", kz: "Кепілдік калькуляторы онлайн — кепілдік пен адамға шаққандағы соманы есептеу", en: "Tip Calculator Online — Calculate Tip and Split Bill" },
    description: { ru: "Рассчитайте чаевые от суммы счёта и разделите итог на компанию. Укажите процент чаевых (10%, 15%, 20% или свой) и количество человек — калькулятор покажет сумму с чаевыми и долю с каждого. Работает в браузере, без регистрации.", kz: "Есеп сомасынан кепілдікті есептеңіз және нәтижені компания бойынша бөліңіз. Кепілдік пайызын және адамдар санын көрсетіңіз.", en: "Calculate tip from bill amount and split the total among the party. Set tip percentage (10%, 15%, 20% or custom) and number of people — get total with tip and per-person share. Runs in browser, no signup." },
    seoIntro: { ru: "Калькулятор чаевых помогает быстро посчитать, сколько оставить на чай от суммы счёта, и разделить итоговую сумму на несколько человек. Введите сумму счёта, выберите или введите процент чаевых и укажите количество гостей — результат отобразится сразу. Все расчёты выполняются на вашем устройстве.", kz: "Кепілдік калькуляторы есеп сомасынан кепілдік қанша қалдыру керектігін және жалпы соманы бірнеше адамға бөлуді тез есептеуге көмектеседі.", en: "The tip calculator helps you quickly figure how much to leave as tip and split the bill among your party. Enter the bill amount, tip percentage and number of people — see the result instantly. All calculations run on your device." },
    keywords: { ru: ["калькулятор чаевых", "рассчитать чаевые", "чаевые от суммы", "разделить счёт", "калькулятор чаевых онлайн"], kz: ["кепілдік калькуляторы", "кепілдікті есептеу"], en: ["tip calculator", "calculate tip", "split bill", "tip percentage", "tip calculator online"] },
  },
  "qr-generator": {
    title: { ru: "Генератор QR-кода онлайн — создать QR-код по ссылке или тексту", kz: "QR код генераторы онлайн — сілтеме немесе мәтін бойынша QR код жасау", en: "QR Code Generator Online — Create QR Code from Link or Text" },
    description: { ru: "Создайте QR-код по любой ссылке или тексту бесплатно. Введите URL или текст — получите изображение QR для сканирования камерой телефона. Генерация выполняется в браузере, данные никуда не отправляются. Удобно для визиток, меню и рекламы.", kz: "Кез келген сілтеме немесе мәтін бойынша QR кодты тегін жасаңыз. URL немесе мәтінді енгізіңіз.", en: "Create a QR code from any link or text for free. Enter a URL or text — get a QR image to scan with your phone. Generation runs in the browser, no data is sent. Handy for business cards, menus and ads." },
    seoIntro: { ru: "Генератор QR-кодов превращает ссылку или произвольный текст в изображение QR-кода, которое можно сканировать камерой смартфона. Введите URL сайта, контакта или любой текст — изображение формируется мгновенно. Можно сохранить картинку и использовать в печати или на экране. Обработка только на вашем устройстве.", kz: "QR код генераторы сілтемені немесе мәтінді смартфон камерасымен сканерлеуге болатын QR код суретіне айналдырады.", en: "The QR code generator turns a link or any text into a QR code image that you can scan with your phone. Enter a URL or text — the image is generated instantly. Save and use in print or on screen. All processing on your device." },
    keywords: { ru: ["генератор qr кода", "создать qr код", "qr код по ссылке", "qr код онлайн бесплатно"], kz: ["qr код генераторы", "qr код жасау"], en: ["qr code generator", "create qr code", "qr code from url", "free qr generator"] },
  },
};

/** Fallback SEO for tools without explicit TOOL_SEO. Descriptions are full 2–3 sentence paragraphs. */
export function getToolSeoFallback(toolName: string): Partial<ToolSeoMeta> {
  const labels: Record<string, { ru: string; kz: string; en: string }> = {
    "word-counter": { ru: "Счётчик слов", kz: "Сөз санағыш", en: "Word Counter" },
    "case-converter": { ru: "Конвертер регистра", kz: "Регистр түрлендіргіші", en: "Case Converter" },
    translit: { ru: "Транслитерация", kz: "Транслитерация", en: "Transliteration" },
    "fonts-social": { ru: "Шрифты для соцсетей", kz: "Әлеуметтік желілер қаріптері", en: "Social Fonts" },
    "space-cleanup": { ru: "Очистка пробелов", kz: "Бос орындарды тазалау", en: "Space Cleanup" },
    zalgo: { ru: "Zalgo текст", kz: "Zalgo мәтін", en: "Zalgo Text" },
    "lorem-ipsum": { ru: "Lorem Ipsum", kz: "Lorem Ipsum", en: "Lorem Ipsum" },
    "random-number": { ru: "Генератор случайных чисел", kz: "Кездейсоқ сандар генераторы", en: "Random Number Generator" },
    "wheel-fortune": { ru: "Колесо фортуны", kz: "Тағдыр дөңгелегі", en: "Wheel of Fortune" },
    dice: { ru: "Кубики", kz: "Сүйектер", en: "Dice" },
    "password-generator": { ru: "Генератор паролей", kz: "Құпия сөз генераторы", en: "Password Generator" },
    uuid: { ru: "UUID генератор", kz: "UUID генераторы", en: "UUID Generator" },
    "list-shuffler": { ru: "Перемешивание списка", kz: "Тізімді араластыру", en: "List Shuffler" },
    pomodoro: { ru: "Помодоро таймер", kz: "Помодоро таймер", en: "Pomodoro Timer" },
    stopwatch: { ru: "Секундомер", kz: "Секундомер", en: "Stopwatch" },
    "world-time": { ru: "Мировое время", kz: "Дүниежүзілік уақыт", en: "World Time" },
    timers: { ru: "Таймеры", kz: "Таймерлер", en: "Timers" },
    "unix-converter": { ru: "Unix конвертер", kz: "Unix түрлендіргіші", en: "Unix Converter" },
    "image-compress": { ru: "Сжатие изображений", kz: "Суреттерді сығу", en: "Image Compress" },
    "color-picker": { ru: "Color Picker", kz: "Түс таңдағыш", en: "Color Picker" },
    "css-gradients": { ru: "CSS градиенты", kz: "CSS градиенттері", en: "CSS Gradients" },
    base64: { ru: "Base64", kz: "Base64", en: "Base64" },
    "favicon-gen": { ru: "Генератор Favicon", kz: "Favicon генераторы", en: "Favicon Generator" },
    "json-formatter": { ru: "JSON Formatter", kz: "JSON Formatter", en: "JSON Formatter" },
    "jwt-decoder": { ru: "JWT Decoder", kz: "JWT Decoder", en: "JWT Decoder" },
    "html-encode": { ru: "HTML Encode", kz: "HTML Encode", en: "HTML Encode" },
    "url-encode": { ru: "URL Encode", kz: "URL Encode", en: "URL Encode" },
    "regex-tester": { ru: "RegEx тестер", kz: "RegEx тестер", en: "RegEx Tester" },
    "utm-builder": { ru: "UTM метки", kz: "UTM белгілері", en: "UTM Builder" },
    "yt-tags": { ru: "Теги YouTube", kz: "YouTube тегтері", en: "YouTube Tags" },
    "char-limits": { ru: "Лимиты символов", kz: "Таңба шектеулері", en: "Character Limits" },
    "wa-link-generator": { ru: "Ссылка WhatsApp", kz: "WhatsApp сілтемесі", en: "WhatsApp Link" },
    "weight-converter": { ru: "Конвертер веса", kz: "Салмақ түрлендіргіші", en: "Weight Converter" },
    "length-converter": { ru: "Конвертер длины", kz: "Ұзындық түрлендіргіші", en: "Length Converter" },
    "currency-converter": { ru: "Конвертер валют", kz: "Валюта түрлендіргіші", en: "Currency Converter" },
    "roman-numerals": { ru: "Римские цифры", kz: "Рим сандары", en: "Roman Numerals" },
    md5: { ru: "MD5", kz: "MD5", en: "MD5" },
    sha256: { ru: "SHA256", kz: "SHA256", en: "SHA256" },
    "aes-encrypt": { ru: "AES шифрование", kz: "AES шифрлау", en: "AES Encryption" },
    "morse-code": { ru: "Азбука Морзе", kz: "Морзе әліпбиі", en: "Morse Code" },
    "cps-test": { ru: "Тест кликов CPS", kz: "CPS басу тесті", en: "CPS Test" },
    metronome: { ru: "Метроном", kz: "Метроном", en: "Metronome" },
    notepad: { ru: "Блокнот", kz: "Жадыға алма", en: "Notepad" },
    ruler: { ru: "Линейка", kz: "Сызғыш", en: "Ruler" },
    "reverse-text": { ru: "Переворот текста", kz: "Мәтінді аудару", en: "Reverse Text" },
    "random-picker": { ru: "Случайный выбор", kz: "Кездейсоқ таңдау", en: "Random Picker" },
    countdown: { ru: "Обратный отсчёт", kz: "Кері санау", en: "Countdown" },
    "tip-calculator": { ru: "Калькулятор чаевых", kz: "Кепілдік калькуляторы", en: "Tip Calculator" },
    "qr-generator": { ru: "Генератор QR-кода", kz: "QR код генераторы", en: "QR Code Generator" },
    "diff-checker": { ru: "Сравнение текстов", kz: "Мәтіндерді салыстыру", en: "Diff Checker" },
    "volume-converter": { ru: "Конвертер объёма", kz: "Көлем түрлендіргіші", en: "Volume Converter" },
    "color-contrast": { ru: "Контраст цветов", kz: "Түстер контрасты", en: "Color Contrast" },
  };
  const l = labels[toolName] ?? { ru: toolName, kz: toolName, en: toolName };
  return {
    title: { ru: `${l.ru} онлайн — бесплатно и без регистрации`, kz: `${l.kz} онлайн — тегін, тіркеусіз`, en: `${l.en} Online — Free, No Signup` },
    description: {
      ru: `Бесплатный ${l.ru.toLowerCase()} для использования в браузере: все расчёты выполняются на вашем устройстве, личные данные никуда не передаются. Регистрация не требуется — откройте страницу и пользуйтесь.`,
      kz: `Тегін ${l.kz.toLowerCase()} браузерде: барлық есептеулер құрылғыңызда орындалады, деректер жіберілмейді. Тіркеу қажет емес.`,
      en: `Free ${l.en.toLowerCase()} in your browser: all processing runs on your device and no data is sent. No signup — open the page and use it.`,
    },
    seoIntro: {
      ru: `${l.ru} позволяет выполнять нужные операции прямо в браузере. Результат отображается мгновенно, данные не покидают ваше устройство. Инструмент бесплатный и не требует регистрации.`,
      kz: `${l.kz} браузерде қажетті операцияларды орындауға мүмкіндік береді. Нәтиже лезде көрсетіледі, деректер құрылғыдан шықпайды.`,
      en: `${l.en} lets you run the needed operations right in the browser. Results appear instantly and data stays on your device. The tool is free and requires no signup.`,
    },
    keywords: { ru: [l.ru.toLowerCase(), "онлайн", "бесплатно", "без регистрации"], kz: [l.kz.toLowerCase(), "онлайн", "тегін"], en: [l.en.toLowerCase(), "online", "free", "no signup"] },
  };
}
