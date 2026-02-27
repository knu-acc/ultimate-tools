# Ultimate Tools

Бесплатные онлайн-инструменты (калькуляторы, генераторы, конвертеры). Next.js, 100+ инструментов, ru/kz/en.

## Структура репозитория

- **`my-app/`** — приложение Next.js (здесь весь код)
- **`netlify.toml`** — настройки деплоя Netlify (base = `my-app`, publish = `out`)

## Деплой на Netlify

1. Подключи репозиторий к Netlify.
2. В настройках сборки укажи (или оставь из `netlify.toml`):
   - **Base directory:** `my-app`
   - **Build command:** `npm run build`
   - **Publish directory:** `out`
3. Деплой — статический экспорт, плагины не нужны.

## Локальный запуск

```bash
cd my-app
npm install
npm run dev
```

Откроется http://localhost:3000 (редирект на /ru).
