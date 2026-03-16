'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Link as MuiLink, Divider, useTheme } from '@mui/material';
import Link from 'next/link';
import { toolGroups } from '@/src/data/tools';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function Footer() {
  const theme = useTheme();
  const { t, lHref, locale } = useLanguage();

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
              {t('footer.description')}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {t('footer.popularCategories')}
            </Typography>
            {toolGroups.slice(0, 7).map(group => (
              <MuiLink
                key={group.id}
                component={Link}
                href={lHref(`/group/${group.slug}`)}
                underline="hover"
                color="text.secondary"
                display="block"
                variant="body2"
                sx={{ mb: 0.5 }}
              >
                {locale === 'en' ? ((group as any).nameEn || group.name) : group.name}
              </MuiLink>
            ))}
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {t('footer.moreCategories')}
            </Typography>
            {toolGroups.slice(7, 14).map(group => (
              <MuiLink
                key={group.id}
                component={Link}
                href={lHref(`/group/${group.slug}`)}
                underline="hover"
                color="text.secondary"
                display="block"
                variant="body2"
                sx={{ mb: 0.5 }}
              >
                {locale === 'en' ? ((group as any).nameEn || group.name) : group.name}
              </MuiLink>
            ))}
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {t('footer.tools')}
            </Typography>
            <MuiLink component={Link} href={lHref('/tools/color-converter')} underline="hover" color="text.secondary" display="block" variant="body2" sx={{ mb: 0.5 }}>
              {locale === 'en' ? 'Color Converter' : 'Конвертер цветов'}
            </MuiLink>
            <MuiLink component={Link} href={lHref('/tools/password-generator')} underline="hover" color="text.secondary" display="block" variant="body2" sx={{ mb: 0.5 }}>
              {locale === 'en' ? 'Password Generator' : 'Генератор паролей'}
            </MuiLink>
            <MuiLink component={Link} href={lHref('/tools/json-formatter')} underline="hover" color="text.secondary" display="block" variant="body2" sx={{ mb: 0.5 }}>
              JSON Formatter
            </MuiLink>
            <MuiLink component={Link} href={lHref('/tools/word-counter')} underline="hover" color="text.secondary" display="block" variant="body2" sx={{ mb: 0.5 }}>
              {locale === 'en' ? 'Word Counter' : 'Счётчик слов'}
            </MuiLink>
            <MuiLink component={Link} href={lHref('/tools/image-compressor')} underline="hover" color="text.secondary" display="block" variant="body2" sx={{ mb: 0.5 }}>
              {locale === 'en' ? 'Image Compressor' : 'Сжатие изображений'}
            </MuiLink>
            <MuiLink component={Link} href={lHref('/blog')} underline="hover" color="text.secondary" display="block" variant="body2" sx={{ mb: 0.5 }}>
              {t('nav.blog')}
            </MuiLink>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {t('footer.copyright', { year: String(new Date().getFullYear()) })}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('footer.madeWith')} ❤️ {t('footer.forProductivity')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
