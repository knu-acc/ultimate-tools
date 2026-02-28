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
  translit: {
    title: { ru: "Транслитерация онлайн — кириллица в латиницу и обратно", kz: "Транслитерация онлайн — кириллицаны латынға және кері", en: "Transliteration Online — Cyrillic to Latin and Back" },
    description: { ru: "Переведите русский текст в латиницу (ГОСТ, ISO) или латиницу в кириллицу. Транслит для имён, загранпаспортов, URL. Бесплатно в браузере.", kz: "Орыс мәтінін латынға немесе кері аударыңыз. Тегін браузерде.", en: "Convert Russian text to Latin (translit) or Latin to Cyrillic. For names, URLs, passports. Free in browser." },
    seoIntro: { ru: "Транслитерация переводит буквы кириллицы в латинские по правилам ГОСТ или ISO. Удобно для заполнения форм, имён в загранпаспорте, URL и никнеймов. Поддержка обратного перевода.", kz: "Транслитерация кириллица әріптерін латын әріптеріне аударады.", en: "Transliteration converts Cyrillic letters to Latin by GOST or ISO rules. Handy for forms, passports, URLs." },
    keywords: { ru: ["транслитерация", "транслит", "кириллица в латиницу", "онлайн транслит"], kz: ["транслитерация", "латынға аудару"], en: ["transliteration", "cyrillic to latin", "translit online"] },
  },
  "wheel-fortune": {
    title: { ru: "Колесо фортуны онлайн — случайный выбор из списка", kz: "Тағдыр дөңгелегі онлайн — тізімнен кездейсоқ таңдау", en: "Wheel of Fortune Online — Random Pick from List" },
    description: { ru: "Крутите колесо фортуны: введите варианты, нажмите «Крутить» — случайный выбор. Для розыгрышей, игр, принятия решений. Бесплатно.", kz: "Тағдыр дөңгелегін айналдырыңыз: нұсқаларды енгізіңіз.", en: "Spin the wheel: enter options, get random pick. For giveaways, games, decisions. Free." },
    seoIntro: { ru: "Колесо фортуны выбирает один вариант из списка случайным образом. Добавьте варианты (каждый с новой строки), крутите — результат показывается анимацией. Идеально для розыгрышей и игр.", kz: "Тағдыр дөңгелегі тізімнен бір нұсқаны кездейсоқ таңдайды.", en: "Wheel of fortune picks one option from your list at random. Add options, spin, get result." },
    keywords: { ru: ["колесо фортуны", "случайный выбор", "розыгрыш онлайн", "крутить колесо"], kz: ["тағдыр дөңгелегі"], en: ["wheel of fortune", "random pick", "spin the wheel"] },
  },
  uuid: {
    title: { ru: "UUID генератор — создать уникальный идентификатор онлайн", kz: "UUID генераторы — бірегей идентификатор жасау", en: "UUID Generator — Create Unique ID Online" },
    description: { ru: "Сгенерируйте UUID v4 (уникальный идентификатор) для баз данных, API, тестов. Один или несколько. Бесплатно, в браузере.", kz: "UUID v4 жасаңыз: деректер базасы, API үшін. Тегін.", en: "Generate UUID v4 for databases, API, tests. One or many. Free in browser." },
    seoIntro: { ru: "UUID (Universally Unique Identifier) — 128-битный идентификатор. Генератор создаёт UUID версии 4, подходящие для баз данных и API. Можно сгенерировать несколько за раз.", kz: "UUID — бірегей идентификатор. Генератор UUID v4 жасайды.", en: "UUID is a 128-bit unique identifier. Generator creates UUID v4 for databases and API." },
    keywords: { ru: ["uuid генератор", "уникальный идентификатор", "uuid v4", "сгенерировать uuid"], kz: ["uuid генераторы"], en: ["uuid generator", "unique identifier", "uuid v4"] },
  },
  "image-compress": {
    title: { ru: "Сжатие изображений онлайн — уменьшить размер JPEG/PNG", kz: "Суреттерді сығу онлайн — JPEG/PNG өлшемін кішірейту", en: "Image Compress Online — Reduce JPEG/PNG Size" },
    description: { ru: "Сожмите фото без потери качества: загрузите изображение, выберите качество, скачайте результат. Работает в браузере, файлы не отправляются.", kz: "Фотоны сығыңыз: суретті жүктеңіз, сапаны таңдаңыз. Браузерде жұмыс істейді.", en: "Compress images in browser: upload, set quality, download. Files stay on your device." },
    seoIntro: { ru: "Инструмент сжимает JPEG-изображения для веб-страниц и соцсетей. Загрузите файл, настройте качество (1–100%), скачайте уменьшенную копию. Обработка локальная.", kz: "Суреттерді веб және әлеуметтік желілер үшін сығады.", en: "Compress JPEG/PNG for web and social. Upload, set quality, download. Local processing." },
    keywords: { ru: ["сжатие изображений", "уменьшить фото", "оптимизация картинок", "jpeg сжатие онлайн"], kz: ["суретті сығу"], en: ["image compress", "reduce image size", "jpeg compressor"] },
  },
  "weight-converter": {
    title: { ru: "Конвертер веса онлайн — кг, граммы, фунты, унции", kz: "Салмақ түрлендіргіш онлайн — кг, грамм, фунт", en: "Weight Converter Online — kg, g, lb, oz" },
    description: { ru: "Переведите вес между килограммами, граммами, фунтами и унциями. Удобно для кулинарии и бытовых расчётов. Бесплатно.", kz: "Салмақты кг, грамм, фунт арасында түрлендіріңіз. Тегін.", en: "Convert between kg, g, lb, oz. For cooking and daily use. Free." },
    seoIntro: { ru: "Конвертер переводит единицы массы: килограммы, граммы, фунты (lb), унции (oz). Введите значение и выберите единицы «из» и «в» — результат мгновенно.", kz: "Салмақ бірліктерін түрлендіреді: кг, г, фунт, унция.", en: "Convert mass units: kg, g, lb, oz. Enter value and units — result instantly." },
    keywords: { ru: ["конвертер веса", "кг в фунты", "граммы в унции", "перевод веса онлайн"], kz: ["салмақ түрлендіргіш"], en: ["weight converter", "kg to lb", "grams to ounces"] },
  },
  "roman-numerals": {
    title: { ru: "Римские цифры онлайн — конвертер в римские и обратно", kz: "Рим сандары онлайн — римге және кері түрлендіргіш", en: "Roman Numerals Online — Convert to and from Roman" },
    description: { ru: "Переведите число в римские цифры (I, V, X, L, C, D, M) или римские в арабские. Для нумерации глав, циферблатов. Бесплатно.", kz: "Санды рим сандарына немесе кері аударыңыз. Тегін.", en: "Convert numbers to Roman numerals or Roman to Arabic. For chapters, clock faces. Free." },
    seoIntro: { ru: "Конвертер переводит арабские числа в римскую запись и обратно. Удобно для оформления текстов, нумерации разделов и обучения.", kz: "Рим сандарына және кері түрлендіреді.", en: "Convert Arabic to Roman numerals and back. For text formatting and learning." },
    keywords: { ru: ["римские цифры", "конвертер римских цифр", "число в римские", "римские цифры онлайн"], kz: ["рим сандары"], en: ["roman numerals", "roman numeral converter", "number to roman"] },
  },
  "morse-code": {
    title: { ru: "Азбука Морзе онлайн — кодировать и декодировать", kz: "Морзе әліпбиі онлайн — кодтау және декодтау", en: "Morse Code Online — Encode and Decode" },
    description: { ru: "Переведите текст в азбуку Морзе (точки и тире) или расшифруйте код. Для радиолюбителей и обучения. Бесплатно в браузере.", kz: "Мәтінді Морзе әліпбиіне аударыңыз немесе кодты шешіңіз. Тегін.", en: "Convert text to Morse code (dots and dashes) or decode. For radio and learning. Free." },
    seoIntro: { ru: "Инструмент кодирует текст в азбуку Морзе и декодирует обратно. Поддержка латиницы, цифр и основных знаков. Удобно для изучения и радиосвязи.", kz: "Мәтінді Морзеге кодтайды және декодтайды.", en: "Encode text to Morse and decode back. Supports letters, numbers, basic symbols." },
    keywords: { ru: ["азбука морзе", "морзе онлайн", "кодировать морзе", "расшифровать морзе"], kz: ["морзе әліпбиі"], en: ["morse code", "morse encoder", "morse decoder"] },
  },
  "reverse-text": {
    title: { ru: "Переворот текста онлайн — написать текст задом наперёд", kz: "Мәтінді аудару онлайн — мәтінді кері жазу", en: "Reverse Text Online — Write Text Backwards" },
    description: { ru: "Переверните текст задом наперёд: посимвольно или по словам. Для соцсетей, ников, оформления. Бесплатно.", kz: "Мәтінді кері аударыңыз. Тегін.", en: "Reverse text character-by-character or by words. For social, nicknames. Free." },
    seoIntro: { ru: "Инструмент переворачивает порядок символов или слов в тексте. Результат можно копировать для постов и подписей.", kz: "Мәтінді таңбалар немесе сөздер бойынша кері аударады.", en: "Reverses character or word order. Copy result for posts and captions." },
    keywords: { ru: ["переворот текста", "текст задом наперёд", "зеркальный текст", "перевернуть слова"], kz: ["мәтінді кері аудару"], en: ["reverse text", "text backwards", "mirror text"] },
  },
  "random-picker": {
    title: { ru: "Случайный выбор онлайн — выбрать один вариант из списка", kz: "Кездейсоқ таңдау онлайн — тізімнен бір нұсқаны таңдау", en: "Random Picker Online — Pick One Option from List" },
    description: { ru: "Введите варианты (каждый с новой строки) — инструмент случайно выберет один. Для розыгрышей, решений, игр. Бесплатно.", kz: "Нұсқаларды енгізіңіз — кездейсоқ бірін таңдайды. Тегін.", en: "Enter options (one per line) — tool picks one at random. For giveaways, decisions. Free." },
    seoIntro: { ru: "Случайный выбор помогает выбрать один вариант из списка без предвзятости. Введите варианты через новую строку или запятую.", kz: "Тізімнен кездейсоқ бір нұсқаны таңдайды.", en: "Picks one option from your list at random. Enter options per line or comma." },
    keywords: { ru: ["случайный выбор", "выбрать из списка", "рандом выбор", "онлайн выбор"], kz: ["кездейсоқ таңдау"], en: ["random picker", "pick from list", "random choice"] },
  },
  countdown: {
    title: { ru: "Обратный отсчёт онлайн — таймер до даты и времени", kz: "Кері санау онлайн — күн мен уақытқа дейін", en: "Countdown Online — Timer to Date and Time" },
    description: { ru: "Узнайте, сколько осталось до события: укажите дату и время — увидите дни, часы, минуты, секунды. Бесплатно.", kz: "Оқиғаға дейін қанша қалғанын біліңіз. Тегін.", en: "See time left until your event: set date and time — get days, hours, minutes, seconds. Free." },
    seoIntro: { ru: "Обратный отсчёт показывает время до указанной даты и времени в формате дни:часы:минуты:секунды. Удобно для событий и дедлайнов.", kz: "Көрсетілген күн мен уақытқа дейінгі уақытты көрсетеді.", en: "Shows time until your date and time. Handy for events and deadlines." },
    keywords: { ru: ["обратный отсчёт", "таймер до даты", "сколько осталось", "countdown онлайн"], kz: ["кері санау"], en: ["countdown", "countdown timer", "time until date"] },
  },
  "diff-checker": {
    title: { ru: "Сравнение текстов онлайн — найти отличия между двумя текстами", kz: "Мәтіндерді салыстыру онлайн — екі мәтін арасындағы айырмашылықтар", en: "Text Diff Checker Online — Find Differences Between Two Texts" },
    description: { ru: "Вставьте два текста — инструмент покажет, какие строки только в первом, какие во втором. Удобно для сравнения версий. Бесплатно.", kz: "Екі мәтінді салыстырыңыз. Тегін.", en: "Paste two texts — see lines only in A or only in B. For comparing versions. Free." },
    seoIntro: { ru: "Сравнение текстов по строкам: показываются номера строк, которые есть только в первом или только во втором тексте. Данные не отправляются.", kz: "Мәтіндерді жолдар бойынша салыстырады.", en: "Compares texts by lines. Shows lines only in A or B. Data stays local." },
    keywords: { ru: ["сравнение текстов", "diff онлайн", "отличия двух текстов", "сравнить текст"], kz: ["мәтіндерді салыстыру"], en: ["text diff", "compare texts", "diff checker"] },
  },
  "color-contrast": {
    title: { ru: "Проверка контраста цветов онлайн — WCAG контрастность", kz: "Түстер контрастын тексеру онлайн — WCAG", en: "Color Contrast Checker Online — WCAG Contrast" },
    description: { ru: "Проверьте контраст текста и фона по WCAG. Узнайте соотношение и соответствие AA/AAA. Для доступности и дизайна. Бесплатно.", kz: "Мәтін мен фон контрастын WCAG бойынша тексеріңіз. Тегін.", en: "Check text and background contrast per WCAG. Get ratio and AA/AAA compliance. Free." },
    seoIntro: { ru: "Инструмент вычисляет контрастность пары цветов (текст и фон) и показывает соответствие критериям WCAG (AA, AAA для обычного и крупного текста).", kz: "Түс контрастын есептейді және WCAG сәйкестілігін көрсетеді.", en: "Calculates contrast ratio and WCAG AA/AAA compliance for text and background." },
    keywords: { ru: ["контраст цветов", "wcag контраст", "проверка контрастности", "доступность цветов"], kz: ["түстер контрасты"], en: ["color contrast", "wcag contrast", "contrast checker"] },
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
