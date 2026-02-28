export const ADFOX_CONFIG = {
  // Замените эти ID на ваши реальные ID площадок из кабинета Яндекса (AdFox/РТБ)
  // Формат обычно: 'yandex_rtb_R-A-XXXXXX-Y'
  blocks: {
    topBanner: "yandex_rtb_R-A-123456-1",
    midContent: "yandex_rtb_R-A-123456-2",
    stickyBottom: "yandex_rtb_R-A-123456-3",
  },
  // Можно отключить рекламу глобально для локальной разработки
  enabled: process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_SHOW_ADS === "true",
};
