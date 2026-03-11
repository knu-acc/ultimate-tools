'use client';

import React from 'react';
import {
  Container, Typography, Box, Grid, Breadcrumbs, Chip, alpha, useTheme, Paper,
} from '@mui/material';
import { Home, NavigateNext } from '@mui/icons-material';
import DynamicIcon from '@/src/components/DynamicIcon';
import Link from 'next/link';
import { getGroupBySlug, getToolsByGroup, toolGroups } from '@/src/data/tools';
import ToolCard from '@/src/components/ToolCard';

export default function GroupPage({ slug }: { slug: string }) {
  const theme = useTheme();
  const group = getGroupBySlug(slug);

  if (!group) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4">Категория не найдена</Typography>
      </Container>
    );
  }

  const groupTools = getToolsByGroup(group.id);
  const relatedGroups = toolGroups.filter(g => g.id !== group.id).slice(0, 4);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
          <Home sx={{ mr: 0.5, fontSize: 18 }} /> Главная
        </Link>
        <Typography color="text.primary" fontWeight={500}>{group.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              bgcolor: alpha(group.color, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DynamicIcon name={group.icon} sx={{ color: group.color, fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h3" component="h1" fontWeight={700}>
              {group.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {group.description} — {groupTools.length} инструментов
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tools Grid */}
      <Grid container spacing={2} sx={{ mb: 6 }}>
        {groupTools.map(tool => (
          <Grid key={tool.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ToolCard tool={tool} />
          </Grid>
        ))}
      </Grid>

      {/* Related Groups */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" fontWeight={600} sx={{ mb: 2 }}>
          Смотрите также
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {relatedGroups.map(g => (
            <Chip
              key={g.id}
              label={g.name}
              component={Link}
              href={`/group/${g.slug}`}
              clickable
              variant="outlined"
              sx={{ borderColor: alpha(g.color, 0.3) }}
            />
          ))}
        </Box>
      </Box>

      {/* SEO text */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" component="h2" fontWeight={600} gutterBottom>
          {group.name} онлайн — бесплатные инструменты
        </Typography>
        <Typography variant="body2" color="text.secondary">
          В категории &laquo;{group.name}&raquo; собрано {groupTools.length} бесплатных онлайн-инструментов.
          Все утилиты работают прямо в вашем браузере без необходимости регистрации и установки.
          Данные обрабатываются локально — конфиденциальность гарантирована.
          Используйте поиск (Ctrl+K) для быстрого доступа к любому инструменту.
        </Typography>
      </Paper>
    </Container>
  );
}
