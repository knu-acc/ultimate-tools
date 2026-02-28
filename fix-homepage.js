const fs = require('fs');
let page = fs.readFileSync('c:/Users/Овсянка/Desktop/pil-cpy-app/my-app/app/[lang]/page.tsx', 'utf8');

const retStart = page.indexOf('  return (');
const prefix = page.substring(0, retStart);

const newReturn = `  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text)] leading-tight">
            <span className="text-[var(--accent)]">{t("common.siteName")}</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-lg text-[var(--text-muted)] leading-relaxed">
            {t("common.homeSlogan")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#popular" className="btn-primary btn-primary-lg">
              {t("home.ctaTry")}
            </a>
            <a href="#popular" className="btn-secondary" style={{height: '46px', padding: '0 28px', fontSize: '15px', borderRadius: 'var(--radius-lg)'}}>
              {t("home.ctaChoose")}
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8 lg:py-14">
        {/* Popular tools */}
        <section id="popular" className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-1 h-6 rounded-full bg-[var(--accent)]" />
            <h2 className="text-xl font-bold text-[var(--text)]">
              {t("home.popularTools")}
            </h2>
          </div>
          <PopularToolsSlider
            items={FEATURED_TOOLS.map(({ slug, category }) => {
              const tool = TOOLS[slug];
              if (!tool) return { slug, category, title: slug, description: "" };
              const camelSlug = slug.split("-").map((s, i) => (i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1))).join("");
              const cardDesc = getNested(tData as Record<string, unknown>, \`tools.\${camelSlug}.cardDescription\`);
              const description = (typeof cardDesc === "string" ? cardDesc : null) ?? t(tool.descriptionKey);
              return { slug, category, title: t(tool.nameKey), description };
            })}
            lang={validLang}
          />
        </section>

        <div className="mb-10">
          <MidContentAd />
        </div>

        {/* Categories */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-1 h-6 rounded-full bg-[var(--accent)]" />
            <h2 className="text-xl font-bold text-[var(--text)]">
              {t("home.categories")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(CATEGORIES).map(([catSlug, { key, tools }], index) => {
              const Icon = CATEGORY_ICONS[catSlug] ?? MoreHorizontal;
              const descKey = catSlug === "dev-tools" ? "devTools" : catSlug;
              const catDescription = getNested(tData as Record<string, unknown>, \`categories.\${descKey}.description\`);
              const exampleSlugs = tools.slice(0, 3);
              const exampleNames = exampleSlugs
                .map((s) => TOOLS[s]?.nameKey)
                .filter(Boolean)
                .map((k) => t(k));

              const CategoryCard = (
                <Link
                  key={catSlug}
                  href={\`/\${validLang}/\${catSlug}\`}
                  className="tool-card group flex flex-col p-5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="shrink-0 p-2 rounded-lg bg-[var(--accent-muted)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors duration-150">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors block truncate">
                        {t(key)}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {tools.length} {t("home.toolsCount")}
                      </span>
                    </div>
                  </div>
                  {typeof catDescription === "string" && (
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2 mb-2 flex-1">
                      {catDescription}
                    </p>
                  )}
                  {exampleNames.length > 0 && (
                    <p className="text-xs text-[var(--text-faint)] truncate mt-auto">
                      {exampleNames.join(", ")}
                    </p>
                  )}
                </Link>
              );

              if (index === 4) {
                return (
                  <Fragment key={\`fragment-\${catSlug}\`}>
                    {CategoryCard}
                    <div key="home-category-ad" className="flex items-center justify-center p-0 min-h-[160px]">
                      <InGridAd />
                    </div>
                  </Fragment>
                );
              }
              return CategoryCard;
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
`;

const newPage = prefix + newReturn;
fs.writeFileSync('c:/Users/Овсянка/Desktop/pil-cpy-app/my-app/app/[lang]/page.tsx', newPage, 'utf8');
console.log('Homepage rewritten. size:', newPage.length);
