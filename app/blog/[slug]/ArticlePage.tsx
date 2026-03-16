'use client';

import React from 'react';
import {
  Container, Typography, Box, Breadcrumbs, Paper, Chip, Button, Divider, alpha, useTheme,
} from '@mui/material';
import { Home, NavigateNext, Schedule, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { getArticleBySlug, getArticlesByTool } from '@/src/data/articles';
import { getToolBySlug } from '@/src/data/tools';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function ArticlePage({ slug }: { slug: string }) {
  const theme = useTheme();
  const { locale, t, lHref } = useLanguage();
  const isEn = locale === 'en';
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4">{isEn ? 'Article not found' : 'Статья не найдена'}</Typography>
        <Button component={Link} href={lHref('/blog')} sx={{ mt: 2 }}>{isEn ? 'Back to blog' : 'К блогу'}</Button>
      </Container>
    );
  }

  const tool = getToolBySlug(article.toolSlug);
  const relatedArticles = getArticlesByTool(article.toolSlug).filter(a => a.slug !== article.slug);
  const articleTitle = isEn ? (article.titleEn || article.title) : article.title;
  const articleDesc = isEn ? (article.descriptionEn || article.description) : article.description;
  const articleContent = isEn ? (article.contentEn || article.content) : article.content;
  const toolName = tool ? (isEn ? ((tool as any).nameEn || tool.name) : tool.name) : '';
  const toolDesc = tool ? (isEn ? ((tool as any).descriptionEn || tool.description) : tool.description) : '';

  const typeLabels: Record<string, string> = isEn ? {
    guide: 'Guide',
    tips: 'Tips',
    'use-cases': 'Use Cases',
  } : {
    guide: 'Руководство',
    tips: 'Советы',
    'use-cases': 'Кейсы',
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let inCode = false;
    let codeContent = '';

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <Box key={`table-${elements.length}`} sx={{ overflowX: 'auto', my: 2 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {tableRows[0].map((cell, i) => (
                    <th key={i} style={{
                      padding: '8px 12px', borderBottom: `2px solid ${theme.palette.divider}`,
                      textAlign: 'left', fontWeight: 600, fontSize: 14,
                    }}>{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(2).map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{
                        padding: '8px 12px', borderBottom: `1px solid ${theme.palette.divider}`,
                        fontSize: 14,
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        );
        tableRows = [];
      }
      inTable = false;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Code blocks
      if (trimmed.startsWith('```')) {
        if (inCode) {
          elements.push(
            <Paper key={`code-${idx}`} elevation={0} sx={{ p: 2, my: 2, bgcolor: alpha(theme.palette.text.primary, 0.05), borderRadius: 2, fontFamily: 'monospace', fontSize: 13, overflow: 'auto' }}>
              <pre style={{ margin: 0 }}>{codeContent}</pre>
            </Paper>
          );
          codeContent = '';
          inCode = false;
        } else {
          inCode = true;
        }
        return;
      }

      if (inCode) {
        codeContent += (codeContent ? '\n' : '') + line;
        return;
      }

      // Tables
      if (trimmed.startsWith('|')) {
        if (!inTable) inTable = true;
        const cells = trimmed.split('|').filter(Boolean).map(c => c.trim());
        tableRows.push(cells);
        return;
      } else if (inTable) {
        flushTable();
      }

      // Headers
      if (trimmed.startsWith('## ')) {
        elements.push(<Typography key={idx} variant="h5" component="h2" fontWeight={600} sx={{ mt: 4, mb: 2 }}>{trimmed.slice(3)}</Typography>);
      } else if (trimmed.startsWith('### ')) {
        elements.push(<Typography key={idx} variant="h6" component="h3" fontWeight={600} sx={{ mt: 3, mb: 1 }}>{trimmed.slice(4)}</Typography>);
      } else if (trimmed.startsWith('- **')) {
        const match = trimmed.match(/- \*\*(.+?)\*\*\s*[—–-]\s*(.*)/);
        if (match) {
          elements.push(
            <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1, ml: 2 }}>
              <Typography variant="body2" component="span">•</Typography>
              <Typography variant="body2"><strong>{match[1]}</strong> — {match[2]}</Typography>
            </Box>
          );
        }
      } else if (trimmed.startsWith('- ')) {
        elements.push(
          <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 0.5, ml: 2 }}>
            <Typography variant="body2" component="span">•</Typography>
            <Typography variant="body2">{trimmed.slice(2)}</Typography>
          </Box>
        );
      } else if (/^\d+\.\s/.test(trimmed)) {
        const num = trimmed.match(/^(\d+)\.\s(.*)/);
        if (num) {
          elements.push(
            <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 0.5, ml: 2 }}>
              <Typography variant="body2" component="span" sx={{ fontWeight: 600, minWidth: 20 }}>{num[1]}.</Typography>
              <Typography variant="body2">{num[2]}</Typography>
            </Box>
          );
        }
      } else if (trimmed.length > 0) {
        // Handle links in text
        const withLinks = trimmed.replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" style="color: ' + theme.palette.primary.main + '; text-decoration: underline;">$1</a>'
        );
        elements.push(
          <Typography key={idx} variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: withLinks }}
          />
        );
      }
    });

    if (inTable) flushTable();

    return elements;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <Link href={lHref('/')} style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
          <Home sx={{ mr: 0.5, fontSize: 18 }} /> {isEn ? 'Home' : 'Главная'}
        </Link>
        <Link href={lHref('/blog')} style={{ color: 'inherit', textDecoration: 'none' }}>{isEn ? 'Blog' : 'Блог'}</Link>
        <Typography color="text.primary" fontWeight={500} noWrap sx={{ maxWidth: 250 }}>{articleTitle}</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={typeLabels[article.type]} size="small" color="primary" />
          {tool && (
            <Chip
              label={toolName}
              size="small"
              variant="outlined"
              component={Link}
              href={lHref(`/tools/${tool.slug}`)}
              clickable
            />
          )}
        </Box>

        <Typography variant="h3" component="h1" fontWeight={700} sx={{ mb: 2 }}>
          {articleTitle}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {article.readTime} {isEn ? 'min read' : 'мин чтения'}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {article.date}
          </Typography>
        </Box>

        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          {articleDesc}
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Article Content */}
      <Box sx={{ mb: 6 }}>
        {renderContent(articleContent)}
      </Box>

      {/* Tool CTA */}
      {tool && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            textAlign: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {isEn ? `Try ${toolName}` : `Попробуйте ${tool.name}`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {toolDesc}
          </Typography>
          <Button
            component={Link}
            href={lHref(`/tools/${tool.slug}`)}
            variant="contained"
            endIcon={<ArrowForward />}
          >
            {isEn ? 'Open tool' : 'Открыть инструмент'}
          </Button>
        </Paper>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            {isEn ? 'Related articles' : 'Связанные статьи'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {relatedArticles.map(a => (
              <Button
                key={a.slug}
                component={Link}
                href={lHref(`/blog/${a.slug}`)}
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                endIcon={<ArrowForward />}
              >
                {isEn ? (a.titleEn || a.title) : a.title}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: articleTitle,
            description: articleDesc,
            datePublished: article.date,
            inLanguage: locale,
            author: { '@type': 'Organization', name: 'Ultimate Tools' },
            publisher: { '@type': 'Organization', name: 'Ultimate Tools' },
          }),
        }}
      />
    </Container>
  );
}
