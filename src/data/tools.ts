export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  keywords: string[];
  icon: string;
  groupId: string;
  featured?: boolean;
  implemented?: boolean;
}

export interface ToolGroup {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const toolGroups: ToolGroup[] = [
  { id: 'converters', slug: 'converters', name: 'Конвертеры', description: 'Конвертация единиц измерения, цветов и многого другого', icon: 'SwapHoriz', color: '#6750A4' },
  { id: 'datetime', slug: 'datetime', name: 'Дата и Время', description: 'Часовые пояса, таймеры, календари и расчёты дат', icon: 'Schedule', color: '#7D5260' },
  { id: 'calculators', slug: 'calculators', name: 'Калькуляторы', description: 'Научные, финансовые и специализированные калькуляторы', icon: 'Calculate', color: '#006C4C' },
  { id: 'images', slug: 'images', name: 'Изображения и Графика', description: 'Сжатие, ресайз, фильтры и генерация изображений', icon: 'Image', color: '#984061' },
  { id: 'text', slug: 'text', name: 'Текст и Контент', description: 'Форматирование, подсчёт, конвертация и обработка текста', icon: 'TextFields', color: '#006874' },
  { id: 'generators', slug: 'generators', name: 'Генераторы', description: 'Генерация паролей, UUID, QR-кодов и случайных данных', icon: 'AutoAwesome', color: '#7E5700' },
  { id: 'developers', slug: 'developers', name: 'Для разработчиков', description: 'CSS, JSON, regex, HTTP-коды и утилиты для девелоперов', icon: 'Code', color: '#4A6741' },
  { id: 'math', slug: 'math', name: 'Математика и Статистика', description: 'Уравнения, графики, матрицы и статистический анализ', icon: 'Functions', color: '#5B5F97' },
  { id: 'health', slug: 'health', name: 'Здоровье и Фитнес', description: 'BMI, калории, пульс, сон и расчёты тренировок', icon: 'FitnessCenter', color: '#A93226' },
  { id: 'finance', slug: 'finance', name: 'Финансы', description: 'Бюджет, инвестиции, кредиты и финансовые расчёты', icon: 'AccountBalance', color: '#1A5276' },
  { id: 'security', slug: 'security', name: 'Данные и Безопасность', description: 'Хэши, шифрование, валидация и генерация данных', icon: 'Security', color: '#6C3483' },
  { id: 'entertainment', slug: 'entertainment', name: 'Развлечения и Рандом', description: 'Рандомайзеры, генератор мемов, колесо фортуны', icon: 'Casino', color: '#D35400' },
  { id: 'media', slug: 'media', name: 'Аудио и Видео', description: 'Конвертация, обрезка и обработка медиафайлов', icon: 'MusicNote', color: '#1ABC9C' },
  { id: 'encoding', slug: 'encoding', name: 'Кодирование и Декодирование', description: 'Base64, URL, HTML кодирование и декодирование', icon: 'LockOpen', color: '#2E86C1' },
  { id: 'qrbarcode', slug: 'qrbarcode', name: 'QR и Штрих-коды', description: 'Генерация и чтение QR-кодов и штрих-кодов', icon: 'QrCode2', color: '#17202A' },
  { id: 'color', slug: 'color', name: 'Цвета и Палитры', description: 'Пипетка, палитры, градиенты и преобразование цветов', icon: 'Palette', color: '#E74C3C' },
  { id: 'seo', slug: 'seo', name: 'SEO-инструменты', description: 'Мета-теги, Open Graph, анализ заголовков', icon: 'TravelExplore', color: '#28B463' },
  { id: 'network', slug: 'network', name: 'Сеть и IP', description: 'IP-калькулятор, DNS lookup, проверка портов', icon: 'Lan', color: '#5D6D7E' },
  { id: 'units', slug: 'units', name: 'Единицы измерения', description: 'Длина, вес, объём, температура и другие единицы', icon: 'Straighten', color: '#AF601A' },
  { id: 'productivity', slug: 'productivity', name: 'Продуктивность', description: 'Заметки, ToDo, Pomodoro и другие утилиты', icon: 'TaskAlt', color: '#2471A3' },
];

export const tools: Tool[] = [
  // === КОНВЕРТЕРЫ ===
  { id: 'color-converter', slug: 'color-converter', name: 'Конвертер цветов', description: 'Преобразование цветов между HEX, RGB, CMYK, HSL, HSV форматами', keywords: ['цвет', 'hex', 'rgb', 'cmyk', 'hsl', 'палитра'], icon: 'ColorLens', groupId: 'converters', featured: true, implemented: true },
  { id: 'number-system', slug: 'number-system', name: 'Системы счисления', description: 'Конвертация чисел между двоичной, восьмеричной, десятичной и шестнадцатеричной', keywords: ['двоичная', 'hex', 'oct', 'bin', 'dec', 'система счисления'], icon: 'Transform', groupId: 'converters', implemented: true },
  { id: 'temperature-converter', slug: 'temperature-converter', name: 'Конвертер температуры', description: 'Перевод между Цельсий, Фаренгейт и Кельвин', keywords: ['температура', 'цельсий', 'фаренгейт', 'кельвин', 'градус'], icon: 'Thermostat', groupId: 'converters', implemented: true },
  { id: 'length-converter', slug: 'length-converter', name: 'Конвертер длины', description: 'Перевод метры, футы, дюймы, мили, километры и другие', keywords: ['длина', 'метр', 'фут', 'дюйм', 'миля', 'километр'], icon: 'Straighten', groupId: 'converters', implemented: true },
  { id: 'weight-converter', slug: 'weight-converter', name: 'Конвертер веса', description: 'Перевод килограммы, фунты, унции, тонны и другие', keywords: ['вес', 'масса', 'килограмм', 'фунт', 'унция', 'тонна'], icon: 'FitnessCenter', groupId: 'converters', implemented: true },
  { id: 'volume-converter', slug: 'volume-converter', name: 'Конвертер объёма', description: 'Перевод литры, галлоны, кубометры и другие', keywords: ['объём', 'литр', 'галлон', 'кубометр'], icon: 'LocalDrink', groupId: 'converters', implemented: true },
  { id: 'speed-converter', slug: 'speed-converter', name: 'Конвертер скорости', description: 'Перевод км/ч, миль/ч, м/с, узлы', keywords: ['скорость', 'км/ч', 'миль/ч', 'м/с'], icon: 'Speed', groupId: 'converters', implemented: true },
  { id: 'area-converter', slug: 'area-converter', name: 'Конвертер площади', description: 'Кв. метры, кв. футы, гектары, акры', keywords: ['площадь', 'кв. метр', 'гектар', 'акр', 'сотка'], icon: 'SquareFoot', groupId: 'converters', implemented: true },
  { id: 'energy-converter', slug: 'energy-converter', name: 'Конвертер энергии', description: 'Джоули, калории, киловатт-часы, BTU', keywords: ['энергия', 'джоуль', 'калория', 'квтч'], icon: 'ElectricBolt', groupId: 'converters', implemented: true },
  { id: 'pressure-converter', slug: 'pressure-converter', name: 'Конвертер давления', description: 'Паскали, атмосферы, бары, PSI, мм рт. ст.', keywords: ['давление', 'паскаль', 'атмосфера', 'бар', 'psi'], icon: 'Compress', groupId: 'converters', implemented: true },
  { id: 'data-converter', slug: 'data-converter', name: 'Конвертер данных', description: 'Биты, байты, килобайты, мегабайты, гигабайты, терабайты', keywords: ['данные', 'байт', 'килобайт', 'мегабайт', 'гигабайт'], icon: 'Storage', groupId: 'converters', implemented: true },
  { id: 'angle-converter', slug: 'angle-converter', name: 'Конвертер углов', description: 'Градусы, радианы, грады, минуты, секунды', keywords: ['угол', 'градус', 'радиан', 'град'], icon: 'Architecture', groupId: 'converters', implemented: true },
  { id: 'power-converter', slug: 'power-converter', name: 'Конвертер мощности', description: 'Ватты, лошадиные силы, BTU/ч, кВт', keywords: ['мощность', 'ватт', 'лошадиная сила', 'кВт'], icon: 'Power', groupId: 'converters', implemented: true },
  { id: 'fuel-converter', slug: 'fuel-converter', name: 'Расход топлива', description: 'Л/100км, MPG, км/л — конвертация расхода топлива', keywords: ['топливо', 'расход', 'бензин', 'л/100км', 'mpg'], icon: 'LocalGasStation', groupId: 'converters', implemented: true },
  { id: 'coordinate-converter', slug: 'coordinate-converter', name: 'Конвертер координат', description: 'Широта/долгота в различных форматах: DD, DMS, DDM', keywords: ['координаты', 'широта', 'долгота', 'GPS'], icon: 'MyLocation', groupId: 'converters', implemented: true },

  // === ДАТА И ВРЕМЯ ===
  { id: 'world-clock', slug: 'world-clock', name: 'Мировые часы', description: 'Текущее время в городах мира по часовым поясам', keywords: ['часы', 'время', 'часовой пояс', 'мировое время'], icon: 'Language', groupId: 'datetime', featured: true, implemented: true },
  { id: 'timezone-converter', slug: 'timezone-converter', name: 'Конвертер часовых поясов', description: 'Перевод времени между часовыми поясами', keywords: ['часовой пояс', 'UTC', 'GMT', 'время'], icon: 'PublicOff', groupId: 'datetime', implemented: true },
  { id: 'date-difference', slug: 'date-difference', name: 'Разница дат', description: 'Вычисление разницы между двумя датами в днях, месяцах, годах', keywords: ['дата', 'разница', 'дни', 'возраст'], icon: 'DateRange', groupId: 'datetime', implemented: true },
  { id: 'timer', slug: 'timer', name: 'Таймер и Секундомер', description: 'Обратный отсчёт и секундомер с кругами', keywords: ['таймер', 'секундомер', 'отсчёт', 'время'], icon: 'Timer', groupId: 'datetime', implemented: true },
  { id: 'age-calculator', slug: 'age-calculator', name: 'Калькулятор возраста', description: 'Точный расчёт возраста по дате рождения', keywords: ['возраст', 'дата рождения', 'годы', 'дни'], icon: 'Cake', groupId: 'datetime', implemented: true },
  { id: 'unix-timestamp', slug: 'unix-timestamp', name: 'Unix Timestamp', description: 'Конвертер Unix timestamp в дату и обратно', keywords: ['unix', 'timestamp', 'epoch', 'время'], icon: 'AccessTime', groupId: 'datetime', implemented: true },
  { id: 'calendar', slug: 'calendar', name: 'Календарь', description: 'Интерактивный календарь с праздниками и событиями', keywords: ['календарь', 'праздники', 'события', 'дата'], icon: 'CalendarMonth', groupId: 'datetime', implemented: true },
  { id: 'week-number', slug: 'week-number', name: 'Номер недели', description: 'Определение номера недели по дате и наоборот', keywords: ['неделя', 'номер', 'дата', 'ISO'], icon: 'ViewWeek', groupId: 'datetime', implemented: true },

  // === КАЛЬКУЛЯТОРЫ ===
  { id: 'scientific-calc', slug: 'scientific-calc', name: 'Научный калькулятор', description: 'Полнофункциональный научный калькулятор с историей', keywords: ['калькулятор', 'научный', 'синус', 'косинус', 'логарифм'], icon: 'Calculate', groupId: 'calculators', featured: true, implemented: true },
  { id: 'percentage-calc', slug: 'percentage-calc', name: 'Калькулятор процентов', description: 'Расчёт процентов, наценки, скидки, изменения', keywords: ['процент', 'скидка', 'наценка', 'расчёт'], icon: 'Percent', groupId: 'calculators', implemented: true },
  { id: 'mortgage-calc', slug: 'mortgage-calc', name: 'Ипотечный калькулятор', description: 'Расчёт ежемесячного платежа, переплаты и графика платежей', keywords: ['ипотека', 'кредит', 'платёж', 'банк'], icon: 'House', groupId: 'calculators', implemented: true },
  { id: 'loan-calc', slug: 'loan-calc', name: 'Кредитный калькулятор', description: 'Расчёт потребительского кредита с графиком', keywords: ['кредит', 'займ', 'платёж', 'ставка'], icon: 'CreditCard', groupId: 'calculators', implemented: true },
  { id: 'tax-calc', slug: 'tax-calc', name: 'Налоговый калькулятор', description: 'Расчёт НДФЛ, НДС, налога на ИП', keywords: ['налог', 'НДФЛ', 'НДС', 'ИП', 'расчёт'], icon: 'Receipt', groupId: 'calculators', implemented: true },
  { id: 'tip-calc', slug: 'tip-calc', name: 'Калькулятор чаевых', description: 'Расчёт чаевых и разделение счёта', keywords: ['чаевые', 'счёт', 'ресторан', 'разделить'], icon: 'RestaurantMenu', groupId: 'calculators', implemented: true },
  { id: 'discount-calc', slug: 'discount-calc', name: 'Калькулятор скидок', description: 'Расчёт цены со скидкой и экономии', keywords: ['скидка', 'цена', 'экономия', 'распродажа'], icon: 'LocalOffer', groupId: 'calculators', implemented: true },
  { id: 'compound-interest', slug: 'compound-interest', name: 'Сложный процент', description: 'Расчёт сложного процента с капитализацией', keywords: ['процент', 'сложный', 'капитализация', 'инвестиции'], icon: 'TrendingUp', groupId: 'calculators', implemented: true },
  { id: 'salary-calc', slug: 'salary-calc', name: 'Зарплатный калькулятор', description: 'Расчёт зарплаты с учётом налогов и вычетов', keywords: ['зарплата', 'оклад', 'налоги', 'нетто', 'брутто'], icon: 'Payments', groupId: 'calculators', implemented: true },

  // === ИЗОБРАЖЕНИЯ И ГРАФИКА ===
  { id: 'image-compressor', slug: 'image-compressor', name: 'Сжатие изображений', description: 'Пакетное сжатие фото без потери качества (WebP, AVIF, JPEG)', keywords: ['сжатие', 'фото', 'оптимизация', 'webp', 'jpeg'], icon: 'PhotoSizeSelectLarge', groupId: 'images', featured: true, implemented: true },
  { id: 'image-resizer', slug: 'image-resizer', name: 'Изменение размера', description: 'Ресайз изображений с сохранением пропорций', keywords: ['ресайз', 'размер', 'масштаб', 'пропорции'], icon: 'PhotoSizeSelectActual', groupId: 'images', implemented: true },
  { id: 'image-crop', slug: 'image-crop', name: 'Обрезка изображений', description: 'Кроп фото с настраиваемыми пропорциями', keywords: ['обрезка', 'кроп', 'crop', 'фото'], icon: 'Crop', groupId: 'images', implemented: true },
  { id: 'image-rotate', slug: 'image-rotate', name: 'Поворот и отражение', description: 'Поворот и зеркальное отражение изображений', keywords: ['поворот', 'отражение', 'зеркало', 'rotate'], icon: 'RotateRight', groupId: 'images', implemented: true },
  { id: 'image-filters', slug: 'image-filters', name: 'Фильтры изображений', description: 'Размытие, резкость, яркость, контраст и другие фильтры', keywords: ['фильтр', 'размытие', 'резкость', 'яркость', 'контраст'], icon: 'AutoFixHigh', groupId: 'images', implemented: true },
  { id: 'bg-remover', slug: 'bg-remover', name: 'Удаление фона', description: 'Автоматическое удаление фона с изображений', keywords: ['фон', 'удаление', 'прозрачный', 'вырезать'], icon: 'ContentCut', groupId: 'images', implemented: true },
  { id: 'favicon-generator', slug: 'favicon-generator', name: 'Генератор favicon', description: 'Создание favicon из изображений/текста в PNG, ICO, SVG', keywords: ['favicon', 'иконка', 'сайт', 'ico', 'png'], icon: 'Web', groupId: 'images', implemented: true },
  { id: 'meme-generator', slug: 'meme-generator', name: 'Генератор мемов', description: 'Создание мемов с текстом на изображениях', keywords: ['мем', 'мемы', 'шаблон', 'генератор'], icon: 'SentimentVerySatisfied', groupId: 'images', implemented: true },
  { id: 'image-to-base64', slug: 'image-to-base64', name: 'Изображение в Base64', description: 'Конвертация изображений в Base64 строку и обратно', keywords: ['base64', 'изображение', 'конвертация', 'кодирование'], icon: 'DataObject', groupId: 'images', implemented: true },
  { id: 'screenshot-mockup', slug: 'screenshot-mockup', name: 'Мокап скриншотов', description: 'Красивые рамки для скриншотов: телефон, ноутбук, браузер', keywords: ['мокап', 'скриншот', 'рамка', 'mockup'], icon: 'Devices', groupId: 'images', implemented: true },
  { id: 'pixel-art', slug: 'pixel-art', name: 'Пиксель-арт', description: 'Создание пиксельных рисунков и иконок', keywords: ['пиксель', 'пиксельарт', 'рисование', 'иконка'], icon: 'GridOn', groupId: 'images', implemented: true },
  { id: 'svg-editor', slug: 'svg-editor', name: 'SVG редактор', description: 'Простой редактор SVG с предпросмотром', keywords: ['svg', 'вектор', 'редактор', 'код'], icon: 'Draw', groupId: 'images', implemented: true },

  // === ТЕКСТ И КОНТЕНТ ===
  { id: 'word-counter', slug: 'word-counter', name: 'Счётчик слов', description: 'Подсчёт символов, слов, предложений, абзацев и времени чтения', keywords: ['слова', 'символы', 'подсчёт', 'текст', 'длина'], icon: 'FormatListNumbered', groupId: 'text', featured: true, implemented: true },
  { id: 'case-converter', slug: 'case-converter', name: 'Конвертер регистра', description: 'Upper Case, lower case, Title Case, camelCase, snake_case', keywords: ['регистр', 'uppercase', 'lowercase', 'title', 'camelCase'], icon: 'TextFormat', groupId: 'text', implemented: true },
  { id: 'lorem-ipsum', slug: 'lorem-ipsum', name: 'Lorem Ipsum генератор', description: 'Генерация заглушечного текста для макетов', keywords: ['lorem', 'ipsum', 'заглушка', 'текст', 'placeholder'], icon: 'Article', groupId: 'text', implemented: true },
  { id: 'text-diff', slug: 'text-diff', name: 'Сравнение текстов', description: 'Нахождение различий между двумя текстами', keywords: ['сравнение', 'diff', 'различия', 'тексты'], icon: 'Compare', groupId: 'text', implemented: true },
  { id: 'text-reverse', slug: 'text-reverse', name: 'Переворот текста', description: 'Переворот и зеркальное отражение текста', keywords: ['переворот', 'reverse', 'зеркало', 'текст'], icon: 'FlipToFront', groupId: 'text', implemented: true },
  { id: 'remove-duplicates', slug: 'remove-duplicates', name: 'Удаление дубликатов', description: 'Удаление дублирующихся строк из текста', keywords: ['дубликаты', 'удаление', 'строки', 'уникальные'], icon: 'PlaylistRemove', groupId: 'text', implemented: true },
  { id: 'text-sort', slug: 'text-sort', name: 'Сортировка строк', description: 'Алфавитная и числовая сортировка строк текста', keywords: ['сортировка', 'строки', 'алфавит', 'порядок'], icon: 'SortByAlpha', groupId: 'text', implemented: true },
  { id: 'markdown-preview', slug: 'markdown-preview', name: 'Markdown превью', description: 'Редактор и просмотрщик Markdown с live-preview', keywords: ['markdown', 'md', 'превью', 'редактор'], icon: 'Edit', groupId: 'text', implemented: true },
  { id: 'text-replace', slug: 'text-replace', name: 'Найти и заменить', description: 'Массовая замена текста с поддержкой регулярных выражений', keywords: ['замена', 'найти', 'replace', 'regex'], icon: 'FindReplace', groupId: 'text', implemented: true },
  { id: 'transliteration', slug: 'transliteration', name: 'Транслитерация', description: 'Конвертация кириллицы в латиницу и обратно', keywords: ['транслитерация', 'кириллица', 'латиница', 'транслит'], icon: 'Translate', groupId: 'text', implemented: true },
  { id: 'text-to-speech', slug: 'text-to-speech', name: 'Текст в речь', description: 'Озвучивание текста с помощью Web Speech API', keywords: ['речь', 'озвучка', 'tts', 'голос'], icon: 'RecordVoiceOver', groupId: 'text', implemented: true },
  { id: 'string-extractor', slug: 'string-extractor', name: 'Извлечение данных', description: 'Извлечение email, URL, телефонов из текста', keywords: ['извлечение', 'email', 'url', 'телефон', 'парсинг'], icon: 'ManageSearch', groupId: 'text', implemented: true },

  // === ГЕНЕРАТОРЫ ===
  { id: 'password-generator', slug: 'password-generator', name: 'Генератор паролей', description: 'Создание надёжных паролей с настройкой сложности', keywords: ['пароль', 'генератор', 'надёжный', 'безопасность'], icon: 'Password', groupId: 'generators', featured: true, implemented: true },
  { id: 'uuid-generator', slug: 'uuid-generator', name: 'Генератор UUID', description: 'Генерация UUID v4 и GUID', keywords: ['uuid', 'guid', 'уникальный', 'идентификатор'], icon: 'Fingerprint', groupId: 'generators', implemented: true },
  { id: 'hash-generator', slug: 'hash-generator', name: 'Генератор хэшей', description: 'MD5, SHA-1, SHA-256, SHA-512 хэширование текста', keywords: ['хэш', 'md5', 'sha', 'контрольная сумма'], icon: 'Tag', groupId: 'generators', implemented: true },
  { id: 'qr-generator', slug: 'qr-generator', name: 'Генератор QR-кодов', description: 'Создание QR-кодов с настройкой размера и стиля', keywords: ['qr', 'код', 'генератор', 'ссылка'], icon: 'QrCode', groupId: 'generators', featured: true, implemented: true },
  { id: 'barcode-generator', slug: 'barcode-generator', name: 'Генератор штрих-кодов', description: 'Генерация штрих-кодов EAN, UPC, Code128', keywords: ['штрих-код', 'barcode', 'ean', 'upc'], icon: 'ViewColumn', groupId: 'generators', implemented: true },
  { id: 'avatar-generator', slug: 'avatar-generator', name: 'Генератор аватаров', description: 'Создание уникальных identicon аватаров', keywords: ['аватар', 'identicon', 'профиль', 'генератор'], icon: 'Face', groupId: 'generators', implemented: true },
  { id: 'gradient-generator', slug: 'gradient-generator', name: 'Генератор градиентов', description: 'Создание CSS градиентов с экспортом кода', keywords: ['градиент', 'css', 'цвета', 'фон'], icon: 'Gradient', groupId: 'generators', implemented: true },
  { id: 'palette-generator', slug: 'palette-generator', name: 'Генератор палитр', description: 'Создание гармоничных цветовых палитр', keywords: ['палитра', 'цвета', 'гармония', 'дизайн'], icon: 'Palette', groupId: 'generators', implemented: true },
  { id: 'random-name', slug: 'random-name', name: 'Случайные имена', description: 'Генерация случайных имён, фамилий, адресов', keywords: ['имя', 'фамилия', 'адрес', 'случайный', 'фейк'], icon: 'Person', groupId: 'generators', implemented: true },
  { id: 'random-number', slug: 'random-number', name: 'Случайное число', description: 'Генерация случайных чисел в диапазоне', keywords: ['число', 'случайное', 'рандом', 'диапазон'], icon: 'Casino', groupId: 'generators', implemented: true },
  { id: 'mockdata-generator', slug: 'mockdata-generator', name: 'Генератор тестовых данных', description: 'JSON/CSV с фейковыми данными для тестирования', keywords: ['мок', 'данные', 'json', 'csv', 'тестовые'], icon: 'DataArray', groupId: 'generators', implemented: true },
  { id: 'slug-generator', slug: 'slug-generator', name: 'Генератор слагов', description: 'Создание URL-friendly слагов из текста', keywords: ['slug', 'url', 'транслитерация', 'ссылка'], icon: 'Link', groupId: 'generators', implemented: true },

  // === ДЛЯ РАЗРАБОТЧИКОВ ===
  { id: 'json-formatter', slug: 'json-formatter', name: 'JSON Formatter', description: 'Форматирование, минификация и валидация JSON', keywords: ['json', 'форматирование', 'валидация', 'prettify'], icon: 'DataObject', groupId: 'developers', featured: true, implemented: true },
  { id: 'regex-tester', slug: 'regex-tester', name: 'Regex тестер', description: 'Тестирование регулярных выражений с подсветкой совпадений', keywords: ['regex', 'регулярное', 'выражение', 'тест', 'паттерн'], icon: 'ManageSearch', groupId: 'developers', implemented: true },
  { id: 'css-minifier', slug: 'css-minifier', name: 'CSS Minifier', description: 'Минификация и форматирование CSS кода', keywords: ['css', 'минификация', 'сжатие', 'оптимизация'], icon: 'Css', groupId: 'developers', implemented: true },
  { id: 'js-beautifier', slug: 'js-beautifier', name: 'JS Beautifier', description: 'Форматирование и минификация JavaScript', keywords: ['javascript', 'js', 'формат', 'beautify'], icon: 'Javascript', groupId: 'developers', implemented: true },
  { id: 'html-formatter', slug: 'html-formatter', name: 'HTML Formatter', description: 'Форматирование и валидация HTML кода', keywords: ['html', 'формат', 'валидация', 'prettify'], icon: 'Html', groupId: 'developers', implemented: true },
  { id: 'sql-formatter', slug: 'sql-formatter', name: 'SQL Formatter', description: 'Форматирование SQL запросов', keywords: ['sql', 'формат', 'запрос', 'база данных'], icon: 'TableView', groupId: 'developers', implemented: true },
  { id: 'cron-generator', slug: 'cron-generator', name: 'Cron генератор', description: 'Визуальный генератор cron выражений', keywords: ['cron', 'расписание', 'задача', 'планировщик'], icon: 'Schedule', groupId: 'developers', implemented: true },
  { id: 'http-status', slug: 'http-status', name: 'HTTP статус-коды', description: 'Справочник HTTP статус-кодов с описаниями', keywords: ['http', 'статус', 'код', '404', '500', 'api'], icon: 'Http', groupId: 'developers', implemented: true },
  { id: 'mime-types', slug: 'mime-types', name: 'MIME Types', description: 'Справочник MIME типов по расширениям файлов', keywords: ['mime', 'тип', 'файл', 'расширение', 'content-type'], icon: 'InsertDriveFile', groupId: 'developers', implemented: true },
  { id: 'flexbox-playground', slug: 'flexbox-playground', name: 'Flexbox Playground', description: 'Интерактивная площадка для изучения CSS Flexbox', keywords: ['flexbox', 'css', 'layout', 'flex'], icon: 'ViewQuilt', groupId: 'developers', implemented: true },
  { id: 'grid-playground', slug: 'grid-playground', name: 'CSS Grid Playground', description: 'Интерактивная площадка для CSS Grid Layout', keywords: ['grid', 'css', 'layout', 'сетка'], icon: 'GridView', groupId: 'developers', implemented: true },
  { id: 'diff-checker', slug: 'diff-checker', name: 'Diff Checker', description: 'Сравнение двух фрагментов кода с подсветкой различий', keywords: ['diff', 'сравнение', 'код', 'различия'], icon: 'Compare', groupId: 'developers', implemented: true },
  { id: 'jwt-decoder', slug: 'jwt-decoder', name: 'JWT Decoder', description: 'Декодирование и проверка JWT токенов', keywords: ['jwt', 'token', 'декодер', 'авторизация'], icon: 'VpnKey', groupId: 'developers', implemented: true },
  { id: 'yaml-json', slug: 'yaml-json', name: 'YAML ↔ JSON', description: 'Конвертация между YAML и JSON форматами', keywords: ['yaml', 'json', 'конвертер', 'конфиг'], icon: 'SwapVert', groupId: 'developers', implemented: true },
  { id: 'xml-formatter', slug: 'xml-formatter', name: 'XML Formatter', description: 'Форматирование и валидация XML', keywords: ['xml', 'формат', 'валидация'], icon: 'Code', groupId: 'developers', implemented: true },
  { id: 'color-picker', slug: 'color-picker', name: 'Color Picker', description: 'Выбор цвета с пипеткой и копированием значений', keywords: ['цвет', 'пипетка', 'picker', 'выбор'], icon: 'Colorize', groupId: 'developers', implemented: true },
  { id: 'github-readme', slug: 'github-readme', name: 'GitHub README генератор', description: 'Генератор красивых README для GitHub проектов', keywords: ['github', 'readme', 'markdown', 'проект'], icon: 'GitHub', groupId: 'developers', implemented: true },

  // === МАТЕМАТИКА И СТАТИСТИКА ===
  { id: 'equation-solver', slug: 'equation-solver', name: 'Решатель уравнений', description: 'Решение линейных и квадратных уравнений', keywords: ['уравнение', 'решение', 'корни', 'квадратное'], icon: 'Functions', groupId: 'math', featured: true, implemented: true },
  { id: 'matrix-calc', slug: 'matrix-calc', name: 'Калькулятор матриц', description: 'Сложение, умножение, определитель, обратная матрица', keywords: ['матрица', 'определитель', 'умножение', 'линейная алгебра'], icon: 'GridOn', groupId: 'math', implemented: true },
  { id: 'statistics-calc', slug: 'statistics-calc', name: 'Статистика', description: 'Среднее, медиана, мода, стандартное отклонение', keywords: ['статистика', 'среднее', 'медиана', 'мода', 'отклонение'], icon: 'BarChart', groupId: 'math', implemented: true },
  { id: 'factorial-calc', slug: 'factorial-calc', name: 'Факториал и Комбинаторика', description: 'Факториал, перестановки, сочетания', keywords: ['факториал', 'комбинаторика', 'перестановки', 'сочетания'], icon: 'AutoGraph', groupId: 'math', implemented: true },
  { id: 'roman-numerals', slug: 'roman-numerals', name: 'Римские числа', description: 'Конвертер арабских чисел в римские и обратно', keywords: ['римские', 'числа', 'конвертер', 'IV', 'XII'], icon: 'Pin', groupId: 'math', implemented: true },
  { id: 'fraction-calc', slug: 'fraction-calc', name: 'Калькулятор дробей', description: 'Операции с обычными и десятичными дробями', keywords: ['дробь', 'числитель', 'знаменатель', 'десятичная'], icon: 'Looks3', groupId: 'math', implemented: true },
  { id: 'graph-plotter', slug: 'graph-plotter', name: 'Построитель графиков', description: 'Визуализация математических функций', keywords: ['график', 'функция', 'визуализация', 'plotly'], icon: 'ShowChart', groupId: 'math', implemented: true },
  { id: 'gcd-lcm', slug: 'gcd-lcm', name: 'НОД и НОК', description: 'Наибольший общий делитель и наименьшее общее кратное', keywords: ['НОД', 'НОК', 'делитель', 'кратное'], icon: 'CallSplit', groupId: 'math', implemented: true },
  { id: 'prime-checker', slug: 'prime-checker', name: 'Проверка простых чисел', description: 'Проверка числа на простоту и разложение на множители', keywords: ['простое', 'число', 'множители', 'факторизация'], icon: 'FilterAlt', groupId: 'math', implemented: true },
  { id: 'proportion-calc', slug: 'proportion-calc', name: 'Калькулятор пропорций', description: 'Решение пропорций и золотое сечение', keywords: ['пропорция', 'золотое сечение', 'соотношение'], icon: 'Balance', groupId: 'math', implemented: true },

  // === ЗДОРОВЬЕ И ФИТНЕС ===
  { id: 'bmi-calc', slug: 'bmi-calc', name: 'Калькулятор BMI', description: 'Расчёт индекса массы тела и рекомендации', keywords: ['bmi', 'вес', 'рост', 'индекс массы тела'], icon: 'MonitorWeight', groupId: 'health' , implemented: true, featured: true },
  { id: 'calorie-calc', slug: 'calorie-calc', name: 'Калькулятор калорий', description: 'Расчёт суточной нормы калорий BMR/TDEE', keywords: ['калории', 'bmr', 'tdee', 'питание', 'диета'], icon: 'LocalDining', groupId: 'health', implemented: true },
  { id: 'ideal-weight', slug: 'ideal-weight', name: 'Идеальный вес', description: 'Расчёт идеального веса по разным формулам', keywords: ['вес', 'идеальный', 'норма', 'формула'], icon: 'Scale', groupId: 'health', implemented: true },
  { id: 'water-intake', slug: 'water-intake', name: 'Норма воды', description: 'Расчёт суточной нормы потребления воды', keywords: ['вода', 'норма', 'питьё', 'здоровье'], icon: 'WaterDrop', groupId: 'health', implemented: true },
  { id: 'sleep-calc', slug: 'sleep-calc', name: 'Калькулятор сна', description: 'Оптимальное время сна по циклам', keywords: ['сон', 'циклы', 'пробуждение', 'здоровье'], icon: 'Bedtime', groupId: 'health', implemented: true },
  { id: 'heart-rate-zone', slug: 'heart-rate-zone', name: 'Зоны пульса', description: 'Расчёт зон пульса для тренировок', keywords: ['пульс', 'зоны', 'тренировка', 'кардио'], icon: 'MonitorHeart', groupId: 'health', implemented: true },
  { id: 'body-fat', slug: 'body-fat', name: 'Процент жира', description: 'Расчёт процента жира в организме', keywords: ['жир', 'процент', 'тело', 'состав'], icon: 'Accessibility', groupId: 'health', implemented: true },
  { id: 'pregnancy-calc', slug: 'pregnancy-calc', name: 'Калькулятор беременности', description: 'Расчёт даты родов и недели беременности', keywords: ['беременность', 'роды', 'дата', 'неделя', 'срок'], icon: 'ChildFriendly', groupId: 'health', implemented: true },

  // === ФИНАНСЫ ===
  { id: 'budget-planner', slug: 'budget-planner', name: 'Планировщик бюджета', description: 'Планирование доходов и расходов', keywords: ['бюджет', 'расходы', 'доходы', 'планирование'], icon: 'AccountBalanceWallet', groupId: 'finance', implemented: true },
  { id: 'investment-calc', slug: 'investment-calc', name: 'Инвестиционный калькулятор', description: 'Расчёт доходности инвестиций', keywords: ['инвестиции', 'доходность', 'прибыль', 'ROI'], icon: 'Insights', groupId: 'finance', implemented: true },
  { id: 'inflation-calc', slug: 'inflation-calc', name: 'Калькулятор инфляции', description: 'Расчёт обесценивания денег со временем', keywords: ['инфляция', 'деньги', 'обесценивание', 'покупательная способность'], icon: 'TrendingDown', groupId: 'finance', implemented: true },
  { id: 'retirement-calc', slug: 'retirement-calc', name: 'Пенсионный калькулятор', description: 'Расчёт накоплений к пенсии', keywords: ['пенсия', 'накопления', 'пенсионный', 'фонд'], icon: 'ElderlyWoman', groupId: 'finance', implemented: true },
  { id: 'deposit-calc', slug: 'deposit-calc', name: 'Депозитный калькулятор', description: 'Расчёт доходности банковского вклада', keywords: ['депозит', 'вклад', 'проценты', 'банк'], icon: 'Savings', groupId: 'finance', implemented: true },

  // === ДАННЫЕ И БЕЗОПАСНОСТЬ ===
  { id: 'password-strength', slug: 'password-strength', name: 'Надёжность пароля', description: 'Проверка надёжности пароля и рекомендации', keywords: ['пароль', 'надёжность', 'безопасность', 'взлом'], icon: 'Shield', groupId: 'security', implemented: true },
  { id: 'email-validator', slug: 'email-validator', name: 'Валидатор Email', description: 'Проверка корректности email адресов', keywords: ['email', 'валидация', 'проверка', 'почта'], icon: 'MarkEmailRead', groupId: 'security', implemented: true },
  { id: 'url-validator', slug: 'url-validator', name: 'Валидатор URL', description: 'Проверка и парсинг URL адресов', keywords: ['url', 'ссылка', 'валидация', 'проверка'], icon: 'LinkOff', groupId: 'security', implemented: true },
  { id: 'ip-validator', slug: 'ip-validator', name: 'Валидатор IP', description: 'Проверка IPv4 и IPv6 адресов', keywords: ['ip', 'адрес', 'ipv4', 'ipv6', 'валидация'], icon: 'Router', groupId: 'security', implemented: true },
  { id: 'phone-validator', slug: 'phone-validator', name: 'Валидатор телефонов', description: 'Проверка и форматирование телефонных номеров', keywords: ['телефон', 'номер', 'валидация', 'формат'], icon: 'PhoneAndroid', groupId: 'security', implemented: true },
  { id: 'json-data-gen', slug: 'json-data-gen', name: 'Генератор JSON данных', description: 'Создание тестовых JSON и CSV данных', keywords: ['json', 'csv', 'данные', 'тестовые', 'генератор'], icon: 'DataArray', groupId: 'security', implemented: true },
  { id: 'checksum-calc', slug: 'checksum-calc', name: 'Контрольная сумма', description: 'Проверка контрольных сумм файлов', keywords: ['контрольная сумма', 'checksum', 'файл', 'проверка'], icon: 'Verified', groupId: 'security', implemented: true },

  // === РАЗВЛЕЧЕНИЯ И РАНДОМ ===
  { id: 'wheel-spinner', slug: 'wheel-spinner', name: 'Колесо фортуны', description: 'Рандомный выбор с анимированным колесом', keywords: ['колесо', 'фортуна', 'рандом', 'выбор', 'спиннер'], icon: 'Cyclone', groupId: 'entertainment', featured: true, implemented: true },
  { id: 'dice-roller', slug: 'dice-roller', name: 'Бросок кубиков', description: 'Виртуальные кубики D4, D6, D8, D10, D12, D20', keywords: ['кубик', 'дайс', 'бросок', 'D6', 'D20'], icon: 'Casino', groupId: 'entertainment', implemented: true },
  { id: 'coin-flip', slug: 'coin-flip', name: 'Подбросить монету', description: 'Орёл или решка с анимацией', keywords: ['монета', 'орёл', 'решка', 'подбросить'], icon: 'Toll', groupId: 'entertainment', implemented: true },
  { id: 'random-picker', slug: 'random-picker', name: 'Случайный выбор', description: 'Выбор случайного элемента из списка', keywords: ['случайный', 'выбор', 'список', 'рандом'], icon: 'Shuffle', groupId: 'entertainment', implemented: true },
  { id: 'decision-maker', slug: 'decision-maker', name: 'Помощник решений', description: 'Помощь в принятии решения: да/нет, из списка', keywords: ['решение', 'выбор', 'да', 'нет', 'помощник'], icon: 'Psychology', groupId: 'entertainment', implemented: true },
  { id: 'team-generator', slug: 'team-generator', name: 'Генератор команд', description: 'Случайное разделение на команды', keywords: ['команды', 'группы', 'разделение', 'игра'], icon: 'Groups', groupId: 'entertainment', implemented: true },
  { id: 'countdown', slug: 'countdown', name: 'Обратный отсчёт', description: 'Красивый обратный отсчёт до события', keywords: ['отсчёт', 'событие', 'таймер', 'дата'], icon: 'HourglassEmpty', groupId: 'entertainment', implemented: true },
  { id: 'random-color', slug: 'random-color', name: 'Случайный цвет', description: 'Генерация случайных красивых цветов', keywords: ['цвет', 'случайный', 'генерация', 'палитра'], icon: 'Colorize', groupId: 'entertainment', implemented: true },

  // === КОДИРОВАНИЕ И ДЕКОДИРОВАНИЕ ===
  { id: 'base64-encoder', slug: 'base64-encoder', name: 'Base64 кодирование', description: 'Кодирование и декодирование Base64 текста и файлов', keywords: ['base64', 'кодирование', 'декодирование', 'encode'], icon: 'Lock', groupId: 'encoding', implemented: true },
  { id: 'url-encoder', slug: 'url-encoder', name: 'URL кодирование', description: 'Кодирование и декодирование URL (percent-encoding)', keywords: ['url', 'encode', 'decode', 'кодирование', 'percent'], icon: 'Link', groupId: 'encoding', implemented: true },
  { id: 'html-encoder', slug: 'html-encoder', name: 'HTML кодирование', description: 'Экранирование HTML-сущностей', keywords: ['html', 'entities', 'экранирование', 'encode'], icon: 'Code', groupId: 'encoding', implemented: true },
  { id: 'morse-code', slug: 'morse-code', name: 'Азбука Морзе', description: 'Конвертация текста в код Морзе и обратно', keywords: ['морзе', 'код', 'точки', 'тире', 'телеграф'], icon: 'MoreHoriz', groupId: 'encoding', implemented: true },
  { id: 'binary-text', slug: 'binary-text', name: 'Бинарный текст', description: 'Конвертация текста в двоичный код', keywords: ['бинарный', 'двоичный', 'текст', 'конвертация'], icon: 'Memory', groupId: 'encoding', implemented: true },
  { id: 'unicode-lookup', slug: 'unicode-lookup', name: 'Unicode справочник', description: 'Поиск и просмотр символов Unicode', keywords: ['unicode', 'символ', 'эмодзи', 'юникод'], icon: 'EmojiSymbols', groupId: 'encoding', implemented: true },

  // === QR И ШТРИХ-КОДЫ ===
  { id: 'qr-code-gen', slug: 'qr-code-gen', name: 'QR-код генератор', description: 'Создание QR-кодов для URL, текста, Wi-Fi, визиток', keywords: ['qr', 'код', 'генератор', 'wifi', 'визитка'], icon: 'QrCode', groupId: 'qrbarcode', implemented: true },
  { id: 'barcode-gen', slug: 'barcode-gen', name: 'Штрих-код генератор', description: 'EAN-13, UPC-A, Code128, Code39, ITF', keywords: ['штрих-код', 'barcode', 'ean', 'upc', 'code128'], icon: 'ViewColumn', groupId: 'qrbarcode', implemented: true },

  // === ЦВЕТА И ПАЛИТРЫ ===
  { id: 'color-wheel', slug: 'color-wheel', name: 'Цветовое колесо', description: 'Интерактивное цветовое колесо для подбора цветов', keywords: ['цвет', 'колесо', 'гармония', 'подбор'], icon: 'Palette', groupId: 'color', implemented: true },
  { id: 'contrast-checker', slug: 'contrast-checker', name: 'Проверка контраста', description: 'WCAG проверка контраста текст/фон', keywords: ['контраст', 'wcag', 'доступность', 'a11y'], icon: 'Contrast', groupId: 'color', implemented: true },
  { id: 'color-blender', slug: 'color-blender', name: 'Смешивание цветов', description: 'Смешивание двух цветов с указанием пропорции', keywords: ['смешивание', 'цвета', 'blend', 'микс'], icon: 'BlurOn', groupId: 'color', implemented: true },
  { id: 'image-colors', slug: 'image-colors', name: 'Цвета из изображения', description: 'Извлечение цветовой палитры из фото', keywords: ['палитра', 'фото', 'извлечение', 'цвет', 'изображение'], icon: 'PhotoCamera', groupId: 'color', implemented: true },
  { id: 'tailwind-colors', slug: 'tailwind-colors', name: 'Tailwind CSS цвета', description: 'Справочник цветов Tailwind CSS', keywords: ['tailwind', 'css', 'цвета', 'справочник'], icon: 'Style', groupId: 'color', implemented: true },
  { id: 'material-colors', slug: 'material-colors', name: 'Material Design цвета', description: 'Справочник цветов Material Design', keywords: ['material', 'design', 'цвета', 'google'], icon: 'DesignServices', groupId: 'color', implemented: true },

  // === SEO ИНСТРУМЕНТЫ ===
  { id: 'meta-generator', slug: 'meta-generator', name: 'Генератор мета-тегов', description: 'Создание мета-тегов для SEO', keywords: ['мета', 'теги', 'seo', 'title', 'description'], icon: 'TravelExplore', groupId: 'seo', implemented: true },
  { id: 'og-preview', slug: 'og-preview', name: 'Open Graph Preview', description: 'Предпросмотр Open Graph и Twitter карточек', keywords: ['og', 'open graph', 'twitter', 'социальные сети', 'preview'], icon: 'Share', groupId: 'seo', implemented: true },
  { id: 'robots-generator', slug: 'robots-generator', name: 'Robots.txt генератор', description: 'Создание файла robots.txt для поисковиков', keywords: ['robots', 'txt', 'seo', 'поисковики', 'краулер'], icon: 'SmartToy', groupId: 'seo', implemented: true },
  { id: 'sitemap-generator', slug: 'sitemap-generator', name: 'Sitemap генератор', description: 'Создание XML sitemap для сайта', keywords: ['sitemap', 'xml', 'seo', 'карта сайта'], icon: 'AccountTree', groupId: 'seo', implemented: true },
  { id: 'heading-checker', slug: 'heading-checker', name: 'Проверка заголовков', description: 'Анализ H1-H6 структуры HTML-страницы', keywords: ['заголовки', 'h1', 'h2', 'структура', 'seo'], icon: 'Title', groupId: 'seo', implemented: true },
  { id: 'keyword-density', slug: 'keyword-density', name: 'Плотность ключевых слов', description: 'Анализ частотности слов в тексте', keywords: ['ключевые слова', 'плотность', 'частота', 'seo'], icon: 'Analytics', groupId: 'seo', implemented: true },

  // === СЕТЬ И IP ===
  { id: 'ip-calculator', slug: 'ip-calculator', name: 'IP калькулятор', description: 'Расчёт подсетей, масок, CIDR', keywords: ['ip', 'подсеть', 'маска', 'cidr', 'расчёт'], icon: 'Lan', groupId: 'network', implemented: true },
  { id: 'subnet-calc', slug: 'subnet-calc', name: 'Калькулятор подсетей', description: 'Подробный расчёт подсетей IPv4', keywords: ['подсеть', 'subnet', 'маска', 'хосты'], icon: 'Hub', groupId: 'network', implemented: true },
  { id: 'mac-lookup', slug: 'mac-lookup', name: 'MAC Address Lookup', description: 'Определение производителя по MAC-адресу', keywords: ['mac', 'адрес', 'производитель', 'сетевая карта'], icon: 'DeviceHub', groupId: 'network', implemented: true },
  { id: 'port-list', slug: 'port-list', name: 'Список портов', description: 'Справочник стандартных сетевых портов', keywords: ['порт', 'tcp', 'udp', 'сеть', 'список'], icon: 'SettingsEthernet', groupId: 'network', implemented: true },
  { id: 'user-agent-parser', slug: 'user-agent-parser', name: 'User-Agent Parser', description: 'Парсинг и анализ строки User-Agent', keywords: ['user-agent', 'браузер', 'парсинг', 'анализ'], icon: 'DevicesOther', groupId: 'network', implemented: true },

  // === ЕДИНИЦЫ ИЗМЕРЕНИЯ ===
  { id: 'cooking-converter', slug: 'cooking-converter', name: 'Кулинарный конвертер', description: 'Чашки, столовые ложки, мл, граммы для рецептов', keywords: ['кулинарный', 'рецепт', 'чашки', 'ложки', 'граммы'], icon: 'Kitchen', groupId: 'units', implemented: true },
  { id: 'shoe-size', slug: 'shoe-size', name: 'Размеры обуви', description: 'Конвертер размеров обуви EU/US/UK/JP', keywords: ['обувь', 'размер', 'eu', 'us', 'uk'], icon: 'IceSkating', groupId: 'units', implemented: true },
  { id: 'clothing-size', slug: 'clothing-size', name: 'Размеры одежды', description: 'Конвертер размеров одежды EU/US/UK', keywords: ['одежда', 'размер', 'eu', 'us', 'uk', 'xl'], icon: 'Checkroom', groupId: 'units', implemented: true },
  { id: 'screen-resolution', slug: 'screen-resolution', name: 'Разрешения экранов', description: 'Справочник разрешений экранов и PPI', keywords: ['разрешение', 'экран', 'ppi', 'dpi', 'пиксели'], icon: 'Monitor', groupId: 'units', implemented: true },
  { id: 'paper-size', slug: 'paper-size', name: 'Форматы бумаги', description: 'Справочник форматов A0-A10, Letter, Legal', keywords: ['бумага', 'формат', 'a4', 'a3', 'letter'], icon: 'Description', groupId: 'units', implemented: true },

  // === ПРОДУКТИВНОСТЬ ===
  { id: 'pomodoro', slug: 'pomodoro', name: 'Помодоро таймер', description: 'Таймер Помодоро для продуктивной работы', keywords: ['помодоро', 'таймер', 'продуктивность', 'работа'], icon: 'AvTimer', groupId: 'productivity', implemented: true },
  { id: 'todo-list', slug: 'todo-list', name: 'Список задач', description: 'Простой ToDo лист с localStorage', keywords: ['задачи', 'todo', 'список', 'дела'], icon: 'Checklist', groupId: 'productivity', implemented: true },
  { id: 'notes', slug: 'notes', name: 'Заметки', description: 'Простой блокнот с сохранением в браузере', keywords: ['заметки', 'блокнот', 'записи', 'текст'], icon: 'StickyNote2', groupId: 'productivity', implemented: true },
  { id: 'reading-time', slug: 'reading-time', name: 'Время чтения', description: 'Расчёт времени чтения текста', keywords: ['чтение', 'время', 'скорость', 'минуты'], icon: 'MenuBook', groupId: 'productivity', implemented: true },
  { id: 'typing-speed', slug: 'typing-speed', name: 'Скорость печати', description: 'Тест скорости печати на клавиатуре', keywords: ['печать', 'скорость', 'клавиатура', 'тест', 'WPM'], icon: 'Keyboard', groupId: 'productivity', implemented: true },

  // === АУДИО И ВИДЕО ===
  { id: 'metronome', slug: 'metronome', name: 'Метроном', description: 'Онлайн-метроном для музыкантов', keywords: ['метроном', 'ритм', 'темп', 'bpm', 'музыка'], icon: 'GraphicEq', groupId: 'media', implemented: true },
  { id: 'tone-generator', slug: 'tone-generator', name: 'Генератор тонов', description: 'Генерация звуковых тонов заданной частоты', keywords: ['тон', 'частота', 'звук', 'генератор', 'герц'], icon: 'MusicNote', groupId: 'media', implemented: true },
  { id: 'noise-generator', slug: 'noise-generator', name: 'Генератор шума', description: 'Белый, розовый, коричневый шум для концентрации', keywords: ['шум', 'белый', 'розовый', 'коричневый', 'концентрация'], icon: 'Waves', groupId: 'media', implemented: true },
  { id: 'video-aspect', slug: 'video-aspect', name: 'Калькулятор пропорций видео', description: 'Расчёт соотношения сторон видео и разрешения', keywords: ['видео', 'пропорции', 'соотношение', 'разрешение', '16:9'], icon: 'AspectRatio', groupId: 'media', implemented: true },
];

// Получение группы по slug
export function getGroupBySlug(slug: string): ToolGroup | undefined {
  return toolGroups.find(g => g.slug === slug);
}

// Получение инструментов группы
export function getToolsByGroup(groupId: string): Tool[] {
  return tools.filter(t => t.groupId === groupId);
}

// Получение инструмента по slug
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug);
}

// Получение featured инструментов
export function getFeaturedTools(): Tool[] {
  return tools.filter(t => t.featured);
}

// Получение реализованных инструментов
export function getImplementedTools(): Tool[] {
  return tools.filter(t => t.implemented);
}

// Статистика
export function getStats() {
  return {
    totalTools: tools.length,
    totalGroups: toolGroups.length,
    implementedTools: tools.filter(t => t.implemented).length,
    featuredTools: tools.filter(t => t.featured).length,
  };
}
