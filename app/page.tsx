// Re-export the single HomePage component.
// Previously this was a full 307-line duplicate with hardcoded Russian text,
// doubling the client JS bundle for the home route.
import type { Metadata } from 'next';
import { getPageMetadata } from '@/src/seo/structuredData';

export const metadata: Metadata = getPageMetadata({
  title: 'Ultimate Tools — Бесплатные онлайн-инструменты',
  description: 'Каталог 140+ бесплатных онлайн-инструментов: калькуляторы, конвертеры, генераторы и многое другое. Без регистрации, работает в браузере.',
  keywords: ['онлайн инструменты', 'бесплатные инструменты', 'калькулятор', 'конвертер', 'генератор'],
  image: '/og-image.png',
  canonical: 'https://ulti-tools.com/ru',
}) as Metadata;

export { default } from './HomePage';
