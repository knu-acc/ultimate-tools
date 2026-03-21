'use client';

import React, { useEffect, useMemo } from 'react';
import {
  Container, Typography, Box, Grid, Breadcrumbs, Paper, Chip, alpha, useTheme, Button,
  Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import { accordionClasses } from '@mui/material/Accordion';
import { Home, NavigateNext, Construction, ExpandMore, CheckCircleOutline } from '@mui/icons-material';
import DynamicIcon from '@/src/components/DynamicIcon';
import Link from 'next/link';
import { getToolBySlug, getToolsByGroup, toolGroups, tools, Tool } from '@/src/data/tools';
import { getGroupName, getToolDescription, getToolName } from '@/src/data/toolLocalization';
import ToolCard from '@/src/components/ToolCard';
import { useRecentTools } from '@/src/hooks/useRecentTools';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getToolComponent } from '@/src/tools/registry';
import { getToolFAQ, getToolFAQEn, getToolSeoContent, getToolSeoContentEn } from './toolPageContent';

const implementedTools = tools.filter(t => t.implemented);
const intentTokenCacheRu = new Map<string, Set<string>>();
const intentTokenCacheEn = new Map<string, Set<string>>();
const keywordSetCache = new Map<string, Set<string>>();

// ============================================================
// SEO Content Generator — уникальный текст для каждой категории
// ============================================================

function tokenizeToolIntent(tool: Tool, isEn: boolean): string[] {
  const locale = isEn ? 'en' : 'ru';
  const name = getToolName(tool, locale).toLowerCase();
  const description = getToolDescription(tool, locale).toLowerCase();
  const keywords = (tool.keywords || []).map(k => k.toLowerCase());
  const raw = [name, description, ...keywords].join(' ');
  return raw
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 2);
}

function getIntentTokenSet(tool: Tool, isEn: boolean): Set<string> {
  const cache = isEn ? intentTokenCacheEn : intentTokenCacheRu;
  const hit = cache.get(tool.id);
  if (hit) return hit;
  const tokens = new Set(tokenizeToolIntent(tool, isEn));
  cache.set(tool.id, tokens);
  return tokens;
}

function getKeywordSet(tool: Tool): Set<string> {
  const hit = keywordSetCache.get(tool.id);
  if (hit) return hit;
  const value = new Set((tool.keywords || []).map(k => k.toLowerCase().trim()).filter(Boolean));
  keywordSetCache.set(tool.id, value);
  return value;
}

// ============================================================
// Main Component
// ============================================================

export default function ToolPage({ slug }: { slug: string }) {
  const theme = useTheme();
  const { locale, t, lHref } = useLanguage();
  const isEn = locale === 'en';
  const tool = getToolBySlug(slug);
  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    if (tool) addRecentTool(tool.slug);
  }, [tool?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!tool) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4">{isEn ? 'Tool not found' : 'Инструмент не найден'}</Typography>
        <Button component={Link} href={lHref('/')} sx={{ mt: 2 }}>{isEn ? 'Home' : 'На главную'}</Button>
      </Container>
    );
  }

  const group = toolGroups.find(g => g.id === tool.groupId);
  const ToolComponent = getToolComponent(tool.slug);
  const localizedToolName = getToolName(tool, locale);
  const localizedToolDescription = getToolDescription(tool, locale);
  const localizedGroupName = getGroupName(group, locale);
  const toolWithSeo = tool as Tool & {
    seoTitle?: string;
    seoTitleEn?: string;
    seoDescription?: string;
    seoDescriptionEn?: string;
  };
  const seoTitle = toolWithSeo.seoTitle || tool.name;
  const seoTitleEn = toolWithSeo.seoTitleEn || tool.nameEn || tool.name;
  const seoDescription = toolWithSeo.seoDescription || tool.description;
  const seoDescriptionEn = toolWithSeo.seoDescriptionEn || tool.descriptionEn || tool.description;
  const groupNameRu = group?.name || '';
  const groupNameEn = group?.nameEn || group?.name || '';

  // Memoize expensive computations — intent scoring over tools plus SEO/FAQ generation.
  const relatedTools = useMemo(() => {
    const currentTokens = getIntentTokenSet(tool, isEn);
    const currentKeywordSet = getKeywordSet(tool);

    const scored = implementedTools
      .filter(t => t.id !== tool.id)
      .map(candidate => {
        const candidateTokens = getIntentTokenSet(candidate, isEn);
        const candidateKeywordSet = getKeywordSet(candidate);
        let overlap = 0;
        for (const token of currentTokens) {
          if (candidateTokens.has(token)) overlap += 1;
        }
        for (const kw of currentKeywordSet) {
          if (candidateKeywordSet.has(kw)) overlap += 1;
        }

        const sameGroupBoost = candidate.groupId === tool.groupId ? 5 : 0;
        const featuredBoost = candidate.featured ? 1 : 0;
        const score = overlap + sameGroupBoost + featuredBoost;

        return { candidate, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    // Keep compact UI but include both in-group and cross-group intent links.
    const primary = scored.slice(0, 8).map(x => x.candidate);
    const fallback = getToolsByGroup(tool.groupId).filter(t => t.id !== tool.id).slice(0, 8);
    const merged = [...primary, ...fallback];
    const unique: Tool[] = [];
    const seen = new Set<string>();
    for (const item of merged) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      unique.push(item);
      if (unique.length >= 8) break;
    }
    return unique;
  }, [tool.id, tool.groupId, isEn]);
  const seoContent = useMemo(
    () => isEn ? getToolSeoContentEn(tool, groupNameEn) : getToolSeoContent(tool, groupNameRu),
    [tool.id, isEn, groupNameEn, groupNameRu]
  );
  const faqItems = useMemo(
    () => isEn ? getToolFAQEn(tool) : getToolFAQ(tool),
    [tool.id, isEn]
  );
  const softwareApplicationJson = useMemo(
    () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: isEn ? seoTitleEn : seoTitle,
      description: isEn ? seoDescriptionEn : seoDescription,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      url: `https://ulti-tools.com/${locale}/tools/${tool.slug}`,
      inLanguage: locale,
      isAccessibleForFree: true,
      browserRequirements: 'Requires JavaScript',
      author: { '@type': 'Organization', name: 'Ultimate Tools', url: 'https://ulti-tools.com' },
      keywords: isEn
        ? tool.keywords.filter(kw => !/[А-Яа-яЁё]/.test(kw)).join(', ')
        : tool.keywords.join(', '),
    }),
    [isEn, seoTitleEn, seoTitle, seoDescriptionEn, seoDescription, locale, tool.slug, tool.keywords]
  );
  const faqJson = useMemo(
    () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    }),
    [faqItems]
  );
  const breadcrumbsJson = useMemo(
    () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isEn ? 'Home' : 'Главная', item: `https://ulti-tools.com/${locale}` },
        { '@type': 'ListItem', position: 2, name: isEn ? (groupNameEn || 'Tools') : (groupNameRu || 'Инструменты'), item: `https://ulti-tools.com/${locale}/group/${group?.slug}` },
        { '@type': 'ListItem', position: 3, name: isEn ? (tool.nameEn || seoTitle) : seoTitle, item: `https://ulti-tools.com/${locale}/tools/${tool.slug}` },
      ],
    }),
    [isEn, locale, group?.slug, groupNameEn, groupNameRu, tool.slug, tool.nameEn, seoTitle]
  );
  const relatedToolsJson = useMemo(
    () => relatedTools.length > 0
      ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: isEn ? 'Related online tools' : 'Похожие онлайн-инструменты',
        numberOfItems: relatedTools.length,
        itemListElement: relatedTools.map((rt, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'SoftwareApplication',
            name: getToolName(rt, locale),
            url: `https://ulti-tools.com/${locale}/tools/${rt.slug}`,
            applicationCategory: 'UtilitiesApplication',
          },
        })),
      })
      : '',
    [relatedTools, isEn, locale]
  );

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
          <Link href={lHref('/')} style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
            <Home sx={{ mr: 0.5, fontSize: 18 }} /> {t('toolPage.breadcrumb.home')}
          </Link>
          <Link href={lHref(`/group/${group?.slug}`)} style={{ color: 'inherit', textDecoration: 'none' }}>
            {localizedGroupName}
          </Link>
          <Typography color="text.primary" fontWeight={500}>{localizedToolName}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            {/* Tool Header */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 18,
                    bgcolor: alpha(group?.color ?? theme.palette.primary.main, 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <DynamicIcon name={tool.icon} sx={{ color: group?.color ?? theme.palette.primary.main, fontSize: 24 }} />
                </Box>
                <Box>
                  {/* SEO-оптимизированный H1 */}
                  <Typography variant="h4" component="h1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                    {isEn ? (tool.nameEn || seoTitle) : seoTitle}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    {localizedToolDescription}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                {(isEn
                  ? tool.keywords.filter(kw => !/[А-Яа-яЁё]/.test(kw)).slice(0, 5)
                  : tool.keywords.slice(0, 5)
                ).map(kw => (
                  <Chip key={kw} label={kw} size="small" sx={{ bgcolor: alpha(group?.color ?? theme.palette.primary.main, 0.08) }} />
                ))}
              </Box>
            </Box>

            {/* Tool Body */}
            <Paper
              elevation={1}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 18,
                bgcolor: theme.palette.surfaceContainerLowest,
                minHeight: 300,
              }}
            >
              {ToolComponent ? (
                <ToolComponent />
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Construction sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    {t('toolPage.underConstruction')}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {t('toolPage.underConstructionDesc', { name: localizedToolName })}
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* SEO Content Block */}
            <Paper
              elevation={0}
              sx={{ mt: 3, p: { xs: 2, md: 3 }, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow }}
            >
              {/* What is */}
              <Typography variant="h5" component="h2" fontWeight={600} gutterBottom>
                {t('toolPage.seoSection.whatIs', { name: localizedToolName })}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {seoContent.intro}
              </Typography>

              {/* How to use */}
              <Typography variant="h6" component="h3" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                {t('toolPage.seoSection.howToUse')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {seoContent.howTo}
              </Typography>

              {/* Features */}
              <Typography variant="h6" component="h3" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                {t('toolPage.seoSection.features', { name: localizedToolName })}
              </Typography>
              <List dense disablePadding>
                {seoContent.features.map((feat, i) => (
                  <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CheckCircleOutline sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={feat}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
              </List>

              {/* When to use */}
              <Typography variant="h6" component="h3" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                {t('toolPage.seoSection.whenToUse')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {seoContent.useCases}
              </Typography>

              {/* Advantages */}
              <Typography variant="h6" component="h3" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                {t('toolPage.seoSection.advantages')}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 0 }}>
                {seoContent.advantages}
              </Typography>
            </Paper>

            {/* Visible FAQ */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" component="h2" fontWeight={600} sx={{ mb: 2 }}>
                {isEn ? 'FAQ' : 'Частые вопросы'}
              </Typography>
              {faqItems.map((faq, i) => (
                <Accordion
                  key={i}
                  elevation={0}
                  disableGutters
                  sx={{
                    bgcolor: theme.palette.surfaceContainerLow,
                    mb: 1,
                    border: `1px solid ${alpha(theme.palette.divider, 0.25)}`,
                    [`&.${accordionClasses.expanded}`]: {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <Box sx={{
                        width: 36, height: 36,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '50%',
                        transitionProperty: 'background-color',
                        transitionDuration: theme.md3?.motion.duration.short4 ?? '200ms',
                        transitionTimingFunction: theme.md3?.motion.easing.standard ?? 'cubic-bezier(0.2, 0, 0, 1)',
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                      }}>
                        <ExpandMore sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
                      </Box>
                    }
                    sx={{
                      '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.04) },
                    }}
                  >
                    <Typography variant="body1" fontWeight={500} color="text.primary">
                      {faq.q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                      {faq.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* Related tools in category */}
            {relatedTools.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('toolPage.relatedLinks', { group: localizedGroupName })}{' '}
                  {relatedTools.map((rt, i) => (
                    <React.Fragment key={rt.id}>
                      <Link href={lHref(`/tools/${rt.slug}`)} style={{ color: 'inherit' }}>{getToolName(rt, locale)}</Link>
                      {i < relatedTools.length - 1 ? ', ' : '.'}
                    </React.Fragment>
                  ))}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              {t('toolPage.sidebar.relatedTools')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {relatedTools.map(t => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </Box>

            <Typography variant="h6" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
              {t('toolPage.sidebar.categories')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {toolGroups.map(g => (
                <Chip
                  key={g.id}
                    label={getGroupName(g, locale)}
                  component={Link}
                  href={lHref(`/group/${g.slug}`)}
                  clickable
                  variant={g.id === group?.id ? 'filled' : 'outlined'}
                  color={g.id === group?.id ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* JSON-LD: SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: softwareApplicationJson,
          }}
        />

        {/* JSON-LD: FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: faqJson,
          }}
        />

        {/* JSON-LD: BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: breadcrumbsJson,
          }}
        />

        {/* JSON-LD: related tools (intent-based internal graph) */}
        {relatedTools.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: relatedToolsJson,
            }}
          />
        )}
      </Container>
    </>
  );
}
