'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Link as MuiLink, Divider, useTheme, alpha } from '@mui/material';
import Link from 'next/link';
import { toolGroups } from '@/src/data/tools';

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        pt: 6,
        pb: 3,
        bgcolor: theme.palette.surfaceContainerLow,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Ultimate Tools
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Бесплатные онлайн-инструменты для конвертации, генерации, расчётов и многого другого.
              Более 150 утилит в одном месте.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Популярные категории
            </Typography>
            {toolGroups.slice(0, 7).map(group => (
              <MuiLink
                key={group.id}
                component={Link}
                href={`/group/${group.slug}`}
                underline="hover"
                color="text.secondary"
                display="block"
                variant="body2"
                sx={{ mb: 0.5 }}
              >
                {group.name}
              </MuiLink>
            ))}
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Ещё категории
            </Typography>
            {toolGroups.slice(7, 14).map(group => (
              <MuiLink
                key={group.id}
                component={Link}
                href={`/group/${group.slug}`}
                underline="hover"
                color="text.secondary"
                display="block"
                variant="body2"
                sx={{ mb: 0.5 }}
              >
                {group.name}
              </MuiLink>
            ))}
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Инструменты
            </Typography>
            <MuiLink component={Link} href="/tools/color-converter" underline="hover" color="text.secondary" display="block" variant="body2" sx={{ mb: 0.5 }}>
              Конвертер цветов
            </MuiLink>
            <MuiLink component={Link} href="/tools/password-generator" underline="hover" color="text.secondary" display="block" variant="body2" sx={{ mb: 0.5 }}>
              Генератор паролей
            </MuiLink>
            <MuiLink component={Link} href="/tools/json-formatter" underline="hover" color="text.secondary" display="block" variant="body2" sx={{ mb: 0.5 }}>
              JSON Formatter
            </MuiLink>
            <MuiLink component={Link} href="/tools/word-counter" underline="hover" color="text.secondary" display="block" variant="body2" sx={{ mb: 0.5 }}>
              Счётчик слов
            </MuiLink>
            <MuiLink component={Link} href="/tools/image-compressor" underline="hover" color="text.secondary" display="block" variant="body2" sx={{ mb: 0.5 }}>
              Сжатие изображений
            </MuiLink>
            <MuiLink component={Link} href="/blog" underline="hover" color="text.secondary" display="block" variant="body2" sx={{ mb: 0.5 }}>
              Блог
            </MuiLink>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Ultimate Tools. Все инструменты бесплатны и работают в браузере.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Сделано с ❤️ для продуктивности
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
