'use client';

import React, { useState } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardActionArea, CardContent,
  Button, Chip, alpha, useTheme, Paper,
} from '@mui/material';
import { Search as SearchIcon, ArrowForward, TrendingUp } from '@mui/icons-material';
import DynamicIcon from '@/src/components/DynamicIcon';
import Link from 'next/link';
import { tools, toolGroups, getFeaturedTools, getStats, getToolsByGroup } from '@/src/data/tools';
import ToolCard from '@/src/components/ToolCard';
import SearchDialog from '@/src/components/SearchDialog';

export default function HomePage() {
  const theme = useTheme();
  const stats = getStats();
  const featuredTools = getFeaturedTools();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Hero — clean, minimal */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(180deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${theme.palette.background.default} 100%)`
            : `linear-gradient(180deg, ${alpha(theme.palette.primaryContainer, 0.5)} 0%, ${theme.palette.background.default} 100%)`,
          pt: { xs: 6, md: 8 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              fontWeight: 400,
              mb: 1.5,
              color: theme.palette.text.primary,
              lineHeight: 1.25,
            }}
          >
            Бесплатные онлайн-инструменты
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 520, mx: 'auto' }}>
            {stats.totalTools}+ утилит прямо в браузере. Конвертеры, калькуляторы, генераторы и
            инструменты для разработчиков.
          </Typography>

          {/* MD3 Search bar */}
          <Paper
            onClick={() => setSearchOpen(true)}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              height: 48,
              borderRadius: 7,
              maxWidth: 480,
              mx: 'auto',
              cursor: 'pointer',
              bgcolor: theme.palette.surfaceContainerHigh,
              transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
              '&:hover': {
                bgcolor: theme.palette.surfaceContainerHighest,
                boxShadow: '0px 1px 2px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)',
              },
            }}
          >
            <SearchIcon sx={{ mr: 1.5, color: theme.palette.text.secondary, fontSize: 22 }} />
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, flexGrow: 1, textAlign: 'left' }}>
              Поиск инструментов...
            </Typography>
            <Chip label="Ctrl+K" size="small" sx={{ height: 24, fontSize: '0.6875rem', bgcolor: alpha(theme.palette.text.primary, 0.06) }} />
          </Paper>

          {/* Quick access tags */}
          <Box sx={{ mt: 2.5, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { name: 'Генератор паролей', slug: 'password-generator' },
              { name: 'JSON Formatter', slug: 'json-formatter' },
              { name: 'Счётчик слов', slug: 'word-counter' },
              { name: 'Конвертер цветов', slug: 'color-converter' },
              { name: 'Regex тестер', slug: 'regex-tester' },
            ].map(tag => (
              <Chip
                key={tag.slug}
                label={tag.name}
                size="small"
                component={Link}
                href={`/tools/${tag.slug}`}
                clickable
                sx={{
                  bgcolor: theme.palette.surfaceContainerHigh,
                  '&:hover': { bgcolor: theme.palette.surfaceContainerHighest },
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>

        {/* Categories — MD3 filled cards */}
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 400 }}>
          Категории
        </Typography>
        <Grid container spacing={1.5} sx={{ mb: 6 }}>
          {toolGroups.map(group => {
            const groupTools = getToolsByGroup(group.id);
            return (
              <Grid key={group.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: theme.palette.surfaceContainerLow,
                    transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
                    '&:hover': {
                      bgcolor: theme.palette.surfaceContainerHigh,
                      boxShadow: '0px 1px 2px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardActionArea component={Link} href={`/group/${group.slug}`} sx={{ p: 2 }}>
                    <DynamicIcon name={group.icon} sx={{ color: group.color, fontSize: 28, mb: 1 }} />
                    <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.3 }}>
                      {group.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {groupTools.length}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Featured tools */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 400 }}>
            Популярные инструменты
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {featuredTools.map(tool => (
            <Grid key={tool.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ToolCard tool={tool} showGroup />
            </Grid>
          ))}
        </Grid>

        {/* Tools by category — first 6 groups */}
        {toolGroups.slice(0, 6).map(group => {
          const groupTools = getToolsByGroup(group.id);
          return (
            <Box key={group.id} sx={{ mb: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DynamicIcon name={group.icon} sx={{ color: group.color, fontSize: 22 }} />
                  <Typography variant="h6" component="h2" fontWeight={500}>
                    {group.name}
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  href={`/group/${group.slug}`}
                  endIcon={<ArrowForward />}
                  size="small"
                  sx={{ borderRadius: 5 }}
                >
                  Все {groupTools.length}
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
            bgcolor: theme.palette.surfaceContainerLow,
            borderRadius: 4,
          }}
        >
          <Typography variant="h6" component="h2" fontWeight={500} gutterBottom>
            Зачем нужен Ultimate Tools?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Ultimate Tools — коллекция из {stats.totalTools}+ бесплатных онлайн-инструментов в вашем браузере.
            Ничего скачивать не нужно — всё работает мгновенно.
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Конвертеры единиц измерения и цветов, калькуляторы (научный, ипотечный, процентный),
            генераторы паролей, QR-кодов, UUID, JSON formatter, regex tester, Base64, сжатие изображений,
            SEO-утилиты и многое другое. Все данные обрабатываются локально —
            конфиденциальность гарантирована.
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
            url: 'https://utools.app',
            description: `${stats.totalTools}+ бесплатных онлайн-инструментов`,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
    </>
  );
}
