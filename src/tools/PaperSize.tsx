'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  TextField,
  Switch,
  useTheme,
  alpha
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { useLanguage } from '@/src/i18n/LanguageContext';

type PaperCategory = 'all' | 'iso-a' | 'iso-b' | 'us';

interface PaperSizeEntry {
  name: string;
  widthMm: number;
  heightMm: number;
  category: PaperCategory;
}

const ISO_A_CORRECT: PaperSizeEntry[] = [
  { name: 'A0', widthMm: 841, heightMm: 1189, category: 'iso-a' },
  { name: 'A1', widthMm: 594, heightMm: 841, category: 'iso-a' },
  { name: 'A2', widthMm: 420, heightMm: 594, category: 'iso-a' },
  { name: 'A3', widthMm: 297, heightMm: 420, category: 'iso-a' },
  { name: 'A4', widthMm: 210, heightMm: 297, category: 'iso-a' },
  { name: 'A5', widthMm: 148, heightMm: 210, category: 'iso-a' },
  { name: 'A6', widthMm: 105, heightMm: 148, category: 'iso-a' },
  { name: 'A7', widthMm: 74, heightMm: 105, category: 'iso-a' },
  { name: 'A8', widthMm: 52, heightMm: 74, category: 'iso-a' },
  { name: 'A9', widthMm: 37, heightMm: 52, category: 'iso-a' },
  { name: 'A10', widthMm: 26, heightMm: 37, category: 'iso-a' },
];

const ISO_B_CORRECT: PaperSizeEntry[] = [
  { name: 'B0', widthMm: 1000, heightMm: 1414, category: 'iso-b' },
  { name: 'B1', widthMm: 707, heightMm: 1000, category: 'iso-b' },
  { name: 'B2', widthMm: 500, heightMm: 707, category: 'iso-b' },
  { name: 'B3', widthMm: 353, heightMm: 500, category: 'iso-b' },
  { name: 'B4', widthMm: 250, heightMm: 353, category: 'iso-b' },
  { name: 'B5', widthMm: 176, heightMm: 250, category: 'iso-b' },
  { name: 'B6', widthMm: 125, heightMm: 176, category: 'iso-b' },
  { name: 'B7', widthMm: 88, heightMm: 125, category: 'iso-b' },
  { name: 'B8', widthMm: 62, heightMm: 88, category: 'iso-b' },
  { name: 'B9', widthMm: 44, heightMm: 62, category: 'iso-b' },
  { name: 'B10', widthMm: 31, heightMm: 44, category: 'iso-b' },
];

const US_SIZES: PaperSizeEntry[] = [
  { name: 'Letter', widthMm: 216, heightMm: 279, category: 'us' },
  { name: 'Legal', widthMm: 216, heightMm: 356, category: 'us' },
  { name: 'Tabloid', widthMm: 279, heightMm: 432, category: 'us' },
  { name: 'Executive', widthMm: 184, heightMm: 267, category: 'us' },
];

const ALL_SIZES = [...ISO_A_CORRECT, ...ISO_B_CORRECT, ...US_SIZES];

const CATEGORY_LABELS: Record<PaperCategory, string> = {
  all: 'Все',
  'iso-a': 'Серия A (ISO)',
  'iso-b': 'Серия B (ISO)',
  us: 'Американские'
};

function mmToInches(mm: number): string {
  return (mm / 25.4).toFixed(2);
}

export default function PaperSize() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const CATEGORY_LABELS_I18N: Record<PaperCategory, string> = {
    all: isEn ? 'All' : 'Все',
    'iso-a': isEn ? 'A Series (ISO)' : 'Серия A (ISO)',
    'iso-b': isEn ? 'B Series (ISO)' : 'Серия B (ISO)',
    us: isEn ? 'US Sizes' : 'Американские'
  };
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PaperCategory>('all');
  const [landscape, setLandscape] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['A4']);

  const filtered = ALL_SIZES.filter((s) => {
    if (category !== 'all' && s.category !== category) return false;
    if (search) {
      return s.name.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const toggleSelection = (name: string) => {
    setSelectedSizes((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  // Visual comparison - scale to fit
  const selectedEntries = ALL_SIZES.filter((s) => selectedSizes.includes(s.name));
  const maxDim = Math.max(...selectedEntries.map((s) => Math.max(s.widthMm, s.heightMm)), 1);
  const scaleBase = 200;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Controls */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3 }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              placeholder={isEn ? 'Search by name' : 'Поиск по названию'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(Object.keys(CATEGORY_LABELS) as PaperCategory[]).map((cat) => (
                <Chip
                  key={cat}
                  label={CATEGORY_LABELS_I18N[cat]}
                  onClick={() => setCategory(cat)}
                  variant={category === cat ? 'filled' : 'outlined'}
                  color={category === cat ? 'primary' : 'default'}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">{isEn ? 'Portrait' : 'Портрет'}</Typography>
              <Switch
                checked={landscape}
                onChange={(e) => setLandscape(e.target.checked)}
                size="small"
              />
              <Typography variant="body2">{isEn ? 'Landscape' : 'Альбом'}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Visual comparison */}
      {selectedEntries.length > 0 && (
        <Paper
          elevation={0}
          sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
            {isEn ? 'Visual comparison (click a row to select)' : 'Визуальное сравнение (нажмите на строку для выбора)'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
              minHeight: scaleBase + 40
            }}
          >
            {selectedEntries.map((s) => {
              const w = landscape ? s.heightMm : s.widthMm;
              const h = landscape ? s.widthMm : s.heightMm;
              const scaledW = (w / maxDim) * scaleBase;
              const scaledH = (h / maxDim) * scaleBase;
              return (
                <Box key={s.name} sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: scaledW,
                      height: scaledH,
                      border: `2px solid ${theme.palette.primary.main}`,
                      borderRadius: 1,
                      backgroundColor: theme.palette.surfaceContainerLow,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 300ms ease'
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 10 }}>
                      {s.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {landscape ? s.heightMm : s.widthMm} x {landscape ? s.widthMm : s.heightMm} мм
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>
      )}

      {/* Table */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
      >
        <Box sx={{ overflowX: 'auto' }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <Box component="tr" sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}>
                {(isEn ? ['Format', 'mm', 'inches', 'Series'] : ['Формат', 'мм', 'дюймы', 'Серия']).map((h) => (
                  <Box component="th" key={h} sx={{ py: 1, px: 1.5, textAlign: 'left' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{h}</Typography>
                  </Box>
                ))}
              </Box>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const w = landscape ? s.heightMm : s.widthMm;
                const h = landscape ? s.widthMm : s.heightMm;
                const isSelected = selectedSizes.includes(s.name);
                return (
                  <Box
                    component="tr"
                    key={s.name}
                    onClick={() => toggleSelection(s.name)}
                    sx={{
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      cursor: 'pointer',
                      backgroundColor: isSelected
                        ? theme.palette.surfaceContainerHigh
                        : 'transparent',
                      '&:hover': { backgroundColor: theme.palette.surfaceContainerLow }
                    }}
                  >
                    <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DescriptionIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontWeight: isSelected ? 600 : 400 }}>
                          {s.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {w} x {h}
                      </Typography>
                    </Box>
                    <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {mmToInches(w)} x {mmToInches(h)}
                      </Typography>
                    </Box>
                    <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                      <Chip
                        label={CATEGORY_LABELS_I18N[s.category]}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                );
              })}
            </tbody>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
