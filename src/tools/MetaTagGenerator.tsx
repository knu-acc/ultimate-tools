'use client';

import React, { useState } from 'react';
import {
  Box, Typography, TextField, Paper, Grid, useTheme, alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


export default function MetaTagGenerator() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [siteName, setSiteName] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');

  const generateMeta = (): string => {
    const lines: string[] = [];
    lines.push(isEn ? '<!-- Basic meta tags -->' : '<!-- Основные мета-теги -->');
    lines.push('<meta charset="UTF-8">');
    lines.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    if (title) lines.push(`<title>${title}</title>`);
    if (description) lines.push(`<meta name="description" content="${description}">`);
    if (keywords) lines.push(`<meta name="keywords" content="${keywords}">`);
    if (author) lines.push(`<meta name="author" content="${author}">`);

    lines.push('');
    lines.push('<!-- Open Graph / Facebook -->');
    lines.push('<meta property="og:type" content="website">');
    if (title) lines.push(`<meta property="og:title" content="${title}">`);
    if (description) lines.push(`<meta property="og:description" content="${description}">`);
    if (url) lines.push(`<meta property="og:url" content="${url}">`);
    if (image) lines.push(`<meta property="og:image" content="${image}">`);
    if (siteName) lines.push(`<meta property="og:site_name" content="${siteName}">`);

    lines.push('');
    lines.push('<!-- Twitter -->');
    lines.push('<meta name="twitter:card" content="summary_large_image">');
    if (title) lines.push(`<meta name="twitter:title" content="${title}">`);
    if (description) lines.push(`<meta name="twitter:description" content="${description}">`);
    if (image) lines.push(`<meta name="twitter:image" content="${image}">`);
    if (twitterHandle) lines.push(`<meta name="twitter:site" content="@${twitterHandle.replace('@', '')}">`);

    if (url) {
      lines.push('');
      lines.push('<!-- Canonical -->');
      lines.push(`<link rel="canonical" href="${url}">`);
    }

    return lines.join('\n');
  };

  const output = generateMeta();

  const titleLength = title.length;
  const descLength = description.length;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 18,
              bgcolor: theme.palette.surfaceContainerLow,
              transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
              '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <TextField
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isEn ? 'Page title' : 'Заголовок страницы'}
              helperText={`${titleLength}/60 ${isEn ? 'characters' : 'символов'}${titleLength > 60 ? (isEn ? ' — recommended up to 60' : ' — рекомендуется до 60') : ''}`}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isEn ? 'Brief page description for search engines' : 'Краткое описание страницы для поисковых систем'}
              helperText={`${descLength}/160 ${isEn ? 'characters' : 'символов'}${descLength > 160 ? (isEn ? ' — recommended up to 160' : ' — рекомендуется до 160') : ''}`}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={isEn ? 'Keywords separated by commas' : 'Ключевые слова через запятую'}
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField fullWidth size="small" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder={isEn ? 'Author' : 'Автор'} />
              </Grid>
              <Grid size={6}>
                <TextField fullWidth size="small" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
              </Grid>
              <Grid size={6}>
                <TextField fullWidth size="small" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/og.jpg" />
              </Grid>
              <Grid size={6}>
                <TextField fullWidth size="small" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder={isEn ? 'Site name' : 'Имя сайта'} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {/* Google Preview */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 18,
              bgcolor: theme.palette.surfaceContainerLow,
              mb: 2,
              transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
              '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Typography variant="body1" sx={{ color: '#1a0dab', fontWeight: 400, fontSize: '1.1rem', mb: 0.5 }}>
              {title || (isEn ? 'Page title' : 'Заголовок страницы')}
            </Typography>
            <Typography variant="body2" sx={{ color: '#006621', fontSize: '0.8rem', mb: 0.5 }}>
              {url || 'https://example.com'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#545454', fontSize: '0.85rem' }}>
              {description || (isEn ? 'Page description will be displayed here...' : 'Описание страницы будет отображаться здесь...')}
            </Typography>
          </Paper>

          {/* Code output */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 18,
              bgcolor: theme.palette.surfaceContainerLow,
              transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
              '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {isEn ? 'HTML Code' : 'HTML-код'}
              </Typography>
              <CopyButton text={output} />
            </Box>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 10,
                bgcolor: '#1e1e1e',
                maxHeight: 400,
                overflow: 'auto'
              }}
            >
              <Box
                component="pre"
                sx={{
                  m: 0,
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  lineHeight: 1.6,
                  color: '#d4d4d4',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {output}
              </Box>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
