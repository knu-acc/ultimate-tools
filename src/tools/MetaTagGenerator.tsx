'use client';

import React, { useState } from 'react';
import {
  Box, Typography, TextField, Paper, Grid, useTheme
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';


export default function MetaTagGenerator() {
  const theme = useTheme();
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
    lines.push('<!-- Основные мета-теги -->');
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
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Заголовок страницы
          </Typography>
          <TextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Мой сайт — Главная страница"
            helperText={`${titleLength}/60 символов${titleLength > 60 ? ' ⚠️ Рекомендуется до 60' : ''}`}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Описание
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Краткое описание страницы для поисковых систем"
            helperText={`${descLength}/160 символов${descLength > 160 ? ' ⚠️ Рекомендуется до 160' : ''}`}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Ключевые слова
          </Typography>
          <TextField
            fullWidth
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="ключевое слово 1, ключевое слово 2"
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Автор</Typography>
              <TextField fullWidth size="small" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Имя автора" />
            </Grid>
            <Grid size={6}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>URL</Typography>
              <TextField fullWidth size="small" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
            </Grid>
            <Grid size={6}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Изображение</Typography>
              <TextField fullWidth size="small" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/og.jpg" />
            </Grid>
            <Grid size={6}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Имя сайта</Typography>
              <TextField fullWidth size="small" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Мой Сайт" />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {/* Google Preview */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Превью Google
          </Typography>
          <Paper
            elevation={0}
            sx={{ p: 2, borderRadius: 2, bgcolor: theme.palette.surfaceContainerLow, mb: 2 }}
          >
            <Typography variant="body1" sx={{ color: '#1a0dab', fontWeight: 400, fontSize: '1.1rem', mb: 0.5 }}>
              {title || 'Заголовок страницы'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#006621', fontSize: '0.8rem', mb: 0.5 }}>
              {url || 'https://example.com'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#545454', fontSize: '0.85rem' }}>
              {description || 'Описание страницы будет отображаться здесь...'}
            </Typography>
          </Paper>

          {/* Code output */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              HTML-код
            </Typography>
            <CopyButton text={output} />
          </Box>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
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
        </Grid>
      </Grid>
    </Box>
  );
}
