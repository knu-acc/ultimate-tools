'use server';

import type { Tool, ToolGroup } from '@/src/data/tools';

/**
 * SEO Content Generation Utilities
 * Extracted from app/tools/[slug]/ToolPage.tsx to improve maintainability
 * Handles generation of SEO descriptions, FAQ schemas, and structured data
 */

interface SeoContent {
  intro: string;
  howTo: string;
  features: string[];
  useCases: string;
  advantages: string;
}

interface FAQ {
  question: string;
  answer: string;
}

/**
 * Generate SEO content for a tool based on its category
 * Russian version
 */
export function generateToolSeoContentRu(tool: Tool, groupName: string): SeoContent {
  const name = tool.name;
  const desc = tool.description;
  const keys = tool.keywords.slice(0, 4).join(', ');

  const byGroup: Record<string, SeoContent> = {
    converters: {
      intro: `«${name}» — точный онлайн-конвертер для мгновенного перевода ${desc.toLowerCase()}. Просто введите исходное значение — результат появится в нужных единицах без лишних шагов. Инструмент работает полностью в вашем браузере: данные не передаются ни на какой сервер.`,
      howTo: `Введите значение в поле ввода. Конвертер автоматически рассчитает результат во всех поддерживаемых форматах. Скопируйте нужное значение одним нажатием. Для точных вычислений используйте числа с дробной частью.`,
      features: [
        'Мгновенный результат без задержки',
        `Поддержка ключевых форматов: ${keys}`,
        'Высокая точность до нескольких знаков после запятой',
        'Полная работа в браузере — без передачи данных',
        'Удобный интерфейс Material Design 3',
        'Бесплатно и без регистрации',
      ],
      useCases: `«${name}» незаменим для студентов, инженеров, программистов и всех, кто работает с международными данными.`,
      advantages: `В отличие от громоздких программ, ${name} работает прямо в браузере без установки.`,
    },
    calculators: {
      intro: `«${name}» — удобный онлайн-калькулятор для точного расчёта ${desc.toLowerCase()}. Введите исходные данные и мгновенно получите результат.`,
      howTo: `Заполните поля ввода нужными значениями. Калькулятор автоматически произведёт расчёт и покажет результат. При необходимости можно изменить параметры и пересчитать.`,
      features: [
        'Мгновенные точные вычисления',
        `Расчёт по параметрам: ${keys}`,
        'Понятный интерфейс без лишних настроек',
        'Работает офлайн после первой загрузки страницы',
        'Без рекламы и регистрации',
        'Подходит для мобильных устройств',
      ],
      useCases: `Пригодится школьникам и студентам при решении задач, специалистам при работе, а также в повседневной жизни.`,
      advantages: `Доступен 24/7 с любого устройства с браузером — компьютера, телефона или планшета.`,
    },
  };

  return byGroup[tool.groupId] || byGroup.calculators;
}

/**
 * Generate SEO content for a tool - English version
 */
export function generateToolSeoContentEn(tool: Tool, groupName: string): SeoContent {
  const name = tool.name;
  const desc = tool.description;
  const keys = tool.keywords.filter(kw => !/[А-Яа-яЁё]/.test(kw)).slice(0, 4).join(', ');

  const byGroup: Record<string, SeoContent> = {
    converters: {
      intro: `"${name}" is an accurate online converter for instant conversion of ${desc.toLowerCase()}. Just enter the source value — the result appears in the needed units without unnecessary steps. The tool works completely in your browser: no data is sent anywhere.`,
      howTo: `Enter a value in the input field. The converter automatically calculates the result in all supported formats. Copy the needed value with one click. For precise calculations, use numbers with decimal places.`,
      features: [
        'Instant result without delays',
        `Support for key formats: ${keys}`,
        'High precision to several decimal places',
        'Complete browser operation — no data transmission',
        'Convenient Material Design 3 interface',
        'Free and no registration required',
      ],
      useCases: `"${name}" is indispensable for students, engineers, programmers and anyone working with international data.`,
      advantages: `Unlike bulky programs, ${name} works right in your browser without installation.`,
    },
    calculators: {
      intro: `"${name}" is a convenient online calculator for accurate calculation of ${desc.toLowerCase()}. Enter your data and get instant results.`,
      howTo: `Fill in the input fields with required values. The calculator automatically performs the calculation and displays the result. You can modify parameters and recalculate if needed.`,
      features: [
        'Instant precise calculations',
        `Calculation parameters: ${keys}`,
        'Clear interface with no unnecessary settings',
        'Works offline after first page load',
        'No ads and no registration',
        'Mobile-friendly design',
      ],
      useCases: `Useful for students solving problems, professionals at work, and in everyday life.`,
      advantages: `Available 24/7 from any device with a browser — computer, phone or tablet.`,
    },
  };

  return byGroup[tool.groupId] || byGroup.calculators;
}

/**
 * Generate FAQ schema for a tool - Russian version
 */
export function generateToolFAQRu(tool: Tool, groupName: string): FAQ[] {
  const name = tool.name;
  return [
    {
      question: `Что такое «${name}»?`,
      answer: `«${name}» — бесплатный онлайн-инструмент для ${tool.description.toLowerCase()}. Работает прямо в браузере без регистрации и установки программ.`,
    },
    {
      question: `Как использовать «${name}»?`,
      answer: `Заполните необходимые поля и нажмите кнопку расчёта или обработки. Результат появится мгновенно. Скопируйте результат одним клико́м.`,
    },
    {
      question: `Безопасен ли «${name}»?`,
      answer: `Да. Все вычисления и обработка данных происходят в вашем браузере. Никакие данные не передаются на сервер. Ваша приватность полностью защищена.`,
    },
    {
      question: `Нужна ли регистрация?`,
      answer: `Нет. Инструмент полностью бесплатен и работает без регистрации. Просто откройте страницу и используйте.`,
    },
  ];
}

/**
 * Generate FAQ schema for a tool - English version
 */
export function generateToolFAQEn(tool: Tool, groupName: string): FAQ[] {
  const name = tool.name;
  return [
    {
      question: `What is "${name}"?`,
      answer: `"${name}" is a free online tool for ${tool.description.toLowerCase()}. Works right in your browser with no registration or software installation.`,
    },
    {
      question: `How to use "${name}"?`,
      answer: `Fill in the required fields and click the calculate or process button. Results appear instantly. Copy the result with one click.`,
    },
    {
      question: `Is "${name}" safe?`,
      answer: `Yes. All calculations and data processing happen in your browser. No data is sent to any server. Your privacy is fully protected.`,
    },
    {
      question: `Is registration required?`,
      answer: `No. The tool is completely free and works without registration. Just open the page and use it.`,
    },
  ];
}

/**
 * Generate JSON-LD structured data for a tool
 */
export function generateToolSchema(tool: Tool, group: ToolGroup | undefined, locale: string, baseUrl: string) {
  const isEn = locale === 'en';
  const name = isEn ? (tool as any).nameEn || tool.name : tool.name;
  const description = isEn ? (tool as any).descriptionEn || tool.description : tool.description;

  return {
    '@context': 'https://schema.org',
    '@type': 'Tool',
    name: name,
    description: description,
    url: `${baseUrl}/${locale}/tools/${tool.slug}`,
    image: `${baseUrl}/opengraph-image`,
    category: group?.name || 'Tools',
    inLanguage: isEn ? 'en' : 'ru',
    creator: {
      '@type': 'Organization',
      name: 'Ultimate Tools',
      url: baseUrl,
    },
  };
}
