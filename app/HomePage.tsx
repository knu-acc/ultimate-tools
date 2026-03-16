'use client';

import React, { useState } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardActionArea, CardContent,
  Button, Chip, alpha, useTheme, Paper,
} from '@mui/material';
import { Search as SearchIcon, ArrowForward, History, AutoAwesome } from '@mui/icons-material';
import DynamicIcon from '@/src/components/DynamicIcon';
import Link from 'next/link';
import { tools, toolGroups, getFeaturedTools, getStats, getToolsByGroup, getToolBySlug } from '@/src/data/tools';
import ToolCard from '@/src/components/ToolCard';
import SearchDialog from '@/src/components/SearchDialog';
import { useRecentTools } from '@/src/hooks/useRecentTools';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function HomePage() {
  const theme = useTheme();
  const stats = getStats();
  const featuredTools = getFeaturedTools();
  const [searchOpen, setSearchOpen] = useState(false);
  const { recentSlugs } = useRecentTools();
  const recentTools = recentSlugs.map(s => getToolBySlug(s)).filter(Boolean) as NonNullable<ReturnType<typeof getToolBySlug>>[];
  const { t, lHref, locale } = useLanguage();
  const isDark = theme.palette.mode === 'dark';

  const quickTags = locale === 'en' ? [
    { name: 'Password Generator', slug: 'password-generator' },
    { name: 'JSON Formatter', slug: 'json-formatter' },
    { name: 'Word Counter', slug: 'word-counter' },
    { name: 'Color Converter', slug: 'color-converter' },
    { name: 'Regex Tester', slug: 'regex-tester' },
  ] : [
    { name: 'Генератор паролей', slug: 'password-generator' },
    { name: 'JSON Formatter', slug: 'json-formatter' },
    { name: 'Счётчик слов', slug: 'word-counter' },
    { name: 'Конвертер цветов', slug: 'color-converter' },
    { name: 'Regex тестер', slug: 'regex-tester' },
  ];

  const easing = theme.md3?.motion.easing.standard ?? 'cubic-bezier(0.2, 0, 0, 1)';
  const dur = theme.md3?.motion.duration.short4 ?? '200ms';

  return (
    <main id="main-content">
      {/* ══════════════════════════════════════════════════════
          HERO — vibrant gradient with MD3 primary + tertiary
          ══════════════════════════════════════════════════════ */}
      <Box
        sx={{
          background: isDark
            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.25)} 0%, ${alpha(theme.palette.secondary.dark, 0.1)} 50%, ${theme.palette.background.default} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primaryContainer, 0.5)} 0%, ${alpha(theme.palette.secondaryContainer, 0.25)} 50%, ${theme.palette.background.default} 100%)`,
          pt: { xs: 6, md: 10 },
          pb: { xs: 5, md: 8 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative gradient orb */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, isDark ? 0.06 : 0.08)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative' }}>
          {/* Stats badge */}
          <Chip
            icon={<AutoAwesome sx={{ fontSize: 16 }} />}
            label={`${stats.totalTools}+ ${locale === 'en' ? 'tools' : 'инструментов'}`}
            size="small"
            sx={{
              mb: 3,
              height: 32,
              bgcolor: isDark ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 600,
              fontSize: '0.8125rem',
              '& .MuiChip-icon': { color: theme.palette.primary.main },
            }}
          />

          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
              fontWeight: 500,
              mb: 2,
              color: theme.palette.text.primary,
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
            }}
          >
            {t('home.hero.title')}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 5, maxWidth: 560, mx: 'auto', fontSize: '1.125rem', lineHeight: 1.6 }}
          >
            {t('home.hero.subtitle', { count: String(stats.totalTools) })}
          </Typography>

          {/* MD3 Search Bar: 56dp height, extraLarge shape */}
          <Paper
            onClick={() => setSearchOpen(true)}
            elevation={0}
            role="button"
            tabIndex={0}
            aria-label={t('home.hero.searchPlaceholder')}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSearchOpen(true); } }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 3,
              height: 56,
              borderRadius: `${theme.shape?.extraLarge ?? 28}px`,
              maxWidth: 520,
              mx: 'auto',
              cursor: 'pointer',
              bgcolor: isDark ? theme.palette.surfaceContainerHigh : theme.palette.surfaceContainerLowest,
              border: `1px solid ${theme.palette.divider}`,
              transition: `background-color ${dur} ${easing}, box-shadow ${dur} ${easing}, border-color ${dur} ${easing}`,
              '&:hover': {
                bgcolor: theme.palette.surfaceContainerHigh,
                boxShadow: theme.shadows[2],
                borderColor: 'transparent',
              },
              '&.Mui-focusVisible': {
                outline: `3px solid ${theme.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
          >
            <SearchIcon sx={{ mr: 1.5, color: theme.palette.text.secondary, fontSize: 22 }} />
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, flexGrow: 1, textAlign: 'left' }}>
              {t('home.hero.searchPlaceholder')}
            </Typography>
            <Chip
              label="Ctrl+K"
              size="small"
              sx={{
                height: 28,
                fontSize: '0.6875rem',
                fontWeight: 600,
                bgcolor: alpha(theme.palette.text.primary, 0.06),
                fontFamily: 'monospace',
              }}
            />
          </Paper>

          {/* Quick access — MD3 tonal chips with primary color */}
          <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {quickTags.map(tag => (
              <Chip
                key={tag.slug}
                label={tag.name}
                component={Link}
                href={lHref(`/tools/${tag.slug}`)}
                clickable
                variant="outlined"
                sx={{
                  height: 36,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>

        {/* Recently Used */}
        {recentTools.length > 0 && (
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <History sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
              <Typography variant="h6" component="h2" fontWeight={500} color="text.secondary">
                {t('home.sections.recentlyUsed')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {recentTools.map(tool => {
                const grp = toolGroups.find(g => g.id === tool.groupId);
                return (
                  <Chip
                    key={tool.slug}
                    label={locale === 'en' ? ((tool as any).nameEn || tool.name) : tool.name}
                    component={Link}
                    href={lHref(`/tools/${tool.slug}`)}
                    clickable
                    icon={<DynamicIcon name={tool.icon} sx={{ fontSize: '1rem !important', color: `${grp?.color} !important` }} />}
                    sx={{
                      height: 36,
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      bgcolor: alpha(grp?.color || theme.palette.primary.main, 0.08),
                      color: theme.palette.text.primary,
                      '&:hover': { bgcolor: alpha(grp?.color || theme.palette.primary.main, 0.16) },
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}

        {/* ══════════════════════════════════════════════════════
            CATEGORIES — colorful MD3 cards with group-tinted backgrounds
            ══════════════════════════════════════════════════════ */}
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 500 }}>
          {t('home.sections.categories')}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {toolGroups.map(group => {
            const groupTools = getToolsByGroup(group.id);
            const gName = locale === 'en' ? ((group as any).nameEn || group.name) : group.name;
            return (
              <Grid key={group.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
                <Card
                  elevation={0}
                  sx={{
                    // Colored tint background per group!
                    bgcolor: alpha(group.color, isDark ? 0.08 : 0.06),
                    borderRadius: `${theme.shape?.medium ?? 12}px`,
                    transition: `background-color ${dur} ${easing}, box-shadow ${dur} ${easing}, transform ${dur} ${easing}`,
                    '&:hover': {
                      bgcolor: alpha(group.color, isDark ? 0.14 : 0.12),
                      boxShadow: theme.shadows[2],
                    },
                  }}
                >
                  <CardActionArea component={Link} href={lHref(`/group/${group.slug}`)} sx={{ p: 2.5 }}>
                    {/* Colored icon container */}
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: `${theme.shape?.medium ?? 12}px`,
                        bgcolor: alpha(group.color, isDark ? 0.2 : 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5,
                      }}
                    >
                      <DynamicIcon name={group.icon} sx={{ color: group.color, fontSize: 26 }} />
                    </Box>
                    <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3, mb: 0.5 }}>
                      {gName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha(group.color, isDark ? 0.8 : 0.7), fontWeight: 500 }}>
                      {groupTools.length} {locale === 'en' ? 'tools' : 'шт.'}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* ══════════════════════════════════════════════════════
            FEATURED TOOLS
            ══════════════════════════════════════════════════════ */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 500 }}>
            {t('home.sections.featuredTools')}
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {featuredTools.map(tool => (
            <Grid key={tool.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ToolCard tool={tool} showGroup />
            </Grid>
          ))}
        </Grid>

        {/* ══════════════════════════════════════════════════════
            TOOLS BY CATEGORY — with colorful section headers
            ══════════════════════════════════════════════════════ */}
        {toolGroups.slice(0, 6).map(group => {
          const groupTools = getToolsByGroup(group.id);
          const gName = locale === 'en' ? ((group as any).nameEn || group.name) : group.name;
          return (
            <Box key={group.id} sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {/* Colored icon badge */}
                  <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: `${theme.shape?.small ?? 8}px`,
                    bgcolor: alpha(group.color, isDark ? 0.15 : 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <DynamicIcon name={group.icon} sx={{ color: group.color, fontSize: 20 }} />
                  </Box>
                  <Typography variant="h6" component="h2" fontWeight={600}>
                    {gName}
                  </Typography>
                </Box>
                {/* Tonal button with group color */}
                <Button
                  component={Link}
                  href={lHref(`/group/${group.slug}`)}
                  endIcon={<ArrowForward sx={{ fontSize: '18px !important' }} />}
                  sx={{
                    borderRadius: 9999,
                    px: 2.5,
                    py: 0.75,
                    fontWeight: 500,
                    fontSize: '0.8125rem',
                    bgcolor: alpha(group.color, isDark ? 0.12 : 0.08),
                    color: group.color,
                    '&:hover': {
                      bgcolor: alpha(group.color, isDark ? 0.2 : 0.14),
                    },
                  }}
                >
                  {locale === 'en' ? `All ${groupTools.length}` : `Все ${groupTools.length}`}
                </Button>
              </Box>
              <Grid container spacing={2}>
                {groupTools.slice(0, 4).map(tool => (
                  <Grid key={tool.id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <ToolCard tool={tool} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}

        {/* SEO block */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            bgcolor: isDark ? theme.palette.surfaceContainerLow : alpha(theme.palette.primaryContainer, 0.3),
            borderRadius: `${theme.shape?.extraLarge ?? 28}px`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
          }}
        >
          <Typography variant="h6" component="h2" fontWeight={600} gutterBottom>
            {locale === 'en' ? 'Why Ultimate Tools?' : 'Зачем нужен Ultimate Tools?'}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
            {locale === 'en'
              ? `Ultimate Tools is a collection of ${stats.totalTools}+ free online tools right in your browser. No downloads needed — everything works instantly.`
              : `Ultimate Tools — коллекция из ${stats.totalTools}+ бесплатных онлайн-инструментов в вашем браузере. Ничего скачивать не нужно — всё работает мгновенно.`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {locale === 'en'
              ? 'Unit and color converters, calculators (scientific, mortgage, percentage), password generators, QR codes, UUID, JSON formatter, regex tester, Base64, image compression, SEO utilities and more. All data is processed locally — privacy guaranteed.'
              : 'Конвертеры единиц измерения и цветов, калькуляторы (научный, ипотечный, процентный), генераторы паролей, QR-кодов, UUID, JSON formatter, regex tester, Base64, сжатие изображений, SEO-утилиты и многое другое. Все данные обрабатываются локально — конфиденциальность гарантирована.'}
          </Typography>
        </Paper>
      </Container>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Ultimate Tools',
            url: 'https://ulti-tools.com',
            description: `${stats.totalTools}+ free online tools`,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
    </main>
  );
}
