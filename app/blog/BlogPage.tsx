'use client';

import React, { useState } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardActionArea, CardContent,
  Chip, TextField, InputAdornment, alpha, useTheme,
} from '@mui/material';
import { Search, Schedule, ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { articles } from '@/src/data/articles';
import { getToolBySlug } from '@/src/data/tools';

export default function BlogPage() {
  const theme = useTheme();
  const [search, setSearch] = useState('');

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase()) ||
    a.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
  );

  const typeLabels: Record<string, string> = {
    guide: 'Руководство',
    tips: 'Советы',
    'use-cases': 'Кейсы',
  };

  const typeColors: Record<string, string> = {
    guide: '#6750A4',
    tips: '#006C4C',
    'use-cases': '#7E5700',
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" fontWeight={700} sx={{ mb: 1 }}>
        Блог
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Статьи, руководства и советы по использованию онлайн-инструментов
      </Typography>

      <TextField
        fullWidth
        placeholder="Поиск статей..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
      />

      <Grid container spacing={3}>
        {filtered.map(article => {
          const tool = getToolBySlug(article.toolSlug);
          return (
            <Grid key={article.slug} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 250ms',
                  '&:hover': {
                    borderColor: typeColors[article.type],
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 20px ${alpha(typeColors[article.type], 0.15)}`,
                  },
                }}
              >
                <CardActionArea component={Link} href={`/blog/${article.slug}`} sx={{ height: '100%' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={typeLabels[article.type]}
                        size="small"
                        sx={{
                          bgcolor: alpha(typeColors[article.type], 0.1),
                          color: typeColors[article.type],
                          fontWeight: 500,
                          fontSize: 11,
                          height: 24,
                        }}
                      />
                      {tool && (
                        <Chip label={tool.name} size="small" variant="outlined" sx={{ fontSize: 11, height: 24 }} />
                      )}
                    </Box>

                    <Typography variant="subtitle1" fontWeight={600} sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {article.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontSize: 13,
                    }}>
                      {article.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                      <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {article.readTime} мин чтения • {article.date}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Статьи не найдены
          </Typography>
        </Box>
      )}
    </Container>
  );
}
