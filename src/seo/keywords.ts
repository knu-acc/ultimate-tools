export function buildKeywordSet(base: string[], extra: string[] = [], max: number = 16): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const raw of [...base, ...extra]) {
    const value = raw.trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
    if (out.length >= max) break;
  }

  return out;
}

export function genericSiteKeywords(isEn: boolean): string[] {
  return isEn
    ? [
        'free online tools',
        'online utilities',
        'web tools',
        'browser tools',
        'online calculator',
        'unit converter online',
        'developer tools online',
        'json formatter',
        'password generator',
        'word counter',
        'qr code generator',
        'image tools online',
        'no signup tools',
        'instant web utilities',
        'ultimate tools',
        'all-in-one tools',
      ]
    : [
        'бесплатные онлайн инструменты',
        'онлайн утилиты',
        'веб инструменты',
        'инструменты в браузере',
        'онлайн калькулятор',
        'конвертер единиц онлайн',
        'инструменты для разработчиков',
        'json formatter онлайн',
        'генератор паролей онлайн',
        'счётчик слов онлайн',
        'генератор qr кода',
        'инструменты для изображений',
        'без регистрации',
        'быстрые онлайн утилиты',
        'ultimate tools',
        'все инструменты в одном месте',
      ];
}
